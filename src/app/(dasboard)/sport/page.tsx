"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import SportForm from "@/components/widget/Forms/SportForm";
import useSportStore from "@/store/useSport.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/store/useSearchStore.store";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useSportForm from "@/hooks/forms/useSport.hook";

interface SportsPageProps {}

const SportsPage: FC<SportsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useSportForm("sport-form");
  const {
    paginatedSports,
    page,
    loading,
    fetchSports,
    deleteSport,
    increasePage,
    decreasePage,
  } = useSportStore();

  useEffect(() => {
    fetchSports(searchValue, 1);
  }, [fetchSports, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Sports" onClick={() => fetchSports(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`Sport-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <SportForm id={`Sport-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col">
          {/* Table Header */}
          <div className=" grid grid-cols-2   bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["Nom", ""].map((column, index) => (
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
            <div className="w-full bg-white  text-boxdark dark:bg-boxdark dark:text-white">
              {paginatedSports?.results?.map((sport, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-2 items-center border-t border-[#EEEEEE] dark:border-strokedark  `}
                >
                  {/* Sport Name */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {sport.name}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      onEdit={() => {
                        resetFormData();
                        toggleModal(`sport-form-${sport.id}`);
                      }}
                      onDelete={() => {
                        toggleModal(`delete-dialog-${sport.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <SportForm
                    key={`sport-form-${sport.id}`}
                    id={`sport-form-${sport.id}`}
                    sport={sport}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`deletion-confirmation-${sport.id}`}
                    id={`delete-dialog-${sport.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce sport"
                    successMessage="Le sport a été supprimé avec succès"
                    objectId={sport.id!}
                    onDelete={deleteSport}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedSports.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchSports(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedSports.count}
          currentPage={page}
          fetchPage={(page) => fetchSports(searchValue, page)}
        />

        {paginatedSports.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchSports(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default SportsPage;
