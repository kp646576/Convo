

//localStorage.setItem("sinchClient", sinchClient);
//localStorage.setItem("messageClient", JSON.stringify(messageClient));
//console.log(JSON.parse(localStorage.getItem("messageClient")));

sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

var messageClient = sinchClient.getMessageClient();



// This jQuery call is just an example how you might authenticate users and pass the ticket to Sinch.

ApplicationKey = '80805d38-246e-4bf7-860a-253e55a73581';
ApplicationSecret = '74RGvay4eEyYnpkGg1+hMQ==';
usernameAndPassword = "application" + ApplicationKey + ":" + ApplicationSecret;
Authorization = "basic" + " " + btoa ( usernameAndPassword );

function sinchInit() {
	//localStorage.setItem("lastname", "Smith");
	console.log("you clicked");
	var username = $('input#username').val();
	var password = $('input#password').val();
	console.log(username);
	console.log(password);


	var authTicket2 = {'userTicket': 'eyJhcHBsaWNhdGlvbktleSI6IjgwODA1ZDM4LTI0NmUtNGJmNy04NjBhLTI1M2U1NWE3MzU4MSIsImV4cGlyZXNJbiI6MzYwMCwiaWRlbnRpdHkiOnsidHlwZSI6InVzZXJuYW1lIiwiZW5kcG9pbnQiOiJhc2RmIn0sImNyZWF0ZWQiOiIyMDE1LTA2LTMwVDEzOjEzOjI1LjkxNDM0MiJ9:nfZlBl7mE3PuNg9pLUdJtQje8NmyOSbC6SmbjxYfdKw='};
	//{'username': 'asdf', 'password': 'asdf'};
	//{'userTicket': 'eyJhcHBsaWNhdGlvbktleSI6IjgwODA1ZDM4LTI0NmUtNGJmNy04NjBhLTI1M2U1NWE3MzU4MSIsImV4cGlyZXNJbiI6MzYwMCwiY3JlYXRlZCI6IjIwMTUtMDYtMzBUMTA6NTM6NTEuMjMyODIyIiwiaWRlbnRpdHkiOnsiZW5kcG9pbnQiOiJhc2RmIiwidHlwZSI6InVzZXJuYW1lIn19:j+lAghtH1u/kMKk6aikbCOyyEJi1o78XbjlS6fFFXCk='};//{'username': 'chicken', 'password': 'fck'};//{'userTicket': 'eyJpZGVudGl0eSI6eyJ0eXBlIjoidXNlcm5hbWUiLCJlbmRwb2ludCI6ImFzZGYifSwiY3JlYXRlZCI6IjIwMTUtMDYtMzBUMTA6MzU6MDAuNzM3MDQ5IiwiZXhwaXJlc0luIjozNjAwLCJhcHBsaWNhdGlvbktleSI6IkFJemFTeUNhZmdNZjQ1YlYydkY5R0JaQ3JQSl9ia2JTWEFiVExYTSJ9:w/bwWUW1aQkYvJJRoUTfq9gbmNkt3kDur0XUUgpjrD4='};




	var userTicket = {
	                        "identity": {"type": "userName", "endpoint": "bro"},
	                        "applicationKey": ApplicationKey,
	                        "created": new Date().toISOString()
	                    };


	                    var userTicketJson = JSON.stringify(userTicket).replace(" ", "");
	                    var userTicketBase64 = btoa(userTicketJson);

	                    var digest = CryptoJS.HmacSHA256(userTicketJson, CryptoJS.enc.Base64.parse(ApplicationSecret));

	                    var signature = CryptoJS.enc.Base64.stringify(digest);

	                    var signedUserTicket = userTicketBase64 + ':' + signature;

/*
console.log(signedUserTicket);
sinchClient.newUser({username: 'oopa', email: 'magnus2@example.com', password: 'strongstuff'})
    .then(function(ticket) {
				console.log(ticket);
        //Things to do on success
        sinchClient.start(ticket); //Start sinch using ticket from creating user
    })
    .fail(function(error) {
        //Manage error (One/more identities may be taken, or password not strong enough, or other)
    })*/

/*
	sinchClient.start({userTicket: signedUserTicket})//{authorization : basic})
			.then(function() {

				console.log("success!");
				var sinchMessage = messageClient.newMessage('asdf', 'hello');
				messageClient.send(sichMessage);
					// Handle successful start, like showing the UI
			})
			.fail(function(error) {
				console.log("fail :(");
					// Handle Sinch error
			});
*/

	$.post('/', function(authTicket) {

			console.log("authticket:" + authTicket);
			var stuff = eval("(" + authTicket + ")");
			console.log(stuff);

			sinchClient.start(stuff)
	        .then(function() {

								console.log("success!");
								//var sinchMessage = messageClient.newMessage('asdf', 'hello');
								//messageClient.send(sichMessage);
	                // Handle successful start, like showing the UI
	            })
	            .fail(function(error) {
								console.log("fail :(");
	                // Handle Sinch error
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
}

/*sinchClient = new SinchClient({
	applicationKey: '80805d38-246e-4bf7-860a-253e55a73581',
	capabilities: {messaging: true},
});

$('button#loginUser').on('click', function(event) {
    //event.preventDefault();
    //$('button#createUser').attr('disabled', true);
    //$('button#loginUser').attr('disabled', true);
	//clearError();

	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.start(loginObject, function() {
		localStorage.username = username;
		location.href = "home.html";
	}).fail(handleError);
});*/
