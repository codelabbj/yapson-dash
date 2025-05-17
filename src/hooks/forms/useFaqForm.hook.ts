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
import Faq from "@/models/faq.model";
import { FaqFormData, FaqFormErrors } from "@/interfaces/faq.interface";
import useFaqStore from "@/store/useFaq.store";

const useFaqForm = (modalId: string, initialData?: Faq) => {
  const { searchValue } = useSearchStore();
  const { addFaq, updateFaq, fetchFaqs } = useFaqStore();

  const [formData, setFormData] = useState<FaqFormData>({
    id: initialData?.id,
    title: initialData?.title ?? "",
    contents: initialData?.contents ?? "",
    last_message: initialData?.lastMessage ?? "",
  });

  const [formErrors, setFormErrors] = useState<FaqFormErrors>({
    title: null,
    contents: null,
    last_message: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      id: initialData?.id,
      title: initialData?.title ?? "",
      contents: initialData?.contents ?? "",
      last_message: initialData?.lastMessage ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      title: null,
      contents: null,
      last_message: null,
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

  const validateForm = () => {
    const errors: FaqFormErrors = {
      title: null,
      contents: null,
      last_message: null,
    };

    if (!formData.title.trim()) {
      errors.title = "Le title est requis";
    }

    if (!formData.contents.trim()) {
      errors.contents = "Veuillez ajouter un contenu";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const service = new Faq(
          formData.title,
          formData.contents,
          formData.last_message,
          formData.id,
        );

        if (service?.id) {
          const updatedfaq = await updateFaq(service);

          if (typeof updatedfaq === "string") {
            setActionResultMessage(updatedfaq);
            toggleModal("action-result-message");
          } else if (updatedfaq) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le service a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchFaqs(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newService = await addFaq(service);

          if (typeof newService === "string") {
            setActionResultMessage(newService);
            toggleModal("action-result-message");
          } else if (newService) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le service a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchFaqs(searchValue);
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

export default useFaqForm;
