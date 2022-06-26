import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from "cors";
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js'
import authRoute from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000;

const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://grand-lokum-45486f.netlify.app/",
];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};
app.use(helmet());
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
  app.listen(PORT, () => {
    console.log("server started");
  });
}

start()