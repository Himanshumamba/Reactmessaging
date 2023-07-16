import { Server } from 'socket.io';
const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
  },
});
let onlineUsers =[];

const addUser = (username,socketId)=>{
  if (!onlineUsers.some((user) => user.username === username)) {
    onlineUsers.push({ username, socketId });
  }


};
const sessioneEnded=(socketId)=>{
  onlineUsers = onlineUsers.filter(user=>user,socketId !== socketId);
};

const getUser = (username) => {
  console.log(onlineUsers)
return  onlineUsers.find((user) => user.username === username);

};



io.on('connection', (socket) => {

  socket.on("newUser" ,(username)=>{
    addUser(username ,socket.id);
  });


  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    console.log(receiver)
    if (receiver) {
      io.to(receiver.socketId).emit("getNotification", {
        senderName,
        type,
      });
    } else {
      console.log(`Receiver '${receiverName}' not found`);
    }
  });

  socket.on('disconnect', () => {
sessioneEnded(socket.id);
  });
});

io.listen(5000, () => {
  console.log('Socket.io server is running on http://localhost:5000');
});
