"use client";

import { useState, FC, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import PageCounter from "@/components/common/PageCounter";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import AppButton from "@/components/widget/Form/Button";
import NotificationCard from "@/components/widget/NotificationCard";
import useNotificationStore from "@/store/useNotification.store";
import useSearchStore from "@/store/useSearchStore.store";

interface NotificationsPageProps {}

const NotificationsPage: FC<NotificationsPageProps> = () => {
  const { searchValue } = useSearchStore();
  const {
    paginatedNotifications,
    page,
    loading,
    fetchNotifications,
    deleteNotification,
    increasePage,
    decreasePage,
    pageSize,
  } = useNotificationStore();

  // Maintain the expanded state per notification
  const [expandedNotifications, setExpandedNotifications] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchNotifications(searchValue, 1);
  }, [fetchNotifications, searchValue]);

  const handleExpandToggle = (id: string) => {
    setExpandedNotifications((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      <Breadcrumb
        pageName="Notifications"
        onClick={() => fetchNotifications(searchValue)}
      />

      <ActionResult />

      <div className="max-w-full">
        {loading ? (
          <ProcessingLoader />
        ) : (
          //
          <div className="grid grid-cols-1 items-start gap-4 rounded-sm text-black dark:text-white md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedNotifications?.results?.map((notification) => (
              <NotificationCard
                key={notification.id}
                id={notification.id} // Pass the ID for toggling
                title={notification.title}
                content={notification.content}
                createdAt={notification.createdAt}
                isReaded={notification.isReaded}
                isExpanded={!!expandedNotifications[notification.id]} // Get expanded state
                onExpandToggle={handleExpandToggle} // Handle toggle
              />
            ))}
          </div>
        )}
      </div>

      <div className="my-5 flex items-center justify-evenly xsm:my-10 md:my-8">
        {paginatedNotifications.previous ? (
          <AppButton
            name="Précédent"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              decreasePage();
              fetchNotifications(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}

        <PageCounter
          totalPage={paginatedNotifications.count}
          currentPage={page}
          pageSize={pageSize}
          fetchPage={(page) => fetchNotifications(searchValue, page)}
        />

        {paginatedNotifications.next ? (
          <AppButton
            name="Suivant"
            width="w-[150px]"
            color={`bg-bodydark2 text-boxdark dark:bg-meta-4 dark:text-white`}
            onClick={() => {
              increasePage();
              fetchNotifications(searchValue);
            }}
          />
        ) : (
          <span className="w-1"></span>
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
