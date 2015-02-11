// login.js
'use strict';


 nlisApp.controller('LoginController', function ($scope, $rootScope, $state, AuthService) {

  	$scope.submit = function (email, password) {
      var promise = AuthService.login(email, password);
  		promise.then(function(user) {
  			console.log("Login success.", user);
  			$rootScope.currentUser = user.password.email;
        $rootScope.userProfile = user.userProfile;
        $state.go('dashboard');
  		}, function(user) {
  			console.log("Login Failed.", user);
  			$scope.$dismiss;
  		});
  	};
});



