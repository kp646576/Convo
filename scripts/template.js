/*------------------------------------------------------------------------------
Testing Section
------------------------------------------------------------------------------*/
//console.log(localStorage.getItem('username'));
var global_username; //= 'asdf';
var current_recipient;// = 'asdf';
var prev_recipient = '';
var my_id;
var recipient_id;
/*
if (localStorage.getItem('chatroomList') === null) {
    localStorage.setItem('chatroomList', {});
}*/

var chatroomList = localStorage.getItem('chatroomList') || [];

if (localStorage.getItem('username') == 'asdf'){
    global_username = 'asdf';
    current_recipient = 'test-user1';
    my_id = '5629499534213120';
    recipient_id = '6173208034148352';
} else {
    global_username = 'test-user1';
    current_recipient = 'asdf';
    my_id = '6173208034148352';
    recipient_id = '5629499534213120';
}
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

var sendMsgToServer = function(msg) {
    $.post('/msg', {"msg": msg}, function() {
        console.log('msg sent to back end');
    });
}

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
    //console.log('inside ticket' + authTicket);
    //var sessionObj = JSON.parse(localStorage['sinchSession-' + sinchClient.applicationKey] || '{}');

    sinchClient.start(eval('(' + authTicket + ')'))
    //sinchClient.start({'username':'asdf', 'password':'asdf'})
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
      /*
        console.log('Message Received');
        console.log('message came for you:' + this.message.textBody);
        console.log('senderID' + this.message.senderId);
        console.log('recipientID' + this.message.recipientIds);
        console.log('current_recipient' + current_recipient);*/
        // Display messages if they didn't com from you
        if (msg.senderId != global_username) {
                var time = timeStamp();
                var text = msg.textBody;
                $('#buddyMsg').tmpl({'username': current_recipient, 'time': time , 'msg': msg.textBody}).appendTo('#chatroom-msgs-'.concat(current_recipient));
                var recvMsg = JSON.stringify(new message(current_recipient, current_recipient, text, time));
                sendMsgToServer(recvMsg);
                $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
        }
    }
};

messageClient.addEventListener(eventListener);
