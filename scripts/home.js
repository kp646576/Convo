var global_username = '';
var global_recipient = '';

function timeStamp() {
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

var clearError = function() {
	$('div.error').text("");
}

var showPickRecipient = function() {
    location.href = "home.html";
    //$('div#auth').css('display', 'none');
    $('form#pickRecipient').show();
}

var showChat = function() {
    // Hide choose recipient
    $('form#pickRecipient').css('display', 'none');

    // Show chat box
    $('div.container').css('display', 'block');

    // Add in chat name to heading
    $('div.panel-heading').prepend(global_recipient);
}

var handleError = function(error) {
	$('button#createUser').attr('disabled', false);
	$('button#loginUser').attr('disabled', false);
	$('div.error').text(error.message);
}

/*
$('button#createUser').on('click', function(event) {
    event.preventDefault();
    $('button#createUser').attr('disabled', true);
    $('button#loginUser').attr('disabled', true);
	clearError();

	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.newUser(loginObject, function(ticket) {
		sinchClient.start(ticket, function() {
			global_username = username;
			showPickRecipient();
		}).fail(handleError);
	}).fail(handleError);
});
*/
/*
$('button#loginUser').on('click', function(event) {
    //event.preventDefault();
    //$('button#createUser').attr('disabled', true);
    //$('button#loginUser').attr('disabled', true);
	//clearError();

	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.start(loginObject, function() {
		global_username = username;
		showPickRecipient();
	}).fail(handleError);
});
*/

$('button#pickRecipient').on('click', function(event) {
    event.preventDefault();
    clearError();
    global_recipient = $('input#recipient').val();
    showChat();
});

var messageClient = sinchClient.getMessageClient();

// Pressing enter submits text
$('#btn-input').keypress(function (e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
        $("#btn-chat").click();
        $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
    };
});


$('button#btn-chat').on('click', function(event) {
    event.preventDefault();
	clearError();

    var text = $('input#btn-input').val();

    $("#userMsg").tmpl({"username": global_username, "time": timeStamp() , "msg": text}).appendTo(".chat");

    // Clears input?
    $('input#btn-input').val('');
	var sinchMessage = messageClient.newMessage(global_recipient, text);
    $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
	messageClient.send(sinchMessage).fail(handleError);
});

var eventListener = {
	onIncomingMessage: function(message) {
	        if (message.senderId == global_recipient) {
	                $("#buddyMsg").tmpl({"username": global_recipient, "time": timeStamp() , "msg": message.textBody}).appendTo(".chat");
	                $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);
	        }
	}
}



messageClient.addEventListener(eventListener);
