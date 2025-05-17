import {
  ServiceFormData,
  ServiceFormErrors,
} from "@/interfaces/service.interface";
import Service from "@/models/service.model";
import useServiceStore from "@/store/useService.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import useSearchStore from "@/store/useSearchStore.store";

const useServiceForm = (modalId: string, initialData?: Service) => {
  const { searchValue } = useSearchStore();
  const { addService, updateService, fetchServices } = useServiceStore();

  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    phoneIndication: initialData
      ? `${initialData?.phoneIndication}${initialData?.phoneIndication}`
      : "",
    secretKey: initialData?.secretKey ?? "",
    isActive: initialData?.isActive ?? false,
  });

  const [formErrors, setFormErrors] = useState<ServiceFormErrors>({
    name: null,
    email: null,
    phone: null,
    phoneIndication: null,
    secretKey: null,
    isActive: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      phoneIndication: initialData
        ? `${initialData?.phoneIndication}${initialData?.phoneIndication}`
        : "",
      secretKey: initialData?.secretKey ?? "",
      isActive: initialData?.isActive ?? false,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      name: null,
      email: null,
      phone: null,
      phoneIndication: null,
      secretKey: null,
      isActive: null,
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
      [name]: name === "logo" ? files?.[0] : value,
    });
  };

  const onPhoneNumberChange = (country: any, value: string) => {
    let dialCode = "+229";

    if (country.hasOwnProperty("dialCode")) {
      dialCode = country.dialCode;
    }

    setFormData({
      ...formData,
      phoneIndication: dialCode,
      phone: value,
    });
  };

  const onStatusChange = (newStatus: boolean) => {
    setFormData({
      ...formData,
      isActive: newStatus,
    });
  };

  const validateForm = () => {
    const errors: ServiceFormErrors = {
      name: null,
      email: null,
      phone: null,
      phoneIndication: null,
      secretKey: null,
      isActive: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Le nom du service est requis";
    } else if (formData.name.length < 3) {
      errors.name = "Le nom doit contenir au moins trois caractères";
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "L'email n'est pas valide";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const service = new Service(
          formData.name,
          formData.email,
          formData.phone,
          formData.phoneIndication,
          formData.secretKey,
          formData.isActive,
          initialData?.id,
        );

        if (service?.id) {
          const updatedService = await updateService(service);

          if (typeof updatedService === "string") {
            setActionResultMessage(updatedService);
            toggleModal("action-result-message");
          } else if (updatedService) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le service a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchServices(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newService = await addService(service);

          if (typeof newService === "string") {
            setActionResultMessage(newService);
            toggleModal("action-result-message");
          } else if (newService) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le service a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchServices(searchValue);
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
    onPhoneNumberChange,
    onStatusChange,
    onInputDataChange,
    onFormSubmit,
  };
};

export default useServiceForm;
