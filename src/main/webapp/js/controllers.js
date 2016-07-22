(function ($app) {
    angular.module('custom.controllers', []);

    app.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', '$window', '$state', '$translate', 'Notification', function ($scope, $http, $location, $rootScope, $window, $state, $translate, Notification) {

        $scope.message = {};

        $scope.login = function () {

            $scope.message.error = undefined;

            var user = { username: $scope.username.value, password: $scope.password.value };

            $http({
                method: 'POST',
                url: 'auth',
                data: $.param(user),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(handleSuccess).error(handleError);
        }
        
        $rootScope.infiniteReached = function() {
          //
        }

        function handleSuccess(data, status, headers, config) {
            // Store data response on session storage
            // The session storage will be cleaned when the browser window is closed
            if(typeof(Storage) !== "undefined") {
                // save the user data on localStorage
                sessionStorage.setItem("_u",JSON.stringify(data));
            } else {
                // Sorry! No Web Storage support.
                // The home page may not work if it depends
                // on the logged user data
            }
            
            // Redirect to home page
            $state.go("home");
            
        }

        function handleError(data, status, headers, config) {
            var error = status == 401 ? $translate.instant('Login.view.invalidPassword') : data;
            Notification.error(error);
        }
    }]);

    app.controller('HomeController', ['$scope', '$http', '$rootScope', '$state', '$translate', 'Notification', '$location', function ($scope, $http, $rootScope, $state, $translate, Notification, $location) {
        
        $scope.message = {};
        $scope.dashboard = {};
        
        $scope.selecionado = {
          valor : 1
        }
        
        // When access home page we have to check
        // if the user is authenticated and the userData
        // was saved on the browser's sessionStorage
        $rootScope.session = (sessionStorage._u) ? JSON.parse(sessionStorage._u) : null;
        if(!$rootScope.session) {
          // If there isn't a user registered on the sessionStorage
          // we must send back to login page
          // TODO - REVISAR login oauth2
          //$state.go("login");
        }
        
        $rootScope.logout = function logout() {

            $http({
                method: 'GET',
                url: 'logout',
            }).then(handleSuccess, handleError)

            $rootScope.session = {};
        }

        function handleSuccess(data) {
            // Before redirect to login page we 
            // have to clean the user data from the 
            // session storage
            if(typeof(Storage) !== "undefined") {
                // save the user data on localStorage
                sessionStorage.removeItem("_u");
            } else {
                // It's not working with sessionStorage
            }
            
            $state.go("login");
        }

        function handleError(error) {
            $rootScope.session.error = error;
        }
        
        $scope.addVendaItem = function(estoque, qtd) {
          var errors = '';
          if (!estoque)
            errors+=$translate.instant('Home.view.Venda.SelectProduct')+'<br/>';
          if (!qtd)
            errors+=$translate.instant('Home.view.Venda.InsertQtd')+'<br/>';
          
          if (errors.length > 0) {
            Notification.error(errors); 
            return;
          }
          
          if (!Venda.active.vendaItens) {
            Venda.active.vendaItens = []
          }
          Venda.active.vendaItens.push( { estoque: estoque, quantidade: qtd  } );
        }
        
        $scope.fecharVenda = function() {
          var errors = '';
          if (!Venda.active.vendaItens || Venda.active.vendaItens.length === 0) {
            errors+=$translate.instant('Home.view.Venda.AtLeastOneProduct')+'<br/>';
          }
          if (errors.length > 0) {
            Notification.error(errors); 
            return;
          }
          Venda.post();
        }
        
        $scope.removeVendaItem = function(itemVenda) {
          var index = Venda.active.vendaItens.indexOf(itemVenda);
          if (index > -1)
            Venda.active.vendaItens.splice(index,1);
        }
        
        $scope.getTotalVenda = function() {
          var total = 0;
          if (Venda.active && Venda.active.vendaItens ) {
            $(Venda.active.vendaItens).each(function() {  total += (this.estoque.valorVenda * this.quantidade)   });
          }
          return total;
        }
        
        
        $scope.changePassword = function () {

            var user = { oldPassword: oldPassword.value, newPassword: newPassword.value, newPasswordConfirmation: newPasswordConfirmation.value };

            $http({
                method: 'POST',
                url: 'changePassword',
                data: $.param(user),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(changeSuccess).error(changeError);
            
            function changeSuccess(data, status, headers, config) {
              Notification.info($translate.instant('Home.view.passwordChanged'));
              cleanPasswordFields();
            }
    
            function changeError(data, status, headers, config) {
                var error = status >= 401 ? $translate.instant('Home.view.InvalidPassword') : data;
                Notification.error(error);
            }     
            
            function cleanPasswordFields() {
                oldPassword.value = "";
                newPassword.value = "";
                newPasswordConfirmation.value = "";
                $("#modalPassword").modal("hide");
            }
        }
        
        var closeMenuHandler = function () {
          var element = $(this);
          if(element.closest('.sub-menu').length > 0) {
            element.closest(".navbar-nav").collapse('hide');
          }
        }
          
        $scope.$on('$viewContentLoaded', function(){
          var navMain = $(".navbar-nav");
          
          //Here your view content is fully loaded !!
          navMain.off("click", "a", closeMenuHandler);
          navMain.on("click", "a", closeMenuHandler);
          
          
          $scope.$watch(
            function () {
              return location.hash
            }, 
            function (value) {
              try {
                if ($location.search().start && Venda) {
                  if (!$scope.Venda.inserting) {
                    var started;
                    var intervalStartInserting  = setInterval(function() {
                      if (!started) {
                        try {
                          started = $('#btnNewVenda').trigger('click');
                        }catch (e) { started = null; }
                      }
                      else
                        clearInterval(intervalStartInserting);
                    },10);
                  }
                }
                else if (Venda)
                  Venda.cancel()
              }
              catch (e) { }
            }
          );
          
        });
        
        $scope.loadDashboard = function() {
          Morris.Area({
            element: 'morris-area-chart',
            data: [{
                period: '2010 Q1',
                iphone: 2666,
                ipad: null,
                itouch: 2647
            }, {
                period: '2010 Q2',
                iphone: 2778,
                ipad: 2294,
                itouch: 2441
            }, {
                period: '2010 Q3',
                iphone: 4912,
                ipad: 1969,
                itouch: 2501
            }, {
                period: '2010 Q4',
                iphone: 3767,
                ipad: 3597,
                itouch: 5689
            }, {
                period: '2011 Q1',
                iphone: 6810,
                ipad: 1914,
                itouch: 2293
            }, {
                period: '2011 Q2',
                iphone: 5670,
                ipad: 4293,
                itouch: 1881
            }, {
                period: '2011 Q3',
                iphone: 4820,
                ipad: 3795,
                itouch: 1588
            }, {
                period: '2011 Q4',
                iphone: 15073,
                ipad: 5967,
                itouch: 5175
            }, {
                period: '2012 Q1',
                iphone: 10687,
                ipad: 4460,
                itouch: 2028
            }, {
                period: '2012 Q2',
                iphone: 8432,
                ipad: 5713,
                itouch: 1791
            }],
            xkey: 'period',
            ykeys: ['iphone', 'ipad', 'itouch'],
            labels: ['iPhone', 'iPad', 'iPod Touch'],
            pointSize: 2,
            hideHover: 'auto',
            resize: true
          });
    
          Morris.Donut({
            element: 'morris-donut-chart',
            data: [{
                label: "Download Sales",
                value: 12
            }, {
                label: "In-Store Sales",
                value: 30
            }, {
                label: "Mail-Order Sales",
                value: 20
            }],
            resize: true
          });
    
          Morris.Bar({
            element: 'morris-bar-chart',
            data: [{
                y: '2006',
                a: 100,
                b: 90
            }, {
                y: '2007',
                a: 75,
                b: 65
            }, {
                y: '2008',
                a: 50,
                b: 40
            }, {
                y: '2009',
                a: 75,
                b: 65
            }, {
                y: '2010',
                a: 50,
                b: 40
            }, {
                y: '2011',
                a: 75,
                b: 65
            }, {
                y: '2012',
                a: 100,
                b: 90
            }],
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B'],
            hideHover: 'auto',
            resize: true
          });
          
           $http({
                method: 'GET',
                url: 'api/rest/controleEstoque/Custom/DashboardInfo',
            }).then(
              function(info) {
                $scope.dashboard = info.data; 
              }
              , function () { });
          
        }
        
    }]);
} (app));
