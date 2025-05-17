
// "use client";

// import React, { useEffect, useState } from "react";
// import { ChevronDown, Check, AlertTriangle, XCircle, RefreshCcw } from "lucide-react";
// import AppSelect from "@/components/widget/Form/Select";
// import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
// import api from "@/utils/api.util";

// // Define types for the operator data
// type ServiceStatus = "OPERATIONAL" | "UNSTABLE" | "DOWN";

// interface OperatorServices {
//   payment: ServiceStatus;
//   transfer: ServiceStatus;
// }

// interface CountryOperators {
//   [operator: string]: OperatorServices;
// }

// interface OperatorsData {
//   [country: string]: CountryOperators;
// }

// interface SelectItem {
//   name: string;
//   value: string;
// }

// // Status card component to show operator status
// interface StatusCardProps {
//   country: string;
//   operator: string;
//   services: OperatorServices;
// }

// const StatusCard: React.FC<StatusCardProps> = ({ country, operator, services }) => {
//   // Determine icon and color based on status
//   const getStatusDetails = (status: ServiceStatus) => {
//     switch (status) {
//       case "OPERATIONAL":
//         return { 
//           icon: <Check className="h-5 w-5 text-green-500" />,
//           bgColor: "bg-green-100",
//           textColor: "text-green-700"
//         };
//       case "UNSTABLE":
//         return { 
//           icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
//           bgColor: "bg-amber-100",
//           textColor: "text-amber-700"
//         };
//       case "DOWN":
//       default:
//         return { 
//           icon: <XCircle className="h-5 w-5 text-red-500" />,
//           bgColor: "bg-red-100",
//           textColor: "text-red-700"
//         };
//     }
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
//       <div className="mb-4 flex items-center justify-between">
//         <h4 className="text-xl font-semibold text-black dark:text-white">
//           {operator} ({country})
//         </h4>
//       </div>

//       <div className="flex flex-col gap-4">
//         {Object.entries(services).map(([serviceType, status]) => {
//           const { icon, bgColor, textColor } = getStatusDetails(status);
//           return (
//             <div 
//               key={serviceType} 
//               className={`flex items-center justify-between rounded-md ${bgColor} px-4 py-3`}
//             >
//               <div className="flex items-center">
//                 {icon}
//                 <span className={`ml-2 capitalize ${textColor} font-medium`}>
//                   {serviceType}
//                 </span>
//               </div>
//               <span className={`font-semibold ${textColor}`}>
//                 {status}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const OperatorsStatus: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [operatorsData, setOperatorsData] = useState<OperatorsData>({});
//   const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
//   const [countries, setCountries] = useState<SelectItem[]>([]);
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   // Function to fetch operators data
//   const fetchOperatorsData = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("https://api.yapson.net/yapson/barkapay-operator");
//       // Type assertion since we know the expected structure
//       const typedResponse = response as OperatorsData;
//       setOperatorsData(typedResponse);
      
//       // Extract country list
//       const countryList = Object.keys(typedResponse);
//       setCountries([
//         { name: "All Countries", value: "ALL" },
//         ...countryList.map(country => ({ name: country, value: country }))
//       ]);
      
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching operators data:", error);
//       setLoading(false);
//     }
//   };

//   // Function to refresh data
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchOperatorsData();
//     setRefreshing(false);
//   };

//   // Handle country change
//   const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCountry(e.target.value);
//   };

//   useEffect(() => {
//     fetchOperatorsData();
//   }, []);

  
  

//   // Generate filtered data based on selected country
//   const getFilteredData = (): OperatorsData => {
//     if (selectedCountry === "ALL") {
//       return operatorsData;
//     }
    
//     if (selectedCountry in operatorsData) {
//       return { 
//         [selectedCountry]: operatorsData[selectedCountry] 
//       };
//     }
    
//     return {};
//   };

//   return (
//     <>
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-black dark:text-white">
//           Statut des opérateurs
//         </h2>
//         <button
//           onClick={handleRefresh}
//           className="flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90 disabled:bg-opacity-70"
//           disabled={refreshing}
//         >
//           <RefreshCcw className={`mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
//           Rafraîchir
//         </button>
//       </div>

//       <div className="mb-6 flex items-center">
//         <span className="mr-5 font-medium text-boxdark dark:text-white">
//         Pays:
//         </span>
//         <AppSelect
//           id="country"
//           name="country"
//           items={countries}
//           icon={<ChevronDown />}
//           value={countries.find((c) => c.value === selectedCountry)?.name || "All Countries"}
//           onChange={handleCountryChange}
//         />
//       </div>

//       {loading ? (
//         <div className="flex h-96 items-center justify-center">
//           <ProcessingLoader />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-7.5">
//           {Object.entries(getFilteredData()).map(([country, operators]) => (
//             Object.entries(operators).map(([operator, services]) => (
//               <StatusCard 
//                 key={`${country}-${operator}`}
//                 country={country}
//                 operator={operator}
//                 services={services}
//               />
//             ))
//           ))}
//         </div>
//       )}

//       {/* Status Summary */}
//       <div className="mt-8">
//         <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Légende du statut</h3>
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
//               <Check className="h-5 w-5 text-green-500" />
//             </div>
//             <span className="ml-2 font-medium">OPÉRATIONNEL</span>
//           </div>
//           <div className="flex items-center">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
//               <AlertTriangle className="h-5 w-5 text-amber-500" />
//             </div>
//             <span className="ml-2 font-medium">INCAPACITÉ DE FONCTIONNEMENT</span>
//           </div>
//           <div className="flex items-center">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
//               <XCircle className="h-5 w-5 text-red-500" />
//             </div>
//             <span className="ml-2 font-medium">Non opérationnel</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OperatorsStatus;





"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Check, AlertTriangle, XCircle, RefreshCcw } from "lucide-react";
import AppSelect from "@/components/widget/Form/Select";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import api from "@/utils/api.util";

// Définition des types pour les données des opérateurs
type ServiceStatus = "OPERATIONAL" | "UNSTABLE" | "DOWN";

interface OperatorServices {
  payment: ServiceStatus;
  transfer: ServiceStatus;
}

interface CountryOperators {
  [operator: string]: OperatorServices;
}

interface OperatorsData {
  [country: string]: CountryOperators;
}

interface SelectItem {
  name: string;
  value: string;
}

// Composant carte de statut pour afficher l'état de l'opérateur
interface StatusCardProps {
  country: string;
  operator: string;
  services: OperatorServices;
}

const StatusCard: React.FC<StatusCardProps> = ({ country, operator, services }) => {
  // Déterminer l'icône et la couleur en fonction du statut
  const getStatusDetails = (status: ServiceStatus) => {
    switch (status) {
      case "OPERATIONAL":
        return { 
          icon: <Check className="h-5 w-5 text-green-500" />,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          statusText: "OPÉRATIONNEL"
        };
      case "UNSTABLE":
        return { 
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          statusText: "INSTABLE"
        };
      case "DOWN":
      default:
        return { 
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          statusText: "INDISPONIBLE"
        };
    }
  };

  // Traduire les types de service
  const translateServiceType = (type: string) => {
    switch (type) {
      case "payment":
        return "Paiement";
      case "transfer":
        return "Transfert";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {operator} ({country})
        </h4>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(services).map(([serviceType, status]) => {
          const { icon, bgColor, textColor, statusText } = getStatusDetails(status);
          return (
            <div 
              key={serviceType} 
              className={`flex items-center justify-between rounded-md ${bgColor} px-4 py-3`}
            >
              <div className="flex items-center">
                {icon}
                <span className={`ml-2 capitalize ${textColor} font-medium`}>
                  {translateServiceType(serviceType)}
                </span>
              </div>
              <span className={`font-semibold ${textColor}`}>
                {statusText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OperatorsStatus: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [operatorsData, setOperatorsData] = useState<OperatorsData>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [countries, setCountries] = useState<SelectItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fonction pour récupérer les données des opérateurs
  const fetchOperatorsData = async () => {
    try {
      setLoading(true);
      const response = await api.get("https://api.yapson.net/yapson/barkapay-operator");
      // Assertion de type car nous connaissons la structure attendue
      const typedResponse = response as OperatorsData;
      setOperatorsData(typedResponse);
      
      // Extraire la liste des pays
      const countryList = Object.keys(typedResponse);
      setCountries([
        { name: "Tous les pays", value: "ALL" },
        ...countryList.map(country => ({ name: country, value: country }))
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données des opérateurs:", error);
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir les données
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOperatorsData();
    setRefreshing(false);
  };

  // Gérer le changement de pays
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  useEffect(() => {
    fetchOperatorsData();
  }, []);

  // Générer les données filtrées en fonction du pays sélectionné
  const getFilteredData = (): OperatorsData => {
    if (selectedCountry === "ALL") {
      return operatorsData;
    }
    
    if (selectedCountry in operatorsData) {
      return { 
        [selectedCountry]: operatorsData[selectedCountry] 
      };
    }
    
    return {};
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Statut des Opérateurs
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-90 disabled:bg-opacity-70"
          disabled={refreshing}
        >
          <RefreshCcw className={`mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      <div className="mb-6 flex items-center">
        <span className="mr-5 font-medium text-boxdark dark:text-white">
          Pays:
        </span>
        <AppSelect
          id="country"
          name="country"
          items={countries}
          icon={<ChevronDown />}
          value={countries.find((c) => c.value === selectedCountry)?.name || "Tous les pays"}
          onChange={handleCountryChange}
        />
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <ProcessingLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-7.5">
          {Object.entries(getFilteredData()).map(([country, operators]) => (
            Object.entries(operators).map(([operator, services]) => (
              <StatusCard 
                key={`${country}-${operator}`}
                country={country}
                operator={operator}
                services={services}
              />
            ))
          ))}
        </div>
      )}

      {/* Légende des statuts */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Légende des Statuts</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <span className="ml-2 font-medium">OPÉRATIONNEL</span>
          </div>
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <span className="ml-2 font-medium">INSTABLE</span>
          </div>
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <span className="ml-2 font-medium">INDISPONIBLE</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorsStatus;