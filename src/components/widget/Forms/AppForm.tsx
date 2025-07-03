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
import AppSelect from "../Form/Select";
import { ChevronDown } from "lucide-react";
import CountrySelector from "../Form/country/selector";
import { getCountryCode } from "../Form/country/utils";
import { COUNTRIES } from "../Form/country/country";
import { SelectMenuOption } from "../Form/country/types";
import App from "@/models/app.model";
import useAppForm from "@/hooks/forms/useAppForm.hook";
import Editor from "react-simple-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface AppFormProps {
  id: string;
  app?: App;
}

const AppForm: FC<AppFormProps> = ({ id, app }) => {
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
  } = useAppForm(id, app);

  const [isOpen, setIsOpen] = useState(false);

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
            <AppInput
              label="Nom unique"
              id="name"
              name="name"
              type="text"
              placeholder=""
              value={formData.name}
              onChange={onInputDataChange}
            />
            {formErrors.name && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Hash"
              id="hash"
              name="hash"
              type="text"
              placeholder=""
              value={formData.hash}
              onChange={onInputDataChange}
            />
            {formErrors.hash && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.hash}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Cashdeskid"
              id="cashdeskid"
              name="cashdeskid"
              type="text"
              placeholder=""
              value={formData.cashdeskid}
              onChange={onInputDataChange}
            />
            {formErrors.cashdeskid && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.cashdeskid}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Cashierpass"
              id="cashierpass"
              name="cashierpass"
              type="text"
              placeholder=""
              value={formData.cashierpass}
              onChange={onInputDataChange}
            />
            {formErrors.cashierpass && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.cashierpass}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Description tuto depot
            </label>
            <Editor
              value={formData.deposit_tuto_content}
              placeholder="Processus de depot"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  deposit_tuto_content: e.target.value,
                });
              }}
            />
            {formErrors.deposit_tuto_content && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.deposit_tuto_content}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Lien démo depot"
              id="deposit_link"
              name="deposit_link"
              type="text"
              placeholder=""
              value={formData.deposit_link}
              onChange={onInputDataChange}
            />
            {formErrors.deposit_link && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.deposit_link}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Description tuto retrait
            </label>
            <Editor
              value={formData.withdrawal_tuto_content}
              placeholder="Processus de retrait"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  withdrawal_tuto_content: e.target.value,
                });
              }}
            />
            {formErrors.withdrawal_tuto_content && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdrawal_tuto_content}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Lien démo retrait"
              id="withdrawal_link"
              name="withdrawal_link"
              type="text"
              placeholder=""
              value={formData.withdrawal_link}
              onChange={onInputDataChange}
            />
            {formErrors.withdrawal_link && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdrawal_link}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Ville pour le retrait"
              id="city"
              name="city"
              type="text"
              placeholder=""
              value={formData.city}
              onChange={onInputDataChange}
            />
            {formErrors.city && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.city}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Rue pour le retrait"
              id="street"
              name="street"
              type="text"
              placeholder=""
              value={formData.street}
              onChange={onInputDataChange}
            />
            {formErrors.street && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.street}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Dépôt minimum"
              id="minimun_deposit"
              name="minimun_deposit"
              type="number"
              placeholder=""
              value={formData.minimun_deposit}
              onChange={onInputDataChange}
            />
            {formErrors.minimun_deposit && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.minimun_deposit}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Dépôt maximum"
              id="max_deposit"
              name="max_deposit"
              type="number"
              placeholder=""
              value={formData.max_deposit}
              onChange={onInputDataChange}
            />
            {formErrors.max_deposit && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.max_deposit}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Retrait minimum"
              id="minimun_with"
              name="minimun_with"
              type="number"
              placeholder=""
              value={formData.minimun_with}
              onChange={onInputDataChange}
            />
            {formErrors.minimun_with && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.minimun_with}
              </p>
            )}
          </div>
          <div className="mb-4">
            <AppInput
              label="Retrait maximum"
              id="max_win"
              name="max_win"
              type="number"
              placeholder=""
              value={formData.max_win}
              onChange={onInputDataChange}
            />
            {formErrors.max_win && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.max_win}
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
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${app?.id ? "Mettre à jour" : "Ajouter"}`}
                type="submit"
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AppForm;
