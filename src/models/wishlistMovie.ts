import mongoose, { Schema, Document } from 'mongoose';

interface IWishlistMovie extends Document {
  title: string;
  genre: string[];
  releaseYear: number;
}


const wishlistMovieSchema = new Schema<IWishlistMovie>({
  title: { type: String, required: true },
  genre: { type: [String], required: true }, // Array of genres
  releaseYear: { type: Number, required: true }
});

const WishlistMovie = mongoose.model<IWishlistMovie>('WishlistMovie', wishlistMovieSchema);
export default WishlistMovie;
export type { IWishlistMovie };
