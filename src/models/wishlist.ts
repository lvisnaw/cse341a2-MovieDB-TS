import mongoose, { Schema, Document } from 'mongoose';
import { IWishlistMovie } from './wishlistMovie';

interface IWishlist extends Document {
  name: string;
  movies: IWishlistMovie[];
}


const wishListSchema = new Schema<IWishlist>({
  name: { type: String, required: true },
  movies: [
    {
      title: { type: String, required: true },
      genre: { type: [String], required: true },
      releaseYear: { type: Number, required: true },
    }]
});

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishListSchema);
export default Wishlist;
export type { IWishlist };
