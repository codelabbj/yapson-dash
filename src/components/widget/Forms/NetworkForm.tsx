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
import { COUNTRIES } from "../Form/country/country";
import { getCountryCode } from "../Form/country/utils";
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
  // ["bizao", "Bizao"],
  // ["barkapay", "BarkaPay"],
  ["pal", "Pal API"],
  ["wave", "Wave"],
  ["connect", "Connect Pro"],
  ["dgs_pay", "DGS Pay"]
];

const NetworkForm: FC<NetworkFormProps> = ({ id, network }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
    onInputDataSelectChange,
    setFormData,
  } = useNetworkForm(id, network);

  const [isOpen, setIsOpen] = useState(false);


  return (
    <Modal
      id={id}
      onClose={() => {
        resetFormData();
        resetFormErrors();
      }}
    >
      <div className="dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <div className="mb-4">
            <AppSelect
              id="country_code"
              name="country_code"
              label="Pays"
              items={COUNTRIES.map((country) => ({
                name: country.title,
                value: country.value.toLowerCase(),
              }))}
              icon={<ChevronDown />}
              value={formData.country_code}
              onChange={async (e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  country_code: val,
                  indication: ((await getCountryCode(val.toUpperCase())) as string).replace(
                    "+",
                    "",
                  ),
                });
              }}
            />
            {formErrors.country_code && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.country_code}
              </p>
            )}
          </div>

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
              onChange={(e) => {
                const newNetworkValue = e.target.value;
                const newFormData = { ...formData, name: newNetworkValue };


                setFormData(newFormData);
              }}
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
            <AppInput
              label="Message de dépôt"
              id="deposit_message"
              name="deposit_message"
              type="text"
              placeholder=""
              value={formData.deposit_message}
              onChange={onInputDataChange}
            />
            {formErrors.deposit_message && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.deposit_message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppInput
              label="Message de retrait"
              id="withdrawal_message"
              name="withdrawal_message"
              type="text"
              placeholder=""
              value={formData.withdrawal_message}
              onChange={onInputDataChange}
            />
            {formErrors.withdrawal_message && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdrawal_message}
              </p>
            )}
          </div>



          <div className="mb-4">
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

          {/* Payment by Link Field - Only show when Connect Pro is selected for deposit API */}
          {formData.deposit_api === "connect" && (
            <div className="mb-4">
              <label htmlFor="payment_by_link" className="block text-sm font-medium text-black dark:text-white">
                Payment par momo
              </label>
              <input
                id="payment_by_link"
                name="payment_by_link"
                type="checkbox"
                checked={formData.payment_by_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_by_link: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {formErrors.payment_by_link && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.payment_by_link}
                </p>
              )}
            </div>
          )}

          {/* New Withdrawal API Field */}
          <div className="mb-4">
            <AppSelect
              id="withdrawal_api"
              name="withdrawal_api"
              label="API de Retrait"
              items={API_CHOICES
                .map((e) => {
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
          <div className="mb-4 flex items-center">
            <label htmlFor="enable" className="mr-2 font-medium text-black dark:text-white">Activer le réseau</label>
            <input
              id="enable"
              name="enable"
              type="checkbox"
              checked={!!formData.enable}
              onChange={e => setFormData({ ...formData, enable: e.target.checked })}
              className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label htmlFor="active_for_deposit" className="mr-2 font-medium text-black dark:text-white">Actif pour dépôt</label>
            <input
              id="active_for_deposit"
              name="active_for_deposit"
              type="checkbox"
              checked={!!formData.active_for_deposit}
              onChange={e => setFormData({ ...formData, active_for_deposit: e.target.checked })}
              className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label htmlFor="active_for_with" className="mr-2 font-medium text-black dark:text-white">Actif pour retrait</label>
            <input
              id="active_for_with"
              name="active_for_with"
              type="checkbox"
              checked={!!formData.active_for_with}
              onChange={e => setFormData({ ...formData, active_for_with: e.target.checked })}
              className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          {/* Payment by USSD Code */}
          <div className="mb-4 flex items-center">
            <label htmlFor="payment_by_ussd_code" className="mr-2 font-medium text-black dark:text-white">Paiement par code USSD</label>
            <input
              id="payment_by_ussd_code"
              name="payment_by_ussd_code"
              type="checkbox"
              checked={!!formData.payment_by_ussd_code}
              onChange={e => setFormData({ ...formData, payment_by_ussd_code: e.target.checked })}
              className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
          </div>

          {/* USSD fields — shown only when payment_by_ussd_code is true */}
          {formData.payment_by_ussd_code && (
            <div className="mb-4 rounded-lg border border-dashed border-stroke p-4 dark:border-strokedark space-y-4">
              <div>
                <AppInput
                  label="Code USSD"
                  id="ussd_code"
                  name="ussd_code"
                  type="text"
                  placeholder="*XXX*X*{amount}#"
                  value={formData.ussd_code as string}
                  onChange={onInputDataChange}
                />
              </div>
              <div>
                <AppInput
                  label="Frais de dépôt (fee_payin)"
                  id="fee_payin"
                  name="fee_payin"
                  type="number"
                  placeholder="0"
                  value={String(formData.fee_payin ?? 0)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fee_payin: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="reduce_fee" className="mr-2 font-medium text-black dark:text-white">Réduire les frais</label>
                <input
                  id="reduce_fee"
                  name="reduce_fee"
                  type="checkbox"
                  checked={!!formData.reduce_fee}
                  onChange={e => setFormData({ ...formData, reduce_fee: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
            </div>
          )}
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${network?.id ? "Mettre à jour" : "Ajouter"}`}
                type="submit"
                onClick={() => { }}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NetworkForm;