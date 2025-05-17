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
import useTransactionFilterForm from "@/hooks/forms/useTransactionFilter.hook";
import useTransactionForm, {
  transactionsData,
} from "../../../hooks/forms/useTransactionForm";
import useTransactionStore from "@/store/useTransaction.store";
import { TransactionFiterFormData } from "@/interfaces/transaction.interface";
import Transaction from "@/models/transaction.model";
import { DefaultSerializable } from "@/models/paginated_transaction.model";

interface TransactionFilterFormProps<
  T extends DefaultSerializable = Transaction,
> {
  id: string;
  filter: TransactionFiterFormData;
  ctor: { new (...params: any[]): T; fromJson(json: any): T };
}

// const TransactionFilterForm: FC<TransactionFilterFormProps> = ({
//   id,
//   filter,
// }) => {
//   const {
//     formData,
//     formErrors,
//     resetFormData,
//     setFormData,
//     onInputDataChange,
//     onPhoneNumberChange,
//     onFormSubmit,
//   } = useTransactionFilterForm(id, filter);
//
//   const { transactionsApps, transactionsServices } = useTransactionStore<
//     Transaction | BotTransaction
//   >();
//
//   useEffect(() => {
//     setFormData({
//       reference: filter.reference ?? "",
//       status:
//         transactionsData.status.find((status) => status.value === filter.status)
//           ?.name ?? "",
//       type:
//         transactionsData.types.find((type) => type.value === filter.type)
//           ?.name ?? "",
//       countryCodeCode: filter.countryCodeCode ?? "",
//       phoneNumber: filter.phoneNumber
//         ? filter.phoneNumber.replace(filter.countryCodeCode ?? "", "")
//         : "",
//       userAppId: filter.userAppId ?? "",
//       mobileReference:
//         transactionsData.mobileReferences.find(
//           (mobilRef) => mobilRef.value === filter.mobileReference,
//         )?.name ?? "",
//       withdriwalCode: filter.withdriwalCode ?? "",
//       userEmail: filter.userEmail ?? "",
//       app: transactionsApps.find((app) => app.id === filter.app)?.name ?? "",
//       service:
//         transactionsServices.find((service) => service.id === filter.service)
//           ?.name ?? "",
//     });
//   }, [setFormData, transactionsData, transactionsApps, filter]);
//
//   return (
//     <Modal id={id} onClose={() => {}}>
//       <div className=" dark:border-strokedark">
//         <form onSubmit={onFormSubmit}>
//           <div className="mb-4">
//             <AppInput
//               label="Référence"
//               id="reference"
//               name="reference"
//               type="text"
//               placeholder="Référence"
//               value={formData.reference}
//               onChange={onInputDataChange}
//             />
//             {formErrors.reference && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.reference}
//               </p>
//             )}
//           </div>
//
//           <div className="mb-6">
//             <AppInput
//               label="Email"
//               id="userEmail"
//               name="userEmail"
//               type="email"
//               placeholder="Email utilisateur"
//               value={formData.userEmail}
//               onChange={onInputDataChange}
//             />
//             {formErrors.userEmail && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.userEmail}
//               </p>
//             )}
//           </div>
//
//           <div className="mb-4">
//             <AppSelect
//               id="status"
//               name="status"
//               label="Status"
//               items={transactionsData.status}
//               value={formData.status}
//               onChange={onInputDataChange}
//               icon={
//                 <GitCommit className="text-black dark:text-white" size={25} />
//               }
//             />
//             {formErrors.status && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.status}
//               </p>
//             )}
//           </div>
//
//           {/* <div className="mb-4">
//             <AppSelect
//               id="type"
//               name="type"
//               label="Type"
//               items={transactionsData.types}
//               value={formData.type}
//               onChange={onInputDataChange}
//               icon={
//                 <ArrowRightLeft
//                   className="text-black dark:text-white"
//                   size={25}
//                 />
//               }
//             />
//             {formErrors.type && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.type}
//               </p>
//             )}
//           </div> */}
//
//           {/*<div className="mb-4">
//             <AppSelect
//               id="mobileReference"
//               name="mobileReference"
//               label="Réseau"
//               items={transactionsData.mobileReferences}
//               value={formData.mobileReference}
//               onChange={onInputDataChange}
//               icon={
//                 <ChartNoAxesColumnIncreasing
//                   className="text-black dark:text-white"
//                   size={25}
//                 />
//               }
//             />
//             {formErrors.mobileReference && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.mobileReference}
//               </p>
//             )}
//           </div>*/}
//
//           <div className="mb-4">
//             <AppSelect
//               id="app"
//               name="app"
//               label="Application"
//               items={transactionsApps.map((app) => ({
//                 name: app.name,
//                 value: app.id ?? "",
//               }))}
//               value={formData.app ?? ""}
//               onChange={onInputDataChange}
//               icon={
//                 <Smartphone className="text-black dark:text-white" size={25} />
//               }
//             />
//             {formErrors.app && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.app}
//               </p>
//             )}
//           </div>
//
//           {/*<div className="mb-4">
//             <AppSelect
//               id="service"
//               name="service"
//               label="Service"
//               items={transactionsServices.map((service) => ({
//                 name: service.name,
//                 value: service.id ?? "",
//               }))}
//               value={formData.service ?? ""}
//               onChange={onInputDataChange}
//               icon={
//                 <ServerCog className="text-black dark:text-white" size={25} />
//               }
//             />
//             {formErrors.service && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.service}
//               </p>
//             )}
//           </div>*/}
//
//           <div className="mb-6">
//             <AppInput
//               label="Identifiant"
//               id="userAppId"
//               name="userAppId"
//               type="text"
//               placeholder="1234567890"
//               value={formData.userAppId}
//               onChange={onInputDataChange}
//             />
//             {formErrors.userAppId && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.userAppId}
//               </p>
//             )}
//           </div>
//
//           <div className="mb-6">
//             <AppInput
//               label="Code de retrait"
//               id="withdriwalCode"
//               name="withdriwalCode"
//               type="text"
//               placeholder="1234567890"
//               value={formData.withdriwalCode}
//               onChange={onInputDataChange}
//             />
//             {formErrors.withdriwalCode && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.withdriwalCode}
//               </p>
//             )}
//           </div>
//
//           <div className="mb-6">
//             <AppPhoneInput
//               label="Téléphone"
//               id="phoneNumber"
//               name="phoneNumber"
//               placeholder="90000000"
//               value={formData.phoneNumber}
//               onChange={onPhoneNumberChange}
//             />
//
//             {formErrors.phoneNumber && (
//               <p className="erreur ml-1.5 text-[14px] font-medium text-red">
//                 {formErrors.phoneNumber}
//               </p>
//             )}
//           </div>
//
//           <div className="mb-5">
//             <AppButton name={`Filtrer`} onClick={() => {}} />
//           </div>
//           <div className="mb-5">
//             <AppButton
//               name={`Réinitialiser`}
//               onClick={() => {
//                 resetFormData();
//               }}
//             />
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

function TransactionFilterForm<T extends DefaultSerializable = Transaction>({
  id,
  filter,
  ctor,
}: TransactionFilterFormProps<T>) {
  const {
    formData,
    formErrors,
    resetFormData,
    setFormData,
    onInputDataChange,
    onPhoneNumberChange,
    onFormSubmit,
  } = useTransactionFilterForm<T>(id, filter, ctor);

  const { transactionsApps, transactionsServices } =
    useTransactionStore<T>(ctor)();

  useEffect(() => {
    setFormData({
      reference: filter.reference ?? "",
      status:
        transactionsData.status.find((status) => status.value === filter.status)
          ?.name ?? "",
      type:
        transactionsData.types.find((type) => type.value === filter.type)
          ?.name ?? "",
      countryCodeCode: filter.countryCodeCode ?? "",
      phoneNumber: filter.phoneNumber
        ? filter.phoneNumber.replace(filter.countryCodeCode ?? "", "")
        : "",
      userAppId: filter.userAppId ?? "",
      mobileReference:
        transactionsData.mobileReferences.find(
          (mobilRef) => mobilRef.value === filter.mobileReference,
        )?.name ?? "",
      withdriwalCode: filter.withdriwalCode ?? "",
      userEmail: filter.userEmail ?? "",
      app: transactionsApps.find((app) => app.id === filter.app)?.name ?? "",
      service:
        transactionsServices.find((service) => service.id === filter.service)
          ?.name ?? "",
    });
  }, []);

  return (
    <Modal id={id} onClose={() => {}}>
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <div className="mb-4">
            <AppInput
              label="Référence"
              id="reference"
              name="reference"
              type="text"
              placeholder="Référence"
              value={formData.reference}
              onChange={onInputDataChange}
            />
            {formErrors.reference && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.reference}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppInput
              label="Email"
              id="userEmail"
              name="userEmail"
              type="email"
              placeholder="Email utilisateur"
              value={formData.userEmail}
              onChange={onInputDataChange}
            />
            {formErrors.userEmail && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.userEmail}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppSelect
              id="status"
              name="status"
              label="Status"
              items={transactionsData.status}
              value={formData.status}
              onChange={onInputDataChange}
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
              onChange={onInputDataChange}
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

          <div className="mb-6">
            <AppInput
              label="Code de retrait"
              id="withdriwalCode"
              name="withdriwalCode"
              type="text"
              placeholder="1234567890"
              value={formData.withdriwalCode}
              onChange={onInputDataChange}
            />
            {formErrors.withdriwalCode && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.withdriwalCode}
              </p>
            )}
          </div>

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

          <div className="mb-5">
            <AppButton name={`Filtrer`} onClick={() => {}} />
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
