const path = require(`path`);
const pluginHandler = require(`./lib/pluginHandler`);

require(`dotenv`).load({
  silent: true
});

const {
  PORT: port
} = process.env;

const Server = require(`hapi`).Server;

const server = new Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, `public`)
      }
    }
  }
});

server.connection({
  port
});

server.register(require(`./modules/`), pluginHandler);
server.register(require(`./routes/`), pluginHandler);

server.start(err => {
  if (err) console.error(err);
  console.log(`Server running at: http://localhost:${port}`);
});

const io = require(`socket.io`)(server.listener);

let users = [];

io.on(`connection`, socket => {
  const {id: socketId} = socket;

  const username = socket.handshake.query.name;


  const user = {
    socketId,
    name: username,
    lat: 0,
    lng: 0
  };

  users.push(user);

  socket.emit(`init`, {users: users, user: user});
  io.emit(`test`);
  socket.broadcast.emit(`join`, user);

  socket.on(`disconnect`, () => {
    const userLeft = users.filter(u => u.socketId !== socketId);
    users = userLeft;
    socket.broadcast.emit(`leave`, socketId);
  });

  socket.on(`userLoc`, data => {
    const userLoc = users.filter(function(u) {
      console.log(data);
      return u.socketId === data.socketId; // Filter out the appropriate one

    })[0];

    if (userLoc) {
      userLoc.lat = data.lat;
      userLoc.lng = data.lng;
      const index = users.findIndex(u => u.socketId === userLoc.socketId);
      users.splice(index, 1, userLoc);
      io.emit(`updateUsers`, users);
    } else {
      return;
    }
  });

});
