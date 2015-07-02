/*------------------------------------------------------------------------------
Testing Section
------------------------------------------------------------------------------*/
//console.log(localStorage.getItem('username'));
var global_username; //= 'asdf';
var global_recipient;// = 'asdf';
var my_id;
var recipient_id;
//console.log(localStorage.getItem('username'));

if (localStorage.getItem('username') == 'asdf'){
    global_username = 'asdf';
    global_recipient = 'test-user1';
    my_id = '5629499534213120';
    recipient_id = '6173208034148352';
} else {
    global_username = 'test-user1';
    global_recipient = 'asdf';
    my_id = '6173208034148352';
    recipient_id = '5629499534213120';
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
    sinchClient.start(eval('(' + authTicket + ')'))
    //sinchClient.start({'username':'asdf', 'password':'asdf'})
        .then(function() {
            // Handle Sinch success
            console.log('Sinch Start Successful');
            // Needed to listen for messages
            sinchClient.startActiveConnection();
        })
        .fail(function(error) {
          // Handle Sinch error
          console.log('Sinch Start Error');
    });
});

var messageClient = sinchClient.getMessageClient();

var eventListener = {
    onIncomingMessage: function(message){
			  /*console.log('Message Received');
        console.log('message came for you:' + message.textBody);
        console.log('senderID' + message.senderId);
        console.log('recipientID' + message.recipientIds);
        console.log('global_recipient' + global_recipient);*/
				// Display messages if they didn't com from you
        if (message.senderId != global_username) {
                $('#buddyMsg').tmpl({'username': global_recipient, 'time': timeStamp() , 'msg': message.textBody}).appendTo('.chat');
                $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
        }
    }
};

messageClient.addEventListener(eventListener);


/*------------------------------------------------------------------------------
 Utility Functions & Controls
------------------------------------------------------------------------------*/
var timeStamp = function() {
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var suffix = ( time[0] < 12 ) ? 'AM' : 'PM';
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = '0' + time[i];
        }
      }
    return date.join('/') + ' ' + time.join(':') + ' ' + suffix;
}

var clearError = function() {
  $('div.error').text('');
}

// Pressing enter submits text
$('#btn-input').keypress(function (e) {
      var code = e.keyCode || e.which;
      if (code === 13) {
          $('#send-msg-btn').click();
          $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
      };
});


/*------------------------------------------------------------------------------
Chat Controls
------------------------------------------------------------------------------*/
// Contacts-Button Controls
$('#contacts-btn').on('click', function(e) {
		$('.settings-container').css('display', 'none');
		$('.container').css('display', 'none');
});

// Home-Button Controls
$('#home-btn').on('click', function(e) {
		$('.settings-container').css('display', 'none');
		// Show chat box
    $('.container').css('display', 'block');

    // Display Recipient at top of chat-box
    $('.panel-heading').prepend(global_recipient);
});

// Settings-Button Controls
$('#settings-btn').on('click', function(e) {
		$('.container').css('display', 'none');
		$('.settings-container').css('display', 'block');
});

$('#send-msg-btn').on('click', function(e) {
    // Q:Is this needed?
    e.preventDefault();
    clearError();

    var text = $('input#btn-input').val();

    $('#userMsg').tmpl({'username': global_username, 'time': timeStamp() , 'msg': text}).appendTo('.chat');
    $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);

    // Clears input?
    $('input#btn-input').val('');

    var sinchMessage = messageClient.newMessage(global_recipient, text);
    //console.log('message object to be sent:' + sinchMessage.recipientIds);

    messageClient.send(sinchMessage)
        .then(function() {console.log('Message Sent');})
        .fail(function() {console.log('Message Failed');});
});
