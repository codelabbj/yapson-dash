import User from "@/models/user.model";
import useInterfaceStore from "@/store/useInterface.store";
import useSearchStore from "@/store/useSearchStore.store";
import useUsersStore from "@/store/useUser.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useState } from "react";

const useAdminPassForm = (modalId: string, user: User) => {
  const { searchValue } = useSearchStore();
  const { deleteUser, fetchUsers } = useUsersStore();

  const [passwordData, setPasswordData] = useState<string>("");

  const [passwordDataError, setPasswordDataError] = useState<string>("");

  const [processing, setProcessing] = useState<boolean>(false);

  const resetPasswordData = () => {
    setPasswordData("");
  };

  const resetPasswordDataError = () => {
    setPasswordDataError("");
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>,
  ) => {
    const { value } = e.target;

    setPasswordData(value);
  };

  const validateForm = () => {
    let passwordError: string = "";

    if (!passwordData.trim()) {
      passwordError = "Le mot de passe est requis";
    } else if (passwordData.trim().length < 4) {
      passwordError = "Le mot de passe doit comporter au moins 4 caractères.";
    }
    /*
    else if (!/[A-Z]/.test(passwordData)) {
      passwordError =
        "Le mot de passe doit comporter au moins une lettre majuscule.";
    } else if (!/[a-z]/.test(passwordData)) {
      passwordError =
        "Le mot de passe doit comporter au moins une lettre minuscule.";
    } else if (!/[0-9]/.test(passwordData)) {
      passwordError = "Le mot de passe doit comporter au moins un chiffre.";
    }
    */

    setPasswordDataError(passwordError);

    return passwordDataError.length == 0;
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const deletedUser = await deleteUser(user.id!, passwordData);

        if (deletedUser) {
          resetPasswordData();
          toggleModal(modalId);
          setActionResultMessage("L'utilisateur a été supprimé avec succès");
          toggleModal("action-result-message");
          fetchUsers(searchValue);
          await delay({ milliseconds: 500 });
          toggleModal("action-result-message");
        } else {
          setActionResultMessage("Une erreur s'est produite");
          toggleModal("action-result-message");
        }
      } catch (error) {
        console.error("Error handling form submission:", error);
      }

      setProcessing(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return URL.createObjectURL(file);
  };

  return {
    processing,
    passwordData,
    passwordDataError,
    resetPasswordData,
    resetPasswordDataError,
    onInputDataChange,
    onFormSubmit,
  };
};

export default useAdminPassForm;
