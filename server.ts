import { serve, ConnInfo } from "https://deno.land/std@0.173.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { main, tick } from "./main.ts";
import { Thing } from "./thing.ts";
import { Controls } from "./controls.ts";
import { Player } from "./player.ts";
import { mapmaker } from "./mapmaker.ts";
import { make } from "./make.ts";

// initialize main
console.log("initializing...");
main();
mapmaker.make("test");
const memo_walldata = Thing.walldata();

// helper functions

// socket ids start from 12941
let socket_cumulative_id = 12941;
const new_socket_id = () => ++socket_cumulative_id;


// socket.io part

const io = new Server({
  cors: {
    origin: "*", // ho ho
  },
});

const broadcast_players = () => {
  io.emit("players", Player.player_data());
}

io.on("connection", (socket) => {

  // a new connection! welcome!

  const id = new_socket_id();

  console.log(`socket #${id} "${socket.id}" connected`);

  const player = new Player(socket);
  player.make(make.player_basic);
  player.team = id;
  player.create();
  player.temp_remove(false);
  player.killer = player.nearest_player(true) || { x: 0, y: 0, };

  setTimeout(() => {
    
    socket.emit("id", id);
    socket.emit("game_map", memo_walldata);
    socket.emit("map_data", mapmaker.get_current_map());
    
  }, 100);

  // the client is asking for a map again because the transfer failed the first time for some reason... hmmm this keeps happening
  socket.on("map_please", () => {
    socket.emit("game_map", memo_walldata);
    socket.emit("map_data", mapmaker.get_current_map());
  });

  socket.on("join", (data: { upgrade: string, ability: string, name: string, }) => {
    player.remove_shoots();
    player.make(make.player);
    player.make(make["player_" + data.upgrade]);
    player.set_ability(data.ability);
    player.name = data.name;
    player.temp_create();
    broadcast_players();
  });

  socket.on("controls", (controls: Controls) => {
    player.controls = controls;
  });

  socket.on("chat", (message: string) => {
    player.chat.push({
      m: message,
      t: Thing.time + 60 * 5,
    });
  });

  socket.on("disconnecting", (_reason) => {
    player.remove();
    // console.log(`socket ${socket.id} disconnecting due to ${reason}`);
  });

  socket.on("disconnect", (_reason) => {
    player.remove();
    // console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

});

const main_tick = () => {
  tick(0);
  io.emit("game_data", Thing.data());
};

const _main_interval = setInterval(main_tick, 16);

const html = `<!DOCTYPE html>
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
</html>`;

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