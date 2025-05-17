
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

const useNetworkForm = (modalId: string, initialData?: Network) => {
  const { searchValue } = useSearchStore();
  const { addNetwork, updateNetwork, fetchNetwork } = useNetworkStore();

  const [formData, setFormData] = useState<NetworkFormData>({
    name: initialData?.name ?? "",
    placeholder: initialData?.placeholder ?? "",
    public_name: initialData?.publicName ?? "",
    country_code: initialData?.countryCode ?? "BJ",
    indication: initialData?.indication ?? "229",
    image: initialData?.image ?? "",
    message_init: initialData?.messageInit,
    deposit_api: initialData?.deposit_api ?? "bpay",
    withdrawal_api: initialData?.withdrawal_api ?? "bpay",
    otp_required: initialData?.otp_required ?? false,
  });

  const [formErrors, setFormErrors] = useState<NetworkFormErrors>({
    name: null,
    placeholder: null,
    public_name: null,
    country_code: null,
    indication: null,
    image: null,
    deposit_api: null,
    withdrawal_api: null,
    otp_required: false,
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      name: initialData?.name ?? "",
      placeholder: initialData?.placeholder ?? "",
      public_name: initialData?.publicName ?? "",
      country_code: initialData?.countryCode ?? "BJ",
      indication: initialData?.indication ?? "229",
      image: initialData?.image ?? "",
      message_init: initialData?.messageInit,
      deposit_api: initialData?.deposit_api ?? "bpay",
      withdrawal_api: initialData?.withdrawal_api ?? "bpay",
      otp_required: initialData?.otp_required ?? false,
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      name: "",
      placeholder: null,
      public_name: null,
      country_code: null,
      indication: null,
      image: null,
      deposit_api: null,
      withdrawal_api: null,
      otp_required: false,
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
      [name]: name === "image" ? files?.[0] : value,
    });
  };

  const onInputDataSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = async () => {
    const errors: NetworkFormErrors = {
      name: null,
      placeholder: null,
      public_name: null,
      country_code: null,
      indication: null,
      image: null,
      deposit_api: null,
      withdrawal_api: null,
      otp_required: false,
    };

    if (!formData.name.trim()) {
      errors.name = "Veuillez choisir un réseau";
    }
    if (!formData.public_name.trim()) {
      errors.public_name = "Le nom du réseau est requis";
    }
    if (!formData.placeholder.trim()) {
      errors.placeholder = "Un exemple de numero est requis ";
    }
    if (!formData.country_code.trim()) {
      errors.country_code = "Le nom du pays est requis";
    }
    if (!formData.deposit_api.trim()) {
      errors.deposit_api = "L'API de dépôt est requise";
    }
    if (!formData.withdrawal_api.trim()) {
      errors.withdrawal_api = "L'API de retrait est requise";
    }

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

        const network = new Network(
          formData.name,
          logoUrl.length != 0 ? logoUrl : (formData.image as string),
          initialData?.createdAt ?? new Date(),
          formData.placeholder,
          formData.public_name,
          formData.country_code,
          formData.indication,
          formData.otp_required,
          // Pass the ID of the initial data if it exists, otherwise pass undefined
          initialData?.id,
          formData.deposit_api,
          formData.withdrawal_api
        );

        // If network has an ID, it's an update
        if (network?.id) {
          // Send PATCH request to the API
          if (network.id) {
            try {
              const endpoint = `https://api.yapson.net/yapson/network/${network.id}/`;
              
              // Prepare payload
              const payload = {
                name: formData.name,
                image: logoUrl.length != 0 ? logoUrl : (formData.image as string),
                placeholder: formData.placeholder,
                public_name: formData.public_name,
                country_code: formData.country_code.toLowerCase(),
                indication: formData.indication,
                message_init: formData.message_init,
                deposit_api: formData.deposit_api,
                withdrawal_api: formData.withdrawal_api
              };
              
              // Make PATCH request
              await api.patch(endpoint, payload);
            } catch (error) {
              console.error("Error updating network via API:", error);
            }
          }

          const updatedNetwork = await updateNetwork(network);

          if (typeof updatedNetwork === "string") {
            setActionResultMessage(updatedNetwork);
            toggleModal("action-result-message");
          } else if (updatedNetwork) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le réseau a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchNetwork(searchValue);
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newNetwork = await addNetwork(network);

          if (typeof newNetwork === "string") {
            setActionResultMessage(newNetwork);
            toggleModal("action-result-message");
          } else if (newNetwork) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le réseau a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchNetwork(searchValue);
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
    setFormData,
  };
};

export default useNetworkForm;
