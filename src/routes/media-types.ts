/**
 * @openapi
 * /api/media-types:
 *   get:
 *     summary: Retrieve a list of available media types
 *     tags:
 *       - Media Types
 *     responses:
 *       200:
 *         description: A list of all available media types.
 *       401:
 *         description: Unauthorized access to media types.
 */

/**
 * @openapi
 * /api/media-types:
 *   post:
 *     summary: Add a new media type
 *     tags:
 *       - Media Types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Media type successfully added.
 *       400:
 *         description: Bad request due to missing or incorrect data.
 *       401:
 *         description: Unauthorized access to add media type.
 */
