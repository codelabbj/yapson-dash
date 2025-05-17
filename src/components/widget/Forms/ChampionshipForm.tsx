import { FC, useEffect, useState } from "react";
import Modal from "../Form/Modal";
import AppInput from "../Form/Input";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import AppButton from "../Form/Button";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Club from "@/models/club.model";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import useChampionshipForm from "@/hooks/forms/useChampionshipForm.hook";
import Championship from "@/models/championship.model";
import ItemSelector from "../Form/ItemSelector";
import Sport from "@/models/sport.model";
import useSportStore from "@/store/useSport.store";

interface ChampionshipFormProps {
  id: string;
  championship?: Championship;
}

const ChampionshipForm: FC<ChampionshipFormProps> = ({ id, championship }) => {
  const {
    processing,
    formData,
    formErrors,
    resetFormData,
    resetFormErrors,
    onInputDataChange,
    onSportChange,
    onFormSubmit,
  } = useChampionshipForm(id, championship);

  const { researchAddSport, researchSports } = useSportStore();

  const [dynamicKey, setDynamicKey] = useState(new Date().toDateString());

  return (
    <Modal
      id={id}
      onClose={() => {
        resetFormData();
        resetFormErrors();
        setDynamicKey(`${new Date().toDateString()}`);
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
          <div className="mb-4">
            <ItemSelector
              key={`${dynamicKey}-sport`}
              modalId={`${id}-sport`}
              name={`sport`}
              onItemSelected={onSportChange}
              defautItem={new Sport("")}
              addItemfn={researchAddSport}
              getItemsfn={researchSports}
              itemName={"Sport"}
              placeholder="Sélectionner un sport"
              item={formData?.sport}
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
                name={`${championship?.id ? "Mettre à jour" : "Ajouter"}`}
                onClick={() => {}}
              />
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChampionshipForm;
