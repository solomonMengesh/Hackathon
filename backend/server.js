import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000;

const startServer = async () => {
  try {


    app.use(cors());
    app.use(express.json());
 const url=process.env.url;
    app.use("/api/auth", authRoutes);
    app.use("/api", routes);

    app.get('/', (req, res) => {
      res.send('API is running...');
    });

 app.listen(PORT, ()=>{console.log(`the server is runing ${PORT}`)});
 mongoose.connect(url)
 .then(()=>console.log("the connection is created successfully !!"))
 .catch((err) => console.log("Connection failed:", err.message));
 

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
