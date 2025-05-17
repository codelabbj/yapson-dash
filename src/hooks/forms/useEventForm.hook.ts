import useEventStore from "@/store/useEvent.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import { EventFormData, EventFormErrors } from "@/interfaces/event.interface";
import Event from "@/models/event.model";
import Club from "@/models/club.model";
import { Moment } from "moment";
import Championship from "@/models/championship.model";
import Match from "@/models/match.model";
import { SelectItemProps } from "../../components/widget/Form/Select";
import useSearchStore from "@/store/useSearchStore.store";

export const eventStatus: SelectItemProps[] = [
  {
    name: "Perdu",
    value: "lost",
  },
  {
    name: "En cours",
    value: "pending",
  },
  {
    name: "Gagné",
    value: "win",
  },
  {
    name: "En attente",
    value: "upcoming",
  },
];

const useEventForm = (modalId: string, initialData?: Event) => {
  const { searchValue } = useSearchStore();
  const { addEvent, updateEvent, fetchEvents } = useEventStore();

  const [formData, setFormData] = useState<EventFormData>({
    match: initialData?.match ?? null,
    status:
      initialData?.status != null
        ? (eventStatus.find((status) => status.value == initialData?.status)
            ?.name ?? "")
        : "",
    bet: initialData?.bet ?? "",
    coast: initialData?.coast ?? "",
  });

  const [formErrors, setFormErrors] = useState<EventFormErrors>({
    match: null,
    status: null,
    bet: null,
    coast: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      match: initialData?.match ?? null,
      status:
        initialData?.status != null
          ? (eventStatus.find((status) => status.value == initialData?.status)
              ?.name ?? "")
          : "",
      bet: initialData?.bet ?? "",
      coast: initialData?.coast ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      match: null,
      status: null,
      bet: null,
      coast: null,
    });
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onMatchChange = (name: string, match: Match) => {
    setFormData({ ...formData, [name]: match });
  };

  const validateForm = () => {
    const errors: EventFormErrors = {
      match: null,
      status: null,
      bet: null,
      coast: null,
    };

    if (formData.match === null) {
      errors.match = "Le match doit être défini";
    }

    if (formData.status?.length === 0) {
      errors.status = "Le status doit être défini";
    }

    if (formData.bet?.length === 0) {
      errors.bet = "Le pari doit être défini";
    }

    if (isNaN(parseFloat(formData.coast ?? ""))) {
      errors.coast = "La cote doit être nombre";
    } else if (parseFloat(`${formData.coast}`) < 1) {
      errors.coast = "La cote minimum est 1";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const event = new Event(
          formData.match!,
          eventStatus.find((item) => item.name === formData.status)?.value ??
            "lost",
          formData.bet!,
          formData.coast!,

          new Date(),
          initialData?.id,
        );

        if (event?.id) {
          const updatedEvent = await updateEvent(event);

          if (typeof updateEvent === "string") {
            setActionResultMessage(updateEvent);
            toggleModal("action-result-message");
          } else if (updatedEvent) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le combiné a été mise à jour avec succès");
            toggleModal("action-result-message");
            fetchEvents(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newEvent = await addEvent(event);

          if (typeof newEvent === "string") {
            setActionResultMessage(newEvent);
            toggleModal("action-result-message");
          } else if (newEvent) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le combiné a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchEvents(searchValue);
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
    onMatchChange,
    onFormSubmit,
  };
};

export default useEventForm;
