"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
//Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
const carSchema = new mongoose_1.default.Schema({
    model: { type: String, required: true },
    brand: { type: String, required: true },
    year: { type: Date, required: true },
    price: { type: String, required: true },
    status: { type: String, required: true },
    kmdriven: { type: String, required: true },
    fueltype: { type: String, required: true },
    transmission: { type: String, required: true },
    type: { type: String, required: true },
    exteriorimage: { type: String, required: true },
    interiorimage: { type: String, required: true },
    tyreimage: { type: String, required: true },
});
exports.Car = mongoose_1.default.model("Car", carSchema);
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
