import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import AppButton from "../Form/Button";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import Match from "@/models/match.model";
import useMatchForm from "@/hooks/forms/useMatchForm.hook";
import ItemSelector from "../Form/ItemSelector";
import useClubStore from "@/store/useClub.store";
import Club from "@/models/club.model";
import AppDateTimePicker from "../Form/DateTimePicker";
import Championship from "@/models/championship.model";
import Sport from "@/models/sport.model";
import useChampionshipStore from "@/store/useChampionship.store";

interface MatchFormProps {
  id: string;
  match?: Match;
}

const MatchForm: FC<MatchFormProps> = ({ id, match }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onClubChange,
    onChampionshipChange,
    onDateTimeChange,
    onFormSubmit,
  } = useMatchForm(id, match);

  const { researchAddClub, researchClubs } = useClubStore();
  const { researchAddChampionship, researchChampionships } =
    useChampionshipStore();

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
            <AppDateTimePicker
              key={`${dynamicKey}-startDate`}
              id="startDate"
              name="startDate"
              label="Date"
              placeholder="Choisissez une date"
              selectedDateTime={formData.startDate}
              onDateChange={onDateTimeChange}
            />
            {formErrors.startDate && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.startDate}
              </p>
            )}
          </div>

          <div className="mb-4">
            <ItemSelector
              key={`${dynamicKey}-championship`}
              modalId={`${id}-championship`}
              name="championship"
              onItemSelected={onChampionshipChange}
              defautItem={new Championship("Nada", new Sport(""))}
              addItemfn={researchAddChampionship}
              getItemsfn={researchChampionships}
              itemName={"Championnat"}
              placeholder="Sélectionner un championnat"
              item={formData.championship}
            />
            {formErrors.championship && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.championship}
              </p>
            )}
          </div>

          <div className="mb-4">
            <ItemSelector
              key={`${dynamicKey}-clubHome`}
              modalId={`${id}-clubHome`}
              name="clubHome"
              onItemSelected={onClubChange}
              defautItem={new Club("", "", new Date())}
              addItemfn={researchAddClub}
              getItemsfn={researchClubs}
              itemName={"Club 1"}
              placeholder="Sélectionner un club"
              item={formData.clubHome}
            />
            {formErrors.clubHome && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.clubHome}
              </p>
            )}
          </div>

          {match?.id && (
            <div className="mb-4">
              <AppInput
                label="But 1"
                id="clubHomeGoal"
                name="clubHomeGoal"
                type="number"
                placeholder="Nombre de but"
                value={formData.clubHomeGoal}
                onChange={onInputDataChange}
              />
              {formErrors.clubHomeGoal && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.clubHomeGoal}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <ItemSelector
              key={`${dynamicKey}-clubForeign`}
              modalId={`${id}-clubForeign`}
              name="clubForeign"
              onItemSelected={onClubChange}
              defautItem={new Club("", "", new Date())}
              addItemfn={researchAddClub}
              getItemsfn={researchClubs}
              itemName={"Club 2"}
              placeholder="Sélectionner un club"
              item={formData.clubForeign}
            />
            {formErrors.clubForeign && (
              <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                {formErrors.clubForeign}
              </p>
            )}
          </div>

          {match?.id && (
            <div className="mb-4">
              <AppInput
                label="But 2"
                id="clubForeignGoal"
                name="clubForeignGoal"
                type="number"
                placeholder="Nombre de but"
                value={formData.clubForeignGoal}
                onChange={onInputDataChange}
              />
              {formErrors.clubForeignGoal && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.clubForeignGoal}
                </p>
              )}
            </div>
          )}

          <div className="mb-5">
            {processing ? (
              <ProcessingLoader />
            ) : (
              <AppButton
                name={`${match?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MatchForm;
