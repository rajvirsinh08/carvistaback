import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
    carId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    date: Date;
    status:'pending' | 'approved' | 'completed' | 'cancelled'; 
}

const inquirySchema = new Schema<IInquiry>({
    carId:
    {
        type: Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date:
    {
         type: Date,
         required: true
    },
   status:
    {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected", "sold"]
    },
},{timestamps:true});

const Inquiry = mongoose.model<IInquiry>("Inquiry", inquirySchema);

export default Inquiry;