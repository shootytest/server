import { serve, ConnInfo } from "https://deno.land/std@0.173.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { main, tick } from "./main.ts";
import { Thing } from "./thing.ts";
import { Matter } from "./matter.js";
import { Controls } from "./controls.ts";
import { Player } from "./player.ts";

const Vector = Matter.Vector;

// initialize main
main();

console.log(Matter);

// helper functions

const _random_string = (length = 10) => {
  const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(
      Math.floor(Math.random() * letters.length),
    );
  }
  return result;
}

let socket_cumulative_id = 0;
const new_socket_id = () => ++socket_cumulative_id;


// constants

const WIDTH = 1000;
const HEIGHT = 1000;

/*
class Thing {
  static cumulative_id = 0;
  static tick() {
    for (const [_, thing] of things) {
      thing.tick();
    }
  }
  static data() {
    const thingdata = [];
    for (const [_, thing] of things) {
      thingdata.push(thing.data());
    }
    return thingdata;
  }
  id: number = ++Thing.cumulative_id;
  x: number = Math.floor(Math.random() * WIDTH);
  y: number = Math.floor(Math.random() * HEIGHT);
  size: number = SIZE;
  speed: number = SPEED;
  vx = 0;
  vy = 0;
  health = 0;
  player = false;
  delete = false;
  team = -1;
  color: string = "#" +
    ("000000" + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
  controls: Controls = new Controls();
  timeout_update: number = Date.now();

  constructor() {
    things.set(this.id, this);
  }

  tick() {
    if (this.player) {
      this.do_controls();
    }
    this.x += this.vx / 60;
    this.y += this.vy / 60;
    if (this.health < 0) {
      this.remove();
    }
  }

  do_controls() {
    const C = this.controls;
    const dx = (C.left ? -1 : 0) + (C.right ? 1 : 0);
    const dy = (C.up ? -1 : 0) + (C.down ? 1 : 0);
    this.vx += dx * this.speed;
    this.vy += dy * this.speed;
    this.vx *= FRICTION;
    this.vy *= FRICTION;
    if (C.rclick) {
      this.x += this.vx / 20;
      this.y += this.vy / 20;
    }
  }

  data() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      health: this.health,
      team: this.team,
    };
  }

  remove() {
    things.delete(this.id);
  }
}
*/


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

  socket.emit("hello", "world");

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