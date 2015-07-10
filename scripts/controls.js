/*------------------------------------------------------------------------------
Contacts Controls
------------------------------------------------------------------------------*/
var appendMsgsToChatbox = function() {
    $('#messages').tmpl({'name': current_recipient}).appendTo('.panel-body');
};

$('#contacts-list li').on('click', function(e) {
    current_recipient = $(this).text();
    if (current_recipient != prev_recipient) {
        // If there was a previous recipient
        if (prev_recipient != '') {
            $('#chatroom-msgs-'.concat(prev_recipient)).css('display', 'none');
        }
        $('#chatroom-msgs-'.concat(current_recipient)).css('display', 'block');
        prev_recipient = current_recipient;
    }
    $('#chatrm-btn').trigger('click');
});

// Potential race condition on different browsers?
$('#contacts-list li').one('click', function(e) {
    appendMsgsToChatbox();
    getMsgsFromServer(current_recipient);
});

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
            $('.panel-heading').html(current_recipient);
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
    var text = $('input#btn-input').val();
    var time = timeStamp();

    formatMsg(true, global_username, time, text);
    scrollUp();
    $('#btn-input').val('');

    var sinchMessage = messageClient.newMessage(current_recipient, text);
    messageClient.send(sinchMessage)
        .then(function() {
          // Needs to have "new"
          var msg = JSON.stringify(new message(global_username, current_recipient, text, time));
          sendMsgToServer(msg);
          console.log('Message Sent');
        })
        .fail(function() {console.log('Message Failed');});
});

/*------------------------------------------------------------------------------
Settings Controls
------------------------------------------------------------------------------*/
$('#logout-btn').on('click', function(e) {
    window.location.href='/logout';
});

/*------------------------------------------------------------------------------
Misc Controls
------------------------------------------------------------------------------*/
$('#home-btn').on('click', function(e) {
    $('#contacts-btn').trigger('click');
});
