"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import AdvertisementCard from "@/components/widget/AdvertisementCard";
import CouponCard from "@/components/widget/CouponCard";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import AppButton from "@/components/widget/Form/Button";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import AdvertisementForm from "@/components/widget/Forms/AdvertisementForm";
import TicketForm from "@/components/widget/Forms/TicketForm";
import useAdvertisementForm from "@/hooks/forms/useAdvertisementForm.hook";
import useTicketForm from "@/hooks/forms/useTicketForm.hook";
import useSearchStore from "@/store/useSearchStore.store";
import useTicketStore from "@/store/useTicket.store";
import { toggleModal } from "@/utils/functions.util";
import { Ticket } from "lucide-react";
import { FC, useEffect } from "react";

interface TicketsPageProps {}

const CouponsPage: FC<TicketsPageProps> = () => {
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

      <div className="overflow-x-auto' max-w-full">
        {loading ? (
          <ProcessingLoader />
        ) : (
          <div className="grid grid-cols-1 gap-4 rounded-sm text-black dark:text-white md:grid-cols-2 lg:grid-cols-3">
            {paginatedTickets?.results.map((ticket, index) => (
              <div
                key={index}
                className={` flex w-full items-center border-t border-[#EEEEEE] dark:border-strokedark `}
              >
                <CouponCard
                  key={index}
                  coupon={ticket}
                  onEdit={() => {
                    resetFormData();
                    resetFormErrors();
                    toggleModal(`deposit-form-${dateString}-${ticket.id}`);
                  }}
                  onDelete={() => {
                    toggleModal(`cancel-confirmation-dialog-${ticket.id}`);
                  }}
                />

                <TicketForm
                  key={`deposit-form-${dateString}-${ticket.id}`}
                  id={`deposit-form-${dateString}-${ticket.id}`}
                  ticket={ticket}
                  apps={apps}
                />

                <DeletionConfirmation
                  key={`cancel-confirmation-${ticket.id}`}
                  id={`cancel-confirmation-dialog-${ticket.id}`}
                  message={`Êtes-vous sûr de vouloir supprimer`}
                  successMessage={`L'operation a ete effectue'`}
                  objectId={ticket.id!}
                  deleteText={"Supprimer"}
                  onDelete={async (id: string) => {
                    const result = await deleteTicket(id);

                    return result;
                  }}
                />
              </div>
            ))}
          </div>
        )}
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

export default CouponsPage;
