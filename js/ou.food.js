/**
 * Created by bjwsl-001 on 2016/8/31.
 */

/**配置路由**/
var app = angular.module('myApp', ['ng', 'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/myIndex', {
        templateUrl: 'tpl/first.html',
        controller:"indexCtrl"
    }).when('/myMenu', {
        templateUrl: 'tpl/menu.html',
        controller:"menuCtrl"
    }).when('/myDetail/:did', {
        templateUrl: 'tpl/detail.html',
        controller:"detailCtrl"
    }).when('/myOrder/:did', {
            templateUrl: 'tpl/order.html',
        controller:"orderCtrl"
    }).when('/myReginter', {
            templateUrl: 'tpl/reginter.html'
        })
        .otherwise({redirectTo: '/myIndex'});

});

app.controller('parentCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $scope.jump = function (arg) {
        $location.path(arg);
    };
}]);
/***index页面加载数据**/
app.controller('indexCtrl', ['$scope', '$http', function ($scope, $http){
    $http.get('data/bread_dish.php').success(function (data) {
        $scope.breadlist = data;
        //console.log(data);
    });
    $http.get('data/cake_dish.php').success(function (data) {
        $scope.cakelist = data;
        //console.log($scope.cakelist);
    });
    $http.get('data/work_dish.php').success(function (data) {
        $scope.worklist = data;
        //console.log($scope.worklist);
    });
}]);
app.controller('menuCtrl', ['$scope', '$http', function ($scope, $http) {
//页面一加载请求条数据，在menu页面生成view
    $scope.hasMore = true;
    $http.get('data/bread_dish.php?count=6').success(function (data) {
        $scope.list = data;
    });
    $scope.getMorecake=function(){
        $http.get('data/cake_dish.php?count=10').success(function (data) {
            $scope.list = '';
            $scope.list = data;
            console.log(data);
        });
    };
    $scope.getMorework=function(){
        $http.get('data/work_dish.php?count=10').success(function (data) {
            $scope.list = '';
            $scope.list = data;
            console.log(data);
        });
    };
    $scope.getMorebread=function(){
        $http.get('data/bread_dish.php?count=10').success(function (data) {
            $scope.list = '';
            $scope.list = data;
            console.log(data);
        });
    };
    $scope.upload = function () {
        $http.get('data/dish_getbyage.php?start=' + $scope.list.length).success(function (data) {
            $scope.list = $scope.list.concat(data);
            if (data.length < 5) {
                $scope.hasMore = false;
            }
            //console.log($scope.list);
        });

    };
    //为搜索框绑定事件;
    $scope.$watch('kw', function () {
        // console.log($scope.kw);
        if ($scope.kw) {
            $http.get('data/dish_getbykey.php?kw=' + $scope.kw).success(function (data) {
                $scope.list = data;
                console.log($scope.list);
            });
        }
    });
}]);
//详情页获取id显示数据  通过$routeParams 传递参数
app.controller('detailCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    console.log($routeParams.did);
    $http.get('data/dish_getbyid.php?did='+$routeParams.did).success(function (data) {
        $scope.dish = data;
        console.log($scope.dish);
    });
    $http.get('data/dish_hot_dish.php').success(function (data) {
        $scope.hotdish = data;

    });

}]);
////表单提交页，接受参数
app.controller('orderCtrl', ['$scope', '$http', '$routeParams', '$rootScope', function ($scope, $http, $routeParams, $rootScope) {
    console.log($routeParams.did);
    $scope.order = {'did': $routeParams.did};
    $scope.submitOrder = function () {
        var str = jQuery.param($scope.order);
        $http.get('data/dish_order.php?' + str).success(function (data) {
            if (data[0].msg == 'succ') {
                $rootScope.phone = $scope.order.phone;
                console.log($rootScope.phone);
                $scope.succMsg = "订餐成功！您的订单编号为：" + data[0].oid + "您可以在用户中心查看订单状态";
            }
            else {
                $scope.errMsg = '订餐失败！';
                $rootScope.phone = $scope.order.phone;
                console.log($rootScope.phone);
            }
        });
    };


}]);


