/*------------------------------------------------------------------------------
Chat Controls
------------------------------------------------------------------------------*/
var containerCtrl = function(container) {
    switch(container) {
        case '.contacts-container':
            $('.chat-container').css('display', 'none');
            $('.settings-container').css('display', 'none');
            $(container).css('display', 'block');
            break;
        case '.chat-container':
            $('.contacts-container').css('display', 'none');
            $('.settings-container').css('display', 'none');
            $('.panel-heading').html(global_recipient);
            $(container).css('display', 'block');
            break;
        default:
            $('.contacts-container').css('display', 'none');
            $('.chat-container').css('display', 'none');
            $(container).css('display', 'block');
    }
}

$('#contacts-btn').on('click', function(e) {
    containerCtrl('.contacts-container');
});

$('#chatrm-btn').on('click', function(e) {
    containerCtrl('.chat-container');
});

$('#settings-btn').on('click', function(e) {
    containerCtrl('.settings-container');
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

/*------------------------------------------------------------------------------
Settings Controls
------------------------------------------------------------------------------*/
$('#logout-btn').on('click', function(e) {
    window.location.href='/logout';
});
