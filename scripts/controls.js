/*------------------------------------------------------------------------------
Contacts Controls
------------------------------------------------------------------------------*/
$('#contacts-list li').on('click', function(e) {
    current_recipient = $(this).text();
    //makeChatroom(current_recipient);
    var tmp = '#chatroom-msgs-'.concat(current_recipient);
    if (current_recipient != prev_recipient) {
      $('#messages').tmpl({'name': current_recipient}).appendTo('.panel-body');
      if (prev_recipient != '') {
        $('#chatroom-msgs-'.concat(prev_recipient)).css('display', 'none');
      }
      prev_recipient = current_recipient;
      $(tmp).css('display', 'block');
    }
    $('#chatrm-btn').trigger('click');
});

var makeChatroom = function(recipient) {
    // Recipient is not in list of chatrooms
    if (!chatroomList[recipient]) {
        chatroomList[recipient] = [];
    }
};
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
    // Q:Is this needed?
    e.preventDefault();
    clearError();

    var text = $('input#btn-input').val();
    var time = timeStamp();
    $('#userMsg').tmpl({'username': global_username, 'time': time , 'msg': text}).appendTo('#chatroom-msgs-'.concat(current_recipient));//appendTo('.chat');
    $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
    // Clears input?
    $('#btn-input').val('');

    var sinchMessage = messageClient.newMessage(current_recipient, text);
    //console.log('message object to be sent:' + sinchMessage.recipientIds);

    messageClient.send(sinchMessage)
        .then(function() {
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
