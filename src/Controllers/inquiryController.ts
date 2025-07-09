//Express
import express,{ Request, Response } from "express";

//InquiryModel
import Inquiry from "../Model/inquiryModel";

//Messages
import {Messages} from '../Constants/Messages'

const app = express();


app.use(express.json()); 


// Schedule a test drive
export const addInquiry = async (req: Request, res: Response) => {
  try {
    const { carId, userId, date,status } = req.body;

    const addInquiry = await Inquiry.create({
      carId,
      userId,
      date,
      status
    });
    res
      .status(200)
      .json({ message: Messages.inquiryAdded, addInquiry});
  } catch (error) {
    res.status(500).json({ error: Messages.inquiryFailed});
    return;
  }
};

// Get all test drives
export const allInquiry = async (req: Request, res: Response) => {
  try {
    const getInquiry = await Inquiry.find().populate("carId userId");
    res.status(200).json(getInquiry);
  } catch (error) {
    res.status(500).json({ error: Messages.inquiryFailed});
    return;
  }
};

// Cancel a test drive
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteInquiry = await Inquiry.findByIdAndDelete(id);
    if (!deleteInquiry) {
      res.status(404).json({ error: Messages.inquiryNotFound });
      return;
    }
    res.status(200).json({ message: Messages.inquiryDeleted, deleteInquiry });
  } catch (error) {
    res.status(500).json({ error: Messages. inquiryCancelFailed});
    return;
  }
};
// Update test drive status
export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedInquiry) {
      res.status(404).json({ error: Messages.inquiryNotFound});
      return;
    }
    res
      .status(200)
      .json({ message:Messages.inquiryUpdated, updatedInquiry});
  } catch (error) {
    res.status(500).json({ error:Messages.inquiryUpdateFailed });
    return;
  }
};

//Get the Inquiry By id

export const getInquiry = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const getInquiry = await Inquiry.findById(id);
    if (!getInquiry) {
      res.status(200).json(getInquiry);
      return;
    } else {
      res.status(404).json(Messages.CarNotFound);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: Messages.UnknownError });
      return;
    }
  }
};

