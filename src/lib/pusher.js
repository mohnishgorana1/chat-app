// lib/pusher.js
import Pusher from "pusher";
import { pusherConfig } from "@/src/config/pusherConfig.js";

const pusher = new Pusher({
  appId: pusherConfig.PUSHER_APP_ID,
  key: pusherConfig.PUSHER_KEY,
  secret: pusherConfig.PUSHER_SECRET,
  cluster: pusherConfig.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default pusher;
