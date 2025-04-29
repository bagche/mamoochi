// src/durable/chat-room.ts
import type { DurableObjectState } from "@cloudflare/workers-types";
import { DurableObject } from "cloudflare:workers";
import crossws from "crossws/adapters/cloudflare-durable";

const ws = crossws({
  hooks: {
    open(peer) {
      peer.subscribe("global");
      peer.publish("global", { system: true, text: `${peer} joined` });
    },
    message(peer, message) {
      const data = JSON.parse(message.text());
      peer.publish("global", data);
    },
    close(peer) {
      // optional cleanup/log
    },
    error(peer, err) {
      console.error("WS error:", err);
    },
  },
});

export class ChatRoom extends DurableObject {
  constructor(state: DurableObjectState, env: any) {
    super(state, env);
    ws.handleDurableInit(this, state, env);
  }
  fetch(request: Request) {
    return ws.handleDurableUpgrade(this, request);
  }
  webSocketMessage(c: any, m: any) {
    return ws.handleDurableMessage(this, c, m);
  }
  webSocketClose(c: any, code: number, reason: string) {
    return ws.handleDurableClose(this, c, code, reason);
  }
}
export default defineNitroPlugin(() => {
  // ChatRoom is now included in the worker build
});
