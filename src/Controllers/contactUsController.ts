// controllers/contactController.ts
import { Request, Response } from 'express';
import Contact, { IContact } from '../Model/contactUsModel';
// import Contact, { IContact } from '../models/contact';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, mobile, query, queryType, queryDescription }: IContact = req.body;

    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      mobile,
      query,
      queryType,
      queryDescription,
    });

    // Save the document to the database
    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
};
// Fetch all contact records from the database
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all contacts
    const contacts = await Contact.find();

    // Return the contacts in the response
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving contacts' });
  }
};

// Delete a contact form by ID
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete the contact form by ID
    const contact = await Contact.findByIdAndDelete(id);

    // Check if the contact exists
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
};