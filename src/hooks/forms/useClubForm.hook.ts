import { ClubFormData, ClubFormErrors } from "@/interfaces/club.interface";
import Club from "@/models/club.model";
import useClubStore from "@/store/useClub.store";
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
import Network from "@/models/network.model";
import useNetworkStore from "@/store/useNetwork.store";
import { NetworkFormData } from "@/interfaces/network.interface";

const useClubForm = (modalId: string, initialData?: Club) => {
  const { searchValue } = useSearchStore();
  const { addClub, updateClub, fetchClubs } = useClubStore();

  const [formData, setFormData] = useState<ClubFormData>({
    name: initialData?.name ?? "",
    logo: initialData?.logo ?? "",
  });

  const [formErrors, setFormErrors] = useState<ClubFormErrors>({
    name: null,
    logo: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      name: initialData?.name ?? "",
      logo: initialData?.logo ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      name: "",
      logo: "",
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

  const validateForm = async () => {
    const errors: ClubFormErrors = {
      name: null,
      logo: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Le nom du club est requis";
    } else if (formData.name.length < 3) {
      errors.name = "Le club doit contenir au moins trois caractères";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name =
        "Le nom du club doit contenir uniquement des lettres et des espaces";
    }

    if (!formData.logo) {
      errors.logo = "Le logo du club est requis";
    } else if (typeof formData.logo === "string") {
      const valid = await validateLogoUrl(formData.logo);
      if (!valid) {
        errors.logo = "Le logo doit être de type (JPEG, PNG, GIF).";
      }
    } else if (
      formData.logo instanceof File &&
      !["image/jpeg", "image/png", "image/gif"].includes(formData.logo.type)
    ) {
      errors.logo = "Le logo doit être de type (JPEG, PNG, GIF).";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (await validateForm()) {
      setProcessing(true);

      try {
        let logoUrl = "";
        if (formData.logo instanceof File) {
          logoUrl = await uploadImage(formData.logo!);
        }
        const club = new Club(
          formData.name,
          logoUrl.length != 0 ? logoUrl : (formData.logo as string),
          initialData?.createdAt ?? new Date(),
          initialData?.id,
        );

        if (club?.id) {
          const updatedClub = await updateClub(club);

          if (typeof updateClub === "string") {
            setActionResultMessage(updateClub);
            toggleModal("action-result-message");
          } else if (updatedClub) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le club a été mise à jour avec succès");
            toggleModal("action-result-message");
            fetchClubs(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newClub = await addClub(club);

          if (typeof newClub === "string") {
            setActionResultMessage(newClub);
            toggleModal("action-result-message");
          } else if (newClub) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le club a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchClubs(searchValue);
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
  };
};

export default useClubForm;
