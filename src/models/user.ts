import mongoose, { Schema, Document } from 'mongoose';

// Define User Interface
interface IUser extends Document {
  username: string;
  password?: string; // Optional since Google users won't have it
  googleId?: string;
  accountType: 'read' | 'read-write' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Define User Schema
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { 
      type: String,
      required: function (this: IUser) { return !this.googleId; } // Only required if NOT a Google user
    },
    googleId: { type: String, unique: true, sparse: true },
    accountType: {
      type: String,
      enum: ['read', 'read-write', 'admin'],
      default: 'read',
    },
  },
  { timestamps: true }
);

// Export User Model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
export { IUser };
