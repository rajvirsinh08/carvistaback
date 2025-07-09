//Mongoose
import mongoose, { Document, Schema,Types  } from 'mongoose';

interface IUser extends Document {
  _id: Types.ObjectId; 

  name: string;
  email: string;
  contact:string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean; // <-- add this line
  profileImage?: string; // ✅ Profile image field
  resetPasswordOTP?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
      },
    password: {
      type: String,
      required: true,
    },
     profileImage: {
      type: String, 
      required: false,

      // ✅ URL to image stored in Vercel Blob
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    isActive: { type: Boolean, default: true }, // <-- add this

  },
  { timestamps: true } 
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;