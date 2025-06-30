"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { ensureBaseUrl, toggleModal } from "@/utils/functions.util";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import useSearchStore from "@/store/useSearchStore.store";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useTicketForm from "@/hooks/forms/useTicketForm.hook";
import useTicketStore from "@/store/useTicket.store";
import TicketCard from "@/components/widget/TicketCard";
import TicketForm from "@/components/widget/Forms/TicketForm";
import AppSelect, { SelectItemProps } from "@/components/widget/Form/Select";
import DepositForm from "@/components/widget/Forms/DepositForm";
import { ChevronDown, Divide } from "lucide-react";
import ImageViewCard from "@/components/widget/ImageViewCard";
import Image from "next/image";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";

interface TicketsPageProps {}

const TicketsPage: FC<TicketsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useTicketForm(
    `ticket-form-${dateString}`,
  );
  const {
    paginatedTickets,
    page,
    loading,
    betapp,
    setBetapp,
    fetchTickets,
    deleteTicket,
    increasePage,
    decreasePage,
    apps,
  } = useTicketStore();

  useEffect(() => {
    fetchTickets(searchValue, 1);
  }, [fetchTickets, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Coupons" onClick={() => fetchTickets(searchValue)}>
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
      <TicketForm apps={apps} id={`deposit-form-${dateString}`} />
      <ActionResult />

      <div className="mb-10 flex items-center justify-between">
        {/* <div className=" flex items-center justify-center">
          <span className="mr-5 font-medium text-boxdark dark:text-white">
            Filtre:
          </span>
          <AppSelect
            id="app"
            name="status"
            items={apps.map(e => {
              let item : SelectItemProps = {
                name : e.name,
                value : e.name
              }
              return item;
            })}
            icon={<ChevronDown />}
            value={
              apps.find((sts) => sts.name == status)?.name ??
              "pending"
            }
            onChange={setStatus}
          />
        </div> */}

        {/* <AppButton
          name="Dépôt Xbet"
          width="w-[150px]"
          onClick={() => {
            resetXbetForm();
            resetXbetFormErrors();
            toggleModal(`deposit-xbet-form-${dateString}`);
          }}
        />
        <XbetDepositForm id={`deposit-xbet-form-${dateString}`} /> */}
      </div>

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white md:grid-cols-4 xl:grid-cols-7">
            {["Code", "App", "Image", "Actions"].map((column, index) => (
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
              {paginatedTickets?.results?.map((ticket, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-3 items-center border-t border-[#EEEEEE] dark:border-strokedark md:grid-cols-4 xl:grid-cols-7`}
                >
                  {/* Deposit Code */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {ticket.code ?? "Code"}
                  </div>

                  {/* Deposit App */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {ticket.bet_app?.public_name || ticket.bet_app?.name || ticket.bet_app?.id || "NAN"}
                  </div>

                  {/* Deposit Image */}
                  <div className="hidden flex-1 justify-start overflow-hidden  px-5 py-4 md:table-cell lg:px-7.5 2xl:px-11 ">
                    {Array.isArray(ticket.images) && (
                      <>
                        {ticket.images.map((e) => {
                          return (
                            <div
                              key={"ticket" + e}
                              className=" my-4 inline-block"
                            >
                              <Image
                                src={ensureBaseUrl(e as string)}
                                alt={e ?? "image"}
                                width={50}
                                height={50}
                                onClick={() => toggleModal(`image-view-${e}`)}
                                className="mx-auto"
                                style={{ height: "auto" }}
                              />

                              <ImageViewCard id={`image-view-${e}`} image={e} />
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    {true && (
                      <EditDeleteButton
                        key={ticket.id}
                        editText="Valider"
                        onEdit={() =>
                          toggleModal(`deposit-form-${dateString}-${ticket.id}`)
                        }
                        deleteText="Annuler"
                        onDelete={() => {
                          toggleModal(
                            `cancel-confirmation-dialog-${ticket.id}`,
                          );
                        }}
                      />
                    )}
                  </div>

                  {/* Update Form*/}
                  <TicketForm
                    key={`deposit-form-${dateString}-${ticket.id}`}
                    id={`deposit-form-${dateString}-${ticket.id}`}
                    ticket={ticket}
                    apps={apps}
                  />

                  {/*Deletion dialog*/}
                  {/* <DeletionConfirmation
                    key={`cancel-confirmation-${ticket.id}`}
                    id={`cancel-confirmation-dialog-${ticket.id}`}
                    message={`Êtes-vous sûr de vouloir annuler ce dépôt`}
                    successMessage={`Le dépôt a été validé avec succès`}
                    objectId={"cancel"}
                    deleteText={"Annuler"}
                    onDelete={async (id: string) => {
                      deposit.status = "cancel";

                      const result = await updateDeposit(deposit);

                      return result instanceof Deposit;
                    }}
                  /> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        <PageCounter
          totalPage={paginatedTickets.count}
          currentPage={page}
          fetchPage={(page) => fetchTickets(searchValue, page)}
        />
      </div>
    </>
  );
};

export default TicketsPage;
