import Ticket from "@/models/ticket.model";
import { ensureBaseUrl, formatDate } from "@/utils/functions.util";
import ImageList from "@mui/material/ImageList/ImageList";
import { Check, Edit, Trash, X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ImageListItem } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface CouponCardProps {
  coupon: Ticket;
  onEdit?: () => void;
  onDelete?: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    // width: 500,
    // maxHeight: 450,
    overflow: "scroll",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

const CouponCard: FC<CouponCardProps> = ({ coupon, onEdit, onDelete }) => {
  const classes = useStyles();
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
        {/* Removed image display as images are no longer part of Ticket */}
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="flex items-center">
          <span className="mr-1 font-medium">{coupon.code}</span>
        </p>
      </div>
    </div>
  );
};

export default CouponCard;
