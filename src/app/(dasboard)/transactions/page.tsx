"use client";

import { FC, useEffect, useState } from "react";
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
import AppSelect from "@/components/widget/Form/Select";
import AppPhoneInput from "@/components/widget/Form/PhoneInput";
import Modal from "@/components/widget/Form/Modal";
import createTransactionStore from "@/store/useTransaction.store";

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
                    {selectedTransaction?.id !== transaction.id ? (
                      <div>
                        <button
                          onClick={async () => {
                            setSelectedTransaction(transaction);
                            const new_transac =
                              await TransactionApi.findBizaoUnique(
                                transaction.reference!,
                              );
                            console.log(
                              "new_transac => ",
                              Object.keys(new_transac),
                            );
                            setBizaoTrans(new_transac);
                            setSelectedTransaction(null);
                          }}
                          className=" flex h-8 w-8 flex-col items-center justify-center rounded-full bg-primary "
                        >
                          <div>
                            <RefreshCcwIcon
                              className={"text-white"}
                              color={"white"}
                              size={"1rem"}
                            />
                          </div>
                        </button>
                        {transactionStatus(
                          transaction.status,
                          transaction.typeTrans.toLowerCase(),
                        )}
                      </div>
                    ) : (
                      <div>
                        <ProcessingLoader />
                      </div>
                    )}
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
