import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import AppRoutes from './src/Routes/index.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(AppRoutes)

app.listen(process.env.PORT, ()=>console.log(`App is Running On Port ${process.env.PORT}`))