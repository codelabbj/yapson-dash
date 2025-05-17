import { FC, ReactNode, useState } from "react";
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";

interface AppTextAreaProps {
  label?: string;
  id: string;
  name: string;
  value?: string;

  placeholder: string;
  autoComplete?: string;

  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // onKeyDown?: (e: React.KeyboardEventHandler<HTMLInputElement>) => void;
}

const AppTextArea: FC<AppTextAreaProps> = ({
  label,
  id,
  name,
  value,
  placeholder,
  autoComplete,

  disabled,
  onChange,
  // onKeyDown,
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}  
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          className={`min-h-30 w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
        />
      </div>
    </div>
  );
};

export default AppTextArea;
