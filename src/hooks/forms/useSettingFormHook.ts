import {
  SettingFormData,
  SettingFormErrors,
} from "@/interfaces/setting.interface";
import Setting from "@/models/Setting.model";
import useSettingStore from "@/store/useSetting.store";
import useInterfaceStore from "@/store/useInterface.store";
import { delay, toggleModal } from "@/utils/functions.util";
import { useEffect, useState } from "react";
import { generateUniqueId } from "@/components/widget/Form/country/utils";

const useSettingForm = (modalId: string, initialData?: Setting) => {
  const { addSetting, updateSetting, fetchSettings } = useSettingStore();

  const [formData, setFormData] = useState<SettingFormData>({
    id: initialData?.id ?? undefined,
    minimumDeposit: initialData?.minimumDeposit ?? "",
    minimumWithdrawal: initialData?.minimumWithdrawal ?? "",
    bonusPercent: initialData?.bonusPercent ?? "",
    moovPassword: initialData?.moovPassword ?? "",
    mtnPassword: initialData?.mtnPassword ?? "",
    sbinPassword: initialData?.sbinPassword ?? "",
    cardPassword: initialData?.cardPassword ?? "",
    mtnUrl: initialData?.mtnUrl ?? "",
    moovUrl: initialData?.moovUrl ?? "",
    cardUrl: initialData?.cardUrl ?? "",
    sbinUrl: initialData?.sbinUrl ?? "",
    hash: initialData?.hash ?? "",
    cashDeskId: initialData?.cashDeskId ?? "",
    cashierPass: initialData?.cashierPass ?? "",
    moovCustomer: initialData?.moovCustomer ?? "",
    mtnCustomer: initialData?.mtnCustomer ?? "",
    cardCustomer: initialData?.cardCustomer ?? "",
    sbinCustomer: initialData?.sbinCustomer ?? "",
    moovDisUrl: initialData?.moovDisUrl ?? "",
    mtnDisUrl: initialData?.mtnDisUrl ?? "",
    rewardMiniWithdrawal: initialData?.rewardMiniWithdrawal ?? "",
    qosicUsername: initialData?.qosicUsername ?? "",
    whatsappPhoneIndi: initialData?.whatsappPhoneIndi ?? "",
    whatsappPhone: initialData?.whatsappPhone ?? "",
    subscriptionPrice: initialData?.subscriptionPrice ?? "",
    transactionCharges:
      initialData?.transactionCharges.map((e) => {
        return {
          ...e,
          slug: generateUniqueId(),
        };
      }) ?? [],
      

    referral_bonus: initialData?.referral_bonus ?? false,
    deposit_reward: initialData?.deposit_reward ?? false,
    deposit_reward_percent: initialData?.deposit_reward_percent ?? 0,
    min_version: initialData?.min_version ?? 0, // New field
    last_version: initialData?.last_version ?? 0, // New field
    dowload_apk_link: initialData?.dowload_apk_link ?? "", // New field
  
  });

  const [formErrors, setFormErrors] = useState<SettingFormErrors>({
    minimumDeposit: null,
    minimumWithdrawal: null,
    bonusPercent: null,
    moovPassword: null,
    mtnPassword: null,
    sbinPassword: null,
    cardPassword: null,
    mtnUrl: null,
    moovUrl: null,
    cardUrl: null,
    sbinUrl: null,
    hash: null,
    cashDeskId: null,
    cashierPass: null,
    moovCustomer: null,
    mtnCustomer: null,
    cardCustomer: null,
    sbinCustomer: null,
    moovDisUrl: null,
    mtnDisUrl: null,
    rewardMiniWithdrawal: null,
    qosicUsername: null,
    whatsappPhoneIndi: null,
    whatsappPhone: null,
    subscriptionPrice: null,
    transactionCharges: null,
    referral_bonus: null,
    deposit_reward: null,
    deposit_reward_percent: null,
    min_version: null, // New field
    last_version: null, // New field
    dowload_apk_link: null, // New field
  });

  const [processing, setProcessing] = useState<boolean>(false);

  const resetFormData = () => {
    setFormData({
      id: initialData?.id ?? undefined,
      minimumDeposit: initialData?.minimumDeposit ?? "",
      minimumWithdrawal: initialData?.minimumWithdrawal ?? "",
      bonusPercent: initialData?.bonusPercent ?? "",
      moovPassword: initialData?.moovPassword ?? "",
      mtnPassword: initialData?.mtnPassword ?? "",
      sbinPassword: initialData?.sbinPassword ?? "",
      cardPassword: initialData?.cardPassword ?? "",
      mtnUrl: initialData?.mtnUrl ?? "",
      moovUrl: initialData?.moovUrl ?? "",
      cardUrl: initialData?.cardUrl ?? "",
      sbinUrl: initialData?.sbinUrl ?? "",
      hash: initialData?.hash ?? "",
      cashDeskId: initialData?.cashDeskId ?? "",
      cashierPass: initialData?.cashierPass ?? "",
      moovCustomer: initialData?.moovCustomer ?? "",
      mtnCustomer: initialData?.mtnCustomer ?? "",
      cardCustomer: initialData?.cardCustomer ?? "",
      sbinCustomer: initialData?.sbinCustomer ?? "",
      moovDisUrl: initialData?.moovDisUrl ?? "",
      mtnDisUrl: initialData?.mtnDisUrl ?? "",
      rewardMiniWithdrawal: initialData?.rewardMiniWithdrawal ?? "",
      qosicUsername: initialData?.qosicUsername ?? "",
      whatsappPhoneIndi: initialData?.whatsappPhoneIndi ?? "",
      whatsappPhone: initialData?.whatsappPhone ?? "",
      subscriptionPrice: initialData?.subscriptionPrice ?? "",
      transactionCharges: initialData?.transactionCharges ?? [],

      referral_bonus: initialData?.referral_bonus ?? false,
      deposit_reward: initialData?.deposit_reward ?? false,
      deposit_reward_percent: initialData?.deposit_reward_percent ?? 0,
      min_version: initialData?.min_version ?? 0, // New field
      last_version: initialData?.last_version ?? 0, // New field
      dowload_apk_link: initialData?.dowload_apk_link ?? "", // New field
    });
  };

  const resetFormErrors = () => {
    setFormErrors({
      minimumDeposit: null,
      minimumWithdrawal: null,
      bonusPercent: null,
      moovPassword: null,
      mtnPassword: null,
      sbinPassword: null,
      cardPassword: null,
      mtnUrl: null,
      moovUrl: null,
      cardUrl: null,
      sbinUrl: null,
      hash: null,
      cashDeskId: null,
      cashierPass: null,
      moovCustomer: null,
      mtnCustomer: null,
      cardCustomer: null,
      sbinCustomer: null,
      moovDisUrl: null,
      mtnDisUrl: null,
      rewardMiniWithdrawal: null,
      qosicUsername: null,
      whatsappPhoneIndi: null,
      whatsappPhone: null,
      subscriptionPrice: null,
      transactionCharges: null,
      referral_bonus: null,
      deposit_reward: null,
      deposit_reward_percent: null,
      min_version: null, // New field
      last_version: null, // New field
      dowload_apk_link: null, // New field
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
    const errors: SettingFormErrors = {
      minimumDeposit: null,
      minimumWithdrawal: null,
      bonusPercent: null,
      moovPassword: null,
      mtnPassword: null,
      sbinPassword: null,
      cardPassword: null,
      mtnUrl: null,
      moovUrl: null,
      cardUrl: null,
      sbinUrl: null,
      hash: null,
      cashDeskId: null,
      cashierPass: null,
      moovCustomer: null,
      mtnCustomer: null,
      cardCustomer: null,
      sbinCustomer: null,
      moovDisUrl: null,
      mtnDisUrl: null,
      rewardMiniWithdrawal: null,
      qosicUsername: null,
      whatsappPhoneIndi: null,
      whatsappPhone: null,
      subscriptionPrice: null,
      transactionCharges: null,
      referral_bonus: null,
      deposit_reward: null,
      deposit_reward_percent: null,
      min_version: null, // New field
      last_version: null, // New field
      dowload_apk_link: null, // New field
    };

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setProcessing(true);

      try {
        const setting = new Setting(
          formData.minimumDeposit,
          formData.minimumWithdrawal,
          formData.bonusPercent,
          formData.moovPassword,
          formData.mtnPassword,
          formData.sbinPassword,
          formData.cardPassword,
          formData.mtnUrl,
          formData.moovUrl,
          formData.cardUrl,
          formData.sbinUrl,
          formData.hash,
          formData.cashDeskId,
          formData.cashierPass,
          formData.moovCustomer,
          formData.mtnCustomer,
          formData.cardCustomer,
          formData.sbinCustomer,
          formData.moovDisUrl,
          formData.mtnDisUrl,
          formData.rewardMiniWithdrawal,
          formData.qosicUsername,
          formData.whatsappPhoneIndi,
          formData.whatsappPhone,
          formData.subscriptionPrice,
          formData?.id ?? "",
          formData.transactionCharges,
          formData.referral_bonus,
          formData.deposit_reward,
          formData.deposit_reward_percent,
          formData.min_version, // New field
          formData.last_version, // New field
          formData.dowload_apk_link, // New field
        );

        if (setting?.id) {
          const updatedSetting = await updateSetting(setting);

          if (typeof updatedSetting === "string") {
            setActionResultMessage(updatedSetting);
            toggleModal("action-result-message");
          } else if (updatedSetting) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le paramètre a été mis à jour avec succès");
            toggleModal("action-result-message");
            fetchSettings();
            await delay({ milliseconds: 500 });
            toggleModal("action-result-message");
          }
        } else {
          const newSetting = await addSetting(setting);
          if (typeof newSetting === "string") {
            setActionResultMessage(newSetting);
            toggleModal("action-result-message");
          } else if (newSetting) {
            resetFormData();
            toggleModal(modalId);
            setActionResultMessage("Le paramètre a été ajouté avec succès");
            toggleModal("action-result-message");
            fetchSettings();
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
    setFormData,

    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
  };
};

export default useSettingForm;
