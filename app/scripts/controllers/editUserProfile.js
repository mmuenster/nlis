//editUserProfile.js

'use strict';

nlisApp.controller('EditUserProfileController', function($scope, $rootScope) {
	
               $scope.user = $rootScope.userProfile;

               $scope.save = function() {
                  console.log( $scope.user );
               };
            });
