//Mongoose
import mongoose, { Document, Schema,Types } from 'mongoose';

interface ITestdrive{
    carId: Types.ObjectId;  
    userId: Types.ObjectId; 
    date: Date;           
    timeSlot:string;
    status: 'pending' | 'approved' | 'completed' | 'cancelled'; 
    bookingTimestamp:Date;
}

const testDriveSchema: Schema<ITestdrive> = new Schema(
  {
    carId: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      date: {
          type: Date,
          required: true,
        },
        timeSlot: {
          type: String,
          required: true,
        },
      status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        required: true,
        default: 'pending'
      },
      bookingTimestamp: { type: Date, default: Date.now }

  },
  { timestamps: true } 
);

const Testdrive = mongoose.model<ITestdrive>('Testdrive', testDriveSchema);

export default Testdrive;