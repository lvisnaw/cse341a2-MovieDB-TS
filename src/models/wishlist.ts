import mongoose, { Schema, Document } from 'mongoose';
import { IWishlistMovie } from './wishlistMovie';

interface IWishlist extends Document {
  name: string;
  movies: IWishlistMovie[];
}


const wishListSchema = new Schema<IWishlist>({
  name: { type: String, required: true },
  movies: { type: [Schema.Types.ObjectId], ref: 'WishlistMovie', required: true } // Array of movies
});

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishListSchema);
export default Wishlist;
export { IWishlist };
