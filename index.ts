
// import express, { Application, Request, Response } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import path from "path";

// import userRoute from "./src/Routes/userRoutes";
// import carRoute from "./src/Routes/carRoutes";
// import estimateRoute from "./src/Routes/estimateRoutes";
// import inspectionRoute from "./src/Routes/inspectionRoutes";
// import testdriveRoute from './src/Routes/TestdriveRoutes';
// import inquiryRoute from "./src/Routes/inquiryRoute";
// import sellCarRoute from "./src/Routes/sellCarRoutes";
// import contactUsRoutes from "./src/Routes/contactUsRoutes";

// import { VercelRequest, VercelResponse } from '@vercel/node';

// dotenv.config();

// const app: Application = express();

// app.use(cors());
// app.use(express.json());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/InspectionReports", express.static(path.join(__dirname, "InspectionReports")));

// app.use("/user", userRoute);
// app.use("/car", carRoute);
// app.use("/testdrive", testdriveRoute);
// app.use("/inquiry", inquiryRoute);
// app.use("/estimateroute", estimateRoute);
// app.use("/sellcar", sellCarRoute);
// app.use("/contactus", contactUsRoutes);
// app.use("/inspection", inspectionRoute);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Carvista backend is live.");
// });

// /**
//  * MongoDB connection caching for serverless functions
//  */
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// async function connectToDatabase() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       // add other mongoose options here if needed
//     };

//     cached.promise = mongoose.connect(process.env.URI || "", opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// // Vercel serverless handler function
// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   try {
//     await connectToDatabase(); // connect once before handling request
//     app(req, res);
//   } catch (error) {
//     console.error("Database connection error:", error);
//     res.status(500).json({ error: "Database connection error" });
//   }
// }
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import userRoute from "./src/Routes/userRoutes";
import carRoute from "./src/Routes/carRoutes";
import estimateRoute from "./src/Routes/estimateRoutes";
import inspectionRoute from "./src/Routes/inspectionRoutes";
import testdriveRoute from './src/Routes/TestdriveRoutes';
import inquiryRoute from "./src/Routes/inquiryRoute";
import sellCarRoute from "./src/Routes/sellCarRoutes";
import contactUsRoutes from "./src/Routes/contactUsRoutes";

import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/InspectionReports", express.static(path.join(__dirname, "InspectionReports")));

// Routes
app.use("/user", userRoute);
app.use("/car", carRoute);
app.use("/testdrive", testdriveRoute);
app.use("/inquiry", inquiryRoute);
app.use("/estimateroute", estimateRoute);
app.use("/sellcar", sellCarRoute);
app.use("/contactus", contactUsRoutes);
app.use("/inspection", inspectionRoute);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Carvista backend is live.");
});

// MongoDB connection caching (for serverless)
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.URI || "", opts).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Local development server start
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB:", err);
    });
}

// Vercel serverless handler export
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectToDatabase(); // ensure DB is connected
    app(req, res); // pass request to express app
  } catch (error) {
    console.error("❌ Database connection error:", error);
    res.status(500).json({ error: "Database connection error" });
  }
}
