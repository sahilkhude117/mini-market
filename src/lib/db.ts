import mongoose from 'mongoose';

let isConnected = false;

export const connectMongoDB = async () => {
  const MONGO_URL = process.env.DB_URL || '';
  
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  const connect = async () => {
    try {
      if (MONGO_URL) {
        const connection = await mongoose.connect(MONGO_URL);
        console.log(`MONGODB CONNECTED : ${connection.connection.host}`);
        console.log(`----------------------------------------------------------------------------`);
        
        isConnected = true;
      } else {
        console.log("No Mongo URL");
      }
    } catch (error) {
      console.log(`Error : ${(error as Error).message}`);
      isConnected = false;
      // Attempt to reconnect
      setTimeout(connect, 1000); // Retry connection after 1 seconds
    }
  };

  await connect();

  mongoose.connection.on("disconnected", () => {
    console.log("MONGODB DISCONNECTED");
    isConnected = false;
    // Attempt to reconnect
    setTimeout(connect, 1000); // Retry connection after 1 seconds
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MONGODB RECONNECTED");
    isConnected = true;
  });
};
