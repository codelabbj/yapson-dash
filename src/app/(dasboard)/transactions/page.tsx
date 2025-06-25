"use client";

import { FC, useEffect, useState, useRef } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import {
  delay,
  formatReadableDate,
  toggleModal,
  transactionMobileReference,
  transactionStatus,
  transactionType,
} from "@/utils/functions.util";
import useTransactionStore from "@/store/useTransaction.store";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useSearchStore from "@/store/useSearchStore.store";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useTransactionForm, {
  transactionsData,
} from "@/hooks/forms/useTransactionForm";
import TransactionForm from "@/components/widget/Forms/TransactionForm";
import {
  ArrowRightLeft,
  ChartNoAxesColumnIncreasing,
  Filter,
  RefreshCcwIcon,
} from "lucide-react";
import TransactionFilterForm from "@/components/widget/Forms/TransactionFilterForm";
import useTransactionFilterForm from "@/hooks/forms/useTransactionFilter.hook";
import Transaction from "@/models/transaction.model";
import TransactionApi from "@/api/transaction.api";
import AppInput from "@/components/widget/Form/Input";
import AppPhoneInput from "@/components/widget/Form/PhoneInput";
import Modal from "@/components/widget/Form/Modal";
import createTransactionStore from "@/store/useTransaction.store";
import api from "@/utils/api.util";
import useInterfaceStore from "@/store/useInterface.store";

interface TransactionsPageProps {}

const usetransactionStoreMemo = useTransactionStore(Transaction);
  

const TransactionsPage: FC<TransactionsPageProps> = () => {
  
  const { searchValue } = useSearchStore();
  const { resetFormData, resetFormErrors } =
    useTransactionForm("transaction-form");


  const {
    paginatedTransactions,
    page,
    loading,
    fetchTransactions,
    fetchServices,
    fetchApps,
    filter,
    transactionsApps,
    increasePage,
    decreasePage,
    updateTransaction,
  } = usetransactionStoreMemo();

  
  useEffect(() => {
    fetchApps();
    fetchServices();
  }, [fetchApps, fetchServices]);

  useEffect(() => {
    console.log("filter => ", filter);
    const fetchData = async () => {
      await fetchTransactions(searchValue, filter, page);
    };
    fetchData();
  }, [searchValue, filter, page, fetchTransactions]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>();
  useEffect(() => {
    fetchTransactions(searchValue);
  }, [fetchTransactions, searchValue]);

  const [bizaotrans, setBizaoTrans] = useState(null);
  /// Temporary solution - Should change that
  useEffect(() => {
    //   const interval = setInterval(() => {
    //     for (let i = 1; i < page; i++) {
    //       console.log("Page => ", i, page);
    //         fetchTransactions(searchValue.length == 0 ? undefined : searchValue, filter, i, undefined, true, page );
    //     }
    // }, 2000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    toggleModal("transaction-details");
  }, [bizaotrans]);

  const [statusEditId, setStatusEditId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const setActionResultMessage = useInterfaceStore((state) => state.setActionResultMessage);
  const statusOptions = [
    { name: "Accepter", value: "accept" },
    { name: "Refuser", value: "refuse" },
  ];

  return (
    <>
      <Breadcrumb
        pageName="Transactions"
        onClick={() => {
          fetchTransactions(searchValue, undefined, 1);
          fetchApps();
          fetchServices();
        }}
      >
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal("transaction-form");
          }}
        />
      </Breadcrumb>

      <TransactionFilterForm<Transaction>
        id="transaction-filter-form"
        filter={filter}
        ctor={Transaction}
        apps={transactionsApps} // Add this prop
        onSubmit={(formData) => {
          
          fetchTransactions(searchValue, formData, 1);
        }}
      />

      <TransactionForm id="transaction-form" transaction={undefined} />

      {bizaotrans && (
        <Modal id={"transaction-details"} onClose={() => {}}>
          {!bizaotrans ? (
            <div className={" w-full p-10 text-center dark:border-strokedark"}>
              Aucune transaction trouvée
            </div>
          ) : (
            <div className=" dark:border-strokedark">
              {Object.keys(bizaotrans ?? {}).map((e) => {
                if (e == "meta") return <div key={e}></div>;
                return (
                  <div
                    key={e}
                    className={" mb-4 flex items-center justify-between gap-5"}
                  >
                    <div className={"font-bold"}>{e}</div>
                    <div>{`${JSON.stringify(bizaotrans![e])}`}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}

      <div className="flex items-center justify-end">
        <div
          className={`  my-10  hidden w-min justify-end  self-end hover:cursor-pointer md:flex ${
            !Object.values(filter).every((flt) => flt.length === 0)
              ? "bg-primary px-5 py-2 text-white "
              : "text-black"
          }`}
          onClick={() => {
            toggleModal("transaction-filter-form");
          }}
        >
          <span className="mr-4 font-bold ">
            {Object.values(filter).every((flt) => flt.length === 0)
              ? "Filtre"
              : "Filtré"}
          </span>
          <Filter
            className={`fill-primary dark:fill-boxdark ${!Object.values(filter).every((flt) => flt.length === 0) ? "fill-white" : ""}`}
          />
        </div>
      </div>

      <ActionResult />

      <div className=" max-w-full overflow-x-auto ">
        <div className="min-w-[500px] rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-bodydark1 text-left  font-bold text-boxdark dark:bg-meta-4 dark:text-white lg:grid-cols-7 xl:grid-cols-9 ">
            {[
              "Référence",
              "Type",
              "Numéro",
              "Réseau",
              "Utilisateur",
              "Montant",
              "Date",
              "Statut",
              "Observation",
            ].map((column, index) => (
              <div
                key={index}
                className={`flex-1 px-5 py-4 lg:px-7.5 2xl:px-11 ${index === 2 || index === 5 ? "hidden xl:table-cell" : ""} ${index === 1 ? "hidden lg:table-cell" : ""} `}
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
              {paginatedTransactions?.results?.map((transaction, index) => (
                <div
                  key={index}
                  className={`  grid w-full grid-cols-6 items-center border-t border-[#EEEEEE] dark:border-strokedark lg:grid-cols-7 xl:grid-cols-9 `}
                >
                  {/* Transaction Reference */}
                  <div className="flex overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {transaction.reference}
                  </div>

                  {/* Transaction Type */}
                  <div
                    className="hidden overflow-hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11"
                    title="Un texte pour voir"
                  >
                    {transactionType(transaction.typeTrans)}
                  </div>

                  {/* Transaction Phone */}
                  <div className=" hidden overflow-hidden px-5 py-4 lg:table-cell lg:px-7.5 2xl:px-11">
                    {transaction.phoneNumber}
                  </div>

                  {/* Transaction Mobile Reference */}
                  <div className="hidden overflow-hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                    {transaction.mobileReference.toUpperCase()}
                  </div>

                  {/* Transaction BeiId */}
                  <div className=" overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    <div>
                      <span> {transaction.user?.lastname ?? "Lastname"} </span>
                      <span>{transaction.user?.firstname ?? "Firstname"}</span>
                    </div>
                    <div>
                      <span className={" font-bold"}>Bet Id: </span>{" "}
                      <span>{transaction.userAppId}</span>
                    </div>
                  </div>

                  {/* Transaction Name
                  <div className=" overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {transaction.user?.lastname ?? "Lastname"}{" "}
                    {transaction.user?.firstname ?? "Firstname"}
                  </div> */}

                  {/* Transaction Amount */}
                  <div className=" overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {transaction.amount}
                  </div>

                  {/* Transaction Date */}
                  <div className=" overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {transaction.createdAt == null
                      ? "Inconnu"
                      : formatReadableDate(transaction.createdAt!)}
                  </div>

                  {/* Transaction Status */}
                  <div
                    title={
                      transaction.error_message ??
                      transactionStatus(
                        transaction.status,
                        transaction.typeTrans.toLowerCase(),
                      )
                    }
                    className={` relative overflow-hidden px-5 py-4 font-bold lg:px-7.5 2xl:px-11 ${transaction.status == "accept" ? "text-green-600" : transaction.status == "pending" ? "" : transaction.status == "bizao_validation" ? "text-green-500" : ""} `}
                  >
                    {/* Status display and refresh button */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            setSelectedTransaction(transaction);
                            const new_transac =
                              await TransactionApi.findBizaoUnique(
                                transaction.reference!,
                              );
                            setBizaoTrans(new_transac);
                            setSelectedTransaction(null);
                          }}
                          className=" flex h-8 w-8 flex-col items-center justify-center rounded-full bg-primary "
                        >
                          <RefreshCcwIcon
                            className={"text-white"}
                            color={"white"}
                            size={"1rem"}
                          />
                        </button>
                        <span>
                          {transactionStatus(
                            transaction.status,
                            transaction.typeTrans.toLowerCase(),
                          )}
                        </span>
                      </div>
                      {/* Custom Status Change Modal/Dropdown */}
                      <div className="mt-2">
                        {statusLoadingId === transaction.id ? (
                          <ProcessingLoader />
                        ) : statusEditId === transaction.id ? (
                          <div ref={statusDropdownRef} className="relative">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <select
                                  id={`status-select-${transaction.id}`}
                                  name="status"
                                  value={transaction.status === "accept" || transaction.status === "refuse" || transaction.status === "error" ? (transaction.status === "error" ? "refuse" : transaction.status) : ""}
                                  onChange={async (e) => {
                                    let newStatus = e.target.value;
                                    // If refuse is selected, send 'error' to backend
                                    if (newStatus === "refuse") newStatus = "error";
                                    setStatusLoadingId(transaction.id!);
                                    try {
                                      // Create a new Transaction object with updated status
                                      const updatedTransaction = new Transaction(
                                        transaction.amount,
                                        transaction.user,
                                        transaction.reference,
                                        transaction.typeTrans,
                                        newStatus,
                                        transaction.phoneNumber,
                                        transaction.country,
                                        transaction.mobileReference,
                                        transaction.createdAt!,
                                        transaction.counntryCode,
                                        transaction.app,
                                        transaction.userAppId,
                                        transaction.withdrawalCode,
                                        transaction.id,
                                        transaction.error_message,
                                      );
                                      const result = await updateTransaction(updatedTransaction);
                                      if (typeof result === "string") {
                                        setActionResultMessage(result);
                                      } else {
                                        setActionResultMessage("Statut de la transaction mis à jour avec succès.");
                                        fetchTransactions(searchValue, filter, page);
                                      }
                                      toggleModal("action-result-message");
                                    } catch (err) {
                                      setActionResultMessage("Erreur lors de la mise à jour du statut.");
                                      toggleModal("action-result-message");
                                    } finally {
                                      setStatusEditId(null);
                                      setStatusLoadingId(null);
                                    }
                                  }}
                                  className={`w-full rounded-md border border-stroke bg-transparent py-1 pl-2 pr-6 text-[11px] outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input 
                                    ${transaction.status === 'accept' ? 'text-success font-medium' : 
                                      transaction.status === 'refuse' || transaction.status === 'error' ? 'text-danger font-medium' : ''}`}
                                >
                                  <option value="" disabled>Sélectionner un statut</option>
                                  {statusOptions.map((option) => (
                                    <option 
                                      key={option.value} 
                                      value={option.value}
                                      className={`${
                                        option.value === 'accept' ? 'text-success' : 
                                        option.value === 'refuse' ? 'text-danger' : ''
                                      }`}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="mt-1 flex items-center justify-between text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => setStatusEditId(null)}
                                  className="text-danger hover:text-danger/80"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`${
                                transaction.status === 'accept' ? 'text-success font-medium' : 
                                transaction.status === 'refuse' || transaction.status === 'error' ? 'text-danger font-medium' : ''
                              }`}>
                                {transaction.status === 'accept' ? 'Accepté' : 
                                 transaction.status === 'refuse' || transaction.status === 'error' ? 'Refusé' : 'En attente'}
                              </span>
                            </div>
                            <button
                              className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80"
                              onClick={() => setStatusEditId(transaction.id!)}
                              type="button"
                            >
                              <span>Modifier le statut</span>
                              <svg 
                                className="h-3 w-3" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Observation */}
                  <div className="hidden overflow-hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                    {transaction.error_message ??
                      transactionStatus(
                        transaction.status,
                        transaction.typeTrans.toLowerCase(),
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedTransactions.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchTransactions(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedTransactions.count}
          currentPage={page}
          fetchPage={(page) => fetchTransactions(searchValue, undefined, page)}
        />

        {paginatedTransactions.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchTransactions(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;
