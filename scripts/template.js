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
			  console.log('Message Received');
        console.log('message came for you:' + message.textBody);
        console.log('senderID' + message.senderId);
        console.log('recipientID' + message.recipientIds);
        console.log('global_recipient' + global_recipient);
				// Display messages if they didn't com from you
        if (message.senderId != global_username) {
                $('#buddyMsg').tmpl({'username': global_recipient, 'time': timeStamp() , 'msg': message.textBody}).appendTo('.chat');
                $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
        }
    }
};

messageClient.addEventListener(eventListener);

/*------------------------------------------------------------------------------
Sinch Specific Controlers
------------------------------------------------------------------------------*/
$('#contacts-list li').on('click', function(e) {
		global_recipient = $(this).text();
    clickHomeBtn();
});
