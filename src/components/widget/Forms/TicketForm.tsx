import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import useTicketForm, {
  ticketStatus,
  ticketSubscriptions,
} from "@/hooks/forms/useTicketForm.hook";
import Championship from "@/models/championship.model";
import Club from "@/models/club.model";
import Event from "@/models/event.model";
import Match from "@/models/match.model";
import Sport from "@/models/sport.model";
import Ticket from "@/models/ticket.model";
import useEventStore from "@/store/useEvent.store";
import { ArrowRightLeft, ChevronDown, Trash, X } from "lucide-react";
import { FC, useState } from "react";
import EventCard from "../EventCard";
import AppButton from "../Form/Button";
import AppInput from "../Form/Input";
import ItemSelector from "../Form/ItemSelector";
import Modal from "../Form/Modal";
import AppSelect, { SelectItemProps } from "../Form/Select";
import BetApp from "@/models/betapp.model";

interface TicketFormProps {
  id: string;
  ticket?: Ticket;
  apps: BetApp[];
}

const TicketForm: FC<TicketFormProps> = ({ id, ticket, apps }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onFormSubmit,
  } = useTicketForm(id, ticket);

  const { researchAddEvent, researchEvents } = useEventStore();

  const [dynamicKey, setDynamicKey] = useState(new Date().toDateString());

  return (
    <Modal
      id={id}
      onClose={() => {
        resetFormData();
        resetFormErrors();
        setDynamicKey(`${new Date().getMilliseconds()}`);
      }}
    >
      <div className=" dark:border-strokedark">
        <form onSubmit={onFormSubmit}>
          {ticket && (
            <div className="mb-5 flex flex-col items-center justify-center">
              <span className="mb-2 text-xl font-medium text-boxdark dark:text-white">
                Mettez a jour un coupon
              </span>
            </div>
          )}
          
          <div className="mb-4">
            <AppSelect
              id="bet_app_id"
              name="bet_app_id"
              label="Application"
              items={apps.map(app => ({
                name: app.name,
                value: app.id ? app.id.toString() : ""
              }))}
              icon={<ChevronDown />}
              value={formData.bet_app_id || ""}
              onChange={onInputDataChange}
            />
            {formErrors.bet_app_id && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.bet_app_id}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppInput
              label="Code"
              id="code"
              name="code"
              type="text"
              placeholder="Code"
              value={formData.code}
              onChange={onInputDataChange}
            />
            {formErrors.code && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.code}
              </p>
            )}
          </div>

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${ticket?.id ? "Mettre à jour" : "Ajouter"}`}
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

export default TicketForm;
