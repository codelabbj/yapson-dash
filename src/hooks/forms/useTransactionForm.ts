import { useEffect, useState } from "react";

import Transaction from "@/models/transaction.model";
import useTransactionStore from "@/store/useTransaction.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, extractAxiosError, toggleModal } from "@/utils/functions.util";
import {
  TransactionFormData,
  TransactionFormErrors,
} from "@/interfaces/transaction.interface";
import User from "@/models/user.model";
import { SelectItemProps } from "@/components/widget/Form/Select";
import useSearchStore from "@/store/useSearchStore.store";

export const transactionsData = {
  types: [
    {
      name: "Dépôt",
      value: "deposit",
    },

    {
      name: "Abonnement",
      value: "subscrib",
    },

    {
      name: "Remboursement Momo",
      value: "disbursements",
    },
  ] as SelectItemProps[],
  mobileReferences: [
    {
      name: "Carte",
      value: "card",
    },

    {
      name: "MTN",
      value: "mtn",
    },
    {
      name: "MOOV",
      value: "moov",
    },
  ] as SelectItemProps[],
  status: [
    {
      name: "En attente",
      value: "pending",
    },
    {
      name: "Accepté",
      value: "accept",
    },
    {
      name: "Annulé",
      value: "cancel",
    },
  ],
};

const useTransactionStoreMemo = useTransactionStore(Transaction);

const useTransactionForm = <T = Transaction>(
  modalId: string,
  initialData?: Transaction,
) => {
  const { searchValue } = useSearchStore();
  const {
    transactionsApps,
    error,
    addTransaction,
    updateTransaction,
    fetchTransactions,
  } = useTransactionStoreMemo();

  const [formData, setFormData] = useState<TransactionFormData>({
    reference: initialData?.reference ?? "",
    amount: initialData?.amount ?? 1000,
    typeTrans:
      initialData?.typeTrans != null
        ? (transactionsData.types.find(
            (type) => type.value == initialData?.typeTrans,
          )?.name ?? "Remboursement Momo")
        : "Remboursement Momo",
    phoneNumber: initialData?.phoneNumber ?? "",
    mobileReference:
      initialData?.mobileReference != null
        ? (transactionsData.mobileReferences.find(
            (mobRef) => mobRef.value == initialData?.mobileReference,
          )?.name ?? "Moov")
        : "Moov",
    app:
      initialData?.app != null
        ? (transactionsApps.find((app) => app.id == initialData?.app)?.name ??
          "")
        : "",
    userAppId: initialData?.userAppId ?? "",
  });

  const [formErrors, setFormErrors] = useState<TransactionFormErrors>({
    reference: null,
    amount: null,
    typeTrans: null,
    mobileReference: null,
    phoneNumber: null,
    app: null,
    userAppId: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      reference: initialData?.reference ?? "",
      amount: initialData?.amount ?? 1000,
      typeTrans:
        initialData?.typeTrans != null
          ? (transactionsData.types.find(
              (type) => type.value == initialData?.typeTrans,
            )?.name ?? "Remboursement Momo")
          : "Remboursement Momo",
      phoneNumber: initialData?.phoneNumber ?? "",
      mobileReference:
        initialData?.mobileReference != null
          ? (transactionsData.mobileReferences.find(
              (mobRef) => mobRef.value == initialData?.mobileReference,
            )?.name ?? "Moov")
          : "Moov",
      app:
        initialData?.app != null
          ? (transactionsApps.find((app) => app.id == initialData?.app)?.name ??
            "")
          : "",
      userAppId: initialData?.userAppId ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      reference: null,
      amount: null,
      typeTrans: null,
      mobileReference: null,
      phoneNumber: null,
      app: null,
      userAppId: null,
    });
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

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

    // setFormData({
    //   ...formData,
    //   countryCodeCode: dialCode,
    //   phoneNumber: value,
    // });
  };

  const validateForm = () => {
    const errors: TransactionFormErrors = {
      reference: null,
      amount: null,
      typeTrans: null,
      mobileReference: null,
      phoneNumber: null,
      app: null,
      userAppId: null,
    };

    // if (formData.typeTrans === "Dépôt" && formData.amount < 1000) {
    //   errors.amount = "Le montant est doit être supérieur ou égal à 1000";
    // }
    //
    // if (formData.typeTrans == "Dépôt" && !formData.userAppId?.trim()) {
    //   errors.typeTrans = "L'ID de l'application est requis";
    // }

    setFormErrors(errors);
    console.log(
      "This is error => ",
      Object.values(errors).every((error) => !error),
    );

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const transaction = new Transaction(
          Number(formData.amount),
          new User("user", "user"),
          formData?.reference ?? "",
          transactionsData.types.find(
            (item) => item.name === formData.typeTrans,
          )?.value ?? "disbursements",
          initialData?.status ?? "pending",
          formData.phoneNumber.split(formData.countryCodeCode ?? "")[1],
          initialData?.country ?? "Bénin",
          transactionsData.mobileReferences.find(
            (item) => item.name === formData.mobileReference,
          )?.value ?? "moov",
          initialData?.createdAt ?? new Date(),
          formData.countryCodeCode,
          transactionsApps.find((app) => app.name === formData.app),
          formData.userAppId,
          initialData?.withdrawalCode,
          initialData?.id,
        );

        if (transaction.id) {
          const updatedTransaction = await updateTransaction(transaction);

          if (error) {
            setActionResultMessage(error);
            toggleModal("action-result-message");
          } else if (updatedTransaction) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage(
              "La transaction a été mise à jour avec succès.",
            );
            toggleModal("action-result-message");
            fetchTransactions(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newTransaction = await addTransaction(transaction);

          if (typeof newTransaction === "string") {
            setActionResultMessage(newTransaction);
            toggleModal("action-result-message");
          } else if (newTransaction) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("La transaction a été ajoutée avec succès.");
            toggleModal("action-result-message");
            fetchTransactions(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        }
      } catch (error) {
        console.error("Error handling form submission:", error);
      }

      setProcessing(false);
    }
  };

  return {
    processing,
    // formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onPhoneNumberChange,
    onFormSubmit,
  };
};

export default useTransactionForm;
