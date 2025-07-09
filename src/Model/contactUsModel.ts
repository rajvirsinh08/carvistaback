// models/contact.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  mobile: string;
  queryType: string;
  queryDescription: string;
  query: string;
}

const contactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  queryType: { type: String, required: true },
  queryDescription: { type: String, required: true },
  query: { type: String, required: true },
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
