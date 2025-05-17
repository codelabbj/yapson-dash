"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { ensureBaseUrl, toggleModal } from "@/utils/functions.util";
import ClubForm from "@/components/widget/Forms/ClubForm";
import useClubStore from "@/store/useClub.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/store/useSearchStore.store";
import { Club } from "lucide-react";
import useClubForm from "@/hooks/forms/useClubForm.hook";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";

interface ClubsPageProps {}

const ClubsPage: FC<ClubsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useClubForm(
    `club-form-${dateString}`,
  );
  const {
    paginatedClubs,
    page,
    loading,
    fetchClubs,
    deleteClub,
    increasePage,
    decreasePage,
  } = useClubStore();

  useEffect(() => {
    fetchClubs(searchValue, 1);
  }, [fetchClubs, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Clubs" onClick={() => fetchClubs(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`club-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <ClubForm id={`club-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-3   bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["Nom", "Logo", ""].map((column, index) => (
              <div
                key={index}
                className={`flex-1 px-5 py-4 lg:px-7.5 2xl:px-11 ${
                  index === 1 ? "text-center" : ""
                }`}
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
            <div className="w-full  bg-white dark:bg-boxdark">
              {paginatedClubs?.results?.map((club, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-3 items-center border-t border-[#EEEEEE] dark:border-strokedark  `}
                >
                  {/* Club Name */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {club.name}
                  </div>

                  {/* Club Logo */}
                  <div className="flex-1 px-5 py-4 lg:px-7.5 2xl:px-11">
                    <Image
                      src={ensureBaseUrl(club.logo as string)}
                      alt={club.name}
                      width={50}
                      height={50}
                      className="mx-auto"
                      style={{ height: "auto" }}
                    />
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      key={club.id}
                      onEdit={() =>
                        toggleModal(`club-form-${dateString}-${club.id}`)
                      }
                      onDelete={() => {
                        toggleModal(`delete-dialog-${club.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <ClubForm
                    key={`club-form-${dateString}-${club.id}`}
                    id={`club-form-${dateString}-${club.id}`}
                    club={club}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`deletion-confirmation-${club.id}`}
                    id={`delete-dialog-${club.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce club"
                    successMessage="Le club a été supprimé avec succès"
                    objectId={club.id!}
                    onDelete={deleteClub}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedClubs.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchClubs(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedClubs.count}
          currentPage={page}
          fetchPage={(page) => fetchClubs(searchValue, page)}
        />

        {paginatedClubs.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchClubs(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default ClubsPage;
