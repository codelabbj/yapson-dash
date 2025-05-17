import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Event from "@/models/event.model";
import useEventForm, { eventStatus } from "@/hooks/forms/useEventForm.hook";
import ItemSelector from "../Form/ItemSelector";
import useClubStore from "@/store/useClub.store";
import Club from "@/models/club.model";
import AppDateTimePicker from "../Form/DateTimePicker";
import Championship from "@/models/championship.model";
import Sport from "@/models/sport.model";
import useChampionshipStore from "@/store/useChampionship.store";
import Match from "@/models/match.model";
import useMatchForm from "@/hooks/forms/useMatchForm.hook";
import useMatchStore from "@/store/useMatch.store";
import AppSelect from "../Form/Select";
import { ArrowRightLeft } from "lucide-react";

interface EventFormProps {
  id: string;
  event?: Event;
}

const EventForm: FC<EventFormProps> = ({ id, event }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onMatchChange,

    onFormSubmit,
  } = useEventForm(id, event);

  const { researchAddMatch, researchMatches } = useMatchStore();

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
          <div className="mb-4">
            <ItemSelector
              key={`${dynamicKey}-match`}
              modalId={`${id}-match`}
              name="match"
              onItemSelected={onMatchChange}
              defautItem={
                new Match(
                  new Championship("", new Sport("")),
                  new Club("", "", new Date()),
                  new Club("", "", new Date()),
                  new Date(),
                  null,
                  null,
                )
              }
              addItemfn={researchAddMatch}
              getItemsfn={researchMatches}
              itemName={"Match"}
              placeholder="Sélectionner un match"
              item={formData.match}
            />
            {formErrors.match && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.match}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppInput
              label="Pari"
              id="bet"
              name="bet"
              type="text"
              placeholder="Pari"
              value={formData.bet}
              onChange={onInputDataChange}
            />
            {formErrors.bet && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.bet}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppInput
              label="Cote"
              id="coast"
              name="coast"
              type="number"
              placeholder="Cote"
              value={parseFloat(formData.coast ?? "0").toFixed(3)}
              onChange={onInputDataChange}
            />
            {formErrors.coast && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.coast}
              </p>
            )}
          </div>

          <div className="mb-4">
            <AppSelect
              id="status"
              name="status"
              label="Statut"
              items={eventStatus}
              value={formData.status ?? "En attente"}
              onChange={onInputDataChange}
              icon={
                <ArrowRightLeft
                  className="text-black dark:text-white"
                  size={25}
                />
              }
            />
            {formErrors.status && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.status}
              </p>
            )}
          </div>

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${event?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EventForm;
