var app_url = 'http://projects.tekshapers.in/watchit/webservices/';
//var app_url = 'http://localhost/watchit/webservices/';
var api_key = '0ed2e4b57d1f837276553b00d3fc2a29';

var storage = window.localStorage;

var app = angular.module("myApp", ['ngRoute', 'ngSanitize', 'ngCookies', 'slickCarousel', 'ngSidebarJS', 'ngCordova', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls', 'com.2fdevs.videogular.plugins.overlayplay', 'com.2fdevs.videogular.plugins.poster', 'com.2fdevs.videogular.plugins.buffering', 'infinite-scroll', 'ngCordovaOauth', 'ngCordova']);
//app.constant("CSRF_TOKEN", '40d3dfd36e217abcade403b73789d732');         //{!! csrf_token() !!}

var currentUrl = '';

//Detect the Current Path
app.run(['$rootScope', '$location', '$routeParams', function ($rootScope, $location, $routeParams, $cookieStore) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
        currentUrl = $location.path();

    });


}]);


var ress;
//Check the background page image from live path, every time the page is loaded
app.run(function ($q, $http, $rootScope, $location, $interval, $cordovaToast, loading, model) {

    var act = window.console.log();

    // window.alert = function (type, content) {

    //     if (content == '' || content == undefined) {

    //         if (typeof type === 'string') {

    //             var j = type.toLowerCase();
    //             var a = j.indexOf("successfully");
    //             var b = j.indexOf("successful");
    //             var c = j.indexOf("success");
    //             // console.log(c)
    //             if (a >= 0 || b >= 0 || c >= 0) {
    //                 model.show('Info', type);
    //             } else {
    //                 model.show('Alert', type);
    //             }

    //         } else {

    //             //it will show when u passed the object
    //             model.show('Info', JSON.stringify(type));
    //         }
    //     } else {

    //         model.show(type, content);
    //     }
    // }


    var deferred = $q.defer();
    var promise = deferred.promise;
    var resolvedValue;
    $rootScope.abc = '';

    $rootScope.AppBackgroungImage = function (a) {

        // loading.active();
        var args = $.param({});

        var ress = $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_bgimage',
            data: args //forms user object

        }).then(function (response) {
            res = response;
            loading.deactive();
            if (res.data.responseCode == '200') {

                ress = res.data.data;
                $rootScope.abc = res.data.data;

            } else {
                $rootScope.abc = 'assets/images/logo.png';//res.data.responseCode;

            }
        });

    }

    $rootScope.AppBackgroungImage();
});

//Redirection from Online App To Offline Page and So on
app.run(function ($rootScope, $location, $interval, $cordovaToast) {

    // //alert(currentUrl.split('/')[1]);
    var myVar = '';
    currentUrl = $location.path().split('/')[1];
    $rootScope.currentUrl = $location.url().split('/')[1];

    $rootScope.userNavigation = function () {
        window.history.back()
    }

    $rootScope.RedirectOffline = function () {

        var ChangeRoute = currentUrl.split('/')[1];
        if (ChangeRoute == 'offline' || ChangeRoute == 'playoffline') {

            $rootScope.StatusMessage('No Internet Connection');
            $interval.cancel(myVar);

        } else {

            $location.path('/offline');
            ////alert('Checked');
        }
    }

    $rootScope.DeletedRecord = [];
    $rootScope.checkconnection = function () {

        if (navigator.connection.type == 'none') {
            $rootScope.RedirectOffline();
        } else {
            // clearInterval(myVar);
        }
    }

    $rootScope.TimeOutConnection = function (status) {
        currentUrl = $location.path().split('/')[1];

        if (status == 'enable') {
            myVar = $interval(function () {

                $rootScope.checkconnection();

                if (currentUrl == '/login' || currentUrl == '/forgot' || currentUrl == '/after_login') {

                    $rootScope.AppBackgroungImage();
                }

            }, 3000); //5 Sec timeStamp
        }

    }


    $rootScope.TimeOutConnection('enable');
});


//App Routing Configuration 
app.config(function ($routeProvider, $httpProvider) {
    // $httpProvider.interceptors.push('timestampMarker');

    $routeProvider
        .when("/", {
            templateUrl: "module/splash/splash.html"
        })
        .when("/splash", {
            templateUrl: "module/splash/splash.html"
        })
        .when("/login", {
            resolve: {
                function($cookieStore, $location) {
                    if ($cookieStore.get('userinfo')) {

                        $location.path('/home');
                    }
                }
            },
            templateUrl: "module/login/login.html",
            controllerAs: 'vm'
        })
        .when("/home", {
            templateUrl: "module/home/home.html",
            controller: 'home',
            controllerAs: 'vm'
        })
        .when("/view_all", {
            templateUrl: "module/home/view_all.html",

        })
        .when("/register_step1", {
            templateUrl: "module/register/register_first_step.html",
            controllerAs: 'vm'
        })
        .when("/register_step2", {
            templateUrl: "module/register/register_second_step.html",
            controllerAs: 'vm'
        })
        .when("/forgot", {
            templateUrl: "module/forgot/forgot.html",
            controller: 'forgot',
            controllerAs: 'vm'
        })
        .when("/changepassword", {
            templateUrl: "module/changepassword/changepassword.html",
            controller: 'changepassword',
            controllerAs: 'vm'
        })
        .when("/myaccount", {
            templateUrl: "module/myaccount/myaccount.html",
            controller: 'myaccount',
            controllerAs: 'vm'
        })
        .when("/subscription_reg", {
            templateUrl: "module/register/subscription_reg.html",
            controllerAs: 'vm'
        })
        .when("/movie_detail", {
            templateUrl: "module/movie_detail/movie_detail.html",
            controllerAs: 'vm'
        })
        .when("/series_view", {
            templateUrl: "module/series_view/series_view.html",
            controllerAs: 'vm'
        })
        .when("/series_detail", {
            templateUrl: "module/series_detail/series_detail.html",
            controllerAs: 'vm'
        })
        .when("/recent_view", {
            templateUrl: "module/recent_view/recent_view.html",
            controllerAs: 'vm'
        })

        .when("/playvideo", {
            templateUrl: "module/playvideo/playvideo.html",
            controller: 'playvideo'
        })
        .when("/playtrailer", {
            templateUrl: "module/playtrailer/playtrailer.html",
            controller: 'playtrailer'
        })
        .when("/playoffline", {
            templateUrl: "module/playoffline/playoffline.html",
            controller: 'playoffline'
        })
        .when("/search", {
            templateUrl: "module/search/search.html",
            //controller: 'search'
        })
        .when("/cms", {
            templateUrl: "module/cms/cms.html",
            //controller: 'search'
        })
        .when("/after_login", {
            templateUrl: "module/after_login/after_login.html",
            controllerAs: 'vm'

        }).when("/subscription", {

            templateUrl: "module/myaccount/subscription.html",
            controllerAs: 'vm',
            controller: 'myaccount'

        }).when("/mydownload", {

            templateUrl: "module/download/download.html",
            controllerAs: 'vm'


        }).when("/offlinedownloads", {

            templateUrl: "module/offlinedownloads/offlinedownloads.html",
            controllerAs: 'vm'

        }).when("/offline", {

            templateUrl: "module/offline/offline.html",
            controllerAs: 'vm'

        });

    //End Written By Rajat Gupta//

    //$httpProvider.defaults.headers.post['csrf_valid'] = '40d3dfd36e217abcade403b73789d732';
    //$httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

//Slider 
app.config(['slickCarouselConfig', function (slickCarouselConfig) {
    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = false;


}]);

//Generate the Random by giving parameter to limit the length of Random String
function makeid(val, id, type, img, name, user_id) {

    var text = "";
    var enc = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < val; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    enc = text + '_' + id + '_' + type + '_' + img + '_' + name + '_' + user_id;
    return encstring = window.btoa(enc);

}

//Encrypt thr Url or string also Decrypt the Url or String
//Download the offline videos, Create File , Remove File, Set the path
//CRUD Directory and File
app.run(function ($rootScope, $location, $interval, $cordovaToast, $cookieStore, $cordovaFile) {

    // Create Base64 Object

    var Base64 = {
        _keyStr: "ABCuvZaUVWXYNOklmnIdewPQRSTopqrsGHKLMt012345JfghijxyzDEFbc6789+/=",
        encode: function (r) {
            var t, e, o, a, h, n, c, d = "",
                C = 0;
            for (r = Base64._utf8_encode(r); C < r.length;) a = (t = r.charCodeAt(C++)) >> 2, h = (3 & t) << 4 | (e = r.charCodeAt(C++)) >> 4, n = (15 & e) << 2 | (o = r.charCodeAt(C++)) >> 6, c = 63 & o, isNaN(e) ? n = c = 64 : isNaN(o) && (c = 64), d = d + this._keyStr.charAt(a) + this._keyStr.charAt(h) + this._keyStr.charAt(n) + this._keyStr.charAt(c);
            return d
        },
        decode: function (r) {
            var t, e, o, a, h, n, c = "",
                d = 0;
            for (r = r.replace(/[^A-Za-z0-9+/=]/g, ""); d < r.length;) t = this._keyStr.indexOf(r.charAt(d++)) << 2 | (a = this._keyStr.indexOf(r.charAt(d++))) >> 4, e = (15 & a) << 4 | (h = this._keyStr.indexOf(r.charAt(d++))) >> 2, o = (3 & h) << 6 | (n = this._keyStr.indexOf(r.charAt(d++))), c += String.fromCharCode(t), 64 != h && (c += String.fromCharCode(e)), 64 != n && (c += String.fromCharCode(o));
            return c = Base64._utf8_decode(c)
        },
        _utf8_encode: function (r) {
            r = r.replace(/rn/g, "n");
            for (var t = "", e = 0; e < r.length; e++) {
                var o = r.charCodeAt(e);
                o < 128 ? t += String.fromCharCode(o) : o > 127 && o < 2048 ? (t += String.fromCharCode(o >> 6 | 192), t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128))
            }
            return t
        },
        _utf8_decode: function (r) {
            for (var t = "", e = 0, o = c1 = c2 = 0; e < r.length;)(o = r.charCodeAt(e)) < 128 ? (t += String.fromCharCode(o), e++) : o > 191 && o < 224 ? (c2 = r.charCodeAt(e + 1), t += String.fromCharCode((31 & o) << 6 | 63 & c2), e += 2) : (c2 = r.charCodeAt(e + 1), c3 = r.charCodeAt(e + 2), t += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3), e += 3);
            return t
        }
    };


    // Encode the String
    $rootScope.encodedString = function (string) {

        return Base64.encode(JSON.stringify(string));
    }

    // Decode the String
    $rootScope.decodedString = function (string) {

        return JSON.parse(Base64.decode((string)));
    }

    $rootScope.createDir = function () {

        document.addEventListener('deviceready', function () {

            $cordovaFile.createDir(cordova.file.externalDataDirectory, "nomedia", false)
                .then(function (success) {
                    // success
                    ////alert(JSON.stringify(success));
                    return 'true';
                }, function (error) {
                    // error
                    ////alert(JSON.stringify(error));
                    return 'false';
                });
        }, false);

    }
    $rootScope.createFile = function () {

        document.addEventListener('deviceready', function () {

            $cordovaFile.createFile(cordova.file.externalDataDirectory + 'nomedia', 'temp_0.txt', true)
                .then(function (success) {
                    // success
                    value = success;
                    // //alert(JSON.stringify(success));

                    return value;

                }, function (error) {
                    // error
                    ////alert(JSON.stringify(error));
                    value = error;
                    return value;

                });

        }, false);

        return value;

    }

    $rootScope.WriteFile = function (string) {

        document.addEventListener('deviceready', function () {
            $cordovaFile.writeFile(cordova.file.externalDataDirectory + 'nomedia', 'temp_0.txt', string, true)
                .then(function (success) {
                    // success
                    ////alert(JSON.stringify(success));
                    return true;
                }, function (error) {
                    // error
                    ////alert(JSON.stringify(error));
                    return false;
                });
        }, false);

    };
    $rootScope.ReadFile = function (string) {

        // READ
        document.addEventListener('deviceready', function () {
            $cordovaFile.readAsText(cordova.file.externalDataDirectory + 'nomedia', 'temp_0.txt')
                .then(function (success) {
                    // success
                    value = success;
                    // //alert(JSON.stringify(success));

                    return value;

                }, function (error) {
                    // error
                    ////alert(JSON.stringify(error));
                    value = error;
                    return error;

                });

        }, false);

        return value;
    };

    $rootScope.haveFile = '';
    $rootScope.CheckFile = function () {
        var IsExist = {};
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + "nomedia/temp_0.txt",
            function (entries) {
                ////alert(JSON.stringify(entries.isFile));
                $rootScope.haveFile = JSON.stringify(entries.isFile);
            }
        )

    }


    $rootScope.RemoveFile = function (string) {

        // READ
        document.addEventListener('deviceready', function () {

            $cordovaFile.removeFile(cordova.file.externalDataDirectory + 'nomedia', 'temp_0.txt')
                .then(function (success) {
                    // success

                    //    alert(JSON.stringify(success));
                    $cookieStore.remove('userinfo');
                    $cookieStore.remove('userinfo');
                    status = 'true';
                    return status;

                }, function (error) {
                    // error
                    //   alert(JSON.stringify(error));
                    status = 'false';
                    return status;

                });

        }, false);

        return status;
    };




});

//Generate the Random string throught out the Whole App
app.service('data', function ($rootScope) {

    var SetData = {};

    SetData.EncryptData = function (source) {
        return $rootScope.encodedString(source);
    };
    SetData.DecryptData = function (source) {
        return $rootScope.decodedString(source);
    };

    return SetData;
});


//Download the file , Tranfer the file and other activites 
//Counter check for the connection status
app.run(function ($q, $rootScope, $cordovaFileTransfer, $cookieStore, loading, model, $http, $location, $cordovaToast) {

    $rootScope.progresss = [];
    $rootScope.a = '0';
    $rootScope.b = [];
    $rootScope.downloadProgress = [];
    $rootScope.reck = '0'
    var invoicedatas = 'demo';



    $rootScope.deleteDownload = function (final_name) {
        var args = $.param({
            user_id: $cookieStore.get('userinfo').id,
            content_id: $cookieStore.get('detail').id,
            download_name: final_name
        });

        //alert(args)
        $http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/deleteDownload',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                //$scope.movie_data = res.data.data;

            } else {

                //Throw error if not logged in
                // model.show('//alert', res.data.responseMessage.error_msg);
            }


        });
    }




    $rootScope.countcheck = function () {
        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({

            user_id: $cookieStore.get('userinfo').id,


        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/count_download',
            data: args //forms user object

        }).then(function (response) {
            // loading.deactive();
            res = response;

            if (res.data.responseCode == '200') {

                $rootScope.counts = res.data.data;


            } else {

                //Throw error if not logged in
                var res = {
                    movies_count: '0',
                    series_count: '0'
                }
                $rootScope.counts = res;
                // $scope.counts.series_count= '0';
                //model.show('//alert', res.data.responseMessage);

            }


        }).finally(function () {

            if ($cookieStore.get('download_type')) {

                $rootScope.init($cookieStore.get('download_type'))

            } else if ($cookieStore.get('type')) {

                // alert($cookieStore.get('type'))
                $rootScope.init($cookieStore.get('type'));
            } else {
                $rootScope.init('series');

            }

            setTimeout(function () {
                loading.deactive();
            }, 3000)
        });
    }

    $rootScope.downloadinvoice = function (id, contentid, type, img, name, link_url = null) {

        loading.deactive();


        var unq_name = makeid(6, $cookieStore.get('detail').id, type, img, name, $cookieStore.get('userinfo').id);

        if (device.platform == 'Android') {

            var permissions = cordova.plugins.permissions;
            permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {

                if (status.hasPermission) {

                    var q = $q.defer();

                    $cordovaToast.showShortBottom('Download In Progress');
                    if (type == 'movies') {

                        var url = $rootScope.movie_data.movie_details.movie_video;

                    } else {

                        var url = $rootScope.movie_data.series_details.video;
                    }


                    var url_parse = url.split('.');
                    var total_len = url_parse.length;

                    var targetPath = cordova.file.externalDataDirectory + unq_name + '.' + url_parse[total_len - 1]; //android_assets/file
                    ////alert(targetPath)
                    var trustHosts = true;
                    var options = {};
                    var final_name = unq_name + '.' + url_parse[total_len - 1];

                    $rootScope.saveDownload = function (flag) {

                        if (type == 'movies') {
                            if (flag == '1') {

                                var args = $.param({
                                    user_id: $cookieStore.get('userinfo').id,
                                    content_id: $cookieStore.get('detail').id,
                                    type: $cookieStore.get('detail').type,
                                    download_name: final_name,
                                    flag: flag
                                });
                            } else {

                                var args = $.param({
                                    user_id: $cookieStore.get('userinfo').id,
                                    content_id: $cookieStore.get('detail').id,
                                    type: $cookieStore.get('detail').type,
                                    download_name: final_name,
                                });
                            }

                        } else {
                            if (flag == '1') {

                                var args = $.param({
                                    user_id: $cookieStore.get('userinfo').id,
                                    content_id: $cookieStore.get('detail').id,
                                    type: $cookieStore.get('detail').type,
                                    download_name: final_name,
                                    flag: flag
                                });
                            } else {

                                var args = $.param({
                                    user_id: $cookieStore.get('userinfo').id,
                                    content_id: $cookieStore.get('detail').id,
                                    type: $cookieStore.get('detail').type,
                                    download_name: final_name,
                                });
                            }

                        }

                        $http({
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            method: 'POST',
                            url: app_url + 'webservices/saveDownload',
                            data: args //forms user object

                        }).then(function (response) {
                            loading.deactive();
                            res = response;

                            if (res.data.responseCode == '200') {
                                //put cookie and redirect it    
                                //$scope.movie_data = res.data.data;

                            } else {

                                //Throw error if not logged in
                                // model.show('//alert', res.data.responseMessage.error_msg);
                                $cordovaToast.showShortBottom(res.data.responseMessage.error_msg);
                            }


                        });
                    }

                    $rootScope.saveDownload('0');
                    $rootScope.transferPromise = $cordovaFileTransfer.download(url, targetPath, q.resolve, q.reject, options, trustHosts);

                    $rootScope.transferPromise.then(function (result) {


                        cordova.plugins.MediaScannerPlugin.scanFile(targetPath, successCallback, errorCallback);

                        function successCallback() {

                            $rootScope.saveDownload('1');
                            // $cordovaToast.showLongBottom//alert('Download Completed');
                            $cordovaToast.showShortBottom('Download Completed');
                            $rootScope.countcheck()
                        };

                        function errorCallback() {

                            $cordovaToast.showShortBottom('Download Not Completed');
                            $rootScope.deleteDownload(final_name);
                            $rootScope.countcheck()

                        };
                        cordova.exec(null, null, 'ScanMedia', 'mediaScanner', [result.nativeURL]);

                    }, function (err) {

                        //alert(err)
                        $cordovaToast.showShortBottom('Download Not Completed Try Again');
                        $rootScope.deleteDownload(final_name);
                        $rootScope.countcheck()
                        $rootScope.error[id] = err;
                        // Error
                    }, function (progress) {


                        var asd = [];
                        var mb1 = progress.loaded / 1024;
                        var mb = mb1 / 1024;

                        var tot = progress.total / 1024;
                        var total = tot / 1024;

                        asd[0] = mb;
                        asd[1] = contentid;
                        asd[2] = type;
                        asd[3] = id;
                        asd[4] = (progress.loaded / progress.total) * 100;
                        asd[5] = img;
                        asd[6] = name;
                        asd[7] = total;
                        $rootScope.progresss[id] = asd;
                        // $rootScope.countcheck();
                    });

                } else {

                    permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);

                    function error() {
                        ////alert('Permission required !!! ');
                    }

                    function success(status) {
                        //////alert(status)
                        if (!status.hasPermission) {
                            error();
                        } else {
                            $rootScope.downloadinvoice(id, contentid, type);
                        }
                    }


                    ////alert("No :( ");
                }
            });

        } else if (device.platform == 'iOS') {
            ////alert('Coming Soon');
        } else {

            ////alert('Platform Not Supported');

        }







    }


});

//Loading service for loading image , show and hide at a time using service  param
app.service('loading', function () {

    var process = {};
    var load = angular.element(document.querySelector('.loading-overlay'));
    process.active = function () {
        return load.removeClass('hide').addClass('show');
    };
    process.deactive = function () {
        return load.removeClass('show').addClass('hide');
    };


    return process;
});

//Conditional model box to give the redirect url where we want to redirec after click OK
app.service('model', ['$rootScope', '$location', function ($rootScope, $location) {
    //////alert(window.location.path('/' + 'home'));
    var process = {};
    var url = '';
    var load = angular.element(document.querySelector('.modal-overlay'));
    $rootScope.load = angular.element(document.querySelector('.modal-overlay'));
    var title = angular.element(document.querySelector('.title'));
    var message = angular.element(document.querySelector('.message'));
    var CloseMark = angular.element(document.querySelector('.close-icon'));
    $rootScope.ok = angular.element(document.querySelector('.ok'));

    $rootScope.RedirectUrl = function () {
        load.removeClass('show').addClass('hide');
        // if (url != '') {

        //     $location.path('/' + url);
        // } else {
        //     load.removeClass('show').addClass('hide');
        // }
    }

    process.show = function (a, b) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        return load.removeClass('hide').addClass('show');
    };
    // It helps to redirect the page onclick of close button 
    process.ShowRedirectUrl = function (a, b, redirect) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        url = redirect;
        CloseMark.addClass('hide');
        return load.removeClass('hide').addClass('show');

    };
    process.ConfirmBox = function (a, b) {
        title.html(a);    // title 
        message.html(b);  //message for box
        $rootScope.ok.removeClass('hide').addClass('show'); //enable the Ok button
        return load.removeClass('hide').addClass('show');

    };
    process.hide = function () {
        return load.removeClass('show').addClass('hide');
    };

    return process;
}]);






app.directive('validateEmail', function () {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    return {
        require: 'ngModel',
        restrict: '',
        link: function (scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {

                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function (modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});
app.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
app.directive('validNumber', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});


app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.factory('Reddit', function ($http, $cookieStore) {
    var Reddit = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
    };
    //console.log(Reddit)
    /* Reddit.prototype.nextPage = function ($scope) {
     if (this.busy)
     return;
     this.busy = true;
     
     var url = "https://api.reddit.com/hot?after=" + this.after + "&jsonp=JSON_CALLBACK";
     var args = $.param({
     'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
     'series_id': $cookieStore.get('detail').id,
     'page' : '2',
     'country_id': '3'
     });
     $http({
     headers: {
     'token': '40d3dfd36e217abcade403b73789d732',
     'Content-Type': 'application/x-www-form-urlencoded'
     },
     method: 'POST',
     url: app_url + 'webservices/get_series_by_seriesId_countryId',
     data: args //forms user object
     
     }).then(function (data) {
     var items = data.data.data.series_list;
     for (var i = 0; i < items.length; i++) {
     this.items.push(items[i]);
     this.after = "t3_" + this.items[this.items.length - 1].id;
     }
     
     this.busy = false;
     }.bind(this));
     };*/
    return Reddit;

});