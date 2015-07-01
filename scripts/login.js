

//localStorage.setItem("sinchClient", sinchClient);
//localStorage.setItem("messageClient", JSON.stringify(messageClient));
//console.log(JSON.parse(localStorage.getItem("messageClient")));

sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

messageClient = sinchClient.getMessageClient();

ApplicationKey = '80805d38-246e-4bf7-860a-253e55a73581';
ApplicationSecret = '74RGvay4eEyYnpkGg1+hMQ==';



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

	/*var loginObject = {username: username, password: password};
	sinchClient.start(loginObject, function() {
		console.log("started?");
		//localStorage.setItem("username", username);
	});*/
});
