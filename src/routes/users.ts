import { Router } from 'express';
import { registerUser, loginUser, updateUser, deleteUser, logoutUser } from '../controllers/usersController';
import { authenticateJWT } from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 */
router.post('/register', registerUser);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's details
 *     tags:
 *       - Users
 */
router.put('/:id', authenticateJWT, authorizeRoles('admin'), updateUser);

/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Users
 */
router.post('/logout', logoutUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 */
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteUser);

export default router;
