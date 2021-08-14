app.service('studentService', function ($http, $q, settingsService) {
  
  this.importStudents = function (request) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/ImportStudents', JSON.stringify(request)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.getStudents = function (request) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/GetStudents?pageIndex=' + request.pageIndex + '&pageSize=' + request.pageSize, JSON.stringify(request)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.updateStudent = function (request) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/UpdateStudent', JSON.stringify(request)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.deleteStudent = function (request) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/DeleteStudent', JSON.stringify(request)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

});