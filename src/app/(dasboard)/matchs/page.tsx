"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { ensureBaseUrl, toggleModal } from "@/utils/functions.util";
import MatchForm from "@/components/widget/Forms/MatchForm";
import useMatchStore from "@/store/useMatch.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useSearchStore from "@/store/useSearchStore.store";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useMatchForm from "@/hooks/forms/useMatchForm.hook";

interface MatchsPageProps {}

const MatchsPage: FC<MatchsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useMatchForm(`match-form`);

  const {
    paginatedMatches,
    page,
    loading,
    fetchMatches,
    deleteMatch,
    increasePage,
    decreasePage,
  } = useMatchStore();

  useEffect(() => {
    fetchMatches(searchValue, 1);
  }, [fetchMatches, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Matchs" onClick={() => fetchMatches(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`match-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <MatchForm id={`match-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' w-full ">
        <div className="min-w-[700px] rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white lg:grid-cols-6 xl:grid-cols-8">
            {[
              "Championnat",
              "Logo",
              "Club 1",
              "Score",
              "Score",
              "Club 2",
              "Logo",
              "",
            ].map((column, index) => (
              <div
                key={index}
                className={`px-4 py-4 ${
                  index === 1 || index === 3 || index === 4 || index === 6
                    ? "text-center"
                    : ""
                } ${index === 3 || index === 4 ? "hidden lg:table-cell" : ""} ${
                  index === 1 || index === 6 ? "hidden xl:table-cell" : ""
                }`}
              >
                {column}
              </div>
            ))}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="min-h-[200px]">
              <ProcessingLoader />
            </div>
          ) : (
            <div className="w-full bg-white dark:bg-boxdark">
              {paginatedMatches?.results.map((match, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center border-t border-[#EEEEEE] dark:border-strokedark lg:grid-cols-6 xl:grid-cols-8"
                >
                  {/* Championship */}
                  <div className="px-4 py-4">
                    <span className="line-clamp-2 overflow-hidden">
                      {match.championship.name}
                    </span>
                  </div>

                  {/* Home Team Logo */}
                  <div className="hidden px-4 py-4 text-center xl:table-cell">
                    <div className="relative mx-auto h-10 w-10">
                      <Image
                        src={ensureBaseUrl(match.clubHome.logo as string)}
                        alt={match.clubHome.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Home Team */}
                  <div className="px-4 py-4">
                    <span className="line-clamp-2 overflow-hidden">
                      {match.clubHome.name}
                    </span>
                  </div>

                  {/* Home Score */}
                  <div className="hidden overflow-hidden px-4 py-4 text-center font-medium lg:table-cell">
                    {match.clubHomeGoal}
                  </div>

                  {/* Away Score */}
                  <div className="hidden overflow-hidden px-4 py-4 text-center font-medium lg:table-cell">
                    {match.clubForeignGoal}
                  </div>

                  {/* Away Team */}
                  <div className="px-4 py-4">
                    <span className="line-clamp-2 overflow-hidden">
                      {match.clubForeign.name}
                    </span>
                  </div>

                  {/* Away Team Logo */}
                  <div className="hidden px-4 py-4 text-center xl:table-cell">
                    <div className="relative mx-auto h-10 w-10">
                      <Image
                        src={ensureBaseUrl(match.clubForeign.logo as string)}
                        alt={match.clubForeign.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4' py-4 text-center  lg:text-start xl:text-center ">
                    <EditDeleteButton
                      key={match.id}
                      onEdit={() =>
                        toggleModal(`match-form-${dateString}-${match.id}`)
                      }
                      onDelete={() => toggleModal(`delete-dialog-${match.id}`)}
                    />
                  </div>

                  {/* Forms and Dialogs */}
                  <MatchForm
                    key={`match-form-${dateString}-${match.id}`}
                    id={`match-form-${dateString}-${match.id}`}
                    match={match}
                  />

                  <DeletionConfirmation
                    key={`deletion-confirmation-${match.id}`}
                    id={`delete-dialog-${match.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce match"
                    successMessage="Le match a été supprimé avec succès"
                    objectId={match.id!}
                    onDelete={deleteMatch}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          {paginatedMatches.previous && (
            <AppButton
              name="Précédent"
              width="w-[120px]"
              color="bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white"
              onClick={() => {
                decreasePage();
                fetchMatches(searchValue);
              }}
            />
          )}

          <PageCounter
            totalPage={paginatedMatches.count}
            currentPage={page}
            fetchPage={(page) => fetchMatches(searchValue, page)}
          />

          {paginatedMatches.next && (
            <AppButton
              name="Suivant"
              width="w-[120px]"
              color="bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white"
              onClick={() => {
                increasePage();
                fetchMatches(searchValue);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MatchsPage;
