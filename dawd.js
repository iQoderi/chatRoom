/**
 * Created by qoder on 16-2-27.
 */
'use strict';

angular.module('NeuqerShopAdminApp')
    .controller('ModalGoodAddCtrl', function ($scope, $uibModalInstance, $qupload, Resource, goodSelected) {

        if (goodSelected === undefined) {
            goodSelected = {}
        }
        $scope.good = goodSelected;

        $scope.onFileSelect = function ($file) {
            if (!$file[0].type.match(/image.*/)) {
                console.log('ig');
                toaster.pop('error', '图片格式不合法', '请上传正确格式的图片，只支持 JPG 与vote PNG');
            } else {
                var reader = new FileReader();
                reader.onload = (function (file) {
                    return function (e) {
                        $scope.good.icon = e.target.result;
                    }
                })($file[0]);
                reader.readAsDataURL($file[0]);
                Resource.File.picture.get(function (data) {
                    $file[0].upload = $qupload.upload({
                        file: $file[0],
                        token: data.token
                    });
                    $file[0].upload.then(function (response) {
                        $scope.good.icon = response.pictureUrl;
                    }, function (response) {
                        console.log(response);
                    }, function (evt) {
                        $scope.good.progress = Math.floor(100 * evt.loaded / evt.totalSize);
                    });
                });
            }

        };


        $scope.icon = {
            replacing: false,
            replace: function () {
                console.log('called');
                this.replacing = !this.replacing;
            }
        };

        $scope.crop = {
            cancelCount: 0,
            ok: function () {
                $scope.$broadcast('cropme:ok', 'iconcrop');
            },
            cancel: function () {
                if (this.cancelCount > 0) {
                    $scope.icon.replace();
                    this.cancelCount = 0;
                } else {
                    $scope.$broadcast('cropme:cancel', 'iconcrop');
                    this.cancelCount++;
                }
            }
        };

        $scope.$on("cropme:done", function (ev, result, cropmeEl) {
            console.log(result.croppedImage);
            var $file = result.croppedImage;
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
                    $scope.good.icon = e.target.result;
                }
            })($file);
            reader.readAsDataURL($file);
            Resource.File.picture.get(function (data) {
                $file.upload = $qupload.upload({
                    file: $file,
                    token: data.token
                });
                $file.upload.then(function (response) {
                    console.log(response);
                    $scope.good.icon = response.pictureUrl;
                    $scope.icon.replace();
                }, function (response) {
                    console.log(response);
                }, function (evt) {
                    $scope.good.progress = Math.floor(100 * evt.loaded / evt.totalSize);
                });
            });
        });

        $scope.ok = function () {
            $uibModalInstance.close($scope.good);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
