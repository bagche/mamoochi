export default defineWebSocketHandler({
  open(peer) {
    // Send welcome to the new client
    peer.send("Welcome to the server!");

    // Join new client to the "chat" channel
    peer.subscribe("chat");

    // Notify every other connected client
    peer.publish("chat", `[system] ${peer} joined!`);
  },

  message(peer, message) {
    console.log("server incoming");
    // The server re-broadcasts incoming messages to everyone
    // peer.send("incoming", await message.text());
    peer.publish("chat", `[${peer}] ${message.text()}`);
    peer.send("pong");
  },

  close(peer) {
    peer.publish("chat", `[system] ${peer} has left the chat!`);
    peer.unsubscribe("chat");
  },
});
