'use strict';

/**
 * @ngdoc overview
 * @name nlisApp
 * @description
 * # nlisApp
 *
 * Main module of the application.
 */
var nlisApp = angular
  .module('nlisApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.router',
    'ui.bootstrap',
    'metawidget'
  ]);

nlisApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('dashboard');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      data: {
        requireLogin: false
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
      data: {
        requireLogin: true
      }
    })
    .state('editUserProfile', {
      url: '/editUserProfile',
      templateUrl: 'views/editUserProfile.html',
      data: { requireLogin: true }
    });

});

nlisApp.run(function ($rootScope, $state, $timeout, AuthService) {
    var authData=AuthService.checkLoginStatus();

    if (authData) {
      var promise=AuthService.getUserProfile(authData);
      promise.then(function(userProfile) {
        $rootScope.currentUser = authData.password.email;
        $rootScope.userProfile = userProfile;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          var requireLogin = toState.data.requireLogin;
          if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            $state.go('login');
          };
        });
      },function(error) {
        console.log('Get User Profile failed.', error);
      });
    }

});

nlisApp.factory('AuthService', function($firebaseAuth, $q, $rootScope) {
    var authService = {};
    var fbRef = new Firebase('https://intense-heat-7202.firebaseio.com');
    fbRef.onAuth(authDataCallback);


      authService.login = function(email, password) {
        return $q(function(resolve,reject) {
          setTimeout(function(){
            fbRef.authWithPassword({'email':email, 'password':password}, function(error, authData) {
              if (error) {
                console.log('Login Failed!', error);
                reject(undefined);
              } else {
                fbRef.child('users/'+authData.uid).once('value', function(data) { 
                  authData.userProfile = data.val();
                  resolve(authData);
                });
              }
          });
        }, 2000);
        });
      };

      authService.logout = function() {
          return fbRef.unauth();
        };

      authService.checkLoginStatus = function() {
        return fbRef.getAuth();
      };


      //Add the user profile data from the 'users' area of the firebase to $rootScope.userProfile
      authService.getUserProfile = function(authData) {
        return $q(function(resolve, reject){
          fbRef.child('users/'+authData.uid).once('value', function(data) { 
            resolve( data.val() );
          }, function(error) {
            reject(error);
          });
        });
      };

      // Create a callback which logs the current auth state
      function authDataCallback(authData) {
        if (authData) {
          console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
          console.log("User is logged out");
        }
      };

      return authService;
});