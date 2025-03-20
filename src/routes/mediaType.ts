import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
import { getAllMedia, addMediaType, updateMediaType, deleteMediaType} from '../controllers/mediaTypeController';

const router = Router();

/**
 * @openapi
 * /api/mediaTypes:
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

//GET MEDIA TYPES
router.get('/', getAllMedia);

/**
 * @openapi
 * /api/mediaTypes:
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
router.post('/', addMediaType);

/**
 * @openapi
 * /api/mediaTypes/{id}:
 *   put:
 *     summary: Update an existing media type
 *     tags:
 *       - Media Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the media type to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaType:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Media type successfully updated.
 *       400:
 *         description: Bad request due to missing or incorrect data.
 *       404:
 *         description: Media type not found with the provided ID.
 *       401:
 *         description: Unauthorized access to update media type.
 */
router.put('/:id', updateMediaType)

/**
 * @openapi
 * /api/mediaTypes/{id}:
 *   delete:
 *     summary: Delete an existing media type
 *     tags:
 *       - Media Types
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the media type to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media type successfully deleted.
 *       404:
 *         description: Media type not found with the provided ID.
 *       401:
 *         description: Unauthorized access to delete media type.
 */
router.delete('/:id', deleteMediaType)

export default router;