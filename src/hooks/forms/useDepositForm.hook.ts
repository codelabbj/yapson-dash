import {
  DepositFormData,
  DepositFormErrors,
} from "@/interfaces/deposit.interface";
import Deposit from "@/models/deposit.model";
import useDepositStore from "@/store/useDeposit.store";
import useInterfaceStore from "@/store/useInterface.store";
import {
  delay,
  toggleModal,
  uploadImage,
  validateLogoUrl,
} from "@/utils/functions.util";
import { useEffect, useState } from "react";
import useSearchStore from "@/store/useSearchStore.store";
import { SelectItemProps } from "../../components/widget/Form/Select";

export const depositStatus: SelectItemProps[] = [
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
];

const useDepositForm = (modalId: string, initialData?: Deposit) => {
  const { searchValue } = useSearchStore();
  const { addDeposit, updateDeposit, fetchDeposits } = useDepositStore();

  const [formData, setFormData] = useState<DepositFormData>({
    amount: initialData?.amount ?? "",
    bet_app_id: initialData?.bet_app?.id ?? "",
  });

  const [formErrors, setFormErrors] = useState<DepositFormErrors>({
    amount: null,
    bet_app_id: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      amount: "",
      bet_app_id: "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      amount: null,
      bet_app_id: null,
    });
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>,
  ) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === "image" ? files?.[0] : value,
    });
  };

  const validateForm = async () => {
    const errors: DepositFormErrors = {
      amount: null,
      bet_app_id: null,
    };

    if (!formData.amount) {
      errors.amount = "Le montant du depôt est requis";
    } else if (isNaN(Number(formData.amount))) {
      errors.amount = "Le montant du depôt doit être un nombre";
    }

    if (formData.bet_app_id.length <= 0) {
      errors.bet_app_id = "Veuillez selectionner une application";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (await validateForm()) {
      setProcessing(true);

      try {
        console.log(initialData, "initialData");
        const deposit = new Deposit(
          initialData?.bet_app ?? null,
          formData.amount,
          initialData?.createdAt ?? new Date(),
          initialData?.id,
        );

        if (deposit?.id) {
          const updatedDeposit = await updateDeposit(
            deposit,
            formData.bet_app_id,
          );

          console.log("updatedDeposit", updatedDeposit);

          if (typeof updatedDeposit === "string") {
            setActionResultMessage(updatedDeposit);
            toggleModal("action-result-message");
          } else if (updatedDeposit) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le depôt a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchDeposits(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newDeposit = await addDeposit(deposit, formData.bet_app_id);

          if (typeof newDeposit === "string") {
            setActionResultMessage(newDeposit);
            toggleModal("action-result-message");
          } else if (newDeposit) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le depôt a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchDeposits(searchValue);
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
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
    setFormData,
  };
};

export default useDepositForm;
