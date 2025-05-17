import AuthAPI from "@/api/auth.api";
import User from "@/models/user.model";
import useInterfaceStore from "@/store/useInterface.store";
import useAuthenticatedUserStore from "@/store/useUser.store";
import { toggleModal } from "@/utils/functions.util";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string | null;
  password: string | null;
}

const useLoginForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: null,
    password: null,
  });

  const [processing, setProcessing] = useState(false);

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors: FormErrors = {
      email: null,
      password: null,
    };

    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "L'email n'est pas valide";
    }

    if (!formData.password.trim()) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password.trim().length < 4) {
      errors.password = "Le mot de passe doit comporter au moins 4 caractères.";
    }
    /*
    else if (!/[A-Z]/.test(formData.password)) {
      errors.password =
        "Le mot de passe doit comporter au moins une lettre majuscule.";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password =
        "Le mot de passe doit comporter au moins une lettre minuscule.";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Le mot de passe doit comporter au moins un chiffre.";
    }
    */

    setFormErrors(errors);
    return (
      (!errors.email || errors.email.length == 0) &&
      (!errors.password || errors.password.length == 0)
    );
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);
      try {
        const response = await AuthAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (response?.message) {
          setFormErrors({
            email: response.message,
            password: response.message,
          });
        } else if (response?.data) {
          // store access token in local storage
          localStorage.setItem("access", response.access ?? "");

          // const user = User.fromJson(response?.data);

          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          setActionResultMessage("Erreur lors de l'authentification");
          toggleModal("action-result-message");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setFormErrors({ email: error.message, password: error.message });
        } else {
          setFormErrors({
            email: "Une erreur inconnue est survenue",
            password: "Une erreur inconnue est survenue",
          });
        }
      }
      setProcessing(false);
    }
  };

  return {
    formData,
    formErrors,
    processing,
    onInputDataChange,
    onFormSubmit,
  };
};

export default useLoginForm;
