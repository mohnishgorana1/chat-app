import mongoose from "mongoose";

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
        
        
    }catch(error){
        console.log("Db Connection Failed", error);
        process.exit(0)
        
    }   
}

export default dbConnect