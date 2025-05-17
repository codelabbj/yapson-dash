"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import EventForm from "@/components/widget/Forms/EventForm";
import useEventStore from "@/store/useEvent.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/store/useSearchStore.store";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import useEventForm from "@/hooks/forms/useEventForm.hook";
import EventCard from "@/components/widget/EventCard";

interface EventsPageProps {}

const EventsPage: FC<EventsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useEventForm(
    `event-form-${dateString}`,
  );
  const {
    paginatedEvents,
    page,
    loading,
    fetchEvents,
    deleteEvent,
    increasePage,
    decreasePage,
  } = useEventStore();

  useEffect(() => {
    fetchEvents(searchValue, 1);
  }, [fetchEvents, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Combinés" onClick={() => fetchEvents(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`event-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <EventForm id={`event-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto'  max-w-full ">
        {loading ? (
          <div className="flex items-center justify-center">
            <ProcessingLoader />
          </div>
        ) : (
          <div className="lg:grid-cols-3' grid grid-cols-1 gap-2 rounded-sm text-black dark:text-white md:grid-cols-2 ">
            {paginatedEvents?.results.map((event, index) => (
              <div key={index}>
                <EventCard
                  key={index}
                  event={event}
                  showOptions={true}
                  onEdit={() => {
                    resetFormData();
                    resetFormErrors();
                    toggleModal(`event-form-${dateString}-${event.id}`);
                  }}
                  onDelete={() => toggleModal(`delete-dialog-${event.id}`)}
                />

                {/* Update Form*/}
                <EventForm
                  key={`event-form-${dateString}-${event.id}`}
                  id={`event-form-${dateString}-${event.id}`}
                  event={event}
                />

                {/*Deletion dialog*/}
                <DeletionConfirmation
                  key={`deletion-confirmation-${event.id}`}
                  id={`delete-dialog-${event.id}`}
                  message="Êtes-vous sûr de vouloir supprimer ce combiné ?"
                  successMessage="Le combiné a été supprimé avec succès"
                  objectId={event.id!}
                  onDelete={deleteEvent}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedEvents.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchEvents(searchValue);
            }}
          />
        ) : (
          <span className="w-1"> </span>
        )}

        <PageCounter
          totalPage={paginatedEvents.count}
          currentPage={page}
          fetchPage={(page) => fetchEvents(searchValue, page)}
        />

        {paginatedEvents.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchEvents(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default EventsPage;
