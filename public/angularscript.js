(function(){
  var app = angular.module('chatClient', []);

  app.service('ChatService', ['$rootScope', function($rootScope){   
    this.messageLog = [];

    var pushMessage = this.messageLog.push.bind(this.messageLog);
    var name = prompt('Name:');
    var socket = io.connect();

    this.sendMessage = function sendMessage(newMessage){
      socket.emit('message', newMessage);
      //  $rootScope.$broadcast('messageLog.update');
      $rootScope.$apply(); //DELETE?
      pushMessage(name + ' (' + newMessage.time + '): ' + newMessage.message);
    };

    socket.emit('join', {user: name});
    pushMessage('(' + (new Date()) + ') You have joined.');

    socket.on('userJoin', function(data){
      pushMessage('(' + data.time + ') ' + data.user + ' has joined.');
      // $rootScope.$broadcast('messageLog.update');
      $rootScope.$apply(); //DELETE?

    });
    socket.on('userChat', function(data){
      pushMessage(data.user + ' (' + data.time + '): ' + data.message);
      /// $rootScope.$broadcast('messageLog.update');
      $rootScope.$apply(); //DELETE?
   });
    socket.on('userLeave', function(data){
      pushMessage('(' + data.time + ') ' + data.user + ' has disconnected.');
      // $rootScope.$broadcast('messageLog.update');
      $rootScope.$apply(); //DELETE?
   });
  }]);

  app.controller('ChatWindowController', ['$scope', 'ChatService', function($scope, ChatService){
    this.messages = ChatService.messageLog;
    /* $scope.$on('messageLog.update', function(event){
      messages = ChatService.messageLog;
    });*/
  }]);
 
  app.controller('ChatInputController', ['$scope', '$rootScope', 'ChatService', function($scope, $rootScope, ChatService){

      this.inputString='';

      this.submit = function submit(event){
      //submit open pressing enter
      if(event.which===13 && this.inputString !== '')
      {
        //  create new message
        var newMessage = {
          time: new Date(),
          message: this.inputString
        };
        ChatService.sendMessage(newMessage);
        this.inputString='';
      }
    };
  }]);
})();

