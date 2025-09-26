import { FC, useEffect, useMemo, useState } from "react";
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
import useTransactionFilterForm from "@/hooks/forms/useTransactionFilter.hook";
import useTransactionForm, {
  transactionsData,
} from "../../../hooks/forms/useTransactionForm";
import useTransactionStore from "@/store/useTransaction.store";
import useSearchStore from "@/store/useSearchStore.store";
import { TransactionFiterFormData } from "@/interfaces/transaction.interface";
import Transaction from "@/models/transaction.model";
import { DefaultSerializable } from "@/models/paginated_transaction.model";
import App from "@/models/app.model";
interface TransactionFilterFormProps<
  T extends DefaultSerializable = Transaction,
> {
  id: string;
  filter: TransactionFiterFormData;
  ctor: { new (...params: any[]): T; fromJson(json: any): T };
  onSubmit: (filter: TransactionFiterFormData) => void;
  apps?: App[]; // Add this prop
}

const TransactionFilterForm = <T extends DefaultSerializable = Transaction>({
  id,
  filter,
  ctor,
  onSubmit,
  apps = [], // Add default value
}: TransactionFilterFormProps<T>) => {
  const {
    formData,
    formErrors,
    resetFormData,
    setFormData,
    onInputDataChange,
    onPhoneNumberChange,
    onFormSubmit,
    transactionsApps,
    transactionsServices,
  } = useTransactionFilterForm(id, filter, ctor);

  // Map apps to select options
  const appOptions = useMemo(() => {
    return transactionsApps.map(app => ({
      value: app.id,
      name: app.name
    }));
  }, [transactionsApps]);

  const [formDataActual, setFormDataActual] = useState<TransactionFiterFormData>(filter);

  // Map status options
  const statusOptions = useMemo(() => {
    return transactionsData.status.map(status => ({
      value: status.value,
      name: status.name
    }));
  }, []);

  useEffect(() => {
    setFormData({
      reference: filter.reference ?? "",
      status:
          transactionsData.status.find(
            (status) => status.name === formData.status,
          )?.value ?? "",
        type:
          transactionsData.types.find((type) => type.name === formData.type)
            ?.value ?? "",
        type_trans: formData.type_trans ?? "",
        countryCodeCode: formData.countryCodeCode ?? "",
        phoneNumber: `${formData.countryCodeCode}${formData.phoneNumber}`.trim(),
        userAppId: formData.userAppId ?? "",
        mobileReference:
          transactionsData.mobileReferences.find(
            (mobileRef) => mobileRef.name === formData.mobileReference,
          )?.value ?? "",
        network: formData.network ?? "",
        withdriwalCode: formData.withdriwalCode ?? "",
        userEmail: formData.userEmail ?? "",
        app:
          transactionsApps.find((app) => app.name === formData.app)?.id ?? "",
        service:
          transactionsServices.find(
            (service) => service.name === formData.service,
          )?.id ?? "",
    });
  }, []);


  return (
    <Modal id={id} onClose={() => {}}>
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          {/* Reference */}
          <div className="mb-4">
            <AppInput
              label="Référence"
              id="reference"
              name="reference"
              type="text"
              placeholder="Référence"
              value={formData.reference}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, reference: e.target.value});
              }}
            />
            {formErrors.reference && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.reference}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <AppInput
              label="Email"
              id="userEmail"
              name="userEmail"
              type="email"
              placeholder="Email utilisateur"
              value={formData.userEmail}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, userEmail: e.target.value});
              }}
            />
            {formErrors.userEmail && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.userEmail}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="mb-4">
            <AppSelect
              id="status"
              name="status"
              label="Status"
              items={transactionsData.status}
              value={formData.status || ""}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, status: e.target.value});
              }}
              icon={
                <GitCommit className="text-black dark:text-white" size={25} />
              }
            />
            {formErrors.status && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.status}
              </p>
            )}
          </div>

          {/* <div className="mb-4">
            <AppSelect
              id="type"
              name="type"
              label="Type"
              items={transactionsData.types}
              value={formData.type}
              onChange={onInputDataChange}
              icon={
                <ArrowRightLeft
                  className="text-black dark:text-white"
                  size={25}
                />
              }
            />
            {formErrors.type && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.type}
              </p>
            )}
          </div> */}

          {/*<div className="mb-4">
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
          </div>*/}

          {/* App */}
          <div className="mb-4">
            <AppSelect
              id="app"
              name="app"
              label="Application"
              items={apps.map((app) => ({
                name: app.name,
                value: app.id ?? "",
              }))}
              value={formData.app ?? ""}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, app: e.target.value});
              }}
              icon={
                <Smartphone className="text-black dark:text-white" size={25} />
              }
            />
            {formErrors.app && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.app}
              </p>
            )}
          </div>

          {/*<div className="mb-4">
            <AppSelect
              id="service"
              name="service"
              label="Service"
              items={transactionsServices.map((service) => ({
                name: service.name,
                value: service.id ?? "",
              }))}
              value={formData.service ?? ""}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, service: e.target.value});
              }}
              icon={
                <ServerCog className="text-black dark:text-white" size={25} />
              }
            />
            {formErrors.service && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.service}
              </p>
            )}
          </div>*/}

          {/* User App Id */}
          <div className="mb-6">
            <AppInput
              label="Identifiant"
              id="userAppId"
              name="userAppId"
              type="text"
              placeholder="1234567890"
              value={formData.userAppId}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, userAppId: e.target.value});
              }}
            />
            {formErrors.userAppId && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.userAppId}
              </p>
            )}
          </div>

          {/* Withdrawal Code */}
          <div className="mb-6">
            <AppInput
              label="Code de retrait"
              id="withdriwalCode"
              name="withdriwalCode"
              type="text"
              placeholder="1234567890"
              value={formData.withdriwalCode}
              onChange={(e) => {
                onInputDataChange(e);
                setFormDataActual({...formDataActual, withdriwalCode: e.target.value});
              }}
            />
            {formErrors.withdriwalCode && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdriwalCode}
              </p>
            )}
          </div>

          {/* Phone Number */}
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

          {/* Date Range */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <AppInput
                label="Date de début"
                id="start_date"
                name="start_date"
                type="date"
                placeholder=""
                value={formData.start_date}
                onChange={(e) => {
                  onInputDataChange(e);
                  setFormDataActual({...formDataActual, start_date: e.target.value});
                }}
              />
              {formErrors.start_date && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.start_date}
                </p>
              )}
            </div>
            <div>
              <AppInput
                label="Date de fin"
                id="end_date"
                name="end_date"
                type="date"
                placeholder=""
                value={formData.end_date}
                onChange={(e) => {
                  onInputDataChange(e);
                  setFormDataActual({...formDataActual, end_date: e.target.value});
                }}
              />
              {formErrors.end_date && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.end_date}
                </p>
              )}
            </div>
          </div>

          {/* Filter Button */}
          <div className="mb-5">
            <AppButton name={`Filtrer`} onClick={() => onSubmit(formDataActual)} />
          </div>
          <div className="mb-5">
            <AppButton
              name={`Réinitialiser`}
              onClick={() => {
                resetFormData();
              }}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default TransactionFilterForm;
