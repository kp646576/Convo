

//localStorage.setItem("sinchClient", sinchClient);
//localStorage.setItem("messageClient", JSON.stringify(messageClient));
//console.log(JSON.parse(localStorage.getItem("messageClient")));

function sinchInit() {
	//localStorage.setItem("lastname", "Smith");
	console.log("you clicked");
	var username = $('input#username').val();
	var password = $('input#password').val();
	console.log(username);
	console.log(password);
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
