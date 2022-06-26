import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import credentials from './middleware/credentials.js';
import cors from "cors";
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js'
import authRoute from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000;

app.use(credentials)

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute)


const start = async() => {
  await connectDB(process.env.MONGO_URL)
  app.listen(PORT, () => {
    console.log("server started");
  });
}

start()