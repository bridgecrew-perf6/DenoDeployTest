import { Room } from "./room.ts";

const rooms: Room[] = [];

export const handler = (req: Request): Response => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("404 not found", {
      status: 404,
    });
  }

  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  let id: string;
  ws.onmessage = (e: MessageEvent) => {
    if (e.data === "connect web") {
      const room = new Room(ws);
      console.log(`room created ${room.id}`);
      id = room.id;
      rooms.push(room);
      ws.send(room.id);
      return;
    }
    if (e.data.match(/^connect pc/)) {
      id = e.data.split(" ")[2];
      const room = rooms.find((r: Room) => r.id === id);
      if (room) {
        room.pc = ws;
        console.log(`pc connected ${room.id}`);
      }
      return;
    }
    if (e.data.match(/^change/)) {
      const text: string = e.data.split(" ")[1];
      const room = rooms.find((r: Room) => r.id === id);
      if (room) {
        room.web.send(`change ${text}`);
        console.log(`update sended to ${room.id}: ${text}`);
      }
      return;
    }
  };

  ws.onclose = () => {
    const room = rooms.find(room => room.id === id);
    if (room) {
      room.web.close();
      room.pc.close();
      rooms.splice(rooms.findIndex(room => room.id === id), 1);
      console.log(`room closed ${id}`);
    }
  };

  return response;
};
