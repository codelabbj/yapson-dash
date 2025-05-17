"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useSettingForm from "@/hooks/forms/useSettingFormHook";
import Setting from "@/models/Setting.model";
import AppInput from "@/components/widget/Form/Input";
import AppButton from "@/components/widget/Form/Button";
import { useEffect, useLayoutEffect, useState } from "react";
import useSettingStore from "@/store/useSetting.store";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Datetime from "react-datetime";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useAuthSettingForm from "@/hooks/forms/useAuthSettingForm.hook";
import { COUNTRIES } from "@/components/widget/Form/country/country";
import {
  ChevronDown,
  CircleChevronDownIcon,
  Plus,
  SchoolIcon,
} from "lucide-react";
import PHONECODESEN from "@/components/widget/Form/country/indication";
import CountrySelector from "@/components/widget/Form/country/selector";
import { SelectMenuOption } from "@/components/widget/Form/country/types";
import { generateUniqueId } from "@/components/widget/Form/country/utils";
import AppSelect from "@/components/widget/Form/Select";

const Settings = () => {
  const { fetchSettings, settings, loading } = useSettingStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");

  const {
    authSettingFormData,
    authSettingFormErrors,
    authSettingProcessing,
    authSettingOnInputDataChange,
    authSettingOnFormSubmit,
  } = useAuthSettingForm();

  const {
    processing,
    formData,
    formErrors,
    setFormData,
    onInputDataChange,
    onFormSubmit,
  } = useSettingForm(
    "",
    new Setting(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      [],
      true,
      true,
      0.0,
      0,
      0,
      "",
    ),
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (!loading && settings.length > 0) {
      // console.log("This is settings", settings[0]);
      setFormData({
        id: settings[0].id ?? undefined,
        minimumDeposit: settings[0].minimumDeposit ?? "",
        minimumWithdrawal: settings[0].minimumWithdrawal ?? "",
        bonusPercent: settings[0].bonusPercent ?? "",
        moovPassword: settings[0].moovPassword ?? "",
        mtnPassword: settings[0].mtnPassword ?? "",
        sbinPassword: settings[0].sbinPassword ?? "",
        cardPassword: settings[0].cardPassword ?? "",
        mtnUrl: settings[0].mtnUrl ?? "",
        moovUrl: settings[0].moovUrl ?? "",
        cardUrl: settings[0].cardUrl ?? "",
        sbinUrl: settings[0].sbinUrl ?? "",
        hash: settings[0].hash ?? "",
        cashDeskId: settings[0].cashDeskId ?? "",
        cashierPass: settings[0].cashierPass ?? "",
        moovCustomer: settings[0].moovCustomer ?? "",
        mtnCustomer: settings[0].mtnCustomer ?? "",
        cardCustomer: settings[0].cardCustomer ?? "",
        sbinCustomer: settings[0].sbinCustomer ?? "",
        moovDisUrl: settings[0]?.moovDisUrl ?? "",
        mtnDisUrl: settings[0]?.mtnDisUrl ?? "",
        rewardMiniWithdrawal: settings[0]?.rewardMiniWithdrawal ?? "",
        qosicUsername: settings[0]?.qosicUsername ?? "",
        whatsappPhoneIndi: settings[0]?.whatsappPhoneIndi ?? "",
        whatsappPhone: settings[0]?.whatsappPhone ?? "",
        subscriptionPrice: settings[0]?.subscriptionPrice ?? "",
        transactionCharges:
          settings[0]?.transactionCharges?.map((e) => {
            return {
              ...e,
              slug: generateUniqueId(),
            };
          }) ?? [],
        deposit_reward: settings[0].deposit_reward,
        referral_bonus: settings[0].referral_bonus,
        deposit_reward_percent: settings[0]?.deposit_reward_percent ?? 0,
        min_version: settings[0]?.min_version ?? 0, // New field
        last_version: settings[0]?.last_version ?? 0, // New field
        dowload_apk_link: settings[0]?.dowload_apk_link ?? "", // New field
    
      });
    }
  }, [settings, setFormData, loading]);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [openCOuntries, setOpenCOuntries] = useState<string[]>([]);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Paramètre"></Breadcrumb>
        <ActionResult />

        <div className="flex flex-col items-center justify-center  xl:flex-row xl:items-start  ">
          {/* ===============> AUTH <=============== */}
          <div className="mb-10 max-w-125 sm:min-w-90 sm:max-w-100 lg:min-w-125 lg:max-w-132.5 xl:mr-10">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Admin
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={authSettingOnFormSubmit}>
                  <div className="mb-4">
                    <AppInput
                      label="Ancien mot de passe"
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      placeholder="Ancien mot de passe"
                      value={authSettingFormData.oldPassword}
                      onChange={authSettingOnInputDataChange}
                    />
                    {authSettingFormErrors.oldPassword && (
                      <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                        {authSettingFormErrors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <AppInput
                      label="Nouveau mot de passe"
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Nouveau mot de passe"
                      value={authSettingFormData.newPassword}
                      onChange={authSettingOnInputDataChange}
                    />
                    {authSettingFormErrors.newPassword && (
                      <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                        {authSettingFormErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <AppInput
                      label="Confirmation nouveau"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      placeholder="Confirmation nouveau"
                      value={authSettingFormData.confirmNewPassword}
                      onChange={authSettingOnInputDataChange}
                    />
                    {authSettingFormErrors.confirmNewPassword && (
                      <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                        {authSettingFormErrors.confirmNewPassword}
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    {authSettingProcessing ? (
                      <ProcessingLoader />
                    ) : (
                      <AppButton name="Mettre à jour" onClick={() => {}} />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* ===============> AUTH <=============== */}

          {/* ===============> SETTING <=============== */}
          {loading ? (
            <ProcessingLoader />
          ) : (
            <div className="sm:min-w-90 lg:min-w-125">
              <div className="rounded-sm border border-stroke  bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Données
                  </h3>
                  {(!editMode || processing) && (
                    <AppButton
                      name={` ${settings.length != 0 ? "Mettre à jour" : "Ajouter"}`}
                      width="w-[150px]"
                      onClick={() => {
                        setEditMode(true);
                      }}
                    />
                  )}
                </div>
                <div className="p-7">
                  <form onSubmit={onFormSubmit}>
                    <div className="mb-4">
                      <AppInput
                        label="Dépôt minimum"
                        id="minimumDeposit"
                        name="minimumDeposit"
                        type="password"
                        disabled={!editMode}
                        placeholder="Dépôt minimum"
                        value={formData.minimumDeposit}
                        onChange={onInputDataChange}
                      />
                      {formErrors.minimumDeposit && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.minimumDeposit}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Retrait minimum"
                        id="minimumWithdrawal"
                        name="minimumWithdrawal"
                        type="password"
                        disabled={!editMode}
                        placeholder="Retrait minimum"
                        value={formData.minimumWithdrawal}
                        onChange={onInputDataChange}
                      />
                      {formErrors.minimumWithdrawal && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.minimumWithdrawal}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Pourcentage de bonus"
                        id="bonusPercent"
                        name="bonusPercent"
                        type="password"
                        disabled={!editMode}
                        placeholder="Pourcentage de bonus"
                        value={formData.bonusPercent}
                        onChange={onInputDataChange}
                      />
                      {formErrors.bonusPercent && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.bonusPercent}
                        </p>
                      )}
                    </div>

                    {/*<div className="mb-4">
                      <AppInput
                        label="Mot de passe Moov"
                        id="moovPassword"
                        name="moovPassword"
                        type="password"
                        disabled={!editMode}
                        placeholder="Mot de passe Moov"
                        value={formData.moovPassword}
                        onChange={onInputDataChange}
                      />
                      {formErrors.moovPassword && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.moovPassword}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Mot de passe MTN"
                        id="mtnPassword"
                        name="mtnPassword"
                        type="password"
                        disabled={!editMode}
                        placeholder="Mot de passe MTN"
                        value={formData.mtnPassword}
                        onChange={onInputDataChange}
                      />
                      {formErrors.mtnPassword && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.mtnPassword}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Mot de passe SBIN"
                        id="sbinPassword"
                        name="sbinPassword"
                        type="password"
                        disabled={!editMode}
                        placeholder="Mot de passe SBIN"
                        value={formData.sbinPassword}
                        onChange={onInputDataChange}
                      />
                      {formErrors.sbinPassword && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.sbinPassword}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Mot de passe Carte"
                        id="cardPassword"
                        name="cardPassword"
                        type="password"
                        disabled={!editMode}
                        placeholder="Mot de passe Carte"
                        value={formData.cardPassword}
                        onChange={onInputDataChange}
                      />
                      {formErrors.cardPassword && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.cardPassword}
                        </p>
                      )}
                    </div>*/}

                    {/*<div className="mb-4">
                      <AppInput
                        label="Lien MTN"
                        id="mtnUrl"
                        name="mtnUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="Lien MTN"
                        value={formData.mtnUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.mtnUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.mtnUrl}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Lien MOOV"
                        id="moovUrl"
                        name="moovUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="Lien MOOV"
                        value={formData.moovUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.moovUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.moovUrl}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Lien SBIN"
                        id="sbinUrl"
                        name="sbinUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="Lien SBIN"
                        value={formData.sbinUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.sbinUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.sbinUrl}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Lien Carte"
                        id="cardUrl"
                        name="cardUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="Lien Carte"
                        value={formData.cardUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.cardUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.cardUrl}
                        </p>
                      )}
                    </div>

                     <div className="mb-4">
                      <AppInput
                        label="Hash"
                        id="hash"
                        name="hash"
                        type="password"
                        disabled={!editMode}
                        placeholder="Hash"
                        value={formData.hash}
                        onChange={onInputDataChange}
                      />
                      {formErrors.hash && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.hash}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="ID Cash Desk"
                        id="cashDeskId"
                        name="cashDeskId"
                        type="password"
                        disabled={!editMode}
                        placeholder="ID Cash Desk"
                        value={formData.cashDeskId}
                        onChange={onInputDataChange}
                      />
                      {formErrors.cashDeskId && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.cashDeskId}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                    <AppInput
                        label="Cashier Pass"
                        id="cashierPass"
                        name="cashierPass"
                        type="password"
                        disabled={!editMode}
                        placeholder="Cashier Pass"
                        value={formData.cashierPass}
                        onChange={onInputDataChange}
                      />
                      {formErrors.cashierPass && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.cashierPass}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Client MOOV"
                        id="moovCustomer"
                        name="moovCustomer"
                        type="password"
                        disabled={!editMode}
                        placeholder="Client MOOV"
                        value={formData.moovCustomer}
                        onChange={onInputDataChange}
                      />
                      {formErrors.moovCustomer && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.moovCustomer}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Client MTN"
                        id="mtnCustomer"
                        name="mtnCustomer"
                        type="password"
                        disabled={!editMode}
                        placeholder="Client MTN"
                        value={formData.mtnCustomer}
                        onChange={onInputDataChange}
                      />
                      {formErrors.mtnCustomer && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.mtnCustomer}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Client SBIN"
                        id="sbinCustomer"
                        name="sbinCustomer"
                        type="password"
                        disabled={!editMode}
                        placeholder="Client SBIN"
                        value={formData.sbinCustomer}
                        onChange={onInputDataChange}
                      />
                      {formErrors.sbinCustomer && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.sbinCustomer}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Client Card"
                        id="cardCustomer"
                        name="cardCustomer"
                        type="password"
                        disabled={!editMode}
                        placeholder="Client Card"
                        value={formData.cardCustomer}
                        onChange={onInputDataChange}
                      />
                      {formErrors.cardCustomer && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.cardCustomer}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="MOOV Distribution Url"
                        id="moovDisUrl"
                        name="moovDisUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="MOOV Distribution Url"
                        value={formData.moovDisUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.moovDisUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.moovDisUrl}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="MTN Distribution Url"
                        id="mtnDisUrl"
                        name="mtnDisUrl"
                        type="password"
                        disabled={!editMode}
                        placeholder="MTN Distribution Url"
                        value={formData.mtnDisUrl}
                        onChange={onInputDataChange}
                      />
                      {formErrors.mtnDisUrl && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.mtnDisUrl}
                        </p>
                      )}
                    </div>*/}

                    <div className="mb-4">
                      <AppInput
                        label="Minimum Retrait Récompense"
                        id="rewardMiniWithdrawal"
                        name="rewardMiniWithdrawal"
                        type="password"
                        disabled={!editMode}
                        placeholder="Minimum Retrait Récompense"
                        value={formData.rewardMiniWithdrawal}
                        onChange={onInputDataChange}
                      />
                      {formErrors.rewardMiniWithdrawal && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.rewardMiniWithdrawal}
                        </p>
                      )}
                    </div>

                    {/*<div className="mb-4">
                      <AppInput
                        label="Nom d'utilisateur Qosic"
                        id="qosicUsername"
                        name="qosicUsername"
                        type="password"
                        disabled={!editMode}
                        placeholder="Nom d'utilisateur Qosic"
                        value={formData.qosicUsername}
                        onChange={onInputDataChange}
                      />
                      {formErrors.qosicUsername && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.qosicUsername}
                        </p>
                      )}
                    </div>*/}

                    <div className="mb-4">
                      <AppInput
                        label="Indicatif Numéro Whatsapp"
                        id="whatsappPhoneIndi"
                        name="whatsappPhoneIndi"
                        type="password"
                        disabled={!editMode}
                        placeholder="Indicatif Numéro Whatsapp"
                        value={formData.whatsappPhoneIndi}
                        onChange={onInputDataChange}
                      />
                      {formErrors.whatsappPhoneIndi && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.whatsappPhoneIndi}
                        </p>
                      )}
                    </div>

                    

                    <div className="mb-4">
                      <AppInput
                        label="Numéro Whatsapp"
                        id="whatsappPhone"
                        name="whatsappPhone"
                        type="password"
                        disabled={!editMode}
                        placeholder="Numéro Whatsapp"
                        value={formData.whatsappPhone}
                        onChange={onInputDataChange}
                      />
                      {formErrors.whatsappPhone && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.whatsappPhone}
                        </p>
                      )}
                    </div>


                    <div className="mb-4">
                      <AppInput
                        label="Version Minimum"
                        id="min_version"
                        name="min_version"
                        type="number"
                        disabled={!editMode}
                        placeholder="Version Minimum"
                        value={formData.min_version}
                        onChange={onInputDataChange}
                      />
                      {formErrors.min_version && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.min_version}
                        </p>
                      )}
                    </div>


                    <div className="mb-4">
                      <AppInput
                        label="Dernière Version"
                        id="last_version"
                        name="last_version"
                        type="number"
                        disabled={!editMode}
                        placeholder="Dernière Version"
                        value={formData.last_version}
                        onChange={onInputDataChange}
                      />
                      {formErrors.last_version && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.last_version}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Lien de Téléchargement APK"
                        id="dowload_apk_link"
                        name="dowload_apk_link"
                        type="url"
                        disabled={!editMode}
                        placeholder="Lien de Téléchargement APK"
                        value={formData.dowload_apk_link}
                        onChange={onInputDataChange}
                      />
                      {formErrors.dowload_apk_link && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.dowload_apk_link}
                        </p>
                      )}
                    </div>

                    {/*<div className="mb-4">
                      <AppInput
                        label="Prix Abonnement"
                        id="subscriptionPrice"
                        name="subscriptionPrice"
                        type="password"
                        disabled={!editMode}
                        placeholder="Prix Abonnement"
                        value={formData.subscriptionPrice}
                        onChange={onInputDataChange}
                      />
                      {formErrors.subscriptionPrice && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.subscriptionPrice}
                        </p>
                      )}
                    </div>*/}

                    <div className="mb-4">
                      <AppSelect
                        label="Bonus de parainage"
                        id="referral_bonus"
                        name="referral_bonus"
                        icon={<CircleChevronDownIcon />}
                        disabled={!editMode}
                        items={[
                          {
                            value: "true",
                            name: "Oui",
                          },
                          {
                            value: "false",
                            name: "Non",
                          },
                        ]}
                        value={formData.referral_bonus ? "true" : "false"}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            referral_bonus:
                              e.target.value !== "true" ? false : true,
                          });
                        }}
                      />
                      {formErrors.referral_bonus && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.referral_bonus}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppSelect
                        label="Bonus de depot"
                        icon={<CircleChevronDownIcon />}
                        id="deposit_reward"
                        name="deposit_reward"
                        items={[
                          {
                            value: "true",
                            name: "Oui",
                          },
                          {
                            value: "false",
                            name: "Non",
                          },
                        ]}
                        disabled={!editMode}
                        value={formData.deposit_reward ? "true" : "false"}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            deposit_reward:
                              e.target.value !== "true" ? false : true,
                          });
                        }}
                      />
                      {formErrors.deposit_reward && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.deposit_reward}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <AppInput
                        label="Pourcentage de bonus de depot"
                        id="deposit_reward_percent"
                        name="deposit_reward_percent"
                        type={"number"}
                        disabled={!editMode}
                        placeholder="Pourcentage"
                        value={formData.deposit_reward_percent}
                        onChange={onInputDataChange}
                      />
                      {formErrors.deposit_reward_percent && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.deposit_reward_percent}
                        </p>
                      )}
                    </div>

                    {
                      <div className=" mb-2 text-xl font-bold">
                        Pourcentage de retrait
                      </div>
                    }

                    <div className="mb-4">
                      {formData.transactionCharges.map((e) => {
                        const countryCo = COUNTRIES.find(
                          (ctr) =>
                            ctr.value ==
                            Object.keys(PHONECODESEN)
                              .map((key) => [
                                key,
                                (
                                  (PHONECODESEN as any)[key].secondary as string
                                ).replace("+", ""),
                              ])
                              .find(
                                (eel) => eel[1] == e.country_indication,
                              )?.[0],
                        );

                        return (
                          <div key={e.slug}>
                            <div className="mb-8"></div>
                            <div className={"mb-2"}>
                              <CountrySelector
                                id={"countries"}
                                disabled={!editMode}
                                open={isOpen && e.slug == currentSlug}
                                onToggle={() => {
                                  currentSlug == ""
                                    ? setCurrentSlug(e.slug ?? "")
                                    : setCurrentSlug("");
                                }}
                                onChange={async (val) => {
                                  setFormData({
                                    ...formData,
                                    transactionCharges: [
                                      ...formData.transactionCharges.filter(
                                        (elt) => elt.slug != e.slug,
                                      ),
                                      {
                                        country_indication: (
                                          (PHONECODESEN as any)[val as any]
                                            .secondary as string
                                        ).replace("+", ""),
                                        percent: e.percent,
                                        slug: e.slug,
                                      },
                                    ],
                                  });
                                  // formData.country_code = val;
                                  // formData.indication = ((await getCountryCode(val)) as string).replace("+", "");
                                }}
                                // We use this type assertion because we are always sure this find will return a value but need to let TS know since it could technically return null
                                selectedValue={
                                  countryCo ??
                                  (COUNTRIES.find(
                                    (b) => b.value == "BJ",
                                  ) as SelectMenuOption)
                                }
                              />
                            </div>
                            <div className="mb-4">
                              <AppInput
                                label={"Pourcentage"}
                                id={"percent_" + e.slug}
                                name={"percent_" + e.slug}
                                type="number"
                                disabled={!editMode}
                                placeholder=""
                                value={e.percent}
                                onChange={(el) => {
                                  setFormData({
                                    ...formData,
                                    transactionCharges: [
                                      ...formData.transactionCharges.filter(
                                        (elt) =>
                                          elt.country_indication !=
                                          e.country_indication,
                                      ),
                                      {
                                        country_indication:
                                          e.country_indication,
                                        percent: `${el.target.value}`,
                                        slug: e.slug,
                                      },
                                    ],
                                  });
                                  console.log("formdata ", {
                                    ...formData,
                                    transactionCharges: [
                                      ...formData.transactionCharges.filter(
                                        (elt) =>
                                          elt.country_indication !=
                                          e.country_indication,
                                      ),
                                      {
                                        country_indication:
                                          e.country_indication,
                                        percent: `${el.target.value}`,
                                      },
                                    ],
                                  });
                                }}
                              />
                            </div>

                            <div className="mb-8"></div>
                            <hr></hr>
                          </div>
                        );
                      })}
                      {formErrors.whatsappPhone && (
                        <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                          {formErrors.whatsappPhone}
                        </p>
                      )}
                    </div>

                    {!formData.transactionCharges.length && (
                      <div className=" p-7 text-center ">
                        Aucun pourcentage ajouté
                      </div>
                    )}

                    {editMode && (
                      <div
                        onClick={() => {
                          setFormData({
                            ...formData,
                            transactionCharges: [
                              ...formData.transactionCharges,
                              {
                                percent: "0",
                                country_indication: "229",
                                slug: generateUniqueId(),
                              },
                            ],
                          });
                          console.log("formdata ", formData);
                        }}
                        className=" flex w-full cursor-pointer items-center justify-center gap-1 rounded border border-dashed border-primary p-2 text-center"
                      >
                        <div>
                          <Plus />
                        </div>

                        <div className="font-bold text-primary">Ajouter</div>
                      </div>
                    )}

                    <div className="mt-8">
                      {editMode && (
                        <>
                          {!processing ? (
                            <AppButton
                              name={` ${settings.length != 0 ? "Mettre à jour" : "Ajouter"}`}
                              onClick={() => {}}
                            />
                          ) : (
                            <ProcessingLoader />
                          )}
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/* ===============> SETTING <=============== */}
        </div>
      </div>
    </>
  );
};

export default Settings;
