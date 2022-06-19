import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors";
import connectDB from './db/connect.js'
import authRoute from './routes/authRoutes.js'

const app = express()
app.use(express.json())
app.use(cors());

app.use('/auth', authRoute)

const start = async() => {
  await connectDB(process.env.MONGO_URL)
  app.listen(5000, () => {
    console.log("server started");
  });
}

start()