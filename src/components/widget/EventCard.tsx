import { eventStatus } from "@/hooks/forms/useEventForm.hook";
import Event from "@/models/event.model";
import { ensureBaseUrl } from "@/utils/functions.util";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface EventCardProps {
  event: Event;
  showOptions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EventCard: FC<EventCardProps> = ({
  event,
  showOptions,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={` my-2 w-full rounded-sm border-[#EEEEEE] bg-white p-4 text-black shadow-md transition-all duration-200 dark:border-strokedark dark:bg-boxdark dark:text-white`}
    >
      <div
        className={`mb-5 flex ${!showOptions ? "justify-center" : "justify-between"}  font-bold`}
      >
        <span className="font-semibold">{event.match.championship.name}</span>
        {showOptions && (
          <div className="flex">
            <Edit
              size={15}
              className="mr-4 text-green-500 hover:cursor-pointer"
              onClick={() => {
                if (onEdit) {
                  onEdit();
                }
              }}
            />
            <Trash
              size={15}
              className="text-red-500 hover:cursor-pointer"
              onClick={() => {
                if (onDelete) {
                  onDelete();
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="mb-12 flex items-center justify-center overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="ml-4 flex items-center justify-between">
            <div className=" flex items-center justify-between">
              <Image
                src={ensureBaseUrl(event.match.clubHome.logo as string)}
                alt={event.match.clubHome.name}
                width={50}
                height={50}
              />
              <span className="ml-3">{event.match.clubHome.name}</span>
            </div>

            <span className="mx-10 text-lg font-medium">vs</span>

            <div className=" flex items-center justify-between">
              <Image
                src={ensureBaseUrl(event.match.clubForeign.logo as string)}
                alt={event.match.clubForeign.name}
                width={50}
                height={50}
              />
              <span className="ml-3">{event.match.clubForeign.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        {/* Bet */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Pari:</span> {event.bet}
        </p>

        {/* Coast */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Cote:</span>
          {parseFloat(event.coast).toFixed(2)}
        </p>

        {/* Status */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Statut:</span>

          {eventStatus.find((item) => item.value === event.status)?.name ??
            "Inconnu"}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
