/*jshint esversion: 6 */
var Notification = require('../models/Notification');
var Equipe = require('../models/Equipe');
var Friends = require('../models/Friends');
var Message = require('../models/Message');
var Room = require('../models/Room');
var gcm = require('node-gcm');
const API_KEY = 'AAAA8Hxw8z8:APA91bFkCNJccW6C8RPY9A4S5zxsxsASqlnGc5CRgLsb4WEhPxYg7H0HfTnc4MkkmUVNsZfpzevIWifsN6G0jFXciF3EcP9yAMZqWKHBvEQj14bfKWM0bUMHu4azUkcqIf9i_g5vlITZ';

var routes=(io)=>{
  let clients = [];
  io.of('/api').on('connection', function(socket) {
      socket.on('disconnect', function(idUser) {
          clients.splice(clients.indexOf(idUser), 1);
      });
      socket.on('add_user', function(idUser) {
        clients.push(idUser);
      });
      socket.on('list_connectee', function(idUser) {
          clients = clients.filter( onlyUnique );
          var list = [];
          //finds list of users connectee
          Friends.findOne({ user: idUser }).populate('friends',['_id', 'firstname', 'lastname', 'email', 'photo'])
          .exec(function(err,data) {
            if (err) {
                console.log(err);
            } else {
              clients.forEach(function(item) {
                 data.friends.forEach(function(person) {
                    if (new String(person._id).valueOf() === new String(item).valueOf()) {
                      list.push(person);
                    }
                  });
              });
            }
            console.log(list);
            socket.emit('list_connectee', list);
          });
      });
      socket.on('room', function(room) {
        console.log(room);
          socket.on(room, function(data) {
            console.log(room);
            console.log(data);
            newMessage = new Message({
              text: data.text,
              createdAt: data.createdAt,
              user: data.user,
              idRoom: room
              });
              Room.update( {_id: room}, { $set: { user: data.user }, message: data.text, createdAt: data.createdAt, vue: 0 } ).then(function(result){
                newMessage.save((error) => {
                  newMessage._id = newMessage._id;
                  socket.broadcast.emit(room, newMessage);
                });
              },function(error){
                console.log(error);
              });
          });
      });
      socket.on('invitationEquipe', function(notify) {
          let tokens = [];
          notify.users.forEach((item) => {
              tokens.push(item.token);
              var notification = new Notification({
                  rejoin: {from: notify.idEquipe, to: item }
              });
              notification.save((err) => {(err) ? console.log(err) : socket.broadcast.emit(item._id, notification);});
          });
          var message = new gcm.Message({
              data: {
                title : notify.title,
                message : "Vous a envoyé une invitation de rejoindre son équipe"
              }
          });
          var sender = new gcm.Sender(API_KEY);
          var registrationIds = tokens;
          sender.sendNoRetry(message, { registrationIds: registrationIds }, function(err, response) {
            if(err)
                console.log(err);
          });
      })
  });
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports=routes;
