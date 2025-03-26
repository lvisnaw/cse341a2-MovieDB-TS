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

#### **Movies Endpoints:**
- `GET /api/movies`: Retrieve all movies in the collection.
- `GET /api/movies/{id}`: Get details of a specific movie by ID.
- `POST /api/movies`: Add a new movie to your collection.
- `PUT /api/movies/{id}`: Update movie details.
- `DELETE /api/movies/{id}`: Remove a movie from the collection.

#### **Wishlist Endpoints:**
- `GET /api/wishlists`: Retrieve all wishlists.
- `POST /api/wishlists`: Add a new wishlist.
- `GET /api/wishlists/{id}`: Get a specific wishlist by ID.
- `PUT /api/wishlists/{id}`: Update a wishlist.
- `DELETE /api/wishlists/{id}`: Remove a wishlist.
- `POST /api/wishlists/{id}/movies`: Add a movie to a specific wishlist.
- `DELETE /api/wishlists/{id}/movies/{movieId}`: Remove a movie from a specific wishlist.

#### **Media Type Endpoints:**
- `GET /api/media-types`: Retrieve a list of available media types.
- `POST /api/media-types`: Add a new media type.
- `PUT /api/media-types/{id}`: Update an existing media type.
- `DELETE /api/media-types/{id}`: Remove a media type.

#### **User Endpoints:**
- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: User login endpoint.
- `GET /api/users`: Retrieve all users.
- `PUT /api/users/{id}`: Update user details.
- `DELETE /api/users/{id}`: Delete a user.
- `POST /api/users/logout`: Log out a user.

#### **Authentication Endpoints:**
- `GET /auth/google`: Authenticate using Google OAuth.
- `GET /auth/google/callback`: Google OAuth callback.
- `GET /auth/dashboard`: Display the user dashboard after authentication.
- `GET /auth/logout`: Logout user.
- `GET /auth/check-auth`: Check authentication status.

### Technologies Used:
- **Node.js** for the backend.
- **Express** for API routing.
- **MongoDB** for the database.
- **Mongoose** for MongoDB data modeling.
- **OAuth** for user authentication.
- **TypeScript** for type safety.

### Render Link
- https://cse341a2-moviedb-ts.onrender.com/api-docs/
