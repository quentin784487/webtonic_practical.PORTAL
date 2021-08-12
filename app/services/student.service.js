app.service('studentService', function ($http, $q, settingsService) {
  
  this.importStudents = function (students) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/ImportStudents', JSON.stringify(students)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.getStudents = function (student) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/GetStudents?pageIndex=' + student.pageIndex + '&pageSize=' + student.pageSize, JSON.stringify(student)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.updateStudent = function (student) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/UpdateStudent', JSON.stringify(student)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

  this.deleteStudent = function (student) {
    var deferred = $q.defer()    
    $http.post(settingsService.settings.baseUrl + 'Students/DeleteStudent', JSON.stringify(student)).then(function (data) {        
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
  }

});