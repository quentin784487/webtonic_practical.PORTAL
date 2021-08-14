app.service('courseService', function ($http, $q, settingsService) {
  this.getCourseTypes = function () {
    var deferred = $q.defer()    
    $http.get(settingsService.settings.baseUrl + 'Course/GetCourseTypes').then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }
});