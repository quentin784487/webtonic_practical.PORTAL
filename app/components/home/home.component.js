'use strict';

app.controller('HomeController', ['$scope', 'studentService', 'courseService', '$uibModal', 'toaster', function ($scope, studentService, courseService, $uibModal, toaster) {

  $scope.filterArgs = {};
  $scope.students = [];
  $scope.courseTypes = [];
  $scope.maxSize = 5;
  $scope.totalCount = 0;
  $scope.pageIndex = 1;
  $scope.pageSizeSelected = 5;

  $scope.onInit = function() {    
    getStudents();
    getCourseTypes();
  }

  $scope.onRefresh = function() {
    getStudents();
  }

  function getStudents() {    
    var request = {
      studentNumber: $scope.filterArgs.studentNumber == null || $scope.filterArgs.studentNumber == '' ? null : parseInt($scope.filterArgs.studentNumber),
      firstName: $scope.filterArgs.firstName != undefined ? $scope.filterArgs.firstName : null,
      surname: $scope.filterArgs.surname != undefined ? $scope.filterArgs.surname : null,
      courseId: $scope.filterArgs.course == null || $scope.filterArgs.course == '' ? null : parseInt($scope.filterArgs.course),
      pageSize: $scope.pageSizeSelected,
      pageIndex: $scope.pageIndex
    }

    studentService.getStudents(request).then(function(response) {
      $scope.students = response.data.students;
      $scope.totalCount = response.data.totalCount;
    });
  }

  function getCourseTypes() {
    courseService.getCourseTypes().then(function(response){
      $scope.courseTypes = response.data;
    });
  }  

  $scope.openImportModal = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'importModalContent.html',
      controller: 'ImportStudentsController',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function () {
      toaster.pop('Import Student Data', "Success", "Student data successfully imported!");
      getStudents();
    });
  };

  $scope.openUpdateModal = function (student) {
    var modalInstance = $uibModal.open({
      templateUrl: 'updateModalContent.html',
      controller: 'UpdateStudentController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        studentCopy: function () {
          return student;
        },
        courseTypes: function() {
          return $scope.courseTypes;
        }
      }
    });

    modalInstance.result.then(function () {
      toaster.pop('Update Student Data', "Success", "Student data successfully updated!");
      getStudents();
    });
  };

  $scope.openDeleteModal = function (student) {
    var modalInstance = $uibModal.open({
      templateUrl: 'deleteModalContent.html',
      controller: 'DeleteStudentController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        studentId: function () {
          return student.id;
        }
      }
    });

    modalInstance.result.then(function (object) {
      toaster.pop('Delete Student', "Success", "Student successfully deleted!");
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
            StudentNumber: parseInt(rowData[0]),
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
        }, function(exception){
          //handle logging
          toaster.pop('Import Students', "Error", "An error has occurred. Please check your network connection.");
        });    
      }
      reader.readAsText(filename.files[0]);
    }    
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);

app.controller('UpdateStudentController', ['$scope', '$uibModalInstance', 'studentCopy', 'courseTypes', 'studentService', function ($scope, $uibModalInstance, studentCopy, courseTypes, studentService) {
  $scope.courseTypes = courseTypes;

  //new copy of the object is made to remove it's reference to the original object. This is so that no data in the table changes as the user edits any values. Values should only reflect changes once saved.
  $scope.student = {
    id: studentCopy.id,
    studentNumber: studentCopy.studentNumber.toString(),
    firstName: studentCopy.firstName,
    surname: studentCopy.surname,
    grade: studentCopy.grade,
    courseId: studentCopy.courseId.toString()
  }  

  $scope.ok = function () {
    var request = {
      id: $scope.student.id,
      studentNumber: parseInt($scope.student.studentNumber),
      firstName: $scope.student.firstName,
      surname: $scope.student.surname,
      courseId: parseInt($scope.student.courseId),
      grade: $scope.student.grade
    }

    studentService.updateStudent(request).then(function(){
      $uibModalInstance.close();
    }, function(exception){
      //handle logging
      toaster.pop('Update Student', "Error", "An error has occurred. Please check your network connection.");
    });     
  };

  $scope.cancel = function () {    
    $uibModalInstance.dismiss('cancel');
  };
}]);

app.controller('DeleteStudentController', ['$scope', '$uibModalInstance', 'studentId', 'studentService', function ($scope, $uibModalInstance, studentId, studentService) {
  $scope.ok = function () {    
    var request = {
      id: parseInt(studentId)
    }
    studentService.deleteStudent(request).then(function(){      
      $uibModalInstance.close();
    }, function(exception){
      //handle logging
      toaster.pop('Delete Student', "Error", "An error has occurred. Please check your network connection.");
    });  
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);