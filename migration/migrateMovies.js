const Movie = require('../models/movie');
const connectDB = require('../db/connection');

async function migrateMovies() {
  try {
    await connectDB();

    const movies = await Movie.find();

    for (const movie of movies) {
      const genres = Array.isArray(movie.genre) ? movie.genre : movie.genre.split(',').map(g => g.trim());
      const description = 'No description available';

      await Movie.findByIdAndUpdate(movie._id, { 
        $set: { genre: genres, description: description }
      }, { new: true });

      console.log(`Migrated movie: ${movie.title}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateMovies();
