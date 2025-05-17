import useInterfaceStore from "@/store/useInterface.store";
import { FC } from "react";
import Modal from "./Modal";
import AppButton from "./Button";
import { toggleModal } from "@/utils/functions.util";

const ActionResult: FC = () => {
  const actionResultMessage = useInterfaceStore(
    (state) => state.actionResultMessage,
  );

  // const setActionResultMessage = useInterfacesStore(
  //   (state) => state.setActionResultMessage
  // );

  return (
    <Modal id="action-result-message">
      <div className=" flex flex-col items-center justify-center self-center p-3 text-[14px]  text-black dark:text-white sm:text-[15px] md:text-[16px] lg:text-[17px]">
        <p className="text-md my-5 text-center font-medium">
          {actionResultMessage}
        </p>
        <div className="mb-1 mt-4 flex w-full flex-row items-center justify-around">
          <AppButton
            name="Fermer"
            width="w-[200px]"
            onClick={() => {
              toggleModal("action-result-message");
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ActionResult;
