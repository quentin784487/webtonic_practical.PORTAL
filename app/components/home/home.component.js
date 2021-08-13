'use strict';

app.controller('HomeController', ['$scope', '$state', '$rootScope', 'studentService', '$uibModal', 'toaster', function ($scope, $state, $rootScope, studentService, $uibModal, toaster) {

  $scope.init = function () {
    $scope.filterArgs = {};
    $scope.students = [];
    $scope.maxSize = 5;
    $scope.totalCount = 0;
    $scope.pageIndex = 1;
    $scope.pageSizeSelected = 5;
    getStudents();
  }

  function getStudents() {
    $scope.filterArgs.pageSize = $scope.pageSizeSelected;
    $scope.filterArgs.pageIndex = $scope.pageIndex;    
    studentService.getStudents($scope.filterArgs).then(function(response) {
      $scope.students = response.data.students;
      $scope.totalCount = response.data.totalCount;
    });
  }

  $scope.openImportModal = function (action, object) {
    var modalInstance = $uibModal.open({
      templateUrl: 'importModalContent.html',
      controller: 'ImportStudentsController',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function () {
      debugger;
      getStudents();
    });
  };
  
}]);

app.controller('ImportStudentsController', ['$scope', '$uibModalInstance', 'studentService', function ($scope, $uibModalInstance, studentService) {
  $scope.ok = function () {
    var students = [];  
    var filename = document.getElementById("bulkDirectFile");
    if (filename.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var rows = e.target.result.split("\n");
        for (var i = 1; i < rows.length; i++) {
          var cells = rows[i].split(",");
          cells = cells[0].replace('\r', '');
          var rowData = cells.split(';');
          var student = {
            StudentNumber: rowData[0],
            FirstName: rowData[1],
            Surname: rowData[2],
            CourseCode: rowData[3],
            CourseDescription: rowData[4],            
            Grade: rowData[5] 
          }
          students.push(student);
        }
        
        studentService.importStudents(students).then(function() {
          $uibModalInstance.close();
        });    
      }
      reader.readAsText(filename.files[0]);
    }    
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);