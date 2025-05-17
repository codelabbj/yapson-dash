import { FC } from "react";
import Modal from "./Form/Modal";
import Image from "next/image";

interface ImageViewCardProps {
  id: string;
  image: string;
}

const ImageViewCard: FC<ImageViewCardProps> = ({ id, image }) => {
  return (
    <Modal id={id} onClose={() => {}}>
      <Image src={image} alt="Image" width={500} height={500} />
    </Modal>
  );
};

export default ImageViewCard;
