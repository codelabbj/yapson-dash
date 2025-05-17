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
import useNetworkForm from "@/hooks/forms/useNetworkForm.hook";
import useNetworkStore from "@/store/useNetwork.store";
import NetworkForm from "@/components/widget/Forms/NetworkForm";
import { COUNTRIES } from "@/components/widget/Form/country/country";
import useAppStore from "@/store/useApp.store";
import AppForm from "@/components/widget/Forms/AppForm";

interface AppsPageProps {}

const AppsPage: FC<AppsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useNetworkForm(
    `app-form-${dateString}`,
  );
  const {
    apps,
    loading,
    fetchApp,
    deleteApp,
  } = useAppStore();

  useEffect(() => {
    fetchApp(searchValue, 1);
  }, [fetchApp, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Clubs" onClick={() => fetchApp(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`app-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <AppForm id={`app-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-4   bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["Nom", "Logo", "Informations", ""].map((column, index) => (
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
              {apps?.map((app, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-4 items-center border-t border-[#EEEEEE] dark:border-strokedark  `}
                >
                  {/* Network Name */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {app.name}
                  </div>

                  {/* Network Logo */}
                  <div className="flex-1 px-5 py-4 lg:px-7.5 2xl:px-11">
                    <Image
                      src={ensureBaseUrl(app.image as string)}
                      alt={app.name}
                      width={50}
                      height={50}
                      className="mx-auto"
                      style={{ height: "auto" }}
                    />
                  </div>

                  {/* Network Pays */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    <div className=" mb-1" >
                        <span style={{
                            fontWeight : 'bold'
                        }} >Hash: </span> {app.hash}
                    </div>
                    <div className=" mb-1" >
                        <span style={{
                            fontWeight : 'bold'
                        }} >Cashdeskid: </span> {app.cashdeskid}
                    </div>
                    <div className=" mb-1" >
                        <span style={{
                            fontWeight : 'bold'
                        }} >Cashierpass: </span> {app.cashierpass}
                    </div>
                    <div className=" mb-1" >
                        <span style={{
                            fontWeight : 'bold'
                        }} >City/Street: </span> {app.city}/{app.street}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      key={app.id}
                      onEdit={() =>
                        toggleModal(`app-form-${dateString}-${app.id}`)
                      }
                      onDelete={() => {
                        toggleModal(`delete-dialog-${app.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <AppForm
                    key={`app-form-${dateString}-${app.id}`}
                    id={`app-form-${dateString}-${app.id}`}
                    app={app}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`deletion-confirmation-${app.id}`}
                    id={`delete-dialog-${app.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce reseau"
                    successMessage="Le club a été supprimé avec succès"
                    objectId={app.id!}
                    onDelete={deleteApp}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
    </>
  );
};

export default AppsPage;
