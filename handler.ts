import { Room } from "./room.ts";

const rooms: Room[] = [];

export const handler = (req: Request): Response => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("404 not found", {
      status: 404,
    });
  }

  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  ws.onmessage = (e: MessageEvent) => {
    if (e.data === "connect web") {
      const room = new Room(ws);
      rooms.push(room);
      ws.send(room.id);
      return;
    }
    if (e.data.match(/^connect pc/)) {
      const id: string = e.data.split(" ")[2];
      const room = rooms.find((r: Room) => r.id === id);
      if (room) {
        room.pc = ws;
      }
      return;
    }
    if (e.data.match(/^change/)) {
      const text: string = e.data.split(" ")[1];
      const id: string = e.data.split(" ")[2];
      const room = rooms.find((r: Room) => r.id === id);
      if (room) {
        room.web.send(`change ${text}`);
      }
      return;
    }
  };

  return response;
};
