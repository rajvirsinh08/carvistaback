import { Request, Response } from "express";
import { Car } from "../Model/carModel";
import { SoldCar } from "../Model/soldCarModel";
// import { Car } from "./CarModel";  // Assuming your Car model is in a separate file
// import { SoldCar } from "./SoldCarModel";  // The SoldCar schema we just created

// API to mark the car as sold and move it to SoldCars collection
export const sellCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params; // Get the car ID from params
    const car = await Car.findById(carId);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    // Calculate the commission (price - finalPrice)
    const price = parseFloat(car.price);
    const finalPrice = car.finalPrice || 0;
    const commission = price - finalPrice;

    // Update the car's status to "sold"
    car.status = "sold";
    await car.save();

    // Create a new SoldCar document
    const soldCar = new SoldCar({
      model: car.model,
      brand: car.brand,
      year: car.year,
      price: car.price,
      finalPrice: car.finalPrice,
      commission,
      kmdriven: car.kmdriven,
      fueltype: car.fueltype,
      transmission: car.transmission,
      type: car.type,
      exteriorimage: car.exteriorimage,
      interiorimage: car.interiorimage,
      tyreimage: car.tyreimage,
      soldDate: new Date(),
    });

    await soldCar.save();
    res.status(200).json({ message: "Car sold successfully", soldCar });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAllSoldCars = async (req: Request, res: Response): Promise<void> => {
    try {
      const soldCars = await SoldCar.find().sort({ soldDate: -1 }); // Sort by latest sold first (optional)
      res.status(200).json(soldCars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sold cars", error: (error as Error).message });
    }
};

// Get total commission from all sold cars
export const getTotalCommission = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await SoldCar.aggregate([
      {
        $group: {
          _id: null,
          totalCommission: { $sum: "$commission" }
        }
      }
    ]);

    const totalCommission = result[0]?.totalCommission || 0;

    res.status(200).json({ totalCommission });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
