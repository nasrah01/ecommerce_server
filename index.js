import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js'
import authRoute from './routes/authRoutes.js'

const app = express()
const PORT = 5000;

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoute)

app.get("/", (req, res) => {
  res.send('Welcome to shop-k')
});

const start = async() => {
  await connectDB(process.env.MONGO_URL)
  app.listen(process.env.PORT || 5000, () => {
    console.log("server started");
  });
}

start()