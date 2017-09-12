(function() {
	'use strict';

	angular.module('d3App.controllers')
		.controller('d3Controller', [ '$window', '$scope', function($window, $scope) {
			$scope.title = "No Query Data Available";
			
			$scope.showExplore = false;
			$scope.showQuery = true;
			$scope.showCompare = false;
			$scope.showUpload = false;
			
			$scope.changeView = function(val){
				if(val == 'explore'){
					$scope.showExplore = true;
					$scope.showQuery = false;
					$scope.showCompare = false;
					$scope.showUpload = false;
				} else if (val == 'query') {
					$scope.showExplore = false;
					$scope.showQuery = true;
					$scope.showCompare = false;
					$scope.showUpload = false;
				} else if (val == 'compare') {
					$scope.showExplore = false;
					$scope.showQuery = false;
					$scope.showCompare = true;
					$scope.showUpload = false;
				} else if (val == 'upload') {
					$scope.showExplore = false;
					$scope.showQuery = false;
					$scope.showCompare = false;
					$scope.showUpload = true;
				}						
			};
			
			$scope.reloadController = function() {
				$window.location.reload();
			}
						
		} ]);
}());
