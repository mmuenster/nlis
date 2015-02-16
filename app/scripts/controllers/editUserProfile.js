//editUserProfile.js

'use strict';

nlisApp.controller('EditUserProfileController', function($scope, $rootScope, AuthService) {
			$scope.alerts = [];
            
            $scope.user = $rootScope.currentUser.userProfile;
            $scope.user.email = $rootScope.currentUser.password.email;
            $scope.master = angular.copy($scope.user);


            $scope.update = function() {
            	$scope.user.name = $scope.user.firstName + " " + $scope.user.lastName;
            	AuthService.updateUserProfile($scope.user);
	              };

	        $scope.reset = function() {
		        $scope.user = angular.copy($scope.master);
	        };

});
