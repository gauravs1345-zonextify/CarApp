import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import listingRoutes from "./routes/listingRoutes.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Get All MongoDB Data
app.use("/listings", listingRoutes);

// Show HTMl Page data

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



    // {
    //   "version": 2,
    //   "builds": [
    //     {
    //       "src": "./server.js",
    //       "use": "@vercel/node"
    //     }
    //   ],
    //   "routes": [
    //     {
    //       "src": "/(.*)",
    //       "dest": "/api"
    //     }
    //   ]
    // }