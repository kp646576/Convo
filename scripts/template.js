sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

messageClient = sinchClient.getMessageClient();

$.get('/ticket', function(authTicket) {
    //console.log("inside ticket" + authTicket);
    sinchClient.start(eval("(" + authTicket + ")"))
        .then(function() {
            console.log("success!");
            //var sinchMessage = messageClient.newMessage('asdf', 'hello');
            //messageClient.send(sichMessage);
              // Handle successful start, like showing the UI
        })
        .fail(function(error) {
          // Handle Sinch error
          console.log("fail :(");
        });
});
/*
$('#loginUser').click(function() {
	//localStorage.setItem("lastname", "Smith");
	var username = $('input#username').val();
	var password = $('input#password').val();

		$.post('/', function(authTicket) {
				sinchClient.start(eval("(" + authTicket + ")"))
		    		.then(function() {
								console.log("success!");
								//var sinchMessage = messageClient.newMessage('asdf', 'hello');
								//messageClient.send(sichMessage);
		              // Handle successful start, like showing the UI
		        })
            .fail(function(error) {
							// Handle Sinch error
							console.log("fail :(");
            });
		});
	    /*
			function(error) {
				console.log("error");
	        // Handle application server error
	    });
});




var global_username = 'asdf';
var global_recipient = 'test-user1';

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

var loginObject = {"username": global_username, "password": "asdf"};
sinchClient.start(loginObject, function() {
});


$('#home-button').on('click', function(event) {
  console.log(localStorage.getItem("username"));

  // Show chat box
  $('.container').css('display', 'block');
  //$( '#main-content' ).load( "../static/home.html .container" );
  $('.panel-heading').prepend(global_recipient);

});

var clearError = function() {
	$('div.error').text("");
}

var handleError = function(error) {
	$('button#createUser').attr('disabled', false);
	$('button#loginUser').attr('disabled', false);
	$('div.error').text(error.message);
}

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
  $('.panel-body').scrollTop($('.panel-body')[0].scrollHeight);

  // Clears input?
  $('input#btn-input').val('');

	var sinchMessage = messageClient.newMessage(global_recipient, text);

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

messageClient.addEventListener(eventListener);*/
