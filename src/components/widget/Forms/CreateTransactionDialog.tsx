import { FC, useState, useEffect } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import AppSelect from "../Form/Select";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import { ArrowRightLeft, Smartphone, Phone, Globe } from "lucide-react";

import api from "@/utils/api.util";
import useInterfaceStore from "@/store/useInterface.store";

interface CreateTransactionDialogProps {
  id: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

interface FormData {
  typeTrans: string;
  amount: string;
  userAppId: string;
  phoneNumber: string;
  networkId: string;
  appId: string;
}

interface FormErrors {
  typeTrans?: string;
  amount?: string;
  userAppId?: string;
  phoneNumber?: string;
  networkId?: string;
  appId?: string;
}

interface Network {
  id: number;
  name: string;
  public_name: string;
  placeholder: string;
  enable: boolean;
}

interface App {
  id: string;
  name: string;
  public_name: string;
  is_active: boolean;
}

const CreateTransactionDialog: FC<CreateTransactionDialogProps> = ({ 
  id, 
  onClose, 
  onSuccess 
}) => {
  const [processing, setProcessing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    typeTrans: "",
    amount: "",
    userAppId: "",
    phoneNumber: "",
    networkId: "",
    appId: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [networks, setNetworks] = useState<Network[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const setActionResultMessage = useInterfaceStore((state) => state.setActionResultMessage);

  const transactionTypes = [
    { name: "Dépôt", value: "deposit" },
    { name: "Retrait", value: "withdraw" },
  ];

  // Fetch networks and apps on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch networks
        const networksResponse = await api.get<Network[]>("/network/");
        setNetworks(networksResponse.filter(network => network.enable));

        // Fetch apps
        const appsResponse = await api.get<App[]>("/app_name");
        setApps(appsResponse.filter(app => app.is_active));
      } catch (error) {
        console.error("Error fetching data:", error);
        setActionResultMessage("Erreur lors du chargement des données");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [setActionResultMessage]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.typeTrans) {
      errors.typeTrans = "Le type de transaction est requis";
    }

    if (!formData.amount) {
      errors.amount = "Le montant est requis";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = "Le montant doit être un nombre positif";
    }

    if (!formData.userAppId) {
      errors.userAppId = "L'identifiant utilisateur est requis";
    }

    if (!formData.appId) {
      errors.appId = "L'application est requise";
    }

    if (formData.typeTrans === "withdraw") {
      if (!formData.phoneNumber) {
        errors.phoneNumber = "Le numéro de téléphone est requis pour les retraits";
      }
      if (!formData.networkId) {
        errors.networkId = "Le réseau est requis pour les retraits";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };



  const resetForm = () => {
    setFormData({
      typeTrans: "",
      amount: "",
      userAppId: "",
      phoneNumber: "",
      networkId: "",
      appId: "",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const payload: any = {
        app_id: formData.appId,
        user_app_id: formData.userAppId,
        amount: formData.amount,
      };

      // Add withdraw-specific fields
      if (formData.typeTrans === "withdraw") {
        payload.phone_number = formData.phoneNumber;
        payload.network_id = formData.networkId;
        payload.type_trans = "withdraw";
      }

      const response = await api.post("/admin-transaction", payload);
      
      setActionResultMessage(
        `Transaction ${formData.typeTrans === "deposit" ? "de dépôt" : "de retrait"} créée avec succès`
      );
      
      resetForm();
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      setActionResultMessage(
        `Erreur lors de la création de la transaction: ${
          error.response?.data?.message || error.message || "Erreur inconnue"
        }`
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      id={id}
      onClose={() => {
        resetForm();
        if (onClose) onClose();
      }}
    >
      <div className="dark:border-strokedark">
        <h2 className="mb-6 text-xl font-bold text-black dark:text-white">
          Créer une nouvelle transaction
        </h2>
        
                 {loadingData ? (
           <div className="flex justify-center py-8">
             <ProcessingLoader />
           </div>
         ) : (
           <form onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div className="mb-4">
            <AppSelect
              id="typeTrans"
              name="typeTrans"
              label="Type de transaction"
              items={transactionTypes}
              value={formData.typeTrans}
              onChange={handleInputChange}
              icon={
                <ArrowRightLeft
                  className="text-black dark:text-white"
                  size={25}
                />
              }
            />
            {formErrors.typeTrans && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.typeTrans}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <AppInput
              label="Montant"
              id="amount"
              name="amount"
              type="number"
              placeholder="500"
              value={formData.amount}
              onChange={handleInputChange}
            />
            {formErrors.amount && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.amount}
              </p>
            )}
          </div>

                     {/* App Selection */}
           <div className="mb-4">
             <AppSelect
               id="appId"
               name="appId"
               label="Application"
               items={apps.map(app => ({
                 name: app.public_name || app.name,
                 value: app.id
               }))}
               value={formData.appId}
               onChange={handleInputChange}
               icon={
                 <Globe
                   className="text-black dark:text-white"
                   size={25}
                 />
               }
             />
             {formErrors.appId && (
               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                 {formErrors.appId}
               </p>
             )}
           </div>

           {/* User App ID */}
           <div className="mb-4">
             <AppInput
               label="Identifiant utilisateur"
               id="userAppId"
               name="userAppId"
               type="text"
               placeholder="1169584483"
               value={formData.userAppId}
               onChange={handleInputChange}
               icon={
                 <Smartphone
                   className="text-black dark:text-white"
                   size={25}
                 />
               }
             />
             {formErrors.userAppId && (
               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                 {formErrors.userAppId}
               </p>
             )}
           </div>

          {/* Withdraw-specific fields */}
          {formData.typeTrans === "withdraw" && (
            <>
                             {/* Phone Number */}
               <div className="mb-4">
                 <AppInput
                   label="Numéro de téléphone"
                   id="phoneNumber"
                   name="phoneNumber"
                   type="text"
                   placeholder="0122323213"
                   value={formData.phoneNumber}
                   onChange={handleInputChange}
                   icon={
                     <Phone
                       className="text-black dark:text-white"
                       size={25}
                     />
                   }
                 />
                 {formErrors.phoneNumber && (
                   <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                     {formErrors.phoneNumber}
                   </p>
                 )}
               </div>

                             {/* Network */}
               <div className="mb-4">
                 <AppSelect
                   id="networkId"
                   name="networkId"
                   label="Réseau"
                   items={networks.map(network => ({
                     name: network.public_name,
                     value: network.id.toString()
                   }))}
                   value={formData.networkId}
                   onChange={handleInputChange}
                   icon={
                     <Phone
                       className="text-black dark:text-white"
                       size={25}
                     />
                   }
                 />
                 {formErrors.networkId && (
                   <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                     {formErrors.networkId}
                   </p>
                 )}
               </div>
            </>
          )}

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name="Créer la transaction"
                type="submit"
                onClick={() => {}}
              />
            )}
                     </div>
         </form>
         )}
       </div>
     </Modal>
   );
 };

export default CreateTransactionDialog;
