
import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Network from "@/models/network.model";
import useNetworkForm from "@/hooks/forms/useNetworkForm.hook";
// Extended type for NetworkFormData
interface NetworkFormData {
  name: string;
  public_name: string;
  placeholder: string;
  message_init: string;
  country_code: string;
  indication: string;
  image: string;
  deposit_api: string;
  withdrawal_api: string;
  [key: string]: string;
}
import AppSelect from "../Form/Select";
import { ChevronDown } from "lucide-react";
import CountrySelector from "../Form/country/selector";
import { getCountryCode } from "../Form/country/utils";
import { COUNTRIES } from "../Form/country/country";
import { SelectMenuOption } from "../Form/country/types";
import axios from "axios";

interface NetworkFormProps {
  id: string;
  network?: Network;
}

const networksList = [
  ["mtn", "MTN"],
  ["moov", "MOOV"],
  ["card", "Cart"],
  ["sbin", "Celtis"],
  ["orange", "Orange"],
  ["wave", "Wave"],
];

const API_CHOICES = [
  ["bpay", "BPAY"],
  ["bizao", "Bizao"],
  ["barkapay", "BarkaPay"],
];

const NetworkForm: FC<NetworkFormProps> = ({ id, network }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    //onFormSubmit: originalOnFormSubmit,
    onFormSubmit,
    onInputDataSelectChange,
    setFormData,
  } = useNetworkForm(id, network);
  
  // Initialize deposit_api and withdrawal_api if they don't exist in formData
  useEffect(() => {
    if (!formData.deposit_api || !formData.withdrawal_api) {
      setFormData({
        ...formData,
        deposit_api: formData.deposit_api || (network?.deposit_api || 'bpay'),
        withdrawal_api: formData.withdrawal_api || (network?.withdrawal_api || 'bpay'),
        otp_required: formData.otp_required ?? (network?.otp_required || false), // Initialize otp_required
      });
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  // Enhanced form submit handler to make the API call
  // const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
    
  //   try {
  //     // If this is an update operation (network exists)
  //     if (network?.id) {
  //       const networkId = network.id;
  //       const endpoint = `https://api.yapson.net/yapson/network/${networkId}/`;
        
  //       // Prepare the payload
  //       const payload = {
  //         name: formData.name,
  //         image: formData.image,
  //         placeholder: formData.placeholder,
  //         public_name: formData.public_name,
  //         country_code: formData.country_code,
  //         indication: formData.indication,
  //         message_init: formData.message_init,
  //         deposit_api: formData.deposit_api,
  //         withdrawal_api: formData.withdrawal_api
  //       };
        
  //       // Make the PATCH request
  //       await axios.patch(endpoint, payload);
  //     }
      
  //     // Call the original form submit handler for other functionality
  //     originalOnFormSubmit(e);
  //   } catch (error) {
  //     console.error("Error updating network:", error);
  //     // Handle the error appropriately
  //   }
  // };

  return (
    <Modal
      id={id}
      onClose={() => {
        resetFormData();
        resetFormErrors();
      }}
    >
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <div className="mb-4">
            <AppSelect
              id="name"
              name="name"
              label="Réseau"
              items={networksList.map((e) => {
                return {
                  name: e[1],
                  value: e[0],
                };
              })}
              icon={<ChevronDown />}
              value={formData.name}
              onChange={onInputDataSelectChange}
            />
            {formErrors.name && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Nom"
              id="public_name"
              name="public_name"
              type="text"
              placeholder=""
              value={formData.public_name}
              onChange={onInputDataChange}
            />
            {formErrors.public_name && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.public_name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Exemple de numéro"
              id="placeholder"
              name="placeholder"
              type="text"
              placeholder=""
              value={formData.placeholder}
              onChange={onInputDataChange}
            />
            {formErrors.placeholder && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.placeholder}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Message d'initialisation"
              id="message_init"
              name="message_init"
              type="text"
              placeholder=""
              value={formData.message_init}
              onChange={onInputDataChange}
            />
          </div>

         

          <div className="mb-4">
            <CountrySelector
              id={"countries"}
              open={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
              onChange={async (val) => {
                setFormData({
                  ...formData,
                  country_code: val.toLowerCase(),
                  indication: ((await getCountryCode(val)) as string).replace(
                    "+",
                    "",
                  ),
                });
                console.log(" formData => ", {
                  ...formData,
                  country_code: val.toLowerCase(),
                  indication: ((await getCountryCode(val)) as string).replace(
                    "+",
                    "",
                  ),
                });
                // formData.country_code = val;
                // formData.indication = ((await getCountryCode(val)) as string).replace("+", "");
              }}
              // We use this type assertion because we are always sure this find will return a value but need to let TS know since it could technically return null
              selectedValue={
                COUNTRIES.find(
                  (option) =>
                    option.value ===
                    (formData.country_code.toUpperCase().length
                      ? formData.country_code.toUpperCase()
                      : "BJ"),
                ) as SelectMenuOption
              }
            />
            {formErrors.country_code && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.country_code}
              </p>
            )}
          </div>
          <div className="mb-6">
            <AppInput
              label="Image"
              id="image"
              name="image"
              type="file"
              placeholder="Logo"
              value={formData.image}
              onChange={onInputDataChange}
            />
            {formErrors.image && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.image}
              </p>
            )}
          </div>
           {/* New Deposit API Field */}
           <div className="mb-4">
            <AppSelect
              id="deposit_api"
              name="deposit_api"
              label="API de Dépôt"
              items={API_CHOICES.map((e) => {
                return {
                  name: e[1],
                  value: e[0],
                };
              })}
              icon={<ChevronDown />}
              value={formData.deposit_api}
              onChange={onInputDataSelectChange}
            />
            {formErrors.deposit_api && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.deposit_api}
              </p>
            )}
          </div>

          {/* New Withdrawal API Field */}
          <div className="mb-4">
            <AppSelect
              id="withdrawal_api"
              name="withdrawal_api"
              label="API de Retrait"
              items={API_CHOICES.map((e) => {
                return {
                  name: e[1],
                  value: e[0],
                };
              })}
              icon={<ChevronDown />}
              value={formData.withdrawal_api}
              onChange={onInputDataSelectChange}
            />
            {formErrors.withdrawal_api && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdrawal_api}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="otp_required" className="block text-sm font-medium text-black dark:text-white">
              OTP Requis
            </label>
            <input
              id="otp_required"
              name="otp_required"
              type="checkbox"
              checked={formData.otp_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  otp_required: e.target.checked,
                })
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            {formErrors.otp_required && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.otp_required}
              </p>
            )}
          </div>
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${network?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NetworkForm;