// index.js

 nlisApp.controller('IndexController', function ($scope, $rootScope, $location, $state, AuthService) {
    $scope.isCurrentPath = function (path) {
      return $location.path() === path;
    };

    $scope.logout = function() {
      var x = AuthService.logout();
      $rootScope.currentUser = undefined;
      $state.go('login');
};
});
