(function(window, angular){
	angular.module('ng-addons.autocomplete', ['ng-addons.autocomplete.tpls'])
	.directive('nga-autocomplete', function(){
		return {
			restrict: 'EA',
			require: '^ngModel',
			templateUrl: 'template/autocomplete.html',
			scope: {
				ngModel: '=',
				autocompleteText: '=',
				displayValue: '@',
				autocompleteConfig: '=',
				matchCallback: '&'
			},
			link: function(scope, elm, attrs, ctrl){
				var defaultConfig = {
					minlength: 3,
					delay: 500,
					placeholder: 'Search...'
				};
				
				scope.config = angular.copy(defaultConfig);
				if(scope.autocompleteConfig){
					for(var key in scope.autocompleteConfig){
						if(scope.config[key] !== undefined){
							var configValue = scope.autocompleteConfig[key];
							scope.config[key] = configValue;
						}
					}
				}
			},
			controller: ['$scope', '$interval', function($scope, $interval){
				$scope.items = [];
				$scope.selected = false;
				
				var resetItems = function(){
					$scope.items = [];
				};
				
				$scope.selectItem = function(item){
					$scope.ngModel = item;
					$scope.autocompleteText = $scope.ngModel[$scope.displayValue] !== undefined ? $scope.ngModel[$scope.displayValue] : $scope.ngModel;
					
					resetItems();
					
					$interval(function(){
						$scope.selected = true;
					}, 50, 3);
				};
				
				$scope.closeAutocomplete = function(){
					resetItems();
				};
				
				$scope.$watch('autocompleteText', function(newValue, oldValue){
					if(newValue !== oldValue && newValue.length >= $scope.config.minlength){
            			$scope.selected = false;
            			$scope.matchCallback({ value: newValue }).then(function(data){
              				$scope.items = data;
            			});
          			}
					else if(!newValue){
						$scope.ngModel = null;
						resetItems();
					}
				});
			}]
		};
	})
	.directive('outsideClick', ['$document', '$parse', function($document, $parse){
    	return {
      		link: function(scope, elm, attrs, ctrl){
        		var scopeExpression = attrs.outsideClick,
            		onDocumentClick = function(event){
              			var isChild = elm.find(event.target).length > 0;

              			if(!isChild) {
                			scope.$apply(scopeExpression);
              			}
            		};

            	$document.on("click", onDocumentClick);

            	elm.on('$destroy', function() {
                	$document.off("click", onDocumentClick);
            	});
      		}
    	};
  	}]);
	  
	angular.module('ng-addons.autocomplete.tpls', []).run([
		'$templateCache', function($templateCache){
			$templateCache.put('template/autocomplete.html',
      		'<div class="autocomplete-container" outside-click="closeAutocomplete()">'+
        		'<div>'+
          			'<input type="text" class="form-control" name="autocomplete" placeholder="{{ config.placehoder || \'\' }}" ng-model="autocompleteText" ng-model-options="{\'debounce\': config.delay}" />'+
        		'</div>'+
        		'<div class="items-container" ng-show="items.length > 0 && !selected">'+
          			'<div class="list-group items-found">'+
            			'<a class="list-group-item" style="cursor:pointer;" ng-repeat="item in items" ng-click="selectItem(item)">{{ item[displayValue] !== undefined ? item[displayValue] : item }}</a>'+
          			'</div>'+
        		'</div>' +
      		'</div>'
      		);
		}
	]);
	
})(window, angular);