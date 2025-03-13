/**
 * @openapi
 * /api/wishlist:
 *   get:
 *     summary: Retrieve all movies in the user's wishlist
 *     tags:
 *       - Wishlist
 *     responses:
 *       200:
 *         description: A list of movies in the user's wishlist.
 *       401:
 *         description: Unauthorized access to wishlist.
 */

/**
 * @openapi
 * /api/wishlist:
 *   post:
 *     summary: Add a new movie to the wishlist
 *     tags:
 *       - Wishlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie successfully added to wishlist.
 *       400:
 *         description: Bad request due to missing or incorrect data.
 *       401:
 *         description: Unauthorized access to add movie to wishlist.
 */

/**
 * @openapi
 * /api/wishlist/{id}:
 *   put:
 *     summary: Update a movie in the wishlist
 *     tags:
 *       - Wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie successfully updated in the wishlist.
 *       400:
 *         description: Bad request due to invalid data.
 *       404:
 *         description: Movie not found in the wishlist.
 *       401:
 *         description: Unauthorized access to update the movie.
 */

/**
 * @openapi
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove a movie from the wishlist
 *     tags:
 *       - Wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to remove from the wishlist.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie successfully removed from the wishlist.
 *       404:
 *         description: Movie not found in the wishlist.
 *       401:
 *         description: Unauthorized access to remove the movie.
 */

/**
 * @openapi
 * /api/wishlist/{id}/movies{id}:
 *   post:
 *     summary: Add a movie to a specific wishlist
 *     tags:
 *       - Wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the wishlist to add the movie to.
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: The ID of the movie to add.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Movie successfully added to the wishlist.
 *       404:
 *         description: Wishlist or movie not found.
 *       401:
 *         description: Unauthorized access to add a movie to the wishlist.
 */

/**
 * @openapi
 * /api/wishlist/{id}/movies{id}:
 *   delete:
 *     summary: Remove a movie from a specific wishlist
 *     tags:
 *       - Wishlist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the wishlist to remove the movie from.
 *         schema:
 *           type: string
 *       - in: path
 *         name: movieId
 *         required: true
 *         description: The ID of the movie to remove.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie successfully removed from the wishlist.
 *       404:
 *         description: Wishlist or movie not found.
 *       401:
 *         description: Unauthorized access to remove the movie from the wishlist.
 */
