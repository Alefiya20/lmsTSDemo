//import express, { Express, Request } from "express";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import { Server } from "http";


// import mongoose from './database/mongoose';
//import verifyToken from "./middleware/verifyToken";
require('./database/mongoose');

const app = express();
const PORT: number | string = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
//app.use(verifyToken);

//Middleware for cors
// app.use((req: Request, res: Response, next: NextFunction) =>{
//     res.setHeader('Access-Control-Allow-Origin', '*'); 
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     next();
//   });



//app.use('/api', verifyToken);
app.use('/api', userRoutes);
const http = new Server(app)
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});