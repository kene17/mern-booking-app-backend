import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import userRoutes from "./routes/userRoutes";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("connected to database!");
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/api/register", userRoutes)

app.listen(4000, ()=>{
    console.log("Server is running on port 7000");
})