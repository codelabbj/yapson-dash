import { SportFormData, SportFormErrors } from "@/interfaces/sport.interface";
import Sport from "@/models/sport.model";
import useSportStore from "@/store/useSport.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import useSearchStore from "@/store/useSearchStore.store";

const useSportForm = (modalId: string, initialData?: Sport) => {
  const { searchValue } = useSearchStore();
  const { addSport, updateSport, fetchSports } = useSportStore();

  const [formData, setFormData] = useState<SportFormData>({
    name: initialData?.name ?? "",
  });

  const [formErrors, setFormErrors] = useState<SportFormErrors>({
    name: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      name: initialData?.name ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      name: null,
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
    const errors: SportFormErrors = {
      name: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Le nom du sport est requis";
    } else if (formData.name.length < 3) {
      errors.name = "Le nom doit contenir au moins trois caractères";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const sport = new Sport(formData.name, initialData?.id);

        if (sport?.id) {
          const updatedSport = await updateSport(sport);

          if (typeof updatedSport === "string") {
            setActionResultMessage(updatedSport);
            toggleModal("action-result-message");
          } else if (updatedSport) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le sport a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchSports(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newSport = await addSport(sport);

          if (typeof newSport === "string") {
            setActionResultMessage(newSport);
            toggleModal("action-result-message");
          } else if (newSport) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le sport a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchSports(searchValue);
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

export default useSportForm;
