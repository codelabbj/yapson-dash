import Advertisement from "@/models/advertisement.model";
import { ensureBaseUrl, formatDate } from "@/utils/functions.util";
import { Check, Edit, Trash, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface AdvertisementCardProps {
  advertisement: Advertisement;
  showOptions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AdvertisementCard: FC<AdvertisementCardProps> = ({
  advertisement,
  showOptions,
  onEdit,
  onDelete,
}) => {
  // console.log("=======> AdvertisementCard Rebuilt");
  return (
    <div
      className={`w-full rounded-sm border-[#EEEEEE] bg-white p-4 text-black shadow-md transition-all duration-200 dark:border-strokedark dark:bg-boxdark dark:text-white `}
    >
      <div className="mb-5 flex justify-between font-bold">
        <span className="text-xl font-semibold">{}</span>
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
      <div className="my-10 flex items-center justify-center">
        <Image
          src={ensureBaseUrl(advertisement.image)}
          height={100}
          width={100}
          alt={advertisement.content?.substring(3) ?? ''}
          className="mx-auto"
          style={{ height: "auto" }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        {/* Date */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Créé le:</span>
          {formatDate(
            typeof advertisement.createdAt === "string"
              ? new Date(advertisement.createdAt)
              : advertisement.createdAt,
          )}
        </p>

        {/* Status */}
        <p className="flex items-center">
          <span className="mr-1 font-medium">Active:</span>
          {advertisement.enable ? (
            <Check className="text-green-500" />
          ) : (
            <X className="text-red-500" />
          )}
        </p>
      </div>
    </div>
  );
};

export default AdvertisementCard;
