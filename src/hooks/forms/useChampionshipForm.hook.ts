import {
  ChampionshipFormData,
  ChampionshipFormErrors,
} from "@/interfaces/championship.interface";
import Championship from "@/models/championship.model";
import Sport from "@/models/sport.model";
import useChampionshipStore from "@/store/useChampionship.store";
import useInterfaceStore from "@/store/useInterface.store";
import useSearchStore from "@/store/useSearchStore.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";

const useChampionshipForm = (modalId: string, initialData?: Championship) => {
  const { searchValue } = useSearchStore();
  const { addChampionship, updateChampionship, fetchChampionships } =
    useChampionshipStore();

  const [formData, setFormData] = useState<ChampionshipFormData>({
    name: initialData?.name ?? "",
    sport: initialData?.sport ?? null,
  });

  const [formErrors, setFormErrors] = useState<ChampionshipFormErrors>({
    name: null,
    sport: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      name: initialData?.name ?? "",
      sport: initialData?.sport ?? null,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      name: null,
      sport: null,
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

  const onSportChange = (name: string, sport: Sport) => {
    setFormData({ ...formData, [name]: sport });
  };

  const validateForm = () => {
    const errors: ChampionshipFormErrors = {
      name: null,
      sport: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Le nom du championnat est requis";
    } else if (formData.name.length < 3) {
      errors.name = "Le nom doit contenir au moins trois caractères";
    }

    if (!formData.sport) {
      errors.sport = "Le sport du championnat est requis";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const championship = new Championship(
          formData.name,
          formData.sport!,
          initialData?.id,
        );

        if (championship?.id) {
          const updatedChampionship = await updateChampionship(championship);

          if (typeof updateChampionship === "string") {
            setActionResultMessage(updateChampionship);
            toggleModal("action-result-message");
          } else if (updatedChampionship) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage(
              "Le championnat a été mis à jour avec succès",
            );
            toggleModal("action-result-message");
            fetchChampionships(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newChampionship = await addChampionship(championship);

          if (typeof newChampionship === "string") {
            setActionResultMessage(newChampionship);
            toggleModal("action-result-message");
          } else if (newChampionship) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le championnat a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchChampionships(searchValue);
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
    onSportChange,
    onFormSubmit,
  };
};

export default useChampionshipForm;
