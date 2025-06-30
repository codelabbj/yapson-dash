import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useAdvertisementForm from "@/hooks/forms/useAdvertisementForm.hook";
import Advertisement from "@/models/advertisement.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import AppTextArea from "../Form/TextArea";
import AppCheckbox from "../Form/Checkbox";

interface AdvertisementFormProps {
  id: string;
  advertisement?: Advertisement;
}

const AdvertisementForm: FC<AdvertisementFormProps> = ({
  id,
  advertisement,
}) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onStatusChange,
    onTextAreaDataChange,
    onInputDataChange,
    setFormData,
    onFormSubmit,
  } = useAdvertisementForm(id, advertisement);

  useEffect(() => {
    setFormData({
      content: advertisement?.content ?? "",
      image: advertisement?.image ?? "",
      enable: advertisement?.enable ?? false,
    });
  }, [setFormData]);

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
          {/*<div className="mb-4">
            <AppTextArea
              label="Contenu"
              id="content"
              name="content"
              placeholder="Contenu"
              value={formData.content}
              onChange={onTextAreaDataChange}
            />
            {formErrors.content && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.content}
              </p>
            )}
          </div>*/}
          <div className="mb-6">
            <AppInput
              label="Image"
              id="image"
              name="image"
              type="file"
              placeholder="Image"
              value={formData.image}
              onChange={onInputDataChange}
            />
            {formErrors.image && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.image}
              </p>
            )}
          </div>

          <div className="mb-6">
            <AppCheckbox
              key={`${formData.enable}-${new Date().toDateString()}`}
              label="Statut"
              id="enable"
              name="enable"
              value={formData.enable}
              onChange={onStatusChange}
            />
            {formErrors.enable && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.enable}
              </p>
            )}
          </div>
          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${advertisement?.id ? "Mettre à jour" : "Ajouter"}`}
                type="submit"
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdvertisementForm;
