import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Sport from "@/models/sport.model";
import useSportForm from "@/hooks/forms/useSport.hook";
import useDepositForm, {
  depositStatus,
} from "@/hooks/forms/useDepositForm.hook";
import Deposit from "@/models/deposit.model";
import Image from "next/image";
import AppSelect from "../Form/Select";
import { ArrowRightLeft } from "lucide-react";
import AppApi from "@/api/app.api";
import App from "@/models/app.model";
import { eventStatus } from "@/hooks/forms/useEventForm.hook";

interface DepositFormProps {
  id: string;
  deposit?: Deposit;
}

const DepositForm: FC<DepositFormProps> = ({ id, deposit }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
    setFormData,
  } = useDepositForm(id, deposit);

  const [apps, setApps] = useState<App[]>([]);

  const fetchApps = async () => {
    try {
      const apps = await AppApi.findMany();
      setApps(apps);
    } catch (e) {
      console.log("Error occured while fetching apps for deposit form ", e);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

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
          <div className="mb-10">
            <AppInput
              label="Montant"
              id="amount"
              name="amount"
              type="number"
              placeholder="Montant"
              value={formData.amount}
              onChange={onInputDataChange}
            />
            {formErrors.amount && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.amount}
              </p>
            )}
          </div>

          {apps.length && (
            <div className="mb-4">
              <AppSelect
                id="bet_app_id"
                name="bet_app_id"
                label="App de pari"
                items={apps.map((e) => {
                  return {
                    name: e.name,
                    value: e.id ?? "",
                  };
                })}
                value={formData.bet_app_id ?? ""}
                onChange={(e) => {
                  console.log({
                    ...formData,
                    bet_app_id: e.target.value,
                  });
                  setFormData({
                    ...formData,
                    bet_app_id: e.target.value,
                  });
                }}
                icon={
                  <ArrowRightLeft
                    className="text-black dark:text-white"
                    size={25}
                  />
                }
              />
              {formErrors.bet_app_id && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.bet_app_id}
                </p>
              )}
            </div>
          )}

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${deposit?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DepositForm;
