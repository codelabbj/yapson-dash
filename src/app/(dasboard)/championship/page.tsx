"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import ChampionshipForm from "@/components/widget/Forms/ChampionshipForm";
import useChampionshipStore from "@/store/useChampionship.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/store/useSearchStore.store";
import useChampionshipForm from "@/hooks/forms/useChampionshipForm.hook";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";

interface ChampionshipsPageProps {}

const ChampionshipsPage: FC<ChampionshipsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useChampionshipForm(
    `championship-form-${dateString}`,
  );
  const {
    paginatedChampionships,
    page,
    loading,
    fetchChampionships,
    deleteChampionship,
    increasePage,
    decreasePage,
  } = useChampionshipStore();

  useEffect(() => {
    fetchChampionships(searchValue, 1);
  }, [fetchChampionships, searchValue]);

  return (
    <>
      <Breadcrumb
        pageName="Championnats"
        onClick={() => fetchChampionships(searchValue)}
      >
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`championship-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <ChampionshipForm id={`championship-form-${dateString}`} />
      <ActionResult />

      <div className="flex max-w-full flex-col">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["Nom", "Sport", ""].map((column, index) => (
              <div
                key={index}
                className={`flex-1 px-5 py-4 lg:px-7.5 2xl:px-11 `}
              >
                {column}
              </div>
            ))}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="min-h-fit">
              <ProcessingLoader />
            </div>
          ) : (
            <div className=" w-full  bg-white dark:bg-boxdark">
              {paginatedChampionships?.results?.map((championship, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-3 items-center border-t border-[#EEEEEE] dark:border-strokedark  `}
                >
                  {/* Championship Name */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {championship.name}
                  </div>

                  {/* Championship Sport */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {championship.sport.name}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      onEdit={() =>
                        toggleModal(
                          `championship-form-${dateString}-${championship.id}`,
                        )
                      }
                      onDelete={() => {
                        toggleModal(`delete-dialog-${championship.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <ChampionshipForm
                    key={`championship-form-${dateString}-${championship.id}`}
                    id={`championship-form-${dateString}-${championship.id}`}
                    championship={championship}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`deletion-confirmation-${championship.id}`}
                    id={`delete-dialog-${championship.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce championnat"
                    successMessage="Le championship a été supprimé avec succès"
                    objectId={championship.id!}
                    onDelete={deleteChampionship}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedChampionships.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchChampionships(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedChampionships.count}
          currentPage={page}
          fetchPage={(page) => fetchChampionships(searchValue, page)}
        />

        {paginatedChampionships.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchChampionships(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default ChampionshipsPage;
