//dashboard.admin.js

'use strict';

angular.module('nlisApp').controller('dashboardAdminController', function($scope) {
	
	$scope.messages = "Initial Message";

	$scope.showUserData = function() {
		$scope.messages = authData.userProfile.firstName;
	};
});