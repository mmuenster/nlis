//editUserProfile.js

'use strict';

nlisApp.controller('EditUserProfileController', function($scope, $rootScope, AuthService) {
			$scope.alerts = [];
            
            $scope.user = $rootScope.userProfile;

            $scope.save = function() {
	              var promise = AuthService.saveUserProfile();
	              promise.then( function() {
		              $scope.alerts.push({ type:"success", message:"User profile data saved successfully!"});
		              console.log($scope.user);
		          }, function () {
		          	console.log('There was a problem saving the user data');
		          });

	              };
            });
