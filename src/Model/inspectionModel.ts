  // import mongoose, { Schema, Document } from "mongoose";

  // export interface IInspectionModel extends Document {
  //   userId: mongoose.Types.ObjectId;
  //   carId: mongoose.Types.ObjectId;
  //   inspectionDate: string;
  //   location: string;
  //   status: "Pending" | "Completed" | "Cancelled";
  //   finalPrice?: number;
  //   createdAt?: Date;
  // }
  
  // const InspectionSchema: Schema = new Schema({
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //   carId: { type: mongoose.Schema.Types.ObjectId, ref: "Estimate", required: true },
  //   inspectionDate: { type: String, required: true },
  //   location: { type: String, required: true },
  //   status: {
  //     type: String,
  //     enum: ["Pending", "Completed", "Cancelled"],
  //     default: "Pending",
  //   },
  //   finalPrice: { type: Number, required: false }, // Optional field
  //   createdAt: { type: Date, default: Date.now },
  // });
  
  // const InspectionModel = mongoose.model<IInspectionModel>("Inspection", InspectionSchema);
  // export default InspectionModel;

  import mongoose, { Schema, Document } from "mongoose";

export interface IInspectionModel extends Document {
  userId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  inspectionDate: string;
  location: string;
  status: "Pending" | "Completed" | "Cancelled";
  finalPrice?: number;
  createdAt?: Date;
  inspectionReport?: string; // ✅ Add this optional field
}

const InspectionSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Estimate", required: true },
  inspectionDate: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  finalPrice: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  inspectionReport: { type: String, required: false }, // ✅ Add this to the schema
});

const InspectionModel = mongoose.model<IInspectionModel>("Inspection", InspectionSchema);
export default InspectionModel;
