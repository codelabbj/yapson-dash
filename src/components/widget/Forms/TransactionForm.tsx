import { FC, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Transaction from "@/models/transaction.model";
import useTransactionForm, {
  transactionsData,
} from "@/hooks/forms/useTransactionForm";
import AppSelect from "../Form/Select";
import {
  ArrowRightLeft,
  ChartNoAxesColumnIncreasing,
  Smartphone,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AppPhoneInput from "../Form/PhoneInput";
import useTransactionStore from "@/store/useTransaction.store";

interface TransactionFormProps {
  id: string;
  transaction?: Transaction;
}

const TransactionForm: FC<TransactionFormProps> = ({ id, transaction }) => {
  const {
    processing,
    // formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onPhoneNumberChange,
    onFormSubmit,
  } = useTransactionForm(id, transaction);

  // const { transactionsApps, error } = useTransactionStore();

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
          {
            <div className="mb-6">
              <AppInput
                label="Référence"
                id="reference"
                name="reference"
                type="text"
                placeholder="YihTYhUiKHG"
                // value={formData.reference}
                onChange={onInputDataChange}
              />
              {formErrors.reference && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.reference}
                </p>
              )}
            </div>
          }
          {/*{(
            <div className="mb-4">
              <AppInput
                label="Montant"
                id="amount"
                name="amount"
                type="text"
                placeholder="Montant"
                value={formData.amount}
                onChange={onInputDataChange}
              />
              {formErrors.amount && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.amount}
                </p>
              )}
            </div>
          )}*/}

          {/*<div className="mb-4">
            <AppSelect
              id="typeTrans"
              name="typeTrans"
              label="Transaction"
              items={transactionsData.types}
              value={formData.typeTrans}
              onChange={onInputDataChange}
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
          </div>*/}

          {/*{formData.typeTrans != "Remboursement Momo" && (
            <div className="mb-4">
              <AppSelect
                id="mobileReference"
                name="mobileReference"
                label="Réseau"
                items={transactionsData.mobileReferences}
                value={formData.mobileReference}
                onChange={onInputDataChange}
                icon={
                  <ChartNoAxesColumnIncreasing
                    className="text-black dark:text-white"
                    size={25}
                  />
                }
              />
              {formErrors.mobileReference && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.mobileReference}
                </p>
              )}
            </div>
          )}

          {formData.typeTrans != "Remboursement Momo" && (
            <div className="mb-6">
              <AppPhoneInput
                label="Téléphone"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="90000000"
                value={formData.phoneNumber}
                onChange={onPhoneNumberChange}
              />

              {formErrors.phoneNumber && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
          )}*/}

          {/* {formData.typeTrans === "Dépôt" && (
            <div className="mb-4">
              <AppSelect
                id="app"
                name="app"
                label="Application"
                items={transactionsApps.map((app) => ({
                  name: app.name,
                  value: app.id ?? "",
                }))}
                value={formData.app ?? ""}
                onChange={onInputDataChange}
                icon={
                  <Smartphone
                    className="text-black dark:text-white"
                    size={25}
                  />
                }
              />
              {formErrors.app && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.app}
                </p>
              )}
            </div>
          )} */}

          {/*{formData.typeTrans == "Dépôt" && (
            <div className="mb-6">
              <AppInput
                label="Identifiant"
                id="userAppId"
                name="userAppId"
                type="text"
                placeholder="1234567890"
                value={formData.userAppId}
                onChange={onInputDataChange}
              />
              {formErrors.userAppId && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.userAppId}
                </p>
              )}
            </div>
          )}*/}

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${transaction?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TransactionForm;
