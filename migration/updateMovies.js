const Movie = require('../models/movie');
const connectDB = require('../db/connection');

const updatedMovies = [
  {
    _id: '67a6d149ef4222d77a645499',
    genre: ['Action', 'Crime', 'Drama'],
    description: 'Batman faces the Joker in a battle of chaos versus justice in Gotham City.'
  },
  {
    _id: '67a6d5fd519223bcc1d64a98',
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    description: 'A thief skilled in dream extraction gets a chance to clear his name by planting an idea in a CEO’s mind.'
  },
  {
    _id: '67a703dc02c0ac3f3f9d2d67',
    genre: ['Adventure', 'Comedy', 'Drama'],
    description: 'A daydreamer embarks on an extraordinary global adventure after losing a treasured photograph.'
  },
  {
    _id: '67b39803acfb543826c4195a',
    genre: ['Comedy', 'Drama', 'Family'],
    description: 'A shy young boy spends the summer with his eccentric uncles, who share wild tales of their past.'
  }
];

async function updateMovies() {
  try {
    await connectDB();

    for (const movie of updatedMovies) {
      await Movie.findByIdAndUpdate(movie._id, {
        $set: { genre: movie.genre, description: movie.description }
      }, { new: true });
      console.log(`Updated movie: ${movie.title}`);
    }

    console.log('All movies updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateMovies();
