"use client";

import { FC, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useSearchStore from "@/store/useSearchStore.store";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useAdvertisementForm from "@/hooks/forms/useAdvertisementForm.hook";
import useAdvertisementStore from "@/store/useAdvertisement.store";
import AdvertisementCard from "@/components/widget/AdvertisementCard";
import AdvertisementForm from "@/components/widget/Forms/AdvertisementForm";
interface AdvertisementsPageProps {}

const AdvertisementsPage: FC<AdvertisementsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useAdvertisementForm(
    `advertisement-form-${dateString}`,
  );
  const {
    paginatedAdvertisements,
    page,
    loading,
    fetchAdvertisements,
    deleteAdvertisement,
    increasePage,
    decreasePage,
  } = useAdvertisementStore();

  useEffect(() => {
    fetchAdvertisements(searchValue, 1);
  }, [fetchAdvertisements, searchValue]);

  return (
    <>
      <Breadcrumb
        pageName="Publicités"
        onClick={() => {
          fetchAdvertisements(searchValue);
        }}
      >
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            //  console.log("toggleModal", `advertisement-form-${dateString}`);
            toggleModal(`advertisement-form-${dateString}`);
            //
          }}
        />
      </Breadcrumb>
      <AdvertisementForm id={`advertisement-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        {loading ? (
          <ProcessingLoader />
        ) : (
          <div className="grid grid-cols-1 gap-4 rounded-sm text-black dark:text-white md:grid-cols-2 lg:grid-cols-3">
            {paginatedAdvertisements?.results.map((advertisement, index) => (
              <div
                key={index}
                className={` flex w-full items-center border-t border-[#EEEEEE] dark:border-strokedark `}
              >
                <AdvertisementCard
                  key={index}
                  advertisement={advertisement}
                  showOptions={true}
                  onEdit={() => {
                    resetFormData();
                    resetFormErrors();
                    toggleModal(
                      `advertisement-form-${dateString}-${advertisement.id}`,
                    );
                  }}
                  onDelete={() => {
                    toggleModal(`delete-dialog-${advertisement.id}`);
                  }}
                />

                <AdvertisementForm
                  key={`advertisement-form-${dateString}-${advertisement.id}-${index}`}
                  id={`advertisement-form-${dateString}-${advertisement.id}`}
                  advertisement={advertisement}
                />

                <DeletionConfirmation
                  key={`deletion-confirmation-${advertisement.id}-${index}`}
                  id={`delete-dialog-${advertisement.id}`}
                  message="Êtes-vous sûr de vouloir supprimer cette publicité"
                  successMessage="La publicité a été supprimée avec succès"
                  objectId={advertisement.id!}
                  onDelete={deleteAdvertisement}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedAdvertisements.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchAdvertisements(searchValue);
            }}
          />
        ) : (
          <span className="w-1"> </span>
        )}

        <PageCounter
          totalPage={paginatedAdvertisements.count}
          currentPage={page}
          fetchPage={(page) => fetchAdvertisements(searchValue, page)}
        />

        {paginatedAdvertisements.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchAdvertisements(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default AdvertisementsPage;
