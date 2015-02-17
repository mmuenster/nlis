// index.js

 nlisApp.controller('IndexController', function ($scope, $rootScope, $location, $state, AuthService) {
    
    $scope.isAdmin = function() {
    	return $rootScope.currentUser.userProfile.roles.toLowerCase().indexOf("admin") > -1
    }

    $scope.isCurrentPath = function (path) {
      return $location.path() === path;
    };

    $scope.logout = function() {
      var x = AuthService.logout();
      $state.go('login');
};

    $scope.logDateToConsole = function (path) {
     console.log(Date.now());
    };
});
