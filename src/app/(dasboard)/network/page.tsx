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

interface NetworksPageProps {}

const NetworksPage: FC<NetworksPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const { resetFormData, resetFormErrors } = useNetworkForm(
    `network-form-${dateString}`,
  );
  const {
    networks,
    loading,
    fetchNetwork,
    deleteNetwork,
  } = useNetworkStore();

  useEffect(() => {
    fetchNetwork(searchValue, 1);
  }, [fetchNetwork, searchValue]);

  return (
    <>
      <Breadcrumb pageName="Réseaux" onClick={() => fetchNetwork(searchValue)}>
        <AppButton
          name="Ajouter"
          width="w-[150px]"
          onClick={() => {
            resetFormErrors();
            resetFormData();
            toggleModal(`network-form-${dateString}`);
          }}
        />
      </Breadcrumb>
      <NetworkForm id={`network-form-${dateString}`} />
      <ActionResult />

      <div className="overflow-x-auto' max-w-full">
        <div className="flex flex-col rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="grid grid-cols-4   bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white ">
            {["Nom", "Logo", "Pays", ""].map((column, index) => (
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
              {networks?.map((network, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-4 items-center border-t border-[#EEEEEE] dark:border-strokedark  `}
                >
                  {/* Network Name */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {network.publicName}
                  </div>

                  {/* Network Logo */}
                  <div className="flex-1 px-5 py-4 lg:px-7.5 2xl:px-11">
                    <Image
                      src={ensureBaseUrl(network.image as string)}
                      alt={network.name}
                      width={50}
                      height={50}
                      className="mx-auto"
                      style={{ height: "auto" }}
                    />
                  </div>

                  {/* Network Pays */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {network.countryCode ? COUNTRIES.filter((e) => e.value === network.countryCode.toUpperCase())[0]?.title : "N/A"}
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      key={network.id}
                      onEdit={() =>
                        toggleModal(`network-form-${dateString}-${network.id}`)
                      }
                      onDelete={() => {
                        toggleModal(`delete-dialog-${network.id}`);
                      }}
                    />
                  </div>

                  {/* Update Form*/}
                  <NetworkForm
                    key={`network-form-${dateString}-${network.id}`}
                    id={`network-form-${dateString}-${network.id}`}
                    network={network}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`deletion-confirmation-${network.id}`}
                    id={`delete-dialog-${network.id}`}
                    message="Êtes-vous sûr de vouloir supprimer ce reseau"
                    successMessage="Le club a été supprimé avec succès"
                    objectId={network.id!}
                    onDelete={deleteNetwork}
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

export default NetworksPage;
