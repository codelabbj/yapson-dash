"use client";

import { FC, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { ensureBaseUrl, formatDate, toggleModal } from "@/utils/functions.util";
import DepositForm from "@/components/widget/Forms/DepositForm";
import useDepositStore from "@/store/useDeposit.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useSearchStore from "@/store/useSearchStore.store";
import useDepositForm, {
  depositStatus,
} from "@/hooks/forms/useDepositForm.hook";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import Deposit from "@/models/deposit.model";
import AppSelect from "@/components/widget/Form/Select";
import { ChevronDown } from "lucide-react";
import ImageViewCard from "@/components/widget/ImageViewCard";

interface DepositsPageProps {}

const DepositsPage: FC<DepositsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useDepositForm(
    `deposit-form-${dateString}`,
  );

  const { resetFormData: resetXbetForm, resetFormErrors: resetXbetFormErrors } =
    useDepositForm(`deposit-xbet-form-${dateString}`);

  const {
    paginatedDeposits,
    page,
    status,
    loading,
    updateDeposit,
    fetchDeposits,
    setStatus,
    increasePage,
    decreasePage,
    deleteDeposit,
  } = useDepositStore();

  useEffect(() => {
    fetchDeposits(searchValue, status, 1);
  }, [fetchDeposits, searchValue, status]);

  return (
    <>
      <Breadcrumb
        pageName="Recharge"
        onClick={() => fetchDeposits(searchValue)}
      >
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`deposit-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <DepositForm id={`deposit-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["App", "Montant", "Date", ""].map((column, index) => (
              <div
                key={index}
                className={` px-5 py-4 lg:px-7.5 2xl:px-11 ${index === 2 ? "hidden  text-center md:table-cell" : ""} ${index === 3 || index === 4 || index === 5 ? "hidden xl:table-cell " : ""}`}
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
              {paginatedDeposits?.results?.map((deposit, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-4 items-center border-t border-[#EEEEEE] dark:border-strokedark`}
                >
                  {/* Deposit Name */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {deposit.bet_app?.name ?? "1xbet"}
                  </div>

                  {/* Deposit Montant */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {deposit.amount}
                  </div>

                  {/* Deposit Montant */}
                  <div className="hidden overflow-hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                    {formatDate(deposit.createdAt)}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    {
                      <EditDeleteButton
                        key={deposit.id}
                        editText="Modifier"
                        onEdit={() => {
                          toggleModal(
                            `deposit-form-${dateString}-${deposit.id}`,
                          );
                        }}
                        deleteText="Annuler"
                        onDelete={() => {
                          toggleModal(
                            `cancel-confirmation-dialog-${deposit.id}`,
                          );
                        }}
                      />
                    }
                  </div>

                  {/* Update Form*/}
                  <DepositForm
                    key={`deposit-form-${dateString}-${deposit.id}`}
                    id={`deposit-form-${dateString}-${deposit.id}`}
                    deposit={deposit}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`cancel-confirmation-${deposit.id}`}
                    id={`cancel-confirmation-dialog-${deposit.id}`}
                    message={`Êtes-vous sûr de vouloir annuler ce dépôt`}
                    successMessage={`Le dépôt a été validé avec succès`}
                    objectId={deposit.id ?? ""}
                    deleteText={"Supprimer"}
                    onDelete={deleteDeposit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedDeposits.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchDeposits(searchValue, status);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedDeposits.count}
          currentPage={page}
          fetchPage={(page) => fetchDeposits(searchValue, status, page)}
        />

        {paginatedDeposits.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchDeposits(searchValue, status);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default DepositsPage;
