import mongoose, { Schema, Document } from 'mongoose';

interface IMovie extends Document {
  title: string;
  genre: string[];
  releaseYear: number;
  format: mongoose.Schema.Types.ObjectId;// reference to MediaType
  director: string;
  leadActors: string[];
  description?: string;
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  genre: { type: [String], required: true }, // Array of genres
  releaseYear: { type: Number, required: true },
  format: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaType', required: true },//reference added
  director: { type: String, required: true },
  leadActors: { type: [String], required: true },
  description: { type: String }, // Optional movie description
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);
export default Movie;
export { IMovie };
