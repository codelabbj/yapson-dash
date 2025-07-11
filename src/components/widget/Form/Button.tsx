import { FC } from "react";

interface AppButtonProps {
  name: string;
  width?: string;
  color?: string;
  disabled?: boolean;
  onClick: () => void;
  type?: "button" | "submit" | "reset" ;
}

const AppButton: FC<AppButtonProps> = ({ name, width, color, onClick, type = "button", disabled }) => {
  return (
    <button
      type={type}
      className={`text-md  flex ${width ? width : "w-full"} justify-center rounded-sm ${color ? color : "bg-primary"} px-3 py-2.5 text-[14px] font-medium text-white shadow-sm hover:border-none  hover:outline-none focus:outline-none sm:text-[15px] md:text-[16px] lg:text-[17px]`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default AppButton;
