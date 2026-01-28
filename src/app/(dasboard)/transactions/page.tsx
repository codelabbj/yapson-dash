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
import CreateTransactionDialog from "@/components/widget/Forms/CreateTransactionDialog";

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
        <div className="flex gap-2">
          <AppButton
            name="Ajouter"
            width="w-[150px]"
            onClick={() => {
              resetFormErrors();
              resetFormData();
              toggleModal("transaction-form");
            }}
          />
          <AppButton
            name="Créer Transaction"
            width="w-[150px]"
            color="bg-green-600 hover:bg-green-700"
            onClick={() => {
              toggleModal("create-transaction-dialog");
            }}
          />
        </div>
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
      
      <CreateTransactionDialog 
        id="create-transaction-dialog" 
        onSuccess={() => {
          fetchTransactions(searchValue, filter, page);
        }}
      />

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

      <div className="mt-4 space-y-4">
        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {loading ? (
            <div className="min-h-fit">
              <ProcessingLoader />
            </div>
          ) : (
            paginatedTransactions?.results?.map((transaction, index) => {
              const statusLabel =
                transaction.status === "accept"
                  ? "Accepté"
                  : transaction.status === "refuse" ||
                      transaction.status === "error"
                    ? "Refusé"
                    : "En attente";
              const statusClass =
                transaction.status === "accept"
                  ? "bg-green-100 text-green-700"
                  : transaction.status === "refuse" ||
                      transaction.status === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700";

              return (
                <div
                  key={index}
                  className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-boxdark dark:text-white">
                        {transaction.reference}
                      </div>
                      <div className="mt-1 text-xs text-bodydark2">
                        {transactionType(transaction.typeTrans)}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-boxdark dark:text-white">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Site</span>
                      <div className="flex min-w-0 items-center gap-2">
                        {transaction.app?.image ? (
                          <img
                            src={transaction.app.image}
                            alt={transaction.app?.name ?? "App"}
                            className="h-5 w-5 flex-shrink-0 rounded-sm object-contain"
                          />
                        ) : null}
                        <span className="min-w-0 truncate">
                          {transaction.app?.name ?? "—"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Utilisateur</span>
                      <span className="text-right">
                        {transaction.user?.lastname ?? "Lastname"}{" "}
                        {transaction.user?.firstname ?? "Firstname"} •{" "}
                        {transaction.userAppId ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Téléphone</span>
                      <span>{transaction.phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Réseau</span>
                      <span>{transaction.mobileReference.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Montant</span>
                      <span className="font-semibold">{transaction.amount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Date</span>
                      <span>
                        {transaction.createdAt == null
                          ? "Inconnu"
                          : formatReadableDate(transaction.createdAt!)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-bodydark2">Observation</span>
                      <span className="text-right">
                        {transaction.error_message ??
                          transactionStatus(
                            transaction.status,
                            transaction.typeTrans.toLowerCase(),
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className="min-w-[1100px] text-black dark:text-white">
              {/* Table Header */}
              <div className="grid grid-cols-10 bg-bodydark1 text-left text-sm font-semibold text-boxdark dark:bg-meta-4 dark:text-white">
                {[
                  "Référence",
                  "Type",
                  "Numéro",
                  "Réseau",
                  "Site",
                  "Utilisateur",
                  "Montant",
                  "Date",
                  "Statut",
                  "Observation",
                ].map((column, index) => (
                  <div key={index} className="px-6 py-4">
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
                <div className="w-full">
                  {paginatedTransactions?.results?.map((transaction, index) => (
                    <div
                      key={index}
                      className="grid w-full grid-cols-10 items-center border-t border-[#EEEEEE] dark:border-strokedark"
                    >
                      {/* Transaction Reference */}
                      <div className="px-6 py-5 text-sm font-medium">
                        {transaction.reference}
                      </div>

                      {/* Transaction Type */}
                      <div className="px-6 py-5 text-sm">
                        {transactionType(transaction.typeTrans)}
                      </div>

                      {/* Transaction Phone */}
                      <div className="px-6 py-5 text-sm">
                        {transaction.phoneNumber}
                      </div>

                      {/* Transaction Mobile Reference */}
                      <div className="px-6 py-5 text-sm">
                        {transaction.mobileReference.toUpperCase()}
                      </div>

                      {/* Transaction App (Bet site) */}
                      <div className="px-6 py-5 text-sm">
                        <div className="flex min-w-0 items-center gap-2">
                          {transaction.app?.image ? (
                            <img
                              src={transaction.app.image}
                              alt={transaction.app?.name ?? "App"}
                              className="h-5 w-5 flex-shrink-0 rounded-sm object-contain"
                            />
                          ) : null}
                          <span className="min-w-0 truncate">
                            {transaction.app?.name ?? "—"}
                          </span>
                        </div>
                      </div>

                      {/* Transaction User + Bet Id */}
                      <div className="px-6 py-5 text-sm">
                        <div>
                          <span>{transaction.user?.lastname ?? "Lastname"} </span>
                          <span>{transaction.user?.firstname ?? "Firstname"}</span>
                        </div>
                        <div className="text-xs text-bodydark2">
                          Bet Id: {transaction.userAppId ?? "—"}
                        </div>
                      </div>

                      {/* Transaction Amount */}
                      <div className="px-6 py-5 text-sm font-semibold">
                        {transaction.amount}
                      </div>

                      {/* Transaction Date */}
                      <div className="px-6 py-5 text-sm">
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
                        className={`relative px-6 py-5 text-sm font-bold ${
                          transaction.status == "accept"
                            ? "text-green-600"
                            : transaction.status == "pending"
                              ? ""
                              : transaction.status == "bizao_validation"
                                ? "text-green-500"
                                : ""
                        }`}
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
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
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
                                      value={
                                        transaction.status === "accept" ||
                                        transaction.status === "refuse" ||
                                        transaction.status === "error"
                                          ? transaction.status === "error"
                                            ? "refuse"
                                            : transaction.status
                                          : ""
                                      }
                                      onChange={async (e) => {
                                        let newStatus = e.target.value;
                                        // If refuse is selected, send 'error' to backend
                                        if (newStatus === "refuse")
                                          newStatus = "error";
                                        setStatusLoadingId(transaction.id!);
                                        try {
                                          // Create a new Transaction object with updated status
                                          const updatedTransaction =
                                            new Transaction(
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
                                          const result =
                                            await updateTransaction(
                                              updatedTransaction,
                                            );
                                          if (typeof result === "string") {
                                            setActionResultMessage(result);
                                          } else {
                                            setActionResultMessage(
                                              "Statut de la transaction mis à jour avec succès.",
                                            );
                                            fetchTransactions(
                                              searchValue,
                                              filter,
                                              page,
                                            );
                                          }
                                          toggleModal("action-result-message");
                                        } catch (err) {
                                          setActionResultMessage(
                                            "Erreur lors de la mise à jour du statut.",
                                          );
                                          toggleModal("action-result-message");
                                        } finally {
                                          setStatusEditId(null);
                                          setStatusLoadingId(null);
                                        }
                                      }}
                                      className={`w-full rounded-md border border-stroke bg-transparent py-1 pl-2 pr-6 text-[11px] outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input 
                                    ${
                                      transaction.status === "accept"
                                        ? "text-success font-medium"
                                        : transaction.status === "refuse" ||
                                            transaction.status === "error"
                                          ? "text-danger font-medium"
                                          : ""
                                    }`}
                                    >
                                      <option value="" disabled>
                                        Sélectionner un statut
                                      </option>
                                      {statusOptions.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                          className={`${
                                            option.value === "accept"
                                              ? "text-success"
                                              : option.value === "refuse"
                                                ? "text-danger"
                                                : ""
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
                                  <span
                                    className={`${
                                      transaction.status === "accept"
                                        ? "text-success font-medium"
                                        : transaction.status === "refuse" ||
                                            transaction.status === "error"
                                          ? "text-danger font-medium"
                                          : ""
                                    }`}
                                  >
                                    {transaction.status === "accept"
                                      ? "Accepté"
                                      : transaction.status === "refuse" ||
                                          transaction.status === "error"
                                        ? "Refusé"
                                        : "En attente"}
                                  </span>
                                </div>
                                <button
                                  className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80"
                                  onClick={() =>
                                    setStatusEditId(transaction.id!)
                                  }
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
                      <div className="px-6 py-5 text-sm">
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
