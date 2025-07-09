import { Request, Response } from "express";
import { Car  } from "../Model/carModel";
import fs from "fs";
import { fetchCarInfo } from "../Services/carService";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
// ✅ Vercel Blob Token
const BLOB_TOKEN = "vercel_blob_rw_qTDvCQWBTr2XDZfc_c979p8v281nEthSLbfBBBIKUsPCvTy";

// ✅ Upload image buffer to Vercel Blob
async function uploadImageToVercelBlob(buffer: Buffer, originalName: string): Promise<string> {
  const fileExtension = originalName.split(".").pop();
  const uniqueName = `${Date.now()}-${randomUUID()}.${fileExtension}`;

  const blob = await put(uniqueName, buffer, {
    access: "public",
    token: BLOB_TOKEN,
  });

  return blob.url;
}
// ✅ Add a new car

export const addCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      model,
      brand,
      year,
      price,
      status,
      kmdriven,
      fueltype,
      transmission,
      type,
      finalPrice,
      inspectionId,
    } = req.body;

    if (
      !model || !brand || !year || !price || !status ||
      !kmdriven || !fueltype || !transmission || !type || !req.files
    ) {
      res.status(400).json({ message: "All fields and images are required" });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const exteriorimage = files.exteriorimage?.[0]
      ? await uploadImageToVercelBlob(files.exteriorimage[0].buffer, files.exteriorimage[0].originalname)
      : "";

    const interiorimage = files.interiorimage?.[0]
      ? await uploadImageToVercelBlob(files.interiorimage[0].buffer, files.interiorimage[0].originalname)
      : "";

    const tyreimage = files.tyreimage?.[0]
      ? await uploadImageToVercelBlob(files.tyreimage[0].buffer, files.tyreimage[0].originalname)
      : "";

    const newCar = new Car({
      model,
      brand,
      year,
      price,
      status,
      kmdriven,
      fueltype,
      transmission,
      type,
      finalPrice,
      exteriorimage,
      interiorimage,
      tyreimage,
      inspectionId,
    });

    await newCar.save();

    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    console.error("Add Car Error:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
// export const addCar = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { model, brand, year, price, status, kmdriven, fueltype, transmission, type, finalPrice ,inspectionId} = req.body;

//     if (!model || !brand || !year || !price || !status || !kmdriven || !fueltype || !transmission || !type || !req.files) {
//       res.status(400).json({ message: "All fields and images are required" });
//       return;
//     }

//     // Extract uploaded file paths
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     const exteriorimage = files["exteriorimage"]?.[0]?.path || "";
//     const interiorimage = files["interiorimage"]?.[0]?.path || "";
//     const tyreimage = files["tyreimage"]?.[0]?.path || "";

//     // Create a new car entry
//     const newCar = new Car({
//       model,
//       brand,
//       year,
//       price,
//       status,
//       kmdriven,
//       fueltype,
//       transmission,
//       type,
//       finalPrice, // ✅ Add finalPrice if provided
//       exteriorimage,
//       interiorimage,
//       tyreimage,
//       inspectionId
//     });

//     await newCar.save();
//     res.status(201).json({ message: "Car added successfully", car: newCar });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: (error as Error).message });
//   }
// };


// 🟢 Delete car by ID (Admin)
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    // Delete images from storage
    const images = [car.exteriorimage, car.interiorimage, car.tyreimage];
    images.forEach((imagePath) => {
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};


// 🟢 Get all cars
export const getCars = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
export const getCountTotalCars = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalCars = await Car.countDocuments();
    res.json({ totalCars });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
// 🟢 Get car by ID
export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

//get estimate car using id
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const carId = req.params.id;
    const {
      model,
      brand,
      year,
      price,
      status,
      kmdriven,
      fueltype,
      transmission,
      type,
      finalPrice,
      inspectionId
    } = req.body;

    // Find the existing car
    const existingCar = await Car.findById(carId);
    if (!existingCar) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    // Update fields
    existingCar.model = model || existingCar.model;
    existingCar.brand = brand || existingCar.brand;
    existingCar.year = year ? Number(year) : existingCar.year;
    existingCar.price = price || existingCar.price;
    existingCar.status = status || existingCar.status;
    existingCar.kmdriven = kmdriven || existingCar.kmdriven;
    existingCar.fueltype = fueltype || existingCar.fueltype;
    existingCar.transmission = transmission || existingCar.transmission;
    existingCar.type = type || existingCar.type;
    existingCar.finalPrice = finalPrice || existingCar.finalPrice;
    existingCar.inspectionId = inspectionId || existingCar.inspectionId;

    // Update images if new ones are uploaded
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.["exteriorimage"]?.[0]) {
      existingCar.exteriorimage = files["exteriorimage"][0].path;
    }
    if (files?.["interiorimage"]?.[0]) {
      existingCar.interiorimage = files["interiorimage"][0].path;
    }
    if (files?.["tyreimage"]?.[0]) {
      existingCar.tyreimage = files["tyreimage"][0].path;
    }

    await existingCar.save();
    res.status(200).json({ message: "Car updated successfully", car: existingCar });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

//Search
export const searchCar = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: "Query parameter is required" });
    return;
  }

  try {
    const cars = await Car.find({
      $or: [
        { brand: { $regex: query, $options: "i" } },
        { model: { $regex: query, $options: "i" } },
        { fuelType: { $regex: query, $options: "i" } },
      ],
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

export const getCarInfo = async (req: Request, res: Response): Promise<void> => {
  const regNumber = req.params.regNumber;
  console.log("📥 Incoming Reg Number:", regNumber);

  try {
    const carInfo = await fetchCarInfo(regNumber);
    console.log("✅ Car Info Retrieved:", carInfo);
    res.status(200).json(carInfo);
  } catch (error: any) {
    console.error("❌ Error in controller:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to get car info" });
  }
};

// Add Multiple cars
export const duplicate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      model,
      brand,
      year,
      price,
      finalPrice,
      status,
      kmdriven,
      fueltype,
      transmission,
      type,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (
      !model ||
      !brand ||
      !year ||
      !price ||
      !finalPrice ||
      !status ||
      !kmdriven ||
      !fueltype ||
      !transmission ||
      !type ||
      !files["exteriorimage"]?.[0] ||
      !files["interiorimage"]?.[0] ||
      !files["tyreimage"]?.[0]
    ) {
      res.status(400).json({ message: "All fields and images are required" });
      return;
    }

    const exteriorimage = files["exteriorimage"][0].path;
    const interiorimage = files["interiorimage"][0].path;
    const tyreimage = files["tyreimage"][0].path;

    const basePrice = parseInt(price, 10);
    const baseFinalPrice = parseInt(finalPrice, 10);
    const baseKmDriven = parseInt(kmdriven, 10);
    const baseYear = parseInt(year, 10);

    const cars = [];

    for (let i = 0; i < 10; i++) {
      const currentPrice = basePrice + i * 20000;
      const currentFinalPrice = baseFinalPrice + i * 20000;
      const currentKmDriven = baseKmDriven + i * 100;

      // Year increases up to 2025 only
      const currentYear = Math.min(baseYear + i, 2025);

      const newCar = new Car({
        model: `${model} `,
        brand,
        year: currentYear,
        price: currentPrice,
        finalPrice: currentFinalPrice,
        status,
        kmdriven: currentKmDriven,
        fueltype,
        transmission,
        type,
        exteriorimage,
        interiorimage,
        tyreimage,
        inspectionId: null,
      });

      cars.push(newCar.save());
    }

    await Promise.all(cars);

    res.status(201).json({ message: "10 cars added with increasing values." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
