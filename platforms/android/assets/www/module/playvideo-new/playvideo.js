app.controller('playvideo', function ($scope, $injector, $http, $location, $route, $cookieStore, $timeout, $q, $sce, loading, model) {


    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    } else {
        var userinfo = $cookieStore.get('userinfo');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }

    $scope.FetchTrailer = function () {
        loading.active();
        var args = $.param({
            country_id: $cookieStore.get('country').country_id,
            income_level_id: userinfo.income_level,
            content_id: $cookieStore.get('detail').id,
            type: $scope.type,
            user_id: $cookieStore.get('userinfo').id,
            age: userinfo.age

        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_trailers',
            data: args //forms user object

        }).then(function (response) {

            res = response;
            if (res.data.responseCode == '200') {
                if (res.data.data.result == '') {

                } else {
                    $scope.getdata = res.data.data.result;
                }
            } else {
                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);
            }
        }).finally(function () {

            // loading.deactive()();

        });

    }

    
    $scope.FetchTrailer();




    $scope.save_trailer_history = function () {
        loading.active();
        var args = $.param({
            csrf_test_name: '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            user_id: $cookieStore.get('userinfo').id,
            trailer_id: $scope.getdata,//$cookieStore.get('detail').id,
            type: $cookieStore.get('ck_typeof')
        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/save_viewed_trailer',
            data: args //forms user object

        }).then(function (response) {
            // loading.deactive()();
            res = response;
            if (res.data.responseCode == '200') {
                console.log(res.data.data);
            } else {
                //Throw error if not logged in
                // model.show('', res.data.responseMessage);
            }
        });

    }


    //==============on click skip advertise=================//
    //------------make entry in db of viewed advertisement--------------//
    $scope.save_advertise_history = function () {
        loading.active();
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'user_id': $cookieStore.get('userinfo').id,
            'advertise_id': $scope.getdata,
            'type': $cookieStore.get('ck_typeof')
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/save_viewed_advertise',
            data: args //forms user object

        }).then(function (response) {
            // loading.deactive()();
            res = response;
            if (res.data.responseCode == '200') {
                console.log(res.data.data);
            } else {
                //Throw error if not logged in
                model.show('', res.data.responseMessage);
            }
        });

    }


    setTimeout(function () {
        if ($scope.getdata !== undefined) {

            $scope.save_trailer_history();
            $scope.save_advertise_history();
        }

    }, 300);


    //===========play movie after skip or compltion of advertise================//
    //------------initialize video player------------------//
    var controller = this;
    controller.API = null;


    $scope.start_player = function (video_url, poster_img) {

        if (video_url != '') {
            var poster_img = (poster_img != '') ? poster_img : '';
            //---------for video player--------------------------//

            controller.config = {
                autoPlay: true,
                preload: "none",
                autohide: true,
                autohideTime: 2000,
                sources: [
                    { src: $sce.trustAsResourceUrl(video_url), type: "video/mp4" },
                    { src: $sce.trustAsResourceUrl("assets/videos/video.webm"), type: "video/webm" },
                    { src: $sce.trustAsResourceUrl("assets/videos/video.ogg"), type: "video/ogg" }
                ],
                tracks: [{
                    src: "assets/video/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }],
                theme: {
                    url: "assets/video/videogular.css"
                },
                plugins: {
                    poster: poster_img
                }
            };


            setTimeout(function () {
                loading.deactive();
            }, 1500)

            //-------- for video player close-----------------------//
        }
    }



    var count = 0;
    controller.onPlayerReady = function (API) {
        loading.active();
        console.log(this);
        controller.API = API;

        $scope.start_player($cookieStore.get('detail').movie_url, 'poster_img');
        return false;
        controller.Complete = function (API) {
            loading.deactive();
            // $scope.is_skippeds = '2';
            // controller.clearMedia()
            if ($scope.getdata) {

                var total_len = $scope.getdata.length;
            } else {
                total_len == '0';
            }

            if (total_len == count) {
                if ($cookieStore.get('video_details')) {

                    var a = $cookieStore.get('video_details');
                    controller.API.mediaElement[0].src = a.src;
                    controller.API.seekTime($cookieStore.get('video_details').current / 1000, null);
                    $scope.is_skippeds = '0';
                    loading.deactive();
                    $cookieStore.remove('video_details');
                    controller.API.play();

                } else {

                    $scope.is_skippeds = '0';
                    $scope.start_player($cookieStore.get('detail').movie_url, poster_img);
                }

            } else {
               
                if ($scope.getdata != undefined && $scope.getdata[count] !== undefined) {
                  // alert($scope.getdata[count].video)
                    // $scope.is_skippeds = '2';
                    poster_img = '';
                    $scope.start_player($scope.getdata[count].video, poster_img);
                    controller.API.play();
                    
                }
                else {
                   
                    if ($cookieStore.get('video_details')) {
                        var a = $cookieStore.get('detail');
                        controller.API.mediaElement[0].src = a.movie_url;

                        controller.API.seekTime($cookieStore.get('video_details').current / 1000, null);

                        $scope.is_skippeds = '0';
                        loading.deactive();
                        $cookieStore.remove('video_details');
                        controller.API.play();

                    } else {
                        var a = $cookieStore.get('detail');
                        controller.API.mediaElement[0].src = a.movie_url;

                        controller.API.seekTime(0 / 1000, null);

                        $scope.is_skippeds = '0';
                        loading.deactive();
                        $cookieStore.remove('video_details');
                        controller.API.play();
                    }

                }
            }
            count++;


        }


        controller.API.playPause = function (API) {



            if (this.mediaElement[0].paused) {
                // request for play 

                var events = {
                    current: this.currentTime,
                    left: this.timeLeft,
                    total: this.totalTime,
                    src: this.mediaElement[0].src
                };
                $cookieStore.put('video_details', events);
                count = 0;
                controller.Complete();
                $scope.is_skippeds = '2';
                this.play();

            } else {
                var events = {
                    current: 0,//this.currentTime,
                    left: 0,//this.timeLeft,
                    total: 0,//this.totalTime,
                    src: this.mediaElement[0].src
                };

                // alert(events)
                $cookieStore.put('video_detailss', events);
                // loading.deactive()();
                this.pause();

            }
        }




        controller.Complete();
        setTimeout(function () {
     
            controller.Complete();
        }, 1000)


    };



});