import AuthAPI from "@/api/auth.api";
import useInterfaceStore from "@/store/useInterface.store";
import { toggleModal } from "@/utils/functions.util";
import { useState } from "react";
import AuthSetting from "../../models/auth_setting.model";
import {
  AuthSettingFormData,
  AuthSettingFormErrors,
} from "@/interfaces/auth_setting.interface";

const useAuthSettingForm = () => {
  const [authSettingFormData, setAuthSettingFormData] =
    useState<AuthSettingFormData>({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  const [authSettingFormErrors, setAuthSettingFormErrors] =
    useState<AuthSettingFormErrors>({
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
    });

  const [authSettingProcessing, setAuthSettingProcessing] =
    useState<boolean>(false);

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const authSettingOnInputDataChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAuthSettingFormData({
      ...authSettingFormData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors: AuthSettingFormErrors = {
      oldPassword: null,
      newPassword: null,
      confirmNewPassword: null,
    };

    if (!authSettingFormData.oldPassword?.trim()) {
      errors.oldPassword = "L'ancien mot de passe est requis";
    }

    if (!authSettingFormData.newPassword?.trim()) {
      errors.newPassword = "Le nouveau mot de passe est requis";
    }

    if (!authSettingFormData.confirmNewPassword?.trim()) {
      errors.confirmNewPassword = "Le confirmation de mot de passe est requis";
    }

    if (authSettingFormData.newPassword!.length < 6) {
      errors.newPassword =
        "Le nouveau mot de passe doit contenir au moins 6 caractères";
    }

    if (authSettingFormData.confirmNewPassword!.length < 6) {
      errors.confirmNewPassword =
        "Le nouveau mot de passe doit contenir au moins 6 caractères";
    }

    if (
      authSettingFormData.newPassword?.trim() !=
      authSettingFormData.confirmNewPassword?.trim()
    ) {
      errors.newPassword = "Mot de passe non identique";
      errors.confirmNewPassword = "Mot de passe non identique";
    }

    /* if (!isValidPassword(authSettingFormData.newPassword!)) {
      errors.newPassword = `Le mot de passe doit contenir au moins une lettre majuscule,
         une lettre minuscule, un chiffre et comporter au moins 6 caractères`;
      errors.confirmNewPassword = `Le mot de passe doit contenir au moins une lettre majuscule,
         une lettre minuscule, un chiffre et comporter au moins 6 caractères`;
    }*/

    setAuthSettingFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  function isValidPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    return regex.test(password);
  }

  const authSettingOnFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setAuthSettingProcessing(true);
      const authSetting = new AuthSetting(
        authSettingFormData.oldPassword,
        authSettingFormData.newPassword,
        authSettingFormData.confirmNewPassword,
      );
      try {
        const response = await AuthAPI.setting(authSetting);

        if (typeof response === "string") {
          setActionResultMessage(response);
          toggleModal("action-result-message");
        } else if (response?.message) {
          setAuthSettingFormErrors({
            oldPassword: response.message,
            newPassword: response.message,
            confirmNewPassword: response.message,
          });
        } else if (response?.success) {
          setActionResultMessage(
            `Votre mot de passe a été modifié avec succès`,
          );

          toggleModal("action-result-message");

          await AuthAPI.logout("");
        }
      } catch (error: unknown) {
        console.error("Error handling form submission:", error);
      }

      setAuthSettingProcessing(false);
    }
  };

  return {
    authSettingFormData,
    authSettingFormErrors,
    authSettingProcessing,
    authSettingOnInputDataChange,
    authSettingOnFormSubmit,
  };
};

export default useAuthSettingForm;
