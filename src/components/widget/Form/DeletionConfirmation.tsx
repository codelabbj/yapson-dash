import { FC, useState } from "react";
import Modal from "./Modal";
import AppButton from "./Button";
import { delay, toggleModal } from "@/utils/functions.util";
import useInterfaceStore from "@/store/useInterface.store";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";

interface DeletionConfirmationProps {
  id: string;
  message: string;
  successMessage: string;
  objectId: string;
  deleteText?: string;
  onDelete: (id: string) => Promise<boolean | undefined>;
}

const DeletionConfirmation: FC<DeletionConfirmationProps> = ({
  id,
  message,
  successMessage,
  objectId,
  deleteText,
  onDelete,
}) => {
  const setActionResultMessage = useInterfaceStore(
    (state) => state.setActionResultMessage,
  );
  const [deleting, setDeleting] = useState(false);

  return (
    <Modal id={id}>
      <div className=" flex flex-col items-center justify-center self-center p-3 text-[14px]  text-black dark:text-white sm:text-[15px] md:text-[16px] lg:text-[17px]">
        <p className="text-md my-5 text-center font-medium">{message}</p>
        <div className="mb-1 mt-4 flex w-full flex-col items-center justify-evenly lg:flex-row ">
          <AppButton
            name="Fermer"
            width="w-[150px] mb-3 lg:mr-3 lg:mb-0"
            onClick={() => {
              toggleModal(id);
            }}
          />
          {deleting ? (
            <ProcessingLoader />
          ) : (
            <AppButton
              name={deleteText ?? `Supprimer `}
              width="w-[150px]"
              color="bg-red-500"
              onClick={async () => {
                setDeleting(true);

                const deleted = await onDelete(objectId);

                if (deleted == true) {
                  toggleModal(id);
                  setActionResultMessage(successMessage);
                  toggleModal("action-result-message");
                  await delay({ milliseconds: 500 });
                  toggleModal("action-result-message");
                } else {
                  setActionResultMessage("Une erreur s'est produite");
                  toggleModal("action-result-message");
                }

                setDeleting(false);
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeletionConfirmation;
