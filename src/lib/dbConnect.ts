import mongoose from "mongoose";
import UserModel from "../model/UserModel";
import ChatModel from "../model/ChatModel";
import MessageModel from "../model/MessageModel";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    // we use this only in nextjs
    if(connection.isConnected){
        console.log("DB Already Connected");
        return 
    }

    try{
        const db = await mongoose.connect(process.env.MONGO_URI! || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB CONNECTED SUCCESSFULLY");
        console.log("Registered Models: ", mongoose.modelNames());
        

         // Register models if they are not already registered
         if (!mongoose.models.User) {
            mongoose.model("User", UserModel);
        }
        if (!mongoose.models.Chat) {
            mongoose.model("Chat", ChatModel);
        }
        if (!mongoose.models.Message) {
            mongoose.model("Message", MessageModel);
        }
        
    }catch(error){
        console.log("Db Connection Failed", error);
        process.exit(0)
        
    }   
}

export default dbConnect