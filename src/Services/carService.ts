import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface CarInfo {
  // Define the structure based on actual API response
  owner_name: string;
  vehicle_age: string;
  fuel_type: string;
  registration_date: string;
  engine_number: string;
  chassis_number: string;
  model: string;
  maker: string;
  vehicle_class: string;
  insurance_upto: string;
  [key: string]: any; // optional: to allow extra fields without error
}
const fetchCarInfo = async (regNumber: string): Promise<CarInfo> => {
  const options = {
    method: 'POST',
    url: 'https://vehicle-rc-information.p.rapidapi.com/',
    headers: {
      'X-RapidAPI-Key': 'e577f057abmsh63d996e34adda48p11823ejsn386550379333',
      'X-RapidAPI-Host': 'vehicle-rc-information.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: { registrationNo: regNumber }
  };
  

  try {
    console.log("📤 Sending request to RapidAPI with:", options);
    const response = await axios.request(options);
    console.log("✅ Received response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ RapidAPI ERROR RESPONSE:", error.response?.data || error.message);
    throw new Error(`Error fetching car info: ${error.message}`);
  }
};



export { fetchCarInfo };