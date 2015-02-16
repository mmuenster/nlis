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
    'ui.bootstrap'
  ]);

nlisApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      resolve: {
        currentUser: 'UserService'
      },
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
    })
    .state('editUserProfile', {
      url: '/editUserProfile',
      templateUrl: 'views/editUserProfile.html',
    })
    .state('admin', {
      url: '/admin',
      templateUrl: 'views/admin.html'
    })


});

nlisApp.constant('fbURL', 'https://intense-heat-7202.firebaseio.com/');

nlisApp.run(function ($rootScope, $state, UserService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          if (!$rootScope.currentUser && toState.name != 'login') {
            event.preventDefault();
            var promise = UserService;
            promise.then(function() {
              console.log("In the promise.")
              $state.go(toState.name, toParams);
            });
          }
        });
});

nlisApp.factory('UserService', function($q, $firebaseAuth, fbURL, $rootScope) {
    return $q(function(resolve,reject){
      var fbRef = new Firebase(fbURL);
      var x = fbRef.getAuth();
      if (!x) {
        $rootScope.currentUser = undefined;
        resolve(undefined);
      } else {
        fbRef.child('users/'+ x.uid).once('value', function(data) { 
          x.userProfile = data.val();
          $rootScope.currentUser = x;
          resolve(x);
          },function() {
            reject("Error");
          }
        );
      } 
  });
});

//AuthService handles changes in the authorization with Firebase
nlisApp.factory('AuthService', function($firebaseAuth, $q, $rootScope, fbURL) {
    var authService = {};
    var fbRef = new Firebase(fbURL);
    
    //Register a callback funtion for anytime the authorization status changes
    fbRef.onAuth(authDataCallback);
      
      authService.login = function(email, password) {
        return $q(function(resolve,reject) {
          setTimeout(function(){
            fbRef.authWithPassword({'email':email, 'password':password}, function(error, fbAuthData) {
              if (error) {
                console.log('Login Failed!', error);
                authService.authData = undefined;
                reject(undefined);
              } else {
                fbRef.child('users/'+fbAuthData.uid).once('value', function(data) { 
                  fbAuthData.userProfile = data.val();
                  authService.authData = fbAuthData;
                  resolve(fbAuthData);
                });
              }
          });
        }, 2000);
        });
      };

      authService.logout = function() {
          $rootScope.currentUser = undefined;
          return fbRef.unauth();
        };


        authService.updateUserProfile = function(profileData) {
          fbRef.child('users/' + $rootScope.currentUser.uid).update(profileData);
        }

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

