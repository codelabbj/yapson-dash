"use client";

import { FC, useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AppButton from "@/components/widget/Form/Button";
import { toggleModal } from "@/utils/functions.util";
import useUserStore from "@/store/useUser.store";
import useNotificationSenderStore from "@/store/useNotificationSender.store";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import Loader from "@/components/common/Loader";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import { SearchIcon, SendIcon, Users, User, ChevronLeft, ChevronRight } from "lucide-react";

interface NotificationSenderPageProps {}

const NotificationSenderPage: FC<NotificationSenderPageProps> = () => {
  const { 
    paginatedUsers, 
    loading: usersLoading, 
    fetchUsers 
  } = useUserStore();
  
  const { 
    notification, 
    setNotification, 
    resetNotification, 
    sendNotification,
    sending, 
    success,
    resetState
  } = useNotificationSenderStore();
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBroadcast, setIsBroadcast] = useState(true);

  // Fetch users on mount, search query change, or page change
  useEffect(() => {
    fetchUsers(searchQuery, currentPage);
  }, [fetchUsers, searchQuery, currentPage]);

  // Reset form after successful notification send
  useEffect(() => {
    if (success) {
      resetState();
      setSelectedUserId(null);
      setSearchQuery("");
    }
  }, [success, resetState]);

  const handleSendNotification = async () => {
    // Set the user_id in the notification object based on broadcast mode
    setNotification('user_id', isBroadcast ? null : selectedUserId);
    
    // Send after a small delay to ensure the user_id is set
    setTimeout(() => {
      sendNotification();
    }, 100);
  };

  const handleBroadcastChange = (broadcast: boolean) => {
    setIsBroadcast(broadcast);
    if (broadcast) {
      setSelectedUserId(null);
      setNotification('user_id', null);
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    setNotification('user_id', userId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers(searchQuery, 1);
  };

  const handleNextPage = () => {
    if (paginatedUsers && paginatedUsers.next) {
      setCurrentPage(prev => prev + 1);
      fetchUsers(searchQuery, currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginatedUsers && paginatedUsers.previous) {
      setCurrentPage(prev => prev - 1);
      fetchUsers(searchQuery, currentPage - 1);
    }
  };

  // Check if the form is valid before submitting
  const isFormValid = () => {
    return notification.title && notification.content && (isBroadcast || selectedUserId);
  };

  return (
    <>
      <Breadcrumb pageName="Notifications" />

      <ActionResult />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-7">
        <h2 className="mb-8 text-2xl font-semibold text-black dark:text-white">
          Envoyer une Notification
        </h2>

        {/* Title field */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full">
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Titre <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Titre de la notification"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={notification.title}
                onChange={(e) => setNotification('title', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content field */}
        <div className="mb-5.5">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Contenu <span className="text-meta-1">*</span>
          </label>
          <textarea
            rows={6}
            placeholder="Contenu de la notification"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={notification.content}
            onChange={(e) => setNotification('content', e.target.value)}
          ></textarea>
        </div>

        {/* Broadcast vs. Individual Selection */}
        <div className="mb-5.5">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Destinataires
          </label>
          
          <div className="mb-4 flex flex-wrap gap-4">
            <button
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-all ${
                isBroadcast
                  ? "bg-primary text-white"
                  : "bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white"
              }`}
              onClick={() => handleBroadcastChange(true)}
            >
              <Users size={18} />
              Tous les utilisateurs
            </button>
            
            <button
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-all ${
                !isBroadcast
                  ? "bg-primary text-white"
                  : "bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white"
              }`}
              onClick={() => handleBroadcastChange(false)}
            >
              <User size={18} />
              Utilisateur spécifique
            </button>
          </div>

          {/* User Selection */}
          {!isBroadcast && (
            <div className="mt-4 w-full">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Sélectionner un utilisateur <span className="text-meta-1">*</span>
              </label>
              
              {/* User Search Bar */}
              <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-bodydark2" size={18} />
                </div>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                >
                  Rechercher
                </button>
              </form>
              
              {usersLoading ? (
                <div className="my-4 flex justify-center">
                  <ProcessingLoader />
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto rounded border-[1.5px] border-stroke bg-transparent dark:border-form-strokedark dark:bg-form-input">
                    {paginatedUsers?.results && paginatedUsers.results.length > 0 ? (
                      <ul className="divide-y divide-stroke dark:divide-form-strokedark">
                        {paginatedUsers.results.map((user) => (
                          <li
                            key={user.id}
                            className={`cursor-pointer px-4 py-3 transition-all hover:bg-gray-100 dark:hover:bg-meta-4 ${
                              selectedUserId === user.id
                                ? "bg-gray-100 dark:bg-meta-4"
                                : ""
                            }`}
                            onClick={() => user.id && handleUserSelection(user.id)}
                          >
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-sm font-medium text-black dark:text-white">
                                  {user.firstname} {user.lastname}
                                </p>
                                <p className="text-xs text-bodydark2">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-center text-sm text-bodydark2">
                        Aucun utilisateur trouvé
                      </p>
                    )}
                  </div>

                  {/* Pagination */}
                  {paginatedUsers && (paginatedUsers.next || paginatedUsers.previous) && (
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={handlePrevPage}
                        disabled={!paginatedUsers.previous}
                        className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-bodydark2 disabled:opacity-50"
                      >
                        <ChevronLeft size={18} />
                        Précédent
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={!paginatedUsers.next}
                        className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-bodydark2 disabled:opacity-50"
                      >
                        Suivant
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSendNotification}
            disabled={!isFormValid() || sending}
            className="flex items-center justify-center gap-2 rounded bg-primary px-6 py-2 font-medium text-white disabled:opacity-60 hover:bg-opacity-90"
          >
            {sending ? (
              <>
                <Loader />
                Envoi en cours...
              </>
            ) : (
              <>
                <SendIcon size={18} />
                Envoyer
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSenderPage;