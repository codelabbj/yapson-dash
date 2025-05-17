/*

import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import useComplaintForm from "@/hooks/forms/useComplaintForm.hook";
import Complaint from "@/models/complaint.model";

interface ComplaintResponseFormProps {
  id: string;
  complaint?: Complaint;
}

const ComplaintResponseForm: FC<ComplaintResponseFormProps> = ({ id, complaint }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
  } = useComplaintForm(id, complaint);

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
              label="Sport"
              id="sport"
              name="sport"
              type="text"
              placeholder="Sport"
              value={formData.sport}
              onChange={onInputDataChange}
            />
            {formErrors.sport && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.sport}
              </p>
            )}
          </div>
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${complaint?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ComplaintForm;


*/
