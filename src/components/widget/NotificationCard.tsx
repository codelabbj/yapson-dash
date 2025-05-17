import { useState, FC } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/utils/functions.util";

interface NotificationProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isReaded: boolean;
  isExpanded: boolean;
  onExpandToggle: (id: string) => void;
}

const NotificationCard: FC<NotificationProps> = ({
  id,
  title,
  content,
  createdAt,
  isReaded,
  isExpanded,
  onExpandToggle,
}) => {
  return (
    <div
      className={`max-w-md rounded-sm shadow-sm ${!isReaded ? "shadow-primary" : ""} border-[#EEEEEE] bg-white p-4 text-black transition-all duration-200 dark:border-strokedark dark:bg-boxdark dark:text-white  `}
      style={{
        display: "flex", // Prevents grid interference
        flexDirection: "column",
        overflow: "hidden", // Keeps the card isolated
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {!isReaded && <div className="h-2 w-2 rounded-full bg-primary" />}
            <h3 className="font-medium ">{title}</h3>
          </div>
          <p className="mt-1 text-sm">{formatDate(createdAt)}</p>
        </div>

        <button
          onClick={() => onExpandToggle(id)}
          className="rounded-full p-1 transition-colors duration-200 hover:bg-gray-100"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div
        key={id}
        className={`{isExpanded ?  "max-h-96" : "max-h-0"} mt-2 max-h-96 overflow-hidden duration-200`}
      >
        <p className="overflow-hidden">{isExpanded ? content : ""}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
