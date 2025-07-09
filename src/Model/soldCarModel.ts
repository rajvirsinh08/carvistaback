import mongoose, { Document, Schema } from "mongoose";

interface ISoldCar {
  brand: string;
  year: number;
  model: string;
  kmdriven: string;
  transmission: string;
  fueltype: string;
  type: string;
  price: string;
  finalPrice: number;
  commission: number;
  exteriorimage: string;
  interiorimage: string;
  tyreimage: string;
  soldDate: Date;
}

const soldCarSchema = new mongoose.Schema<ISoldCar>({
  model: { type: String, required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: String, required: true },
  finalPrice: { type: Number, required: true },
  commission: { type: Number, required: true },
  kmdriven: { type: String, required: true },
  fueltype: { type: String, required: true },
  transmission: { type: String, required: true },
  type: { type: String, required: true },
  exteriorimage: { type: String, required: true },
  interiorimage: { type: String, required: true },
  tyreimage: { type: String, required: true },
  soldDate: { type: Date, default: Date.now },
});

export const SoldCar = mongoose.model<ISoldCar>("SoldCar", soldCarSchema);
