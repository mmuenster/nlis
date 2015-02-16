//admin.js

nlisApp.controller('AdminController', function($scope, fbURL, $firebase, $firebaseAuth) {
	var counter = 0;
	var fbRef = new Firebase(fbURL);
	var fbUsersRef = fbRef.child('users');
	var authObj = $firebaseAuth(fbRef);

	$scope.users = $firebase(fbUsersRef).$asArray();

	$scope.createUser = function() {
		var newEmail = "m" + counter + "@m.com";
		fbRef.createUser({ email:newEmail, password:'m'}, function(error, userData) {
		  if (error) {
		    switch (error.code) {
		      case "EMAIL_TAKEN":
		        console.log("The new user account cannot be created because the email is already in use.");
		        break;
		      case "INVALID_EMAIL":
		        console.log("The specified email is not a valid email.");
		        break;
		      default:
		        console.log("Error creating user:", error);
		    }
		  } else {
		    console.log("Successfully created user account with uid:", userData);
		   $firebase(fbUsersRef).$set(userData.uid,{ email:newEmail, name:userData.uid, password:'m' });
		  }
		});
		counter++;
	};

	$scope.delete = function(user) {
		console.log("Got to delete", user)
		$firebase(fbUsersRef).$remove(user.$id);
		authObj.$removeUser({ 
			email: user.email, 
			password: user.password
		});
	}
})