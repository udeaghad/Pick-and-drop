import mongoose from "mongoose";

mongoose.set('strictQuery', true);

//connect to database
export const connect = async () => {
  await mongoose.connect(String(process.env.DB_TEST)); 
}

export const closeDatabase = async () => {
  await mongoose.connection.close();
}

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({});
  }
}

