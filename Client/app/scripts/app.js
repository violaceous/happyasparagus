var app = angular.module('happyasparagusApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
]);

// $locationProvider.html5Mode(true)

app.config(function($httpProvider) {

  var logsOutUserOn401 = function($location, $q, SessionService, FlashService) {
    var success = function(response) {
      return response;
    };

    var error = function(response) {
      if(response.status === 418) {
        SessionService.unset('authenticated');
        $location.path('/login');
        FlashService.show(response.data.flash);
      }
      return $q.reject(response);
    };

    return function(promise) {
      return promise.then(success, error);
    };
  };

  $httpProvider.responseInterceptors.push(logsOutUserOn401);

});

app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  });
  
  $routeProvider.when('/register', {
	  templateUrl: 'views/register.html',
	  controller: 'RegisterController'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});

app.run(function($rootScope, $location, AuthenticationService, FlashService) {
  var routesThatRequireAuth = ['/home'];

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      message = 'Please log in to continue.';
      FlashService.show(message);
    }
  });
});

app.factory("FlashService", function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  };
});

app.factory("SessionService", function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  }
});

app.factory("AuthenticationService", function($http, $sanitize, SessionService, FlashService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  var loginError = function(response) {
	if(response.flash) {
		FlashService.show(response.flash);
	}
	else {
		FlashService.show("Error logging in - please try again.");
	}
  };

  var sanitizeCredentials = function(credentials) {
    return {
      email: $sanitize(credentials.email),
      password: $sanitize(credentials.password),
    };
  };

      var loginSuccess = function(data, status, headers, config, $scope) {
		  FlashService.clear();
		  cacheSession();
	  }

  return {
    login: function(credentials) {
      var login = $http.post("/api/login", sanitizeCredentials(credentials)).success(loginSuccess).error(loginError);
      return login;
    },
     
    logout: function() {
      var logout = $http.get("/api/logout");
      logout.success(uncacheSession);
      return logout;
    },
    
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});

app.factory("UserService", function() {
    var id = '14';

    return {
	getId: function() {
	    return id;
	},

	setId: function(newId) {
	    id = newId;
	}
    };
});


app.factory("RegisterService", function($http, $sanitize, SessionService, FlashService) {
	
	var sanitizeRegister = function(details) {
		return {
			first: $sanitize(details.first),
			last: $sanitize(details.last),
			email: $sanitize(details.email),
			password: $sanitize(details.password)
		};
	};
	var onRegisterSuccess = function(data, status, headers, config) {
		FlashService.clear();
	};
	
	var onRegisterError = function() {
		FlashService.show("Error creating user");
	};
	
	
	return {
		register: function(details) {
			var register = $http.post("/api/user", sanitizeRegister(details)).success(onRegisterSuccess).error(onRegisterError);
			return register;
		}
	}
});




