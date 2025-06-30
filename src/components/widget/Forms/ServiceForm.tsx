import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import AppSelect from "../Form/Select";
import {
  ArrowRightLeft,
  ChartNoAxesColumnIncreasing,
  GitCommit,
  ServerCog,
  Smartphone,
} from "lucide-react";
import "react-phone-input-2/lib/style.css";
import AppPhoneInput from "../Form/PhoneInput";
import useServiceForm from "@/hooks/forms/useService.hook";
import useTransactionForm, {
  transactionsData,
} from "../../../hooks/forms/useTransactionForm";
import useTransactionStore from "@/store/useTransaction.store";
import useSearchStore from "@/store/useSearchStore.store";
import { TransactionFiterFormData } from "@/interfaces/transaction.interface";
import Service from "@/models/service.model";
import useServiceStore from "@/store/useService.store";
import AppCheckbox from "../Form/Checkbox";

interface ServiceFormProps {
  id: string;
  service?: Service;
}

const ServiceForm: FC<ServiceFormProps> = ({ id, service }) => {
  const {
    formData,
    formErrors,
    resetFormData,
    onStatusChange,
    onInputDataChange,
    onPhoneNumberChange,
    onFormSubmit,
  } = useServiceForm(id, service);

  // const { transactionsApps, transactionsServices } = useServiceStore();

  return (
    <Modal id={id} onClose={() => {}}>
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <div className="mb-4">
            <AppInput
              label="Nom"
              id="name"
              name="name"
              type="text"
              placeholder="Nom"
              value={formData.name}
              onChange={onInputDataChange}
            />
            {formErrors.name && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppInput
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={onInputDataChange}
            />
            {formErrors.email && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.email}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppInput
              label="Code Secret"
              id="secretKey"
              name="secretKey"
              type="password"
              placeholder="*****"
              value={formData.secretKey}
              onChange={onInputDataChange}
            />
            {formErrors.secretKey && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.secretKey}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppPhoneInput
              label="Téléphone"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="90000000"
              value={formData.phone}
              onChange={onPhoneNumberChange}
            />

            {formErrors.phone && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.phone}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppCheckbox
              key={`${formData.isActive}-${new Date().toDateString()}`}
              label="Statut"
              id="isActive"
              name="isActive"
              value={formData.isActive}
              onChange={onStatusChange}
            />
            {formErrors.isActive && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.isActive}
              </p>
            )}
          </div>

          <div className="mb-5">
            <AppButton
              name={` ${service?.id ? "Mettre à jour" : "Ajouter"}`}
              type="submit"
              onClick={() => {}}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ServiceForm;
