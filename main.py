
#!/usr/bin/env python

from google.appengine.ext.webapp import template
#from google.appengine.api import users

#from webapp2_extras.appengine.api import users# import login_required
from google.appengine.ext import ndb
from webapp2_extras.appengine.auth.models import User


import logging
import os.path
import webapp2

from webapp2_extras import auth
from webapp2_extras import sessions

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from datetime import datetime
import json
import uuid
import hmac
import hashlib
import base64

# Sinch Credentials
APPLICATION_KEY = '80805d38-246e-4bf7-860a-253e55a73581'
APPLICATION_SECRET = '74RGvay4eEyYnpkGg1+hMQ=='

################################################################################
# Utility Functions
################################################################################
def getAuthTicket(user):
    print "ticketauth:" + str(user['user_id'])
    username = ''
    print "user id:" + str(user['user_id'])
    if str(user['user_id']) == '5629499534213120':
        username = 'asdf'
    else:
        username = 'test-user1'
    print "username:" + str(username)

    userTicket = {
        'identity': {'type': 'username', 'endpoint': username},#str(user['user_id'])},
        'expiresIn': 3600, #1 hour expiration time of session when created using this ticket
        'applicationKey': APPLICATION_KEY,
        'created': datetime.utcnow().isoformat()
    }

    userTicketJson = json.dumps(userTicket).replace(" ", "")
    userTicketBase64 = base64.b64encode(userTicketJson)

    # TicketSignature = Base64 ( HMAC-SHA256 ( ApplicationSecret, UTF8 ( UserTicketJson ) ) )
    digest = hmac.new(base64.b64decode(
        APPLICATION_SECRET), msg=userTicketJson, digestmod=hashlib.sha256).digest()
    signature = base64.b64encode(digest)

    # UserTicket = TicketData + ":" + TicketSignature
    signedUserTicket = userTicketBase64 + ':' + signature

    #print {'userTicket': signedUserTicket}
    return {"userTicket": signedUserTicket}

def user_required(handler):
  """
    Decorator that checks if there's a user associated with the current session.
    Will also fail if there's no session present.
  """
  def check_login(self, *args, **kwargs):
    auth = self.auth
    if not auth.get_user_by_session():
      self.redirect(self.uri_for('login'), abort=True)
    else:
      return handler(self, *args, **kwargs)

  return check_login

def not_logged_in(handler):
  """
    Decorator that checks if there's a user associated with the current session.
    Will also fail if there's no session present.
  """
  def check_login(self, *args, **kwargs):
    auth = self.auth
    if auth.get_user_by_session():
      self.redirect(self.uri_for('home'), abort=True)
    else:
      return handler(self, *args, **kwargs)

  return check_login

def printUser():
    info = User.query().fetch()
    print "User List:"
    print 100 * '#'
    for user in User.query.fetch():
        for name in user._properties:
            print getattr(user, name)
        print 100 * '#'

################################################################################
# Base Handler
################################################################################
class BaseHandler(webapp2.RequestHandler):
  @webapp2.cached_property
  def auth(self):
    """Shortcut to access the auth instance as a property."""
    return auth.get_auth()

  @webapp2.cached_property
  def user_info(self):
    """Shortcut to access a subset of the user attributes that are stored
    in the session.

    The list of attributes to store in the session is specified in
      config['webapp2_extras.auth']['user_attributes'].
    :returns
      A dictionary with most user information
    """
    return self.auth.get_user_by_session()

  @webapp2.cached_property
  def user(self):
    """Shortcut to access the current logged in user.

    Unlike user_info, it fetches information from the persistence layer and
    returns an instance of the underlying model.

    :returns
      The instance of the user model associated to the logged in user.
    """
    u = self.user_info
    return self.user_model.get_by_id(u['user_id']) if u else None

  @webapp2.cached_property
  def user_model(self):
    """Returns the implementation of the user model.

    It is consistent with config['webapp2_extras.auth']['user_model'], if set.
    """
    return self.auth.store.user_model

  @webapp2.cached_property
  def session(self):
      """Shortcut to access the current session."""
      return self.session_store.get_session(backend="datastore")

  def render_template(self, view_filename, params=None):
    if not params:
      params = {}
    user = self.user_info
    params['user'] = user
    path = os.path.join(os.path.dirname(__file__), 'views', view_filename)
    self.response.out.write(template.render(path, params))

  def display_message(self, message):
    """Utility function to display a template with a simple message."""
    params = {
      'message': message
    }
    self.render_template('message.html', params)

  # this is needed for webapp2 sessions to work
  def dispatch(self):
      # Get a session store for this request.
      self.session_store = sessions.get_store(request=self.request)

      try:
          # Dispatch the request.
          webapp2.RequestHandler.dispatch(self)
      finally:
          # Save all sessions.
          self.session_store.save_sessions(self.response)


################################################################################
# Handlers
################################################################################
class MainHandler(BaseHandler):
  @user_required
  def get(self):
    names = [str(getattr(user, 'auth_ids')[0]) for user in User.query().fetch()]
    names.sort()
    self.render_template('template.html', {'names': names})

class SignupHandler(BaseHandler):
  def get(self):
    self.render_template('signup.html')

  def post(self):
    user_name = self.request.get('username')
    email = self.request.get('email')
    name = self.request.get('name')
    password = self.request.get('password')
    last_name = self.request.get('lastname')

    unique_properties = ['email_address']
    user_data = self.user_model.create_user(user_name,
      unique_properties,
      email_address=email, name=name, password_raw=password,
      last_name=last_name, verified=False)
    if not user_data[0]: #user_data is a tuple
      self.display_message('Unable to create user for email %s because of \
        duplicate keys %s' % (user_name, user_data[1]))
      return

    user = user_data[1]
    user_id = user.get_id()

    token = self.user_model.create_signup_token(user_id)

    verification_url = self.uri_for('verification', type='v', user_id=user_id,
      signup_token=token, _full=True)

    msg = 'Send an email to user in order to verify their address. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

    self.display_message(msg.format(url=verification_url))

class ForgotPasswordHandler(BaseHandler):
  def get(self):
    self._serve_page()

  def post(self):
    username = self.request.get('username')

    user = self.user_model.get_by_auth_id(username)
    if not user:
      logging.info('Could not find any user entry for username %s', username)
      self._serve_page(not_found=True)
      return

    user_id = user.get_id()
    token = self.user_model.create_signup_token(user_id)

    verification_url = self.uri_for('verification', type='p', user_id=user_id,
      signup_token=token, _full=True)

    msg = 'Send an email to user in order to reset their password. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

    self.display_message(msg.format(url=verification_url))

  def _serve_page(self, not_found=False):
    username = self.request.get('username')
    params = {
      'username': username,
      'not_found': not_found
    }
    self.render_template('forgot.html', params)


class VerificationHandler(BaseHandler):
  def get(self, *args, **kwargs):
    user = None
    user_id = kwargs['user_id']
    signup_token = kwargs['signup_token']
    verification_type = kwargs['type']

    # it should be something more concise like
    # self.auth.get_user_by_token(user_id, signup_token)
    # unfortunately the auth interface does not (yet) allow to manipulate
    # signup tokens concisely
    user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
      'signup')

    if not user:
      logging.info('Could not find any user with id "%s" signup token "%s"',
        user_id, signup_token)
      self.abort(404)

    # store user data in the session
    self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)

    if verification_type == 'v':
      # remove signup token, we don't want users to come back with an old link
      self.user_model.delete_signup_token(user.get_id(), signup_token)

      if not user.verified:
        user.verified = True
        user.put()

      self.display_message('User email address has been verified.')
      return
    elif verification_type == 'p':
      # supply user to the page
      params = {
        'user': user,
        'token': signup_token
      }
      self.render_template('resetpassword.html', params)
    else:
      logging.info('verification type not supported')
      self.abort(404)

class SetPasswordHandler(BaseHandler):

  @user_required
  def post(self):
    password = self.request.get('password')
    old_token = self.request.get('t')

    if not password or password != self.request.get('confirm_password'):
      self.display_message('passwords do not match')
      return

    user = self.user
    user.set_password(password)
    user.put()

    # remove signup token, we don't want users to come back with an old link
    self.user_model.delete_signup_token(user.get_id(), old_token)

    self.display_message('Password updated')

class TicketHandler(BaseHandler):
    @user_required
    def get(self):
        print "TicketHandler"
        #print self.user
        self.response.write(getAuthTicket(self.user_info))


class LoginHandler(BaseHandler):
  @not_logged_in
  def get(self):

    self._serve_page()
    #self.render_template('login.html')

  def post(self):
    username = self.request.get('username')
    password = self.request.get('password')
    print ("username:" + str(username))
    print ("password:" + str(password))

    try:
      u = self.auth.get_user_by_password(username, password, remember=True,
        save_session=True)
      #return getAuthTicket()
      print ("u:" + str(u))
      self.redirect(self.uri_for('home'))

    except (InvalidAuthIdError, InvalidPasswordError) as e:
      logging.info('Login failed for user %s because of %s', username, type(e))
      self._serve_page(True)

  def _serve_page(self, failed=False):
    username = self.request.get('username')
    params = {
      'username': username,
      'failed': failed
    }
    self.render_template('login.html', params)

class LogoutHandler(BaseHandler):
  def get(self):
    self.auth.unset_session()
    self.redirect(self.uri_for('login'))


################################################################################
# Additional Configs
################################################################################
config = {
  'webapp2_extras.auth': {
    'user_model': 'models.User',
    'user_attributes': ['name']
  },
  'webapp2_extras.sessions': {
    'secret_key': 'YOUR_SECRET_KEY'
  }
}


################################################################################
# Routes
################################################################################
app = webapp2.WSGIApplication([
    webapp2.Route('/', LoginHandler, name='login'),
    webapp2.Route('/signup', SignupHandler),
    webapp2.Route('/<type:v|p>/<user_id:\d+>-<signup_token:.+>',
      handler=VerificationHandler, name='verification'),
    webapp2.Route('/password', SetPasswordHandler),
    webapp2.Route('/home', MainHandler, name='home'),
    webapp2.Route('/logout', LogoutHandler, name='logout'),
    webapp2.Route('/ticket', TicketHandler, name='ticket'),
    webapp2.Route('/forgot', ForgotPasswordHandler, name='forgot'),
], debug=True, config=config)

logging.getLogger().setLevel(logging.DEBUG)
