# MovieDB README

## Project Title: MovieDB

### Overview:
MovieDB is a personal movie database designed to manage and organize your movie collection. It provides a digital way to catalog movies with key details like title, description, genre, format, personal ratings, and location. The system aims to make it easier for users to track and manage their collections while offering a feature-rich platform for easy searching and filtering. A wishlist feature is included to allow users to track movies they wish to add to their collection.

### Features:
- **Movie Management**: Catalog movies with details like title, description, genre, movie ratings, format (e.g., DVD, Blu-ray, Digital), personal rating, and storage location.
- **Search and Filter**: Quickly search and filter your collection based on various attributes.
- **Wishlist**: Create and manage a wishlist of movies you desire to add to your collection.
- **User Authentication**: OAuth authentication for secure user login and movie collection management.
  
### Database:
- **MongoDB**: The backend uses MongoDB with four collections:
  1. **Movies Collection**: Stores movie details (title, description, genre, format, rating, etc.)
  2. **Wishlist Collection**: Stores movies you wish to add to your collection.
  3. **Media Type Collection**: Information about different media formats (DVD, Blu-ray, Digital).
  4. **Users Collection**: Manages user authentication tokens and other user-related data.

### API Endpoints:
- **Movies Endpoints:**
  - `GET /movies`: Retrieve all movies in the collection.
  - `GET /movies/{id}`: Get details of a specific movie by ID.
  - `POST /movies`: Add a new movie to your collection.
  - `PUT /movies/{id}`: Update movie details.
  - `DELETE /movies/{id}`: Remove a movie from the collection.

- **Wishlist Endpoints:**
  - `GET /wishlist`: Retrieve all movies in the user's wishlist.
  - `POST /wishlist`: Add a new movie to the wishlist.
  - `PUT /wishlist/{id}`: Update a movie in the wishlist.
  - `DELETE /wishlist/{id}`: Remove a movie from the wishlist.
  - `POST /wishlist/{id}/movies{id}`: Add a movie to a wishlist.
  - `DELETE /wishlist/{id}/movies{id}`: Remove a movie from a wishlist.

- **Media Type Endpoints:**
  - `GET /media-types`: Retrieve a list of available media types.
  - `POST /media-types`: Add a new media type.

- **User Endpoints:**
  - `POST /users/login`: User login endpoint.
  - `GET /users`: Retrieve all users.


### Technologies Used:
- **Node.js** for the backend.
- **Express** for API routing.
- **MongoDB** for the database.
- **Mongoose** for MongoDB data modeling.
- **OAuth** for user authentication.
- **TypeScript** for type safety.
