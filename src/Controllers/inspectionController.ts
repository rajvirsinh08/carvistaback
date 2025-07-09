import { Request, Response } from "express";
import InspectionModel from "../Model/inspectionModel";
import EstimateModel from "../Model/EstimateCarModel"; // Using your provided model
import nodemailer from "nodemailer";
import User from "../Model/userModel";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

// ✅ Hardcoded Vercel Blob token (ONLY for dev/testing)
const BLOB_TOKEN = "vercel_blob_rw_qTDvCQWBTr2XDZfc_c979p8v281nEthSLbfBBBIKUsPCvTy";

// ✅ Inline upload function
async function uploadToVercelBlob(buffer: Buffer, originalname: string) {
  const filename = `${Date.now()}-${randomUUID()}-${originalname}`;
  const blob = await put(filename, buffer, {
    access: "public",
    contentType: "application/pdf",
    token: BLOB_TOKEN,
  });
  return blob.url;
}
// function uploadToCloudinary(buffer: Buffer): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "inspectionReports", resource_type: "auto" },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result!.secure_url);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// }

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
export const bookInspection = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    const userId = req.user.id;
    const { carId, inspectionDate, location } = req.body;

    if (!carId || !inspectionDate || !location) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const [car, existingBooking] = await Promise.all([
      EstimateModel.findById(carId),
      InspectionModel.findOne({ userId, carId }),
    ]);

    if (!car) {
      res.status(404).json({ error: "Car not found in Estimate database" });
      return;
    }

    if (existingBooking) {
      res
        .status(400)
        .json({ error: "Inspection already booked for this car." });
      return;
    }

    const inspectionDateFormatted = new Date(inspectionDate)
      .toISOString()
      .split("T")[0];

    const newInspection = new InspectionModel({
      userId,
      carId,
      inspectionDate: inspectionDateFormatted,
      location,
    });

    await newInspection.save();

    res.json({
      message:
        "Inspection booked successfully. Confirmation email is being sent.",
      inspectionId: newInspection._id,
      inspection: newInspection,
    });

    // Send email in background
    setImmediate(async () => {
      try {
        const user = await User.findById(userId);
        if (!user || !user.email) {
          console.warn("User email not found. Email not sent.");
          return;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER, // Must match transporter auth.user
          to: user.email,
          subject: "Car Inspection Booking Confirmation",
          html: `
            <h2>Inspection Booked Successfully</h2>
            <p>Dear ${user.name},</p>
            <p>Your car inspection has been successfully booked.</p>
            <p><strong>Car Details:</strong></p>
            <ul>
              <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
              <li><strong>Year:</strong> ${car.year}</li>
              <li><strong>Fuel Type:</strong> ${car.fuel}</li>
              <li><strong>Transmission:</strong> ${car.transmission}</li>
              <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
              <li><strong>Estimated Price:</strong> ₹${car.estimatedPrice.toLocaleString()}</li>
            </ul>
            <p><strong>Inspection Date:</strong> ${inspectionDateFormatted}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p>Thank you for using Carvista.</p>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
      } catch (emailError) {
        console.error(
          "Failed to send inspection confirmation email:",
          emailError
        );
      }
    });
  } catch (error) {
    console.error("Inspection Booking Error:", error);
    res
      .status(500)
      .json({ error: "Server error", details: (error as Error).message });
  }
};

// export const bookInspection = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       res.status(401).json({ error: "User authentication failed." });
//       return;
//     }

//     const { carId, inspectionDate, location } = req.body;

//     if (!carId || !inspectionDate || !location) {
//       res.status(400).json({ error: "All fields are required" });
//       return;
//     }

//     const car = await EstimateModel.findById(carId);
//     if (!car) {
//       res.status(404).json({ error: "Car not found in Estimate database" });
//       return;
//     }

//     const existingBooking = await InspectionModel.findOne({
//       userId: req.user.id,
//       carId,
//     });

//     if (existingBooking) {
//       res.status(400).json({ error: "Inspection already booked for this car." });
//       return;
//     }

//     const inspectionDateFormatted = new Date(inspectionDate).toISOString().split("T")[0];

//     const newInspection = new InspectionModel({
//       userId: req.user.id,
//       carId,
//       inspectionDate: inspectionDateFormatted,
//       location,
//     });

//     await newInspection.save();

//     const user = await User.findById(req.user.id);
//     if (!user || !user.email) {
//       res.status(404).json({ error: "User email not found" });
//       return;
//     }

//     const mailOptions = {
//       from: "rajvirsinhdabhi1@gmail.com",
//       to: user.email,
//       subject: "Car Inspection Booking Confirmation",
//       html: `
//         <h2>Inspection Booked Successfully</h2>
//         <p>Dear ${user.name},</p>
//         <p>Your car inspection has been successfully booked.</p>
//         <p><strong>Car Details:</strong></p>
//         <ul>
//           <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
//           <li><strong>Year:</strong> ${car.year}</li>
//           <li><strong>Fuel Type:</strong> ${car.fuel}</li>
//           <li><strong>Transmission:</strong> ${car.transmission}</li>
//           <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
//           <li><strong>Estimated Price:</strong> ₹${car.estimatedPrice.toLocaleString()}</li>
//         </ul>
//         <p><strong>Inspection Date:</strong> ${inspectionDateFormatted}</p>
//         <p><strong>Location:</strong> ${location}</p>
//         <p>Thank you for using our service.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.json({
//       message: "Inspection booked successfully. Confirmation email sent.",
//       inspectionId: newInspection._id,
//       inspection: newInspection,
//     });
//   } catch (error) {
//     console.error("Inspection Booking Error:", error);
//     res.status(500).json({ error: "Server error", details: (error as Error).message });
//   }
// };

export const getInspectionDetail = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    const { inspectionId } = req.params;

    if (!inspectionId) {
      res.status(400).json({ error: "Inspection ID is required" });
      return;
    }

    // Find the inspection and populate car details
    const inspection = await InspectionModel.findById(inspectionId).populate(
      "carId userId"
    );

    if (!inspection) {
      res.status(404).json({ error: "Inspection not found" });
      return;
    }

    res.json({
      message: "Inspection details retrieved successfully",
      inspection,
    });
  } catch (error) {
    console.error("Get Inspection Detail Error:", error);
    res
      .status(500)
      .json({ error: "Server error", details: (error as Error).message });
  }
};

export const cancelInspection = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    const { inspectionId } = req.params;

    if (!inspectionId) {
      res.status(400).json({ error: "Inspection ID is required" });
      return;
    }

    // Find the inspection
    const inspection = await InspectionModel.findOne({
      _id: inspectionId,
      userId: req.user.id,
    });

    if (!inspection) {
      res.status(404).json({ error: "Inspection not found or unauthorized" });
      return;
    }

    // Fetch car details
    const car = await EstimateModel.findById(inspection.carId);
    if (!car) {
      res.status(404).json({ error: "Car details not found" });
      return;
    }

    // Delete the inspection
    await InspectionModel.findByIdAndDelete(inspectionId);

    // Fetch user details
    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      res.status(404).json({ error: "User email not found" });
      return;
    }

    // Email content
    const mailOptions = {
      from: "rajvirsinhdabhi1@gmail.com",
      to: user.email,
      subject: "Inspection Cancellation Confirmation",
      html: `
        <h2>Inspection Canceled</h2>
        <p>Dear ${user.name},</p>
        <p>Your car inspection has been successfully canceled.</p>
        <p><strong>Car Details:</strong></p>
        <ul>
          <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
          <li><strong>Year:</strong> ${car.year}</li>
          <li><strong>Fuel Type:</strong> ${car.fuel}</li>
          <li><strong>Transmission:</strong> ${car.transmission}</li>
          <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
          <li><strong>Estimated Price:</strong> ₹${car.estimatedPrice.toLocaleString()}</li>
        </ul>
        <p><strong>Original Inspection Date:</strong> ${
          inspection.inspectionDate
        }</p>
        <p>Thank you for using our service.</p>
      `,
    };

    // Send cancellation email
    await transporter.sendMail(mailOptions);

    res.json({
      message: "Inspection canceled successfully. Confirmation email sent.",
    });
  } catch (error) {
    console.error("Cancel Inspection Error:", error);
    res
      .status(500)
      .json({ error: "Server error", details: (error as Error).message });
  }
};
export const deleteInspectionByAdmin = async (req: Request, res: Response) => {
  try {
    // Check if the authenticated user is an admin
    if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ error: "Access denied. Admins only." });
      return;
    }

    const { inspectionId } = req.params;

    if (!inspectionId) {
      res.status(400).json({ error: "Inspection ID is required" });
      return;
    }

    // Find the inspection without filtering by userId
    const inspection = await InspectionModel.findById(inspectionId);

    if (!inspection) {
      res.status(404).json({ error: "Inspection not found" });
      return;
    }

    // Fetch car details
    const car = await EstimateModel.findById(inspection.carId);
    if (!car) {
      res.status(404).json({ error: "Car details not found" });
      return;
    }

    // Fetch user details
    const user = await User.findById(inspection.userId);
    if (!user || !user.email) {
      res.status(404).json({ error: "User email not found" });
      return;
    }

    // Delete the inspection
    await InspectionModel.findByIdAndDelete(inspectionId);

    // Email content
    const mailOptions = {
      from: "your-email@example.com",
      to: user.email,
      subject: "Inspection Deletion Notification",
      html: `
        <h2>Inspection Deleted</h2>
        <p>Dear ${user.name},</p>
        <p>Your car inspection has been deleted by an administrator.</p>
        <p><strong>Car Details:</strong></p>
        <ul>
          <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
          <li><strong>Year:</strong> ${car.year}</li>
          <li><strong>Fuel Type:</strong> ${car.fuel}</li>
          <li><strong>Transmission:</strong> ${car.transmission}</li>
          <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
          <li><strong>Estimated Price:</strong> ₹${car.estimatedPrice.toLocaleString()}</li>
        </ul>
        <p><strong>Original Inspection Date:</strong> ${
          inspection.inspectionDate
        }</p>
        <p>If you have any questions, please contact support.</p>
      `,
    };

    // Send deletion email
    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "Inspection deleted successfully. Notification email sent to the user.",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Delete Inspection Error:", error.message);
      res.status(500).json({ error: "Server error", details: error.message });
    } else {
      console.error("Delete Inspection Error:", error);
      res
        .status(500)
        .json({ error: "Server error", details: "An unknown error occurred" });
    }
  }
};
export const rescheduleInspection = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    const { inspectionId } = req.params;
    const { newInspectionDate, newLocation, status } = req.body;

    if (!inspectionId || !newInspectionDate || !newLocation) {
      res
        .status(400)
        .json({
          error: "Inspection ID, new date, and new location are required",
        });
      return;
    }

    const inspection = await InspectionModel.findOne({
      _id: inspectionId,
      userId: req.user.id,
    });

    if (!inspection) {
      res.status(404).json({ error: "Inspection not found or unauthorized" });
      return;
    }

    inspection.inspectionDate = new Date(newInspectionDate)
      .toISOString()
      .split("T")[0];
    inspection.location = newLocation;
    inspection.status = status || inspection.status;

    await inspection.save();

    // Parallel fetching of user and car
    const [user, car] = await Promise.all([
      User.findById(req.user.id),
      EstimateModel.findById(inspection.carId),
    ]);

    if (!user || !user.email) {
      res.status(404).json({ error: "User email not found" });
      return;
    }

    if (!car) {
      res.status(404).json({ error: "Car details not found" });
      return;
    }

    // Prepare email content
    const mailOptions = {
      from: "rajvirsinhdabhi1@gmail.com",
      to: user.email,
      subject: "Inspection Rescheduled Confirmation",
      html: `
        <h2>Inspection Rescheduled</h2>
        <p>Dear ${user.name},</p>
        <p>Your car inspection has been successfully rescheduled.</p>
        <p><strong>Car Details:</strong></p>
        <ul>
          <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
          <li><strong>Year:</strong> ${car.year}</li>
          <li><strong>Fuel Type:</strong> ${car.fuel}</li>
          <li><strong>Transmission:</strong> ${car.transmission}</li>
          <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
        </ul>
        <p><strong>New Inspection Date:</strong> ${inspection.inspectionDate}</p>
        <p><strong>New Location:</strong> ${inspection.location}</p>
        <p><strong>Status:</strong> ${inspection.status}</p>
        <p>Thank you for using our service.</p>
      `,
    };

    // Send response immediately
    res.json({
      message:
        "Inspection rescheduled successfully. Confirmation email will be sent shortly.",
      inspection,
    });

    // Send email asynchronously (non-blocking)
    transporter.sendMail(mailOptions).catch((emailError) => {
      console.error("Error sending reschedule confirmation email:", emailError);
    });
  } catch (error) {
    console.error("Reschedule Inspection Error:", error);
    res
      .status(500)
      .json({ error: "Server error", details: (error as Error).message });
  }
};

// export const rescheduleInspection = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       res.status(401).json({ error: "User authentication failed." });
//       return;
//     }

//     const { inspectionId } = req.params;
//     const { newInspectionDate, newLocation, status } = req.body;

//     if (!inspectionId || !newInspectionDate || !newLocation) {
//       res.status(400).json({ error: "Inspection ID, new date, and new location are required" });
//       return;
//     }

//     // Find the inspection
//     const inspection = await InspectionModel.findOne({
//       _id: inspectionId,
//       userId: req.user.id,
//     });

//     if (!inspection) {
//       res.status(404).json({ error: "Inspection not found or unauthorized" });
//       return;
//     }

//     // Update fields
//     inspection.inspectionDate = new Date(newInspectionDate).toISOString().split("T")[0]; // Store as YYYY-MM-DD string
//     inspection.location = newLocation;
//     inspection.status = status || inspection.status; // ✅ Update status if provided

//     await inspection.save();

//     // Fetch user details
//     const user = await User.findById(req.user.id);
//     if (!user || !user.email) {
//       res.status(404).json({ error: "User email not found" });
//       return;
//     }

//     // Fetch car details
//     const car = await EstimateModel.findById(inspection.carId);
//     if (!car) {
//       res.status(404).json({ error: "Car details not found" });
//       return;
//     }

//     // Email content
//     const mailOptions = {
//       from: "rajvirsinhdabhi1@gmail.com",
//       to: user.email,
//       subject: "Inspection Rescheduled Confirmation",
//       html: `
//         <h2>Inspection Rescheduled</h2>
//         <p>Dear ${user.name},</p>
//         <p>Your car inspection has been successfully rescheduled.</p>
//         <p><strong>Car Details:</strong></p>
//         <ul>
//           <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
//           <li><strong>Year:</strong> ${car.year}</li>
//           <li><strong>Fuel Type:</strong> ${car.fuel}</li>
//           <li><strong>Transmission:</strong> ${car.transmission}</li>
//           <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
//         </ul>
//         <p><strong>New Inspection Date:</strong> ${inspection.inspectionDate}</p>
//         <p><strong>New Location:</strong> ${inspection.location}</p>
//         <p><strong>Status:</strong> ${inspection.status}</p>
//         <p>Thank you for using our service.</p>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.json({
//       message: "Inspection rescheduled successfully. Confirmation email sent.",
//       inspection,
//     });
//   } catch (error) {
//     console.error("Reschedule Inspection Error:", error);
//     res.status(500).json({ error: "Server error", details: (error as Error).message });
//   }
// };

export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: "User authentication failed." });
      return;
    }

    // Fetch all inspections for the logged-in user, populating car details
    const appointments = await InspectionModel.find({
      userId: req.user.id,
    }).populate("carId");

    if (!appointments.length) {
      res.status(404).json({ error: "No appointments found." });
      return;
    }

    res.json({
      message: "User appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    console.error("Get User Appointments Error:", error);
    res
      .status(500)
      .json({ error: "Server error", details: (error as Error).message });
  }
};
export const getAllInspections = async (req: Request, res: Response) => {
  try {
    const inspection = await InspectionModel.find()
      .populate({
        path: "userId",
        select: "name email contact", // Fetch only required fields
      })
      .populate("carId") // Fetch car details
      .exec();

    if (!inspection.length) {
      res.status(404).json({ message: "No inspections found." });
      return;
    }

    res.status(200).json({ inspection });
  } catch (error) {
    console.error("Error fetching inspections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const countPendingInspections = async (req: Request, res: Response) => {
  try {
    const pendingInspectionsCount = await InspectionModel.countDocuments({
      status: { $regex: /^pending$/i },
    });

    res.status(200).json({ pendingInspectionsCount });
  } catch (error) {
    console.error("Error counting pending inspections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const ByAdminrescheduleInspection = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
       res.status(401).json({ error: "User authentication failed." });
       return;
    }

    const isAdmin = req.user.role === "admin";
    const { inspectionId } = req.params;
    const { newInspectionDate, newLocation, status, finalPrice } = req.body;

    if (!inspectionId || !newInspectionDate || !newLocation) {
       res.status(400).json({
        error: "Inspection ID, new date, and new location are required",
      });
      return;
    }

    const inspection = await InspectionModel.findById(inspectionId);
    if (!inspection) {
       res.status(404).json({ error: "Inspection not found" });
       return;
    }

    if (inspection.userId.toString() !== req.user.id && !isAdmin) {
       res.status(403).json({
        error: "You do not have permission to update this inspection.",
      });
      return;
    }

    // Update fields
    inspection.inspectionDate = new Date(newInspectionDate).toISOString().split("T")[0];
    inspection.location = newLocation;
    inspection.status = status || inspection.status;

    if (finalPrice !== undefined) {
      inspection.finalPrice = finalPrice;
    }

    // ✅ Upload PDF if provided
    if (req.file) {
      console.log("🧾 Uploading file:", req.file.originalname);
      const pdfUrl = await uploadToVercelBlob(req.file.buffer, req.file.originalname);
      inspection.inspectionReport = pdfUrl;
    }

    await inspection.save();

    // Send email notification
    const [user, car] = await Promise.all([
      User.findById(inspection.userId),
      EstimateModel.findById(inspection.carId),
    ]);

    if (!user || !user.email) {
       res.status(404).json({ error: "User email not found" });
       return;
    }

    if (!car) {
       res.status(404).json({ error: "Car details not found" });
       return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rajvirsinhdabhi1@gmail.com",
        pass: process.env.EMAIL_PASSWORD, // secure in .env
      },
    });

    const mailOptions = {
      from: "rajvirsinhdabhi1@gmail.com",
      to: user.email,
      subject: "Inspection Rescheduled Confirmation",
      html: `
        <h2>Inspection Rescheduled</h2>
        <p>Dear ${user.name},</p>
        <p>Your car inspection has been successfully rescheduled.</p>
        <p><strong>Car:</strong> ${car.brand} ${car.model} (${car.year})</p>
        <p><strong>New Date:</strong> ${inspection.inspectionDate}</p>
        <p><strong>Location:</strong> ${inspection.location}</p>
        <p><strong>Status:</strong> ${inspection.status}</p>
        ${inspection.finalPrice ? `<p><strong>Final Price:</strong> ₹${inspection.finalPrice}</p>` : ""}
        <p>Thank you for choosing Carvista.</p>
      `,
    };

    transporter.sendMail(mailOptions).catch(err =>
      console.error("Error sending email:", err)
    );

    res.json({
      message: "Inspection rescheduled successfully. Confirmation email sent.",
      inspection,
    });

  } catch (error) {
    console.error("Reschedule Inspection Error:", error);
    res.status(500).json({ error: "Server error", details: (error as Error).message });
  }
};
// export const ByAdminrescheduleInspection = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     if (!req.user?.id) {
//       res.status(401).json({ error: "User authentication failed." });
//       return;
//     }

//     const isAdmin = req.user?.role === "admin";
//     const { inspectionId } = req.params;
//     const { newInspectionDate, newLocation, status, finalPrice } = req.body;

//     if (!inspectionId || !newInspectionDate || !newLocation) {
//       res.status(400).json({
//         error: "Inspection ID, new date, and new location are required",
//       });
//       return;
//     }

//     const inspection = await InspectionModel.findById(inspectionId);
//     if (!inspection) {
//       res.status(404).json({ error: "Inspection not found" });
//       return;
//     }

//     if (inspection.userId.toString() !== req.user.id && !isAdmin) {
//       res.status(403).json({
//         error: "You do not have permission to update this inspection.",
//       });
//       return;
//     }

//     // Update fields
//     inspection.inspectionDate = new Date(newInspectionDate)
//       .toISOString()
//       .split("T")[0];
//     inspection.location = newLocation;
//     inspection.status = status || inspection.status;

//     if (finalPrice !== undefined) {
//       inspection.finalPrice = finalPrice;
//     }

//     // 🔽 Handle PDF file upload if exists
   
//     // if (req.file) {
//     //   const pdfUrl = await uploadToCloudinary(req.file.buffer);
//     //   inspection.inspectionReport = pdfUrl;
//     // }
// if (req.file) {
//   console.log("🧾 File metadata:", {
//     originalname: req.file?.originalname,
//     mimetype: req.file?.mimetype,
//     size: req.file?.size,
//     first10Bytes: req.file?.buffer?.subarray(0, 10).toString("hex"),
//   });

//   const pdfUrl = await uploadToCloudinary(req.file.buffer);
//   inspection.inspectionReport = pdfUrl;
// }

//     await inspection.save();

//     // Fetch user and car info
//     const [user, car] = await Promise.all([
//       User.findById(inspection.userId),
//       EstimateModel.findById(inspection.carId),
//     ]);

//     if (!user || !user.email) {
//       res.status(404).json({ error: "User email not found" });
//       return;
//     }

//     if (!car) {
//       res.status(404).json({ error: "Car details not found" });
//       return;
//     }

//     // Email content
//     const mailOptions = {
//       from: "rajvirsinhdabhi1@gmail.com",
//       to: user.email,
//       subject: "Inspection Rescheduled Confirmation",
//       html: `
//         <h2>Inspection Rescheduled</h2>
//         <p>Dear ${user.name},</p>
//         <p>Your car inspection has been successfully rescheduled.</p>
//         <p><strong>Car Details:</strong></p>
//         <ul>
//           <li><strong>Car Name:</strong> ${car.brand} ${car.model}</li>
//           <li><strong>Year:</strong> ${car.year}</li>
//           <li><strong>Fuel Type:</strong> ${car.fuel}</li>
//           <li><strong>Transmission:</strong> ${car.transmission}</li>
//           <li><strong>Kilometers Driven:</strong> ${car.kmdriven}</li>
//         </ul>
//         <p><strong>New Inspection Date:</strong> ${
//           inspection.inspectionDate
//         }</p>
//         <p><strong>New Location:</strong> ${inspection.location}</p>
//         <p><strong>Status:</strong> ${inspection.status}</p>
//         ${
//           inspection.finalPrice !== undefined
//             ? `<p><strong>Final Price Offered:</strong> ₹${inspection.finalPrice}</p>`
//             : ""
//         }
//         <p>Thank you for using our service.</p>
//       `,
//     };

//     transporter.sendMail(mailOptions).catch((emailError) => {
//       console.error("Error sending email:", emailError);
//     });

//     res.json({
//       message: "Inspection rescheduled successfully. Confirmation email sent.",
//       inspection,
//     });
//   } catch (error) {
//     console.error("Reschedule Inspection Error:", error);
//     res
//       .status(500)
//       .json({ error: "Server error", details: (error as Error).message });
//   }
// };
