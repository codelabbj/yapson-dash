import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";

interface ClubFormProps {
  id: string;
  club?: Club;
}

const ClubForm: FC<ClubFormProps> = ({ id, club }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
  } = useClubForm(id, club);

  return (
    <Modal
      id={id}
      onClose={() => {
        resetFormData();
        resetFormErrors();
      }}
    >
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <div className="mb-4">
            <AppInput
              label="Nom"
              id="name"
              name="name"
              type="text"
              placeholder="Nom"
              value={formData.name}
              onChange={onInputDataChange}
            />
            {formErrors.name && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="mb-6">
            <AppInput
              label="Logo"
              id="logo"
              name="logo"
              type="file"
              placeholder="Logo"
              value={formData.logo}
              onChange={onInputDataChange}
            />
            {formErrors.logo && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.logo}
              </p>
            )}
          </div>
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${club?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ClubForm;
