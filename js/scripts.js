(function() {
  var khi;

  khi = angular.module('khi', []);

  khi.factory('Projects', function() {
    var defaultImg;
    defaultImg = 'code.png';
    return [
      {
        title: 'Sample',
        desc: 'This is a sample project',
        img: 'img.png',
        link: 'http://google.com'
      }, {
        title: 'Sample Github',
        desc: 'This is a sample github project',
        img: 'img.png',
        github: 'http://github.com'
      }
    ];
  });

  khi.controller('HomePageCtrl', [
    '$scope', 'Projects', function($scope, Projects) {
      $scope.projects = Projects;
      return $scope.blogposts = [];
    }
  ]);

  khi.controller('WorkPageCtrl', [
    '$scope', 'Projects', function($scope, Projects) {
      return $scope.projects = Projects;
    }
  ]);

  khi.controller('ResumePageCtrl', [
    '$scope', function($scope) {
      return $scope.jobs = [
        {
          start: '',
          end: '',
          place: '',
          role: '',
          company: '',
          desc: '',
          subjobs: [
            {
              start: '',
              end: '',
              place: '',
              role: '',
              company: '',
              desc: ''
            }
          ]
        }
      ];
    }
  ]);

  khi.controller('ContactSectionCtrl', ['$scope', function($scope) {}]);

}).call(this);