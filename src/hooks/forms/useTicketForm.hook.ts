import useTicketStore from "@/store/useTicket.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal, uploadImage } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import {
  TicketFormData,
  TicketFormDataV2,
  TicketFormErrors,
  TicketFormErrorsV2,
} from "@/interfaces/ticket.interface";
import Ticket from "@/models/ticket.model";
import Event from "@/models/event.model";
import { SelectItemProps } from "../../components/widget/Form/Select";
import useSearchStore from "@/store/useSearchStore.store";

export const ticketStatus: SelectItemProps[] = [
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
];

export const ticketSubscriptions: SelectItemProps[] = [
  {
    name: "Gratuit",
    value: "free",
  },
  {
    name: "VIP",
    value: "vip",
  },
];

const useTicketForm = (modalId: string, initialData?: Ticket) => {
  const { searchValue } = useSearchStore();
  const { addTicket, updateTicket, fetchTickets } = useTicketStore();

  const [formData, setFormData] = useState<TicketFormDataV2>({
    image: initialData?.images ?? [],
    betapp: initialData?.betapp ?? "",
    code: initialData?.code ?? "",
  });

  const [formErrors, setFormErrors] = useState<TicketFormErrorsV2>({
    image: null,
    betapp: null,
    code: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      image: initialData?.images ?? [],
      betapp: initialData?.betapp ?? "",
      code: initialData?.code ?? "",
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      image: null,
      betapp: null,
      code: null,
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

    let files: File[] = [];

    if ((e.target as any).files) files = (e.target as any).files;
    console.log("Files ", files);

    setFormData({
      ...formData,
      [name]: name === "image" ? files : value,
    });
    console.log("formData ", formData);
  };

  // const onEventChange = (name: string, event: Event) => {
  //   if (!formData.events.find((evt) => evt.id == event.id))
  //     setFormData({ ...formData, [name]: [...formData.events, event] });
  // };

  // const removeEvent: (event: Event) => void = (event: Event) => {
  //   setFormData({
  //     ...formData,
  //     events: formData.events.filter((evt) => evt.id !== event.id),
  //   });
  // };

  const validateForm = () => {
    const errors: TicketFormErrorsV2 = {
      image: null,
      betapp: null,
      code: null,
    };

    if (formData.image.length === 0) {
      errors.image = "Veuillez choisir au mois une image";
    }

    if (!formData.betapp || formData.betapp.trim() === "") {
      errors.betapp = "Veuillez sélectionner une application";
    }

    if (!formData.code || formData.code.trim() === "") {
      errors.code = "Veuillez saisir un code";
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submitted ", typeof formData.image);

    if (validateForm()) {
      setProcessing(true);

      let images: (string | File)[] = [];

      // [...formData.image].forEach(async (element) => {
      //   if (element instanceof File) {
      //     images.push(await uploadImage(element));
      //   }
      // });

      for (const image of [...formData.image]) {
        images.push(await uploadImage(image as File));
      }
      console.log("formData.image ", images);

      try {
        const ticket = new Ticket(
          formData.betapp!,
          images as string[],
          initialData?.id,
          formData.code,
        );

        if (ticket?.id) {
          const updatedTicket = await updateTicket(ticket);

          if (typeof updatedTicket === "string") {
            setActionResultMessage(updatedTicket);
            toggleModal("action-result-message");
          } else if (updatedTicket) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le coupon a été mise à jour avec succès");
            toggleModal("action-result-message");
            fetchTickets(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newTicket = await addTicket(ticket);

          if (typeof newTicket === "string") {
            setActionResultMessage(newTicket);
            toggleModal("action-result-message");
          } else if (newTicket) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le coupon a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchTickets(searchValue);
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

export default useTicketForm;
