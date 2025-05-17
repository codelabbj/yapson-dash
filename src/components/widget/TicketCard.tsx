import {
  ticketStatus,
  ticketSubscriptions,
} from "@/hooks/forms/useTicketForm.hook";
import Ticket from "@/models/ticket.model";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface TicketCardProps {
  ticket: Ticket;
  showOptions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TicketCard: FC<TicketCardProps> = ({
  ticket,
  showOptions,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`w-full rounded-sm border-[#EEEEEE] bg-white p-4 text-black shadow-md transition-all duration-200 dark:border-strokedark dark:bg-boxdark dark:text-white `}
    >
      <div className="mb-5 flex justify-between font-bold">
        <span className="text-xl font-semibold">{ticket.code}</span>
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
      </div>
      <div className="my-10 flex items-center justify-center overflow-hidden">
        <p className="">
          <span className=" text-xl font-semibold">{ticket.images.length}</span>
          <span className="ml-3"> combinés</span>
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        {/* Subscription */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Abonnement:</span>
          {ticketSubscriptions.find((item) => item.value === ticket.betapp)
            ?.name ?? "Inconnu"}
        </p>

        {/* Status */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Statut:</span>
          {ticketStatus.find((item) => item.value === ticket.betapp)?.name ??
            "Inconnu"}
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
