import { useEffect, useState } from "react";
import {
  TransactionFiterFormData,
  TransactionFiterFormErrors,
} from "@/interfaces/transaction.interface";
import useTransactionStore from "@/store/useTransaction.store";
import { toggleModal } from "@/utils/functions.util";
import useSearchStore from "@/store/useSearchStore.store";
import { transactionsData } from "./useTransactionForm";
import { DefaultSerializable } from "@/models/paginated_transaction.model";
import Transaction from "@/models/transaction.model";

const useTransactionFilterForm = <T extends DefaultSerializable = Transaction>(
  modalId: string,
  filter: TransactionFiterFormData,
  ctor: { new (...params: any[]): T; fromJson(json: any): T },
) => {
  const {
    setFilter,
    fetchTransactions,
    transactionsApps,
    transactionsServices,
  } = useTransactionStore<T>(ctor)();
  const { searchValue } = useSearchStore();

  const [formData, setFormData] = useState<TransactionFiterFormData>({
    reference: filter.reference ?? "",
    status:
      transactionsData.status.find((status) => status.name === filter.status)
        ?.name ?? "",
    type:
      transactionsData.types.find((type) => type.name === filter.status)
        ?.name ?? "",
    countryCodeCode: filter.countryCodeCode ?? "",
    phoneNumber: filter.phoneNumber ?? "",
    userAppId: filter.userAppId ?? "",
    mobileReference:
      transactionsData.mobileReferences.find(
        (mobilRef) => mobilRef.name === filter.status,
      )?.name ?? "",
    withdriwalCode: filter.withdriwalCode ?? "",
    userEmail: filter.userEmail ?? "",
    app: transactionsApps.find((app) => app.id === filter.app)?.name ?? "",
    service:
      transactionsServices.find((service) => service.id === filter.service)
        ?.name ?? "",
  });

  const [formErrors, setFormErrors] = useState<TransactionFiterFormErrors>({
    reference: null,
    status: null,
    type: null,
    phoneNumber: null,
    userAppId: null,
    mobileReference: null,
    withdriwalCode: null,
    userEmail: null,
    app: null,
    service: null,
  });

  const resetFormData = async () => {
    setFormData({
      reference: "",
      status: "",
      type: "",
      countryCodeCode: "",
      phoneNumber: "",
      userAppId: "",
      mobileReference: "",
      withdriwalCode: "",
      userEmail: "",
      app: "",
      service: "",
    });

    toggleModal(modalId);

    await fetchTransactions(searchValue, undefined, 1);
  };

  const resetFormErrors = () => {
    setFormErrors({
      reference: null,
      status: null,
      type: null,
      phoneNumber: null,
      userAppId: null,
      mobileReference: null,
      withdriwalCode: null,
      userEmail: null,
      app: null,
      service: null,
    });
  };

  const onInputDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onPhoneNumberChange = (country: any, value: string) => {
    let dialCode = "+229";

    if (country.hasOwnProperty("dialCode")) {
      dialCode = country.dialCode;
    }

    setFormData({
      ...formData,
      countryCodeCode: dialCode,
      phoneNumber: value,
    });
  };

  const validateForm = () => {
    const errors: TransactionFiterFormErrors = {
      reference: null,
      status: null,
      type: null,
      phoneNumber: null,
      userAppId: null,
      mobileReference: null,
      withdriwalCode: null,
      userEmail: null,
      app: null,
      service: null,
    };

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setFilter({
        reference: formData.reference ?? "",
        status:
          transactionsData.status.find(
            (status) => status.name === formData.status,
          )?.value ?? "",
        type:
          transactionsData.types.find((type) => type.name === formData.type)
            ?.value ?? "",
        countryCodeCode: formData.countryCodeCode ?? "",
        phoneNumber: `${formData.countryCodeCode}${formData.phoneNumber}`,
        userAppId: formData.userAppId ?? "",
        mobileReference:
          transactionsData.mobileReferences.find(
            (mobileRef) => mobileRef.name === formData.mobileReference,
          )?.value ?? "",

        withdriwalCode: formData.withdriwalCode ?? "",
        userEmail: formData.userEmail ?? "",
        app:
          transactionsApps.find((app) => app.name === formData.app)?.id ?? "",
        service:
          transactionsServices.find(
            (service) => service.name === formData.service,
          )?.id ?? "",
      });

      toggleModal(modalId);

      await fetchTransactions(searchValue, undefined, 1);
    }
  };

  return {
    formData,
    formErrors,
    setFormData,
    resetFormData,
    resetFormErrors,
    onPhoneNumberChange,
    onInputDataChange,
    onFormSubmit,
  };
};

export default useTransactionFilterForm;
