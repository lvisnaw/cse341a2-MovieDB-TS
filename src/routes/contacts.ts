import { Router, Request, Response } from 'express';
import { getDb } from '../db/connection'; // Import the getDb function
import { ObjectId } from 'mongodb';
import { getContactById } from '../utils/contactService'; // Import the utility function

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API for managing contacts
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of contacts
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const collection = db.collection('contacts');

    console.log('🔍 Attempting to retrieve documents from collection...');
    const contacts = await collection.find({}).toArray();
    console.log('✅ Raw query result:', contacts);

    res.json(Array.isArray(contacts) ? contacts : []);
  } catch (error: any) {
    console.error('❌ Error querying contacts:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the contact
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    res.status(200).json(contact);
  } catch (error: any) {
    console.error('❌ Error fetching contact by ID:', error.message);

    if (error.message === 'Invalid ID format') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Contact not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    if (!contact.firstName || !contact.lastName || !contact.email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDb();
    const response = await db.collection('contacts').insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error: any) {
    console.error('❌ Error creating contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const response = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('❌ Error updating contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const response = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
