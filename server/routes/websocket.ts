// server/routes/chat.ts
import type { Message, Peer } from "crossws";

export default defineWebSocketHandler({
  open(peer: Peer) {
    peer.send(JSON.stringify({ type: "welcome", text: "Connected!" }));
    peer.subscribe("global");
  },

  message(peer: Peer, message: Message) {
    const data = JSON.parse(message.text());
    peer.publish("global", data);
  },

  close(peer: Peer) {
    console.log("Peer disconnected:", peer.toString());
  },

  error(peer: Peer, err: Error) {
    console.error("WebSocket error:", err);
  },
});
