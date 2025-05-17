"use client";

import { FC, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import MultipleActionButton from "@/components/widget/Form/EditDeleteButton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import useUserStore from "@/store/useUser.store";
import EditDeleteButton from "@/components/widget/Form/EditDeleteButton";
import Image from "next/image";
import DeletionConfirmation from "@/components/widget/Form/DeletionConfirmation";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/store/useSearchStore.store";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import { Check, X } from "lucide-react";
import AdminPassForm from "@/components/widget/Forms/AdminPassForm";

interface UsersPageProps {}

const UsersPage: FC<UsersPageProps> = () => {
  const { searchValue } = useSearchStore();
  const dateString = new Date().toDateString();
  const {
    paginatedUsers,
    page,
    loading,
    fetchUsers,
    blockUser,
    increasePage,
    decreasePage,
  } = useUserStore();

  useEffect(() => {
    fetchUsers(searchValue, 1);
  }, [fetchUsers, searchValue]);

  return (
    <>
      <Breadcrumb
        pageName="Utilisateurs"
        onClick={() => fetchUsers(searchValue)}
      ></Breadcrumb>

      <ActionResult />

      <div className="'overflow-x-auto' max-w-full ">
        <div className="min-w-[400px] rounded-sm text-black dark:text-white">
          {/* Table Header */}
          <div className="  grid grid-cols-3 bg-bodydark1 text-left font-bold text-boxdark dark:bg-meta-4 dark:text-white md:grid-cols-4 xl:grid-cols-6 ">
            {["Nom", "Prénoms", "Email", "Téléphone", "Actif", ""].map(
              (column, index) => (
                <div
                  key={index}
                  className={` px-5 py-4 lg:px-7.5 2xl:px-11 ${index === 2 ? "hidden md:table-cell" : ""} ${index === 3 || index === 4 ? "hidden xl:table-cell" : ""} ${index === 5 ? "text-center" : ""} `}
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
            <div className="w-full   bg-white dark:bg-boxdark">
              {paginatedUsers?.results?.map((user, index) => (
                <div
                  key={index}
                  className={` grid w-full grid-cols-3 items-center border-t border-[#EEEEEE] dark:border-strokedark md:grid-cols-4 xl:grid-cols-6  `}
                >
                  {/* User Name */}
                  <div className="flex-1  overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {user.lastname}
                  </div>

                  {/* User Firstname */}
                  <div className="flex-1 overflow-hidden px-5 py-4 lg:px-7.5 2xl:px-11">
                    {user.firstname}
                  </div>

                  {/* User Email */}
                  <div className="hidden flex-1 overflow-hidden px-5 py-4 md:table-cell lg:px-7.5 2xl:px-11">
                    {user.email}
                  </div>

                  {/* User phone */}
                  <div className="hidden overflow-hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                    {user.phoneIndicative}
                    {user.phone}
                  </div>

                  {/* User is Block */}

                  <div className="flex items-center justify-center">
                    <div className="hidden px-5 py-4 lg:px-7.5 xl:table-cell 2xl:px-11">
                      {!user.isBlock ? (
                        <Check size={25} className="text-primary" />
                      ) : (
                        <X size={25} className="text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!user.isStaff && <div
                    className={`flex-1 px-5 py-4 text-end lg:px-7.5 2xl:px-11`}
                  >
                    <EditDeleteButton
                      editText={user.isBlock ? `Débloquer` : `Bloquer`}
                      onEdit={() => toggleModal(`block-dialog-${user.id}`)}
                      onDelete={() => {
                        toggleModal(`admin-pass-form-${user.id}`);
                      }}
                    />
                  </div>}

                  {/* Admin Pass Form*/}
                  <AdminPassForm
                    key={`admin-pass-form-${user.id}`}
                    id={`admin-pass-form-${user.id}`}
                    user={user}
                  />

                  {/*Deletion dialog*/}
                  <DeletionConfirmation
                    key={`block-confirmation-${user.id}`}
                    id={`block-dialog-${user.id}`}
                    message={`Êtes-vous sûr de vouloir ${user.isBlock ? `débloquer` : `bloquer`} ce utilisateur`}
                    successMessage={`L'utilisateur a été ${user.isBlock ? `débloqué` : `bloqué`} avec succès`}
                    objectId={user.id!}
                    deleteText={user.isBlock ? `Débloquer` : `Bloquer`}
                    onDelete={blockUser}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedUsers.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchUsers(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedUsers.count}
          fetchPage={(page) => fetchUsers(searchValue, page)}
          currentPage={page}
        />

        {paginatedUsers.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchUsers(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default UsersPage;
