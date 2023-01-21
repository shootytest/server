import { serve } from "https://deno.land/std@0.155.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { test } from "./hi.ts";

// serve((req: Request) => new Response(test));

const io = new Server();

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("hello", "world");

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

await serve(io.handler(), {
  port: 3000,
});