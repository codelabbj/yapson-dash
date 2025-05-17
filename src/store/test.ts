import axios from "axios";

interface BotUser {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  created_at: string;
  real_name: string | null;
  chat_id: string | null;
}

interface PaginatedBotUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: BotUser[];
}

class BotUserApi {
  private static baseUrl: string = "https://api.blaffa.net/bot";

  /**
   * Get bot users with optional pagination
   * @param page Optional page number (default: 1)
   * @param pageSize Optional page size (default: 20)
   * @returns Paginated list of bot users
   */
  static async fetchBotUsers(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedBotUsers> {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get<PaginatedBotUsers>(
        `${this.baseUrl}/user/?page=${page}&page_size=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching bot users:", error);
      throw error;
    }
  }

  /**
   * Search bot users
   * @param searchValue Search term
   * @param page Optional page number (default: 1)
   * @param pageSize Optional page size (default: 20)
   * @returns Paginated list of bot users matching search
   */
  static async searchBotUsers(
    searchValue: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedBotUsers> {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get<PaginatedBotUsers>(
        `${this.baseUrl}/user/?search_fields=${searchValue}&page=${page}&page_size=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error searching bot users:", error);
      throw error;
    }
  }

  /**
   * Send notification to bot users
   * @param content Notification content
   * @param user_id Optional specific bot user ID (if null, sends to all bot users)
   * @returns Success status
   */
  static async sendBotNotification(
    content: string,
    user_id?: string | null
  ): Promise<any> {
    try {
      const token = localStorage.getItem("access");
      const payload = {
        content,
        user_id
      };
      
      const response = await axios.post(
        `${this.baseUrl}/notification/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": "fr",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error sending bot notification:", error);
      throw error;
    }
  }
}

export default BotUserApi;


























import { create } from 'zustand';
import NotificationApi from '@/api/notificationsender.api';
import BotUserApi from '@/api/botuser.api'; // Import the new Bot User API
import Notification from '@/models/notificationSender.model';
import PaginatedNotification from '@/models/paginated_notificationSender.model';

// Define Bot User interfaces
interface BotUser {
  id: number;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  created_at: string;
  real_name: string | null;
  chat_id: string | null;
}

interface PaginatedBotUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: BotUser[];
}

interface NotificationSenderState {
  loading: boolean;
  sending: boolean;
  success: boolean;
  error: string | null;
  notification: Notification;
  paginatedNotifications: PaginatedNotification;
  botUsers: PaginatedBotUsers | null;
  botUsersLoading: boolean;
  page: number;
  botPage: number;
  recipientType: 'regular' | 'bot';
  isBroadcast: boolean;
  selectedBotUserId: string | null;
  
  // Methods
  setNotification: (field: keyof Notification, value: any) => void;
  resetNotification: () => void;
  sendNotification: () => Promise<void>;
  sendBotNotification: () => Promise<void>;
  fetchNotifications: (searchValue?: string, page?: number) => Promise<void>;
  fetchBotUsers: (searchValue?: string, page?: number) => Promise<void>;
  setRecipientType: (type: 'regular' | 'bot') => void;
  setIsBroadcast: (isBroadcast: boolean) => void;
  setSelectedBotUserId: (userId: string | null) => void;
  increasePage: () => void;
  decreasePage: () => void;
  resetState: () => void;
}

// Create a custom function to show action results
const showActionResult = (type: 'success' | 'error', message: string) => {
  // You can implement this based on how your app shows notifications
  console.log(`[${type}] ${message}`);
  
  // If you have a global state for notifications or a context, update it here
  const actionResultElement = document.getElementById('action-result');
  if (actionResultElement) {
    actionResultElement.className = type === 'success' ? 'text-green-500' : 'text-red-500';
    actionResultElement.textContent = message;
    actionResultElement.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      actionResultElement.style.display = 'none';
    }, 3000);
  }
};

const initialNotification = new Notification('', '');

const emptyPaginatedNotifications = new PaginatedNotification(0, null, null, []);

const emptyPaginatedBotUsers = {
  count: 0,
  next: null,
  previous: null,
  results: []
};

const useNotificationSenderStore = create<NotificationSenderState>((set, get) => ({
  loading: false,
  sending: false,
  success: false,
  error: null,
  notification: initialNotification,
  paginatedNotifications: emptyPaginatedNotifications,
  botUsers: emptyPaginatedBotUsers,
  botUsersLoading: false,
  page: 1,
  botPage: 1,
  recipientType: 'regular',
  isBroadcast: true,
  selectedBotUserId: null,

  setNotification: (field, value) => {
    set((state) => {
      // Create a new Notification instance instead of spreading
      const currentNotification = state.notification;
      const updatedNotification = new Notification(
        field === 'title' ? value : currentNotification.title,
        field === 'content' ? value : currentNotification.content,
        field === 'user_id' ? value : currentNotification.user_id,
        currentNotification.id,
        currentNotification.created_at,
        currentNotification.updated_at
      );
      
      return { notification: updatedNotification };
    });
  },
  
  resetNotification: () => {
    set({ notification: initialNotification, success: false, error: null });
  },

  sendNotification: async () => {
    const { notification } = get();
    
    // Validate notification data
    if (!notification.title.trim()) {
      showActionResult('error', 'Le titre est requis');
      return;
    }
    
    if (!notification.content.trim()) {
      showActionResult('error', 'Le contenu est requis');
      return;
    }
    
    try {
      set({ sending: true, error: null });
      
      await NotificationApi.send(notification);
      
      set({ sending: false, success: true });
      
      const recipientText = notification.user_id 
        ? 'l\'utilisateur sélectionné' 
        : 'tous les utilisateurs';
        
      showActionResult('success', `Notification envoyée avec succès à ${recipientText}`);
    } catch (error: any) {
      set({ 
        sending: false, 
        error: error.message || 'Une erreur est survenue lors de l\'envoi de la notification'
      });
      
      showActionResult('error', error.message || 'Échec de l\'envoi de la notification');
    }
  },

  sendBotNotification: async () => {
    const { notification, selectedBotUserId, isBroadcast } = get();
    
    // For bot notifications, only content is required
    if (!notification.content.trim()) {
      showActionResult('error', 'Le contenu est requis');
      return;
    }
    
    try {
      set({ sending: true, error: null });
      
      // Send notification to bot users
      await BotUserApi.sendBotNotification(
        notification.content,
        isBroadcast ? null : selectedBotUserId
      );
      
      set({ sending: false, success: true });
      
      const recipientText = isBroadcast 
        ? 'tous les utilisateurs du bot' 
        : 'l\'utilisateur du bot sélectionné';
        
      showActionResult('success', `Notification envoyée avec succès à ${recipientText}`);
    } catch (error: any) {
      set({ 
        sending: false, 
        error: error.message || 'Une erreur est survenue lors de l\'envoi de la notification'
      });
      
      showActionResult('error', error.message || 'Échec de l\'envoi de la notification');
    }
  },

  fetchNotifications: async (searchValue = '', page = 1) => {
    try {
      set({ loading: true, error: null });
      
      const paginatedNotifications = await NotificationApi.findMany(searchValue, page);
      
      set({ 
        paginatedNotifications,
        loading: false,
        page
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Une erreur est survenue lors de la récupération des notifications'
      });
      
      showActionResult('error', error.message || 'Échec de la récupération des notifications');
    }
  },

  fetchBotUsers: async (searchValue = '', page = 1) => {
    try {
      set({ botUsersLoading: true, error: null });
      
      // Use the appropriate fetch method based on whether we're searching or not
      const botUsers = searchValue.trim() 
        ? await BotUserApi.searchBotUsers(searchValue, page)
        : await BotUserApi.fetchBotUsers(page);
      
      set({ 
        botUsers,
        botUsersLoading: false,
        botPage: page
      });
    } catch (error: any) {
      set({ 
        botUsersLoading: false, 
        error: error.message || 'Une erreur est survenue lors de la récupération des utilisateurs bot'
      });
      
      showActionResult('error', error.message || 'Échec de la récupération des utilisateurs bot');
    }
  },

  setRecipientType: (type) => {
    set({ 
      recipientType: type,
      isBroadcast: true,
      selectedBotUserId: null,
      notification: new Notification(
        type === 'bot' ? '' : get().notification.title,
        get().notification.content
      )
    });
  },

  setIsBroadcast: (isBroadcast) => {
    set({ isBroadcast });
  },

  setSelectedBotUserId: (userId) => {
    set({ selectedBotUserId: userId });
  },

  increasePage: () => {
    set((state) => ({ page: state.page + 1 }));
  },

  decreasePage: () => {
    set((state) => ({ page: Math.max(1, state.page - 1) }));
  },

  resetState: () => {
    set({ 
      notification: initialNotification, 
      success: false, 
      error: null,
      recipientType: 'regular',
      isBroadcast: true,
      selectedBotUserId: null
    });
  }
}));

export default useNotificationSenderStore;













































































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
import { SearchIcon, SendIcon, Users, ChevronLeft, ChevronRight, Bot, User } from "lucide-react";

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
    sendBotNotification,
    fetchBotUsers,
    botUsers,
    botUsersLoading,
    recipientType,
    setRecipientType,
    isBroadcast,
    setIsBroadcast,
    selectedBotUserId,
    setSelectedBotUserId,
    sending, 
    success,
    resetState
  } = useNotificationSenderStore();
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBotPage, setCurrentBotPage] = useState(1);

  // Fetch users on mount, search query change, or page change
  useEffect(() => {
    if (recipientType === 'regular') {
      fetchUsers(searchQuery, currentPage);
    } else {
      fetchBotUsers(searchQuery, currentBotPage);
    }
  }, [fetchUsers, fetchBotUsers, searchQuery, currentPage, currentBotPage, recipientType]);

  // Reset form after successful notification send
  useEffect(() => {
    if (success) {
      resetState();
      setSelectedUserId(null);
      setSearchQuery("");
    }
  }, [success, resetState]);

  const handleSendNotification = async () => {
    if (recipientType === 'regular') {
      // Set the user_id in the notification object based on broadcast mode
      setNotification('user_id', isBroadcast ? null : selectedUserId);
      
      // Send after a small delay to ensure the user_id is set
      setTimeout(() => {
        sendNotification();
      }, 100);
    } else {
      // For bot users, send bot notification
      sendBotNotification();
    }
  };

  const handleRecipientTypeChange = (type: 'regular' | 'bot') => {
    setRecipientType(type);
    setSearchQuery("");
    setCurrentPage(1);
    setCurrentBotPage(1);
  };

  const handleBroadcastModeChange = (broadcast: boolean) => {
    setIsBroadcast(broadcast);
    if (broadcast) {
      setSelectedUserId(null);
      setSelectedBotUserId(null);
      setNotification('user_id', null);
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    setNotification('user_id', userId);
  };

  const handleBotUserSelection = (userId: string) => {
    setSelectedBotUserId(userId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recipientType === 'regular') {
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers(searchQuery, 1);
    } else {
      setCurrentBotPage(1); // Reset to first page when searching
      fetchBotUsers(searchQuery, 1);
    }
  };

  const handleNextPage = () => {
    if (recipientType === 'regular') {
      if (paginatedUsers && paginatedUsers.next) {
        setCurrentPage(prev => prev + 1);
        fetchUsers(searchQuery, currentPage + 1);
      }
    } else {
      if (botUsers && botUsers.next) {
        setCurrentBotPage(prev => prev + 1);
        fetchBotUsers(searchQuery, currentBotPage + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (recipientType === 'regular') {
      if (paginatedUsers && paginatedUsers.previous) {
        setCurrentPage(prev => prev - 1);
        fetchUsers(searchQuery, currentPage - 1);
      }
    } else {
      if (botUsers && botUsers.previous) {
        setCurrentBotPage(prev => prev - 1);
        fetchBotUsers(searchQuery, currentBotPage - 1);
      }
    }
  };

  // Check if the form is valid before submitting
  const isFormValid = () => {
    if (recipientType === 'regular') {
      return notification.title && notification.content && (isBroadcast || selectedUserId);
    } else {
      // For bot users, only content is required
      return notification.content && (isBroadcast || selectedBotUserId);
    }
  };

  const renderUsersList = () => {
    if (recipientType === 'regular') {
      return (
        <>
          {usersLoading ? (
            <div className="my-4 flex justify-center">
              <ProcessingLoader />
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto rounded border-[1.5px] border-stroke bg-transparent dark:border-form-strokedark dark:bg-form-input">
                {paginatedUsers?.results?.length > 0 ? (
                  <ul className="divide-y divide-stroke dark:divide-form-strokedark">
                    {paginatedUsers.results.map((user) => (
                      <li
                        key={user.id}
                        className={`cursor-pointer px-4 py-3 transition-all hover:bg-gray-100 dark:hover:bg-meta-4 ${
                          selectedUserId === user.id
                            ? "bg-gray-100 dark:bg-meta-4"
                            : ""
                        }`}
                        onClick={() => handleUserSelection(user.id!)}
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
              
              {/* Pagination Controls */}
              <div className="mt-4 flex items-center justify-between">
                {paginatedUsers?.count > 0 && (
                  <div className="text-sm text-bodydark2">
                    Page {currentPage} - Total: {paginatedUsers.count} utilisateurs
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!paginatedUsers?.previous}
                    className={`flex items-center justify-center rounded-md p-2 ${
                      !paginatedUsers?.previous
                        ? "cursor-not-allowed opacity-50"
                        : "bg-primary text-white hover:bg-opacity-90"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!paginatedUsers?.next}
                    className={`flex items-center justify-center rounded-md p-2 ${
                      !paginatedUsers?.next
                        ? "cursor-not-allowed opacity-50"
                        : "bg-primary text-white hover:bg-opacity-90"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      );
    } else {
      // Bot users list
      return (
        <>
          {botUsersLoading ? (
            <div className="my-4 flex justify-center">
              <ProcessingLoader />
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto rounded border-[1.5px] border-stroke bg-transparent dark:border-form-strokedark dark:bg-form-input">
                {botUsers?.results?.length > 0 ? (
                  <ul className="divide-y divide-stroke dark:divide-form-strokedark">
                    {botUsers.results.map((user) => (
                      <li
                        key={user.id}
                        className={`cursor-pointer px-4 py-3 transition-all hover:bg-gray-100 dark:hover:bg-meta-4 ${
                          selectedBotUserId === user.user_id
                            ? "bg-gray-100 dark:bg-meta-4"
                            : ""
                        }`}
                        onClick={() => handleBotUserSelection(user.user_id)}
                      >
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="text-sm font-medium text-black dark:text-white">
                              {user.real_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utilisateur Bot'}
                            </p>
                            <p className="text-xs text-bodydark2">
                              ID: {user.user_id}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-sm text-bodydark2">
                    Aucun utilisateur bot trouvé
                  </p>
                )}
              </div>
              
              {/* Pagination Controls for Bot Users */}
              <div className="mt-4 flex items-center justify-between">
                {botUsers?.count > 0 && (
                  <div className="text-sm text-bodydark2">
                    Page {currentBotPage} - Total: {botUsers.count} utilisateurs bot
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={!botUsers?.previous}
                    className={`flex items-center justify-center rounded-md p-2 ${
                      !botUsers?.previous
                        ? "cursor-not-allowed opacity-50"
                        : "bg-primary text-white hover:bg-opacity-90"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!botUsers?.next}
                    className={`flex items-center justify-center rounded-md p-2 ${
                      !botUsers?.next
                        ? "cursor-not-allowed opacity-50"
                        : "bg-primary text-white hover:bg-opacity-90"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Notifications" />

      <ActionResult />

      <div className="rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-7">
        <h2 className="mb-8 text-2xl font-semibold text-black dark:text-white">
          Envoyer une Notification
        </h2>

        {/* Recipient Type Selection */}
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Type de Destinataire
          </label>
          
          <div className="flex flex-wrap gap-4">
            <button
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-all ${
                !isBroadcast
                  ? "bg-primary text-white"
                  : "bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white"
              }`}
              onClick={() => handleBroadcastModeChange(false)}
            >
              <Users size={18} />
              {recipientType === 'regular' ? 'Utilisateur spécifique' : 'Utilisateur bot spécifique'}
            </button>
          </div>

          {!isBroadcast && (
            <div className="mt-4 w-full">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Sélectionner un {recipientType === 'regular' ? 'utilisateur' : 'utilisateur bot'} <span className="text-meta-1">*</span>
              </label>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Rechercher un ${recipientType === 'regular' ? 'utilisateur' : 'utilisateur bot'}...`}
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
              
              {renderUsersList()}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center gap-3.5 rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            onClick={resetState}
            disabled={sending}
          >
            Annuler
          </button>
          
          <button
            className="flex items-center justify-center gap-2 rounded bg-primary px-6 py-2 font-medium text-gray disabled:opacity-60 hover:bg-opacity-90"
            onClick={handleSendNotification}
            disabled={sending || !isFormValid()}
          >
            {sending ? (
              <>
                <Loader /> Envoi en cours...
              </>
            ) : (
              <>
                <SendIcon size={18} /> Envoyer
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSenderPage;


