import express from 'express';
import socketIO, { Socket } from 'socket.io';
import http from 'http';

import { addUser, removeUser, getUser } from './userHandler';

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const clientTimeoutInS = 600;
const clientTimeoutInMs = clientTimeoutInS * 1000;

const clientTimeoutFunction = (socket: Socket): NodeJS.Timeout => {
  return setTimeout(() => {
    socket.disconnect(true);
  }, clientTimeoutInMs);
};

const timeStamp = () => (new Date().toISOString());

io.origins('*:*');

io.on('connection', (socket: SocketIO.Socket): void => {
  console.log(`${timeStamp()}: \n New connection from client id: ${socket.id}`);
  let timeoutTimer: ReturnType<typeof setTimeout>;

  socket.on('join', ({ name }: {name : string}, cb: Function): void => {
    const { error, user } = addUser(socket.id, name);
    if ( error ) {
      console.log(`${timeStamp()}: \n Client tried to join using a name that's already in use`);
      return cb(error);
    }

    timeoutTimer = clientTimeoutFunction(socket);
    if (user) {
      console.log(`${timeStamp()}: \n Client has joined using the username: ${user.name}`);
      socket.emit('message', { user: 'Server', text: `${user.name} welcome to the server`});
      socket.broadcast.emit('message', { user: 'Server', text: `${user.name} has joined the server`});

      cb();
    }
  });

  socket.on('userMessage', (message: string): void => {
    clearTimeout(timeoutTimer);
    const user = getUser(socket.id);
    console.log(`${timeStamp()}: \n Got a new message from client with ID: ${socket.id}`);

    io.emit('message', {user: user?.name, text: message});
    timeoutTimer = clientTimeoutFunction(socket);
  });

  socket.on('disconnect', (reason: string): void => {
    const user = removeUser(socket.id);
    if (user) {
      if (reason === 'server namespace disconnect') {
        console.log(`${timeStamp()}: \n Disconnected client: ${socket.id} because of inactivity`);
        io.emit('message', { user: 'Server', text: `${user.name} got disconnected due to inactivity` });
      } else if (reason === 'transport close') {
        // client left
        console.log(`${timeStamp()}: \n Client: ${socket.id} left the page`);
        io.emit('message', { user: 'Server', text: `${user.name} left the server`});
      } else if (reason === 'client namespace disconnect') {
        // client left
        console.log(`${timeStamp()}: \n Client: ${socket.id} left the chat`);
        io.emit('message', { user: 'Server', text: `${user.name} left the server`});
      }
    }
  });
});

process.once('SIGINT', (): void => {
  console.log('SIGINT recieved closing down the server');
  io.emit('message', { user: 'Server', text: 'Server going offline byebye'});
  io.close();
  server.close();
});

process.once('SIGTERM', (): void => {
  console.log('SIGTERM recieved closing down the server');
  io.emit('message', { user: 'Server', text: 'Server going offline byebye'});
  io.close();
  server.close();
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));