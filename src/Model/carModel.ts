//Mongoose
import mongoose, { Document, Schema } from "mongoose";

interface ICar {
  brand: string;
  year: number; // ← Changed from Date to number
  model: string;
  kmdriven: string;
  transmission: string;
  status: string;
  fueltype: string;
  type: string;
  price:string;
  finalPrice?: number;
  exteriorimage: string;
  interiorimage: string;
  tyreimage: string;
  inspectionId?: mongoose.Types.ObjectId;
}

const carSchema = new mongoose.Schema<ICar>({
  model: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true }, // ← Changed from Date to Number
  price: { type: String, required: true },
  status: { type: String, required: true },
  kmdriven: { type: String, required: true },
  fueltype: { type: String, required: true },
  transmission: { type: String, required: true },
  type: { type: String, required: true },
  finalPrice: { type: Number, required: false }, // Optional field
  exteriorimage: { type: String, required: true },
  interiorimage: { type: String, required: true },
  tyreimage: { type: String, required: true },
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Inspection", required: false },
});

export const Car = mongoose.model<ICar>("Car", carSchema);



// import mongoose, { Schema, Document } from "mongoose";

// export interface ICar {
//   model: string;
//   manufacturer: string;
//   year: Date;
//   price: string;
//   status: string;
//   kmdriven:string;
//   fueltype:string;
//   transmission:string;
//   image: string; 
// }

// const carSchema: Schema<ICar> = new Schema(
//     {
//       model: {
//         type: String,
//         required: true,
//       },
//       manufacturer: {
//         type: String,
//         required: true,
//       },
//       year: {
//         type: Date,
//         required: true,
//       },
//       price: {
//         type: String,
//         required: true,
//       },
//       status: {
//         type: String,
//         required: true,
//       },
//       kmdriven: {
//         type: String,
//         required: true,
//       },
//       fueltype: {
//         type: String,
//         required: true,
//       },
//       transmission: {
//         type: String,
//         required: true,
//       },
//       image: {
//         type: String, // ✅ Image will be stored as a file path or URL
//         required: true,
//       },
//     },
//     { timestamps: true }
//   );
// export const Car = mongoose.model<ICar>("Car", carSchema);


// import mongoose, { Document, Schema } from "mongoose";

// interface ICar {
//   model: string;
//   manufacturer: string;
//   year: Date;
//   price: string;
//   status: string;
//   kmdriven:string;
//   fueltype:string;
//   transmission:string;
//   image: string; // ✅ Added image field
// }

// const carSchema: Schema<ICar> = new Schema(
//   {
//     model: {
//       type: String,
//       required: true,
//     },
//     manufacturer: {
//       type: String,
//       required: true,
//     },
//     year: {
//       type: Date,
//       required: true,
//     },
//     price: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     kmdriven: {
//       type: String,
//       required: true,
//     },
//     fueltype: {
//       type: String,
//       required: true,
//     },
//     transmission: {
//       type: String,
//       required: true,
//     },
//     image: {
//       type: String, // ✅ Image will be stored as a file path or URL
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Car = mongoose.model<ICar>("Car", carSchema);

// export default Car;
