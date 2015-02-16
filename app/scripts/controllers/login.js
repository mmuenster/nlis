// login.js
'use strict';


 nlisApp.controller('LoginController', function ($scope, $rootScope, $state, currentUser, AuthService) {

  console.log($rootScope.currentUser);
  if ($rootScope.currentUser) {
    $state.go('dashboard');
  }
  	
    $scope.submit = function (email, password) {
      var promise = AuthService.login(email, password);
  		promise.then(function(user) {
  			console.log("Login success.", user);
  			$rootScope.currentUser = user;
        $state.go('dashboard');
  		}, function(user) {
  			console.log("Login Failed.", user);
  			$scope.$dismiss;
  		});
  	};
});



