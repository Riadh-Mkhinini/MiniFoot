/*jshint esversion: 6 */
var Friends = require('../models/Friends');
var Message = require('../models/Message');
var Room = require('../models/Room');

var routes=(io)=>{
  let clients = [];
  io.of('/api').on('connection', function(socket) {
      socket.on('disconnect', function(idUser) {
          clients.splice(clients.indexOf(idUser), 1);
      });
      socket.on('add_user', function(idUser) {
        clients.push(idUser);
        //clients.push('58d8f0b9ae995e2330f9ca0a');
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
  });
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

module.exports=routes;
