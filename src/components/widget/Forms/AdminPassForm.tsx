import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import User from "@/models/user.model";
import useAdminPassForm from "@/hooks/forms/useAdminPassForm.hook";

interface AdminPassFormProps {
  id: string;
  user: User;
}

const AdminPassForm: FC<AdminPassFormProps> = ({ id, user }) => {
  const {
    processing,
    passwordData,
    passwordDataError,
    resetPasswordData,
    resetPasswordDataError,
    onInputDataChange,
    onFormSubmit,
  } = useAdminPassForm(id, user);

  return (
    <Modal
      id={id}
      onClose={() => {
        resetPasswordData();
        resetPasswordDataError();
      }}
    >
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          <p className="my-4 flex items-center justify-center text-center text-lg font-bold text-red-500">
            Attenttion! Cet utilisateur sera définitivement supprimé. Entrez
            votre mot de passe pour continuer
          </p>
          <div className="mb-4">
            <AppInput
              label="Mot de passe"
              id={`${id}-password`}
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={passwordData}
              onChange={onInputDataChange}
            />
            {passwordDataError && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {passwordDataError}
              </p>
            )}
          </div>

          <div className="mb-5 mt-7 flex justify-center">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={"Valider"}
                width="w-[200px]"
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminPassForm;
