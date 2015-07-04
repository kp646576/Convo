/*------------------------------------------------------------------------------
Chat Controls
------------------------------------------------------------------------------*/
// Contacts-Button Controls
$('#contacts-btn').on('click', function(e) {
		$('.settings-container').css('display', 'none');
		$('.container').css('display', 'none');
        $('.contacts-container').css('display', 'block');
});

// Home-Button Controls
var clickHomeBtn = function() {
	$('.settings-container').css('display', 'none');
			$('.contacts-container').css('display', 'none');
	// Show chat box
	$('.container').css('display', 'block');
	$('.panel-heading').html(global_recipient);
}

$('#home-btn').one('click', function(e) {
  // Display Recipient at top of chat-box

});

// Settings-Button Controls
$('#settings-btn').on('click', function(e) {
		$('.container').css('display', 'none');
        $('.contacts-container').css('display', 'none');
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
    $('#btn-input').val('');

    var sinchMessage = messageClient.newMessage(global_recipient, text);
    //console.log('message object to be sent:' + sinchMessage.recipientIds);

    messageClient.send(sinchMessage)
        .then(function() {console.log('Message Sent');})
        .fail(function() {console.log('Message Failed');});
});
