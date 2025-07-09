    import mongoose, { Schema, Document, Model } from "mongoose";

    // ✅ Define Interface Without Extending `Document`
    export interface IEstimateCar {
    userId: mongoose.Types.ObjectId;
    brand: string;
    model: string; // Keep model but handle Mongoose conflict
    year: number;
    fuel: string;
    kmdriven: number;
    transmission: string;
    type: string;
    estimatedPrice: number;
    createdAt?: Date;
    }

    // ✅ Define Schema
    const EstimateSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true }, // Keeping "model"
    year: { type: Number, required: true },
    fuel: { type: String, required: true },
    kmdriven: { type: Number, required: true },
    transmission: { type: String, required: true },
    type: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    });

    // ✅ Define Model Correctly (Use HydratedDocument for safer typing)
    type IEstimateCarDocument = Document & IEstimateCar;
    const EstimateModel: Model<IEstimateCarDocument> = mongoose.model<IEstimateCarDocument>("Estimate", EstimateSchema);

    export default EstimateModel;