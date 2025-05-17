import {
  AdvertisementFormData,
  AdvertisementFormErrors,
} from "@/interfaces/advertisement.interface";
import Advertisement from "@/models/advertisement.model";
import useAdvertisementStore from "@/store/useAdvertisement.store";
import useInterfaceStore from "@/store/useInterface.store";
import useSearchStore from "@/store/useSearchStore.store";
import api from "@/utils/api.util";
import {
  delay,
  toggleModal,
  uploadImage,
  validateLogoUrl,
} from "@/utils/functions.util";
import { useEffect, useState } from "react";

const useAdvertisementForm = (modalId: string, initialData?: Advertisement) => {
  const { searchValue } = useSearchStore();
  const { addAdvertisement, updateAdvertisement, fetchAdvertisements } =
    useAdvertisementStore();

  const [formData, setFormData] = useState<AdvertisementFormData>({
    content: initialData?.content ?? "",
    image: initialData?.image ?? "",
    enable: initialData?.enable ?? true,
  });

  const [formErrors, setFormErrors] = useState<AdvertisementFormErrors>({
    content: null,
    image: null,
    enable: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      content: initialData?.content ?? "",
      image: initialData?.image ?? "",
      enable: initialData?.enable ?? false,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      content: null,
      image: null,
      enable: null,
    });
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === "image" ? files?.[0] : value,
    });
  };

  const onStatusChange = (newStatus: boolean) => {
    console.log(" ====> New  value", newStatus);
    setFormData({
      ...formData,
      enable: newStatus,
    });
  };

  const onTextAreaDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = async () => {
    const errors: AdvertisementFormErrors = {
      content: null,
      image: null,
      enable: null,
    };

    // if (!formData.content.trim()) {
    //   errors.content = "Le contenu de la publicité est requis";
    // } else if (formData.content.length < 3) {
    //   errors.content = "Le contenu doit contenir au moins trois caractères";
    // }

    if (!formData.image) {
      errors.image = "L'image de la publicité est requis";
    } else if (typeof formData.image === "string") {
      const valid = await validateLogoUrl(formData.image);
      if (!valid) {
        errors.image = "L'image doit être de type (JPEG, PNG, GIF)";
      }
    } else if (
      formData.image instanceof File &&
      !["image/jpeg", "image/png", "image/gif"].includes(formData.image.type)
    ) {
      errors.image = "L'image doit être de type (JPEG, PNG, GIF).";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (await validateForm()) {
      setProcessing(true);

      try {
        let imageUrl = "";
        if (formData.image instanceof File) {
          imageUrl = await uploadImage(formData.image!);
        }

        const advertisement = new Advertisement(
          formData.content ?? "",
          imageUrl.length != 0 ? imageUrl : (formData.image as string),
          formData.enable,
          initialData?.createdAt ?? new Date(),
          initialData?.id,
        );

        if (advertisement?.id) {
          const updatedAdvertisement = await updateAdvertisement(advertisement);

          if (typeof updateAdvertisement === "string") {
            setActionResultMessage(updateAdvertisement);
            toggleModal("action-result-message");
          } else if (updatedAdvertisement) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage(
              "La publicité a été mise à jour avec succès",
            );

            toggleModal("action-result-message");
            fetchAdvertisements(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newAdvertisement = await addAdvertisement(advertisement);

          if (typeof newAdvertisement === "string") {
            setActionResultMessage(newAdvertisement);
            toggleModal("action-result-message");
          } else if (newAdvertisement) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("La publicité a été ajoutée avec succès");
            toggleModal("action-result-message");
            fetchAdvertisements(searchValue);
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
    onTextAreaDataChange,
    onStatusChange,
    setFormData,
    onFormSubmit,
  };
};

export default useAdvertisementForm;
