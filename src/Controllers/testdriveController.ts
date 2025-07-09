import { Request, Response } from "express";
import Testdrive from "../Model/testdriveModel";
import { Messages } from "../Constants/Messages";
import nodemailer from "nodemailer";
import User from "../Model/userModel";
import EstimateModel from "../Model/EstimateCarModel";
import { Car } from "../Model/carModel";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed or untrusted certificates
  },
});
// Schedule a test drive
export const scheduleTestdrive = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    const { carId, date, timeSlot } = req.body;

    if (!carId || !date || !timeSlot) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Check if the user has already booked a test drive for the same car
    const existingTestDrive = await Testdrive.findOne({
      userId: req.user.id,
      carId,
    });

    if (existingTestDrive) {
      res.status(400).json({ error: "You have already booked a test drive for this car." });
      return;
    }

    // Prevent duplicate test drives for the same car, date, and time slot
    const existingTestDriveslot = await Testdrive.findOne({
      userId: req.user.id,
      carId,
      date,
      timeSlot,
    });

    if (existingTestDriveslot) {
      res.status(400).json({ error: "Test drive already scheduled for this slot." });
      return;
    }

    // Save test drive booking
    const newTestDrive = new Testdrive({
      userId: req.user.id,
      carId,
      date,
      timeSlot,
      status: "pending",
    });

    await newTestDrive.save();

    res.status(200).json({
      message: "Testdrive booked successfully.",
      testdriveid: newTestDrive._id,
      testDrive: newTestDrive,
    });

    // Send confirmation email in background
    setImmediate(async () => {
      try {
        // Fetch user details
        const user = await User.findById(req.user!.id);
        if (!user || !user.email) {
          console.warn("User email not found. Email not sent.");
          return;
        }

        // Fetch car details for email
        const car = await Car.findById(carId);
        if (!car) {
          console.warn("Car not found. Email sent without car details.");
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Test Drive Booking Confirmation",
          html: `
            <h2>Test Drive Scheduled Successfully</h2>
            <p>Dear ${user.name || "User"},</p>
            <p>Your test drive has been successfully booked.</p>
            ${
              car
                ? `<p><strong>Car Details:</strong></p>
                   <ul>
                     <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
                     <li><strong>Year:</strong> ${car.year}</li>
                     <li><strong>Fuel Type:</strong> ${car.fueltype}</li>
                     <li><strong>Transmission:</strong> ${car.transmission}</li>
                     <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
                   </ul>`
                : ""
            }
            <p><strong>Date:</strong> ${new Date(date).toISOString().split("T")[0]}</p>
            <p><strong>Time Slot:</strong> ${timeSlot}</p>
            <p>Thank you for choosing Carvista.</p>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Test drive confirmation email sent:", info.response);
      } catch (emailError) {
        console.error("Failed to send test drive confirmation email:", emailError);
      }
    });

  } catch (error) {
    console.error("Test Drive Booking Error:", error);
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};

// Count the number of pending test drives
export const countTestdrives = async (req: Request, res: Response) => {
  try {
    // Optionally filter by user or car ID if needed
    const { userId, carId } = req.query;

    let query: any = { status: 'pending' }; // Filter for pending test drives

    if (userId) {
      query.userId = userId;
    }

    if (carId) {
      query.carId = carId;
    }

    // Count the number of pending test drives based on the query filters
    const count = await Testdrive.countDocuments(query);

    res.status(200).json({ 
      message: "Pending test drive count fetched successfully", 
      count: count 
    });
  } catch (error) {
    console.error("Test Drive Count Error:", error);
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};

// Get all test drives
export const getAllTestDrives = async (req: Request, res: Response) => {
  try {
    // Fetch all test drives along with user and car details
    const testDrives = await Testdrive.find()
      .populate({
        path: "userId",
        select: "name email contact", // Select only necessary user fields
      })
      .populate({
        path: "carId",
        select: "brand year model kmdriven transmission status fueltype type price"
      })
      .exec();

    if (!testDrives.length) {
      res.status(404).json({ message: "No test drives found." });
      return;
    }

    res.status(200).json({ testDrives });
  } catch (error) {
    console.error("Error fetching test drives:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get test drive by ID
export const getTestdrive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testDrive = await Testdrive.findById(id).populate("carId userId");
    if (!testDrive) {
      res.status(404).json({ error: Messages.testdriveNotFound });
      return;
    }
    res.status(200).json(testDrive);
  } catch (error) {
    res.status(500).json({ error: Messages.failFetchTestdrive });
  }
};

// Cancel a test drive
export const cancelTestdrive = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('Canceling test drive with ID:', id);

    const testDrive = await Testdrive.findById(id);
    if (!testDrive) {
      console.log('Test drive not found');
      res.status(404).json({ error: Messages.testdriveNotFound });
      return;
    }

    // Optional: Check user ID match
    // if (testDrive.userId.toString() !== req.user?.id) {
    //   res.status(403).json({ error: "Unauthorized" });
    //   return;
    // }

    await Testdrive.findByIdAndDelete(id);
    console.log('Test drive deleted');
    res.status(200).json({ message: Messages.testdriveCancel });

  } catch (error) {
    console.error('Error canceling test drive:', error);
    res.status(500).json({ error: Messages.failtestdriveCancel });
  }
};

// Update test drive status
export const updateTestdrivestatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, date, timeSlot } = req.body;

    // Ensure valid status values
    if (!["pending", "completed", "cancelled"].includes(status.toLowerCase())) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }


    const updatedTestDrive = await Testdrive.findByIdAndUpdate(
      id,
      { status, date, timeSlot },
      { new: true }
    );

    if (!updatedTestDrive) {
      res.status(404).json({ error: "Test drive not found." });
      return;
    }

    res.status(200).json({ message: "Test drive updated successfully!", updatedTestDrive });
  } catch (error) {
    console.error("Error updating test drive:", error);
    res.status(500).json({ error: "Failed to update test drive. Please try again later." });
  }
};