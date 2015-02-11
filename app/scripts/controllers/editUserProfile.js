//editUserProfile.js

'use strict';

angular.module('nlisApp').controller('EditUserProfileController', function($scope, $rootScope) {
	
               $scope.user = $rootScope.userProfile;

               $scope.save = function() {
                  console.log( $scope.user );
               };
            });
