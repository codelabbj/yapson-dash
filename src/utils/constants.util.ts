import dotenv from "dotenv";
dotenv.config();

const baseUrl = process.env.BASE_URL;

const AppConstants = {
  baseUrl: `${baseUrl}l`,
};

export default AppConstants;
