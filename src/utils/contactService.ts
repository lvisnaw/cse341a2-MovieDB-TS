import { getDb } from '../db/connection';
import { ObjectId } from 'mongodb';

/**
 * Retrieves a contact by ID from the database.
 * @param id - The ID of the contact to retrieve.
 * @returns A Promise resolving to the contact object if found.
 * @throws An error if the ID format is invalid or the contact is not found.
 */
export const getContactById = async (id: string): Promise<Record<string, unknown>> => {
  const db = getDb();
  const collection = db.collection('contacts');

  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }

  const contact = await collection.findOne({ _id: new ObjectId(id) });

  if (!contact) {
    throw new Error('Contact not found');
  }

  return contact;
};
