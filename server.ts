import { serve, ConnInfo } from "https://deno.land/std@0.173.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { main, tick } from "./main.ts";
import { Thing } from "./thing.ts";
import { Matter } from "./matter.js";
import { Controls } from "./controls.ts";
import { Player } from "./player.ts";
import { mapmaker } from "./mapmaker.ts";

const Vector = Matter.Vector;

// initialize main
console.log("initializing...")
main();
mapmaker.make("tutorial");
const memo_walldata = Thing.walldata();

// helper functions

let socket_cumulative_id = 0;
const new_socket_id = () => ++socket_cumulative_id;


// constants

const WIDTH = 1000;
const HEIGHT = 1000;

// socket.io part

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

  // a new connection! welcome!

  console.log(`socket ${socket.id} connected`);

  const id = new_socket_id();

  const player = new Player();
  player.position = Vector.create(Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
  player.team = id;
  player.create();

  socket.emit("log", "joined: " + socket.id);
  socket.emit("id", id);
  console.log(Thing.walls.length);
  socket.emit("gamemap", memo_walldata);

  socket.on("hello", (message) => {
    console.log(message);
    io.emit("hello", message);
  });

  socket.on("controls", (controls: Controls) => {
    player.controls = controls;
  });

  socket.on("disconnecting", (reason) => {
    player.remove();
    console.log(`socket ${socket.id} disconnecting due to ${reason}`);
  });

  socket.on("disconnect", (reason) => {
    player.remove();
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

});

setInterval(() => {
  tick(0);
  io.emit("gamedata", Thing.data());
}, 16);

const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>deno socket test</title>
    </head>
    <body>
      <h1>shooty.deno.dev</h1>
      <p>this is a server for shootytest.surge.sh</p>
    </body>
  </html>
`;

await serve((request: Request, connection_info: ConnInfo) => {
  const is_ws = request.url.includes("socket.io"); // haha a hack
  if (is_ws) {
    return io.handler()(request, connection_info);
  } else {
    return new Response(html, {
      headers: {
        "Content-type": "text/html",
      },
    });
  }
}, { port: 8080 });