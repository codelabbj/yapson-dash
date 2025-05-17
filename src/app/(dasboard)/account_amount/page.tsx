// "use client";

// import React, { useEffect, useState } from "react";
// import { ChevronDown, Wallet2Icon } from "lucide-react";
// import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
// import CardDataStats from "@/components/CardDataStats";
// import api from "@/utils/api.util";
// import AppSelect from "@/components/widget/Form/Select";

// // Define types for the Barkapay account data
// type AccountData = {
//   label: string;
//   balance: number;
// };

// type BarkapayAccountData = {
//   BFA: AccountData[];
//   CIV: AccountData[];
//   SEN: AccountData[];
// };

// // Define country labels for display
// const countryLabels = {
//   BFA: "Burkina Faso",
//   CIV: "Côte d'Ivoire",
//   SEN: "Sénégal"
// };

// const BarkapayAccount: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [barkapayData, setBarkapayData] = useState<BarkapayAccountData | null>(null);
  
//   // Filter state for countries
//   const [selectedCountry, setSelectedCountry] = useState<string>("all");
  
//   // Create array of countries for the filter dropdown
//   const countries = [
//     { value: "all", name: "Tous les pays" },
//     { value: "BFA", name: countryLabels.BFA },
//     { value: "CIV", name: countryLabels.CIV },
//     { value: "SEN", name: countryLabels.SEN }
//   ];

//   const fetchBarkapayAccount = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("https://api.yapson.net/yapson/barkapay-account");
//       setBarkapayData(response);
//     } catch (error) {
//       console.error("Error occurs when trying to fetch Barkapay account data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBarkapayAccount();
//   }, []);

//   // Helper function to get the appropriate currency code for each country
//   const getCurrencyCode = (countryCode: string): string => {
//     switch (countryCode) {
//       case "BFA":
//         return "XOF";
//       case "CIV":
//         return "XOF";
//       case "SEN":
//         return "XOF";
//       default:
//         return "XOF";
//     }
//   };

//   // Function to render account cards based on country filter
//   const renderAccountCards = () => {
//     if (!barkapayData) return null;

//     // Create a filtered list of countries to display
//     const countriesToDisplay = selectedCountry === "all" 
//       ? Object.keys(barkapayData) 
//       : [selectedCountry];

//     return (
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7.5">
//         {countriesToDisplay.map(countryCode => (
//           barkapayData[countryCode as keyof BarkapayAccountData].map((account, index) => (
//             <CardDataStats
//               key={`${countryCode}-${account.label}-${index}`}
//               title={`${countryLabels[countryCode as keyof typeof countryLabels]} - ${account.label.charAt(0).toUpperCase() + account.label.slice(1)}`}
//               total={`${account.balance} ${getCurrencyCode(countryCode)}`}
//             >
//               <Wallet2Icon className="fill-primary dark:fill-white" />
//             </CardDataStats>
//           ))
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center">
//         <span className="mb-5 font-medium text-boxdark dark:text-white">
//           Comptes Barkapay
//         </span>

//         <div className="my-6 flex items-center justify-center">
//           <span className="mr-5 font-medium text-boxdark dark:text-white">
//             Filtre par pays:
//           </span>
//           <AppSelect
//             id="country"
//             name="country"
//             items={countries}
//             icon={<ChevronDown />}
//             value={countries.find(c => c.value === selectedCountry)?.name || "Tous les pays"}
//             onChange={setSelectedCountry}
//           />
//         </div>

//         {loading ? (
//           <ProcessingLoader />
//         ) : (
//           renderAccountCards()
//         )}
//       </div>

//       <div className="mt-8 flex justify-center">
//         <button
//           onClick={fetchBarkapayAccount}
//           className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
//         >
//           Actualiser les données
//         </button>
//       </div>
//     </>
//   );
// };

// export default BarkapayAccount;


"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Wallet2Icon } from "lucide-react";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import CardDataStats from "@/components/CardDataStats";
import api from "@/utils/api.util";
import AppSelect from "@/components/widget/Form/Select";

// Define types for the Barkapay account data
type AccountData = {
  label: string;
  balance: number;
};

type BarkapayAccountData = {
  BFA: AccountData[];
  CIV: AccountData[];
  SEN: AccountData[];
};

// Define country labels for display
const countryLabels = {
  BFA: "Burkina Faso",
  CIV: "Côte d'Ivoire",
  SEN: "Sénégal"
};

// Define a type for the country filter items
type CountryFilterItem = {
  value: string;
  name: string;
};

const BarkapayAccount: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [barkapayData, setBarkapayData] = useState<BarkapayAccountData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state for countries
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  
  // Create array of countries for the filter dropdown
  const countries: CountryFilterItem[] = [
    { value: "all", name: "Tous les pays" },
    { value: "BFA", name: countryLabels.BFA },
    { value: "CIV", name: countryLabels.CIV },
    { value: "SEN", name: countryLabels.SEN }
  ];
  
  // Handler for country selection changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const fetchBarkapayAccount = async () => {
    setError(null);
    try {
      setLoading(true);
      // Replace {{base_url}} with the actual base URL for your API
      const response = await api.get("https://api.yapson.net/yapson/barkapay-account");
      
      console.log("API Response:", response); // Add logging to see the actual response
      
      // Ensure we have valid data structure before setting state
      if (response && typeof response === 'object') {
        // Cast the response to the correct type
        setBarkapayData(response as BarkapayAccountData);
      } else {
        console.error("Invalid API response format:", response);
        setError("Format de réponse API invalide");
        // Initialize with empty data structure to prevent mapping errors
        setBarkapayData({ BFA: [], CIV: [], SEN: [] });
      }
    } catch (error) {
      console.error("Error occurs when trying to fetch Barkapay account data:", error);
      setError("Erreur lors de la récupération des données");
      // Initialize with empty data structure in case of error
      setBarkapayData({ BFA: [], CIV: [], SEN: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarkapayAccount();
  }, []);

  // Helper function to get the appropriate currency code for each country
  const getCurrencyCode = (countryCode: string): string => {
    switch (countryCode) {
      case "BFA":
        return "XOF";
      case "CIV":
        return "XOF";
      case "SEN":
        return "XOF";
      default:
        return "XOF";
    }
  };

  // Function to render account cards based on country filter
  const renderAccountCards = () => {
    if (!barkapayData) return null;
    
    console.log("Rendering with data:", barkapayData); // Add logging for debugging

    // Create a filtered list of countries to display
    const countriesToDisplay = selectedCountry === "all" 
      ? Object.keys(barkapayData) 
      : [selectedCountry];
    
    console.log("Countries to display:", countriesToDisplay); // Log countries being displayed

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7.5">
        {countriesToDisplay.map(countryCode => {
          // Check if the country data exists and is an array before mapping
          const countryData = barkapayData[countryCode as keyof BarkapayAccountData];
          console.log(`Data for ${countryCode}:`, countryData); // Log data for each country
          
          if (!countryData || !Array.isArray(countryData)) {
            console.log(`No valid data for ${countryCode}`); // Log when country has no valid data
            return null;
          }
          
          return countryData.map((account, index) => (
            <CardDataStats
              key={`${countryCode}-${account.label}-${index}`}
              title={`${countryLabels[countryCode as keyof typeof countryLabels] || countryCode} - ${account.label.charAt(0).toUpperCase() + account.label.slice(1)}`}
              total={`${account.balance} ${getCurrencyCode(countryCode)}`}
            >
              <Wallet2Icon className="fill-primary dark:fill-white" />
            </CardDataStats>
          ));
        })}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <span className="mb-5 font-medium text-boxdark dark:text-white">
          Comptes Barkapay
        </span>

        <div className="my-6 flex items-center justify-center">
          <span className="mr-5 font-medium text-boxdark dark:text-white">
            Filtre par pays:
          </span>
          <AppSelect
            id="country"
            name="country"
            items={countries}
            icon={<ChevronDown />}
            value={countries.find(c => c.value === selectedCountry)?.name || "Tous les pays"}
            onChange={handleCountryChange}
          />
        </div>

        {loading ? (
          <ProcessingLoader />
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <p className="mt-2 text-sm">Vérifiez la console pour plus de détails</p>
          </div>
        ) : !barkapayData || Object.keys(barkapayData).length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Aucune donnée disponible</p>
          </div>
        ) : (
          renderAccountCards()
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchBarkapayAccount}
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
        >
          Actualiser les données
        </button>
      </div>
      
      {/* Add debug section in development */}
      {/* {process.env.NODE_ENV !== 'production' && barkapayData && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="mb-2 text-lg font-semibold">Debug Data:</h3>
          <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs">
            {JSON.stringify(barkapayData, null, 2)}
          </pre>
        </div>
      )} */}
    </>
  );
};

export default BarkapayAccount;