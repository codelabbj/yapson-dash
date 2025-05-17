import useMatchStore from "@/store/useMatch.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import { MatchFormData, MatchFormErrors } from "@/interfaces/match.interface";
import Match from "@/models/match.model";
import Club from "@/models/club.model";
import { Moment } from "moment";
import Championship from "@/models/championship.model";
import useSearchStore from "@/store/useSearchStore.store";

const useMatchForm = (modalId: string, initialData?: Match) => {
  const { searchValue } = useSearchStore();
  const { addMatch, updateMatch, fetchMatches } = useMatchStore();

  const [formData, setFormData] = useState<MatchFormData>({
    championship: initialData?.championship ?? null,
    clubHome: initialData?.clubHome ?? null,
    clubForeign: initialData?.clubForeign ?? null,
    startDate:
      initialData?.startDate != null
        ? new Date(initialData.startDate as Date)
        : new Date(),
    clubHomeGoal: initialData?.clubHomeGoal ?? 0,
    clubForeignGoal: initialData?.clubForeignGoal ?? 0,
  });

  const [formErrors, setFormErrors] = useState<MatchFormErrors>({
    championship: null,
    clubHome: null,
    clubForeign: null,
    startDate: null,
    clubHomeGoal: null,
    clubForeignGoal: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      championship: initialData?.championship ?? null,
      clubHome: initialData?.clubHome ?? null,
      clubForeign: initialData?.clubForeign ?? null,
      startDate: new Date(),
      clubHomeGoal: initialData?.clubHomeGoal ?? 0,
      clubForeignGoal: initialData?.clubForeignGoal ?? 0,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      championship: null,
      clubHome: null,
      clubForeign: null,
      startDate: null,
      clubHomeGoal: null,
      clubForeignGoal: null,
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
      [name]: value,
    });
  };

  const onClubChange = (name: string, club: Club) => {
    setFormData({ ...formData, [name]: club });
  };

  const onChampionshipChange = (name: string, championship: Championship) => {
    setFormData({ ...formData, [name]: championship });
  };

  const onDateTimeChange = (date: Date | Moment) => {
    if (!initialData?.id) {
      setFormData({ ...formData, startDate: date });
    }
  };

  const validateForm = () => {
    const errors: MatchFormErrors = {
      championship: null,
      clubHome: null,
      clubForeign: null,
      startDate: null,
      clubHomeGoal: null,
      clubForeignGoal: null,
    };

    if (initialData?.id === undefined && new Date() > formData.startDate) {
      errors.startDate = "Définissez une date correcte";
    }

    if (formData.championship === null) {
      errors.championship = "Le championnat doit être défini";
    }

    if (formData.clubHome === null) {
      errors.clubHome = "Le club doit être défini";
    }

    if (formData.clubForeign === null) {
      errors.clubForeign = "Le club doit être défini";
    }

    if (
      formData.clubHome &&
      formData.clubForeign &&
      formData.clubHome.id === formData.clubForeign.id
    ) {
      errors.clubHome = "Répétition de club";
      errors.clubForeign = "Répétition de club";
    }

    if (!formData.startDate) {
      errors.startDate = "La date doit être définie";
    }

    /*

    if (
      !formData.clubHomeGoal &&
      !isNaN(parseInt(formData.clubForeignGoal?.toString() ?? ""))
    ) {
      errors.clubHomeGoal = "Le nombre de but ne peut être null";
    }

    if (
      !isNaN(parseInt(formData.clubHomeGoal?.toString() ?? "")) &&
      formData.clubForeignGoal &&
      !formData.clubForeignGoal
    ) {
      errors.clubForeignGoal = "Le nombre de but ne peut être null";
    }
    */

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const match = new Match(
          formData.championship!,
          formData.clubHome!,
          formData.clubForeign!,
          formData.startDate!,
          formData.clubHomeGoal,
          formData.clubForeignGoal,
          initialData?.id,
        );

        if (match?.id) {
          const updatedMatch = await updateMatch(match);

          if (typeof updatedMatch === "string") {
            setActionResultMessage(updatedMatch);
            toggleModal("action-result-message");
          } else if (updatedMatch) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le match a été mise à jour avec succès");
            toggleModal("action-result-message");
            fetchMatches(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newMatch = await addMatch(match);

          if (typeof newMatch === "string") {
            setActionResultMessage(newMatch);
            toggleModal("action-result-message");
          } else if (newMatch) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le match a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchMatches(searchValue);
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
    onClubChange,
    onChampionshipChange,
    onDateTimeChange,
    onFormSubmit,
  };
};

export default useMatchForm;
