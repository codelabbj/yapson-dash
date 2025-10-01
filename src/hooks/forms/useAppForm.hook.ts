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
import {
  NetworkFormData,
  NetworkFormErrors,
} from "@/interfaces/network.interface";
import App from "@/models/app.model";
import useAppStore from "@/store/useApp.store";
import { AppFormData, AppFormErrors } from "@/interfaces/app.interface";

const useAppForm = (modalId: string, initialData?: App) => {
  const { searchValue } = useSearchStore();
  const { addApp, updateApp, fetchApp } = useAppStore();

  const [formData, setFormData] = useState<AppFormData>({
    name : initialData?.name ?? "",
    image : initialData?.image ?? "",
    hash : initialData?.hash ?? "",
    cashdeskid : initialData?.cashdeskid ?? "",
    cashierpass : initialData?.cashierpass ?? "",
    deposit_tuto_content : initialData?.deposit_tuto_content ?? "",
    deposit_link : initialData?.deposit_link ?? "",
    withdrawal_tuto_content : initialData?.withdrawal_tuto_content ?? "",
    withdrawal_link : initialData?.withdrawal_link ?? "",
    order : initialData?.order ?? "",
    city : initialData?.city ?? "",
    street : initialData?.city ?? "",
    id : initialData?.id ?? undefined,
    max_deposit: initialData?.max_deposit ?? "",
    minimun_deposit: initialData?.minimun_deposit ?? "",
    minimun_with: initialData?.minimun_with ?? "",
    max_win: initialData?.max_win ?? "",
    enable: initialData?.enable ?? false,
  });

  const [formErrors, setFormErrors] = useState<AppFormErrors>({
    name: null,
    image: null,
    hash: null,
    cashdeskid: null,
    cashierpass: null,
    deposit_tuto_content: null,
    deposit_link: null,
    withdrawal_tuto_content: null,
    withdrawal_link: null,
    order: null,
    city: null,
    street: null,
    max_deposit: null,
    minimun_deposit: null,
    minimun_with: null,
    max_win: null,
    enable: null,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
        name : initialData?.name ?? "",
        image : initialData?.image ?? "",
        hash : initialData?.hash ?? "",
        cashdeskid : initialData?.cashdeskid ?? "",
        cashierpass : initialData?.cashierpass ?? "",
        deposit_tuto_content : initialData?.deposit_tuto_content ?? "",
        deposit_link : initialData?.deposit_link ?? "",
        withdrawal_tuto_content : initialData?.withdrawal_tuto_content ?? "",
        withdrawal_link : initialData?.withdrawal_link ?? "",
        order : initialData?.order ?? "",
        city : initialData?.city ?? "",
        street : initialData?.city ?? "",
        id : initialData?.id ?? undefined,
        max_deposit: initialData?.max_deposit ?? "",
        minimun_deposit: initialData?.minimun_deposit ?? "",
        minimun_with: initialData?.minimun_with ?? "",
        max_win: initialData?.max_win ?? "",
        enable: initialData?.enable ?? false,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
        name: null,
        image: null,
        hash: null,
        cashdeskid: null,
        cashierpass: null,
        deposit_tuto_content: null,
        deposit_link: null,
        withdrawal_tuto_content: null,
        withdrawal_link: null,
        order: null,
        city: null,
        street: null,
        max_deposit: null,
        minimun_deposit: null,
        minimun_with: null,
        max_win: null,
        enable: null,
    });
  };

  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );

  const onInputDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement >,
  ) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === "image" ? files?.[0] : value,
    });
  };

  const onInputDataSelectChange = (
    e: React.ChangeEvent< HTMLSelectElement >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = async () => {
    const errors: AppFormErrors = {
        name: null,
        image: null,
        hash: null,
        cashdeskid: null,
        cashierpass: null,
        deposit_tuto_content: null,
        deposit_link: null,
        withdrawal_tuto_content: null,
        withdrawal_link: null,
        order: null,
        city: null,
        street: null,
        max_deposit: null,
        minimun_deposit: null,
        minimun_with: null,
        max_win: null,
        enable: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Veuillez choisir un réseau";
    }
    if (!formData.cashdeskid.trim()) {
      errors.cashdeskid = "Le Cashdeskid est requis";
    }
    if (!formData.cashierpass.trim()) {
        errors.cashierpass = "Le Cashierpass est requis";
    }
    // if (!formData.deposit_tuto_content.trim()) {
    //     errors.cashierpass = "Le processus de depot est requis";
    // }

    // if (!formData.deposit_link.trim()) {
    //   errors.deposit_link = "Le lien de démo du depot est requis";
    // }

    // if (!formData.withdrawal_tuto_content.trim()) {
    //     errors.deposit_link = "Le processus de retrait est requis";
    // }

    // if (!formData.withdrawal_link.trim()) {
    //     errors.deposit_link = "Le lien de démo du retrait est requis";
    // }

    if (!formData.city.trim()) {
        errors.city = "La nom de la ville est requis";
    }

    if (!formData.street.trim()) {
        errors.city = "La Rue est requis";
    }

    // else if (formData.name.length < 3) {
    //   errors.name = "Le club doit contenir au moins trois caractères";
    // } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
    //   errors.name =
    //     "Le nom du club doit contenir uniquement des lettres et des espaces";
    // }

    if (!formData.image) {
      errors.image = "L'image du reseau est requis";
    } else if (typeof formData.image === "string") {
      const valid = await validateLogoUrl(formData.image);
      if (!valid) {
        errors.image = "L'image doit être de type (JPEG, PNG, GIF).";
      }
    } else if (
      formData.image instanceof File &&
      !["image/jpeg", "image/png", "image/gif"].includes(formData.image.type)
    ) {
      errors.image = "L'image doit être de type (JPEG, PNG, GIF).";
    }

    if (!(formData.minimun_deposit ?? '').trim()) {
      errors.minimun_deposit = "Le dépôt minimum est requis";
    }
    if (!(formData.max_deposit ?? '').trim()) {
      errors.max_deposit = "Le dépôt maximum est requis";
    }
    if (!(formData.minimun_with ?? '').trim()) {
      errors.minimun_with = "Le retrait minimum est requis";
    }
    if (!(formData.max_win ?? '').trim()) {
      errors.max_win = "Le gain maximum est requis";
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
        if (formData.image instanceof File) {
          logoUrl = await uploadImage(formData.image!);
        }
        // const club = new Club(
        //   formData.name,
        //   logoUrl.length != 0 ? logoUrl : (formData.logo as string),
        //   initialData?.createdAt ?? new Date(),
        //   initialData?.id,
        // );
        const app = new App(
          formData.name,
          logoUrl.length != 0 ? logoUrl : (formData.image as string),
          formData.hash,
          formData.cashdeskid,
          formData.cashierpass,
          formData.deposit_tuto_content,
          formData.deposit_link,
          formData.withdrawal_tuto_content,
          formData.withdrawal_link,
          "",
          formData.city,
          formData.street,
          formData.max_deposit,
          formData.minimun_deposit,
          formData.minimun_with,
          formData.max_win,
          formData.enable,
          formData.id
        );

        if (app?.id) {
          const updatedApp = await updateApp(app);

          if (typeof updatedApp === "string") {
            setActionResultMessage(updatedApp);
            toggleModal("action-result-message");
          } else if (updatedApp) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le club a été mise à jour avec succès");
            toggleModal("action-result-message");
            fetchApp(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newApp = await addApp(app);

          if (typeof newApp === "string") {
            setActionResultMessage(newApp);
            toggleModal("action-result-message");
          } else if (newApp) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le club a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchApp(searchValue);
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
    onInputDataSelectChange,
    setFormData
  };
};

export default useAppForm;
