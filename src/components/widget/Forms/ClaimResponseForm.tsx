import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import useComplaintResponseForm from "@/hooks/forms/useComplaintResponseForm.hook";
import useSportStore from "@/store/useSport.store";
import Complaint from "@/models/complaint.model";
import AppTextArea from "../Form/TextArea";

interface ComplaintResponseFormProps {
  id: string;
  complaint?: Complaint;
}

const ComplaintResponseForm: FC<ComplaintResponseFormProps> = ({
  id,
  complaint,
}) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
  } = useComplaintResponseForm(id, complaint);

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
            <AppTextArea
              label="Message"
              id="complaint"
              name="complaint"
              disabled={true}
              placeholder="Message"
              value={complaint?.message}
              onChange={() => {}}
            />
          </div>
          <div className="mb-4">
            <AppTextArea
              label="Réponse"
              id="response"
              name="response"
              placeholder="Réponse"
              value={formData.response}
              onChange={onInputDataChange}
            />
            {formErrors.response && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.response}
              </p>
            )}
          </div>

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${complaint?.response?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ComplaintResponseForm;
