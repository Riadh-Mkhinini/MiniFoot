/*jshint esversion: 6 */
var Notification = require('../models/Notification');
var RejoindreTeam = require('../models/RejoindreTeam');
var Equipe = require('../models/Equipe');
var Friends = require('../models/Friends');
var Message = require('../models/Message');
var Room = require('../models/Room');
var Advert = require('../models/Advert');
var Match = require('../models/Match');
var User = require('../models/users');
var gcm = require('node-gcm');
const API_KEY = 'AAAA8Hxw8z8:APA91bFkCNJccW6C8RPY9A4S5zxsxsASqlnGc5CRgLsb4WEhPxYg7H0HfTnc4MkkmUVNsZfpzevIWifsN6G0jFXciF3EcP9yAMZqWKHBvEQj14bfKWM0bUMHu4azUkcqIf9i_g5vlITZ';

let clients = [];
var routes=(io)=>{
  io.of('/api').on('connection', function(socket) {
      socket.on('disconnect', function(idUser) {
          clients.splice(clients.indexOf(idUser), 1);
          console.log('disconnect', clients);
      });
      socket.on('add_user', function(idUser) {
        clients.push(idUser);
        clients = clients.filter(onlyUnique);
        console.log('new User online', clients);
      });
      socket.on('list_connectee', function(idUser) {
          //var list = [];
          //finds list of users connectee
          Friends.findOne({ "user": idUser })
          .populate
            ({
              path: 'friends',
              select: ['_id', 'firstname', 'lastname', 'email', 'photo'],
              match: { _id: { $in: clients }}
            })
          .exec(function(err,data) {
            if (err) {
                console.log(err);
            } else {
              /*clients.forEach(function(item) {
                 data.friends.forEach(function(person) {
                    if (new String(person._id).valueOf() === new String(item).valueOf()) {
                      list.push(person);
                    }
                  });
              });*/
              socket.emit('list_connectee', data.friends);
            };
          });
      });
      socket.on('room', function(room) {
          socket.on(room, function(data) {
            newMessage = new Message({
              text: data.text,
              createdAt: data.createdAt,
              user: data.user,
              idRoom: room
              });
              newMessage.save((error) => {
                  newMessage._id = newMessage._id;
                  socket.broadcast.emit(room, newMessage);
              });
          });
      });
      socket.on('newRoomCreated', function(room) {
          User.findById(room.users[0]).select(['_id', 'firstname', 'lastname', 'photo'])
            .exec(function(err, user1) {
            if (err) {
                console.log('Internal Server Error.');
            } else {
                User.findById(room.users[1]).select(['_id', 'firstname', 'lastname', 'photo'])
                  .exec(function(err, user2) {
                  if (err) {
                      console.log('Internal Server Error.');
                  } else {
                      let tabUsers = [];
                      tabUsers.push(user1);
                      tabUsers.push(user2);
                      let newRooms = {
                          users: tabUsers,
                          message : 'Envoyer votre premier message',
                          user: { _id: user2._id, name: '', avatar: ''},
                          vue: 0
                      }
                      console.log(newRooms);
                      socket.broadcast.emit(room.users[0], newRooms);
                      socket.broadcast.emit(room.users[1], newRooms);
                  }});
            }});
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
                message : "Vous a envoyé une invitation de rejoindre son équipe",
                smallIcon: notify.logo,
                tag: 'TEAM'
              }
          });
          var sender = new gcm.Sender(API_KEY);
          var registrationIds = tokens;
          sender.sendNoRetry(message, { registrationIds: registrationIds }, function(err, response) {
            if(err)
                console.log(err);
          });
      })
      socket.on('rejoindreTeam', function(rejoin){
        var rejoindreTeam = new RejoindreTeam({
          joinTeam: { from: rejoin.idUser },
          to: rejoin.idEquipe,
          type: rejoin.type
        });
        rejoindreTeam.save(function(err) {
          if (err) {
            console.log(err);
          } else {
              (err) ? console.log(err) : socket.broadcast.emit(rejoin.idEquipe, rejoindreTeam);
          }
        });
      });
      socket.on('add_advert', function(advert) {
          var newAdvert = new Advert(advert);
          newAdvert.save(function(err) {
              if (err) {
                  console.log(err);
              } else {
                  socket.broadcast.emit('new_advert',advert);
              }
          });
      });
      socket.on('add_match', function(match) {
          var newMatch = new Match({
              teamOne: match.teamOne._id,
              teamTow: match.teamTow._id,
              stade: match.stade
          });
          newMatch.save(function(err) {
              if (err) {
                  console.log(err);
              } else {
                  var rejoindreTeam = new RejoindreTeam({
                    joinMatch: { from: match.teamOne._id, match: newMatch._id },
                    to: match.teamTow._id,
                    type: match.type
                  });
                  rejoindreTeam.save(function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                        (err) ? console.log(err) : socket.broadcast.emit(match.teamTow._id, rejoindreTeam);
                    }
                  });
              }
          });
      });
      socket.on('reserver', function(notify) {
          socket.broadcast.emit(notify.idStade, notify);
      });
      socket.on('invitation_friend', function(idUser) {
          socket.broadcast.emit(idUser, 'Friend');
      });
  });
};


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports=routes;
