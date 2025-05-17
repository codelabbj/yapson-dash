import axios from "axios";

export async function getCountryCode(countryCode: string) {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      const dialCode = response.data[0].idd.root + (response.data[0].idd.suffixes[0] ?? "");
      console.log(`Indicatif de ${countryCode} : ${dialCode} `, response.data);
      return dialCode;
    } catch (error) {
      console.error('Erreur lors de la récupération du code:', error);
    }
  }

export function generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }