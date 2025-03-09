import mongoose, { Schema, Document } from 'mongoose';

interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  birthday?: Date;
}

const contactSchema = new Schema<IContact>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date, default: null },
});

const Contact = mongoose.model<IContact>('Contact', contactSchema, 'contacts');

export default Contact;
