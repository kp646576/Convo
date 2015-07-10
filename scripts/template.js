/*------------------------------------------------------------------------------
Initializations
------------------------------------------------------------------------------*/
var global_username = localStorage.getItem('username');
var current_recipient;
var prev_recipient = '';
var my_id;
var recipient_id;

$(document).ready(function() {
  $('#my-top-header').html(global_username + '\'s Convos');
});

/*------------------------------------------------------------------------------
Messages
------------------------------------------------------------------------------*/
function message(sender, recipient, message, timestamp) {
    this.sender = sender;
    this.recipient = recipient;
    this.message = message;
    this.timestamp = timestamp;
}

/*
function chatroom(recipient, messages, view_id) {
    this.recipient = recipient;
    this.messages = messages;
    this.view_id = view_id;
}
*/

var getMsgsFromServer = function(recipient) {
    $.post('/getMsgs', {"recipient": recipient}, function(msgs) {
        console.log('Msgs recieved from back-end');
        // {recipient: [{recipient, sender, timestamp, message}, ...]}
        try {
            var msgsList = JSON.parse(msgs);
            if (msgsList.length > 0) {
                for (i = 0; i < msgsList.length; i++) {
                    if (msgsList[i].sender == global_username) {
                        formatMsg(true, global_username, msgsList[i].timestamp, msgsList[i].message);
                    } else {
                        formatMsg(false, current_recipient, msgsList[i].timestamp, msgsList[i].message);
                    }
                    scrollUp();
                }
            }
        }
        catch(err) {
            alert('Error while loading previous messages with ' + current_recipient + ':' + err);
        }
    });
}

var sendMsgToServer = function(msg) {
    $.post('/storeMsg', {"msg": msg}, function() {
        console.log('Msg sent to back-end');
    });
};

var formatMsg = function(user, username, time, msg) {
    if (user) {
        $('#userMsg').tmpl({'username': username, 'time': time, 'msg': msg}).appendTo('#chatroom-msgs-'.concat(current_recipient));
    } else {
        $('#buddyMsg').tmpl({'username': username, 'time': time, 'msg': msg}).appendTo('#chatroom-msgs-'.concat(current_recipient));
    }
};

/*------------------------------------------------------------------------------
Sinch Initialization
------------------------------------------------------------------------------*/
// Send applicationKey via post call?
sinchClient = new SinchClient({
    applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
    capabilities: {messaging: true},
    supportActiveConnection: true
});

$.get('/ticket', function(authTicket) {
    //console.log('authTicket:' + authTicket);
    //var sessionObj = JSON.parse(localStorage['sinchSession-' + sinchClient.applicationKey] || '{}');

    sinchClient.start(eval('(' + authTicket + ')'))
        .then(function() {
            // Handle Sinch success
            console.log('Sinch Start Successful');
            // Needed to listen for messages
            sinchClient.startActiveConnection();
            //localStorage['sinchSession-' + sinchClient.applicationKey] = JSON.stringify(sinchClient.getSession());
            //console.log(JSON.stringify(sinchClient.getSession()));
        })
        .fail(function(error) {
          // Handle Sinch error
          console.log('Sinch Start Error');
    });
});

var messageClient = sinchClient.getMessageClient();

var eventListener = {
    onIncomingMessage: function(msg){
        console.log('Message Received');
        /*console.log('message:' + this.message.textBody);
        console.log('senderID' + this.message.senderId);
        console.log('recipientID' + this.message.recipientIds);
        console.log('current_recipient' + current_recipient);*/
        if (msg.senderId != global_username) {
            var time = timeStamp();
            var text = msg.textBody;
            formatMsg(false, current_recipient, time, text);
            var recvMsg = JSON.stringify(new message(current_recipient, current_recipient, text, time));
            sendMsgToServer(recvMsg);
            scrollUp();
        }
    }
};

messageClient.addEventListener(eventListener);
