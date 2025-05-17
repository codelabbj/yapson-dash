"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import AppButton from "@/components/widget/Form/Button";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import ServiceForm from "@/components/widget/Forms/ServiceForm";
import useServiceForm from "@/hooks/forms/useService.hook";
import useSearchStore from "@/store/useSearchStore.store";
import useServiceStore from "@/store/useService.store";
import { toggleModal } from "@/utils/functions.util";
import { Check, X } from "lucide-react";
import { FC, useEffect } from "react";

interface ServicesPageProps {}

const ServicesPage: FC<ServicesPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useServiceForm(
    `service-form-${dateString}`,
  );

  const {
    paginatedServices,
    page,

    loading,
    updateService,
    fetchServices,
    deleteService,
    increasePage,
    decreasePage,
  } = useServiceStore();

  useEffect(() => {
    fetchServices(searchValue, 1);
  }, [fetchServices, searchValue]);

  return (
    <>
      <Breadcrumb
        pageName="Services"
        onClick={() => fetchServices(searchValue)}
      >
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`service-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <ServiceForm id={`service-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white md:grid-cols-4 xl:grid-cols-6">
            {["Nom", "Email", "Téléphone", "Code Secret", "Actif", ""].map(
              (column, index) => (
                <div
                  key={index}
                  className={` px-5 py-4 lg:px-7.5 2xl:px-11 ${index === 4 ? "hidden  text-center md:table-cell" : ""} ${index === 2 || index === 3 ? "hidden xl:table-cell " : ""}`}
                >
                  {column}
                </div>
              ),
            )}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="min-h-fit">
              <ProcessingLoader />
            </div>
          ) : (
            <div className="w-full  bg-white dark:bg-boxdark">
              {paginatedServices?.results?.map((service, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-3 items-center border-t border-[#EEEEEE] dark:border-strokedark md:grid-cols-4 xl:grid-cols-6`}
                >
                  {/* service Name */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {service.name}
                  </div>

                  {/* service Email */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {service.email}
                  </div>

                  {/* service Phone */}
                  <div className="hidden flex-1 justify-start overflow-hidden  px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11 ">
                    {`00${service.phoneIndication}${service.phone}`}
                  </div>

                  {/* service code secret */}
                  <div className="hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                    {service.secretKey}
                  </div>

                  {/* service Status */}
                  <div className="flex items-center justify-center">
                    <div className="hidden px-5 py-4 text-center md:table-cell lg:px-7.5 2xl:px-11">
                      {service.isActive ? (
                        <Check size={25} className="text-primary" />
                      ) : (
                        <X size={25} className="text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      key={service.id}
                      editText="Modifier"
                      onEdit={() =>
                        toggleModal(`service-form-${dateString}-${service.id}`)
                      }
                      deleteText="Supprimer"
                      onDelete={() => {
                        toggleModal(`delete-confirmation-dialog-${service.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <ServiceForm
                    key={`service-form-${dateString}-${service.id}`}
                    id={`service-form-${dateString}-${service.id}`}
                    service={service}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`delete-confirmation-${service.id}`}
                    id={`delete-confirmation-dialog-${service.id}`}
                    message={`Êtes-vous sûr de vouloir supprimer ce service`}
                    successMessage={`Le service a été validé avec succès`}
                    objectId={service.id!}
                    deleteText={"Supprimer"}
                    onDelete={deleteService}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedServices.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchServices(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedServices.count}
          currentPage={page}
          fetchPage={(page) => fetchServices(searchValue, page)}
        />

        {paginatedServices.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchServices(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
