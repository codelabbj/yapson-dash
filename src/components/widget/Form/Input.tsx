import { FC, ReactNode, useState } from "react";
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";
import { ensureBaseUrl } from "@/utils/functions.util";

interface AppInputProps {
  label?: string;
  id: string;
  name: string;
  type: "text" | "number" | "file" | "email" | "password" | "date" | "files" | "url" | "checkbox";
  checkbox?: boolean;
  value?: string | number | readonly string[] | File | null | File[];
  placeholder: string;
  autoComplete?: string;
  icon?: ReactNode;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // onKeyDown?: (e: React.KeyboardEventHandler<HTMLInputElement>) => void;
}

const AppInput: FC<AppInputProps> = ({
  label,
  id,
  name,
  type,
  value,
  checked,
  className,
  placeholder,
  autoComplete,
  icon,
  disabled,
  required,
  onChange,
  // onKeyDown,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(e);
    }
  };

  const [inputType, setInputType] = useState<"text" | "password">(
    type === "password" ? type : "text",
  );

  return (
    <div>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {type === "file" ? (
          <div className="flex items-center justify-between">
            <input
              id={id}
              name={name}
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
              className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {value &&
              (value instanceof File ? (
                <div className="ml-4">
                  <Image
                    src={URL.createObjectURL(value)}
                    alt="Selected Logo"
                    width={60}
                    height={60}
                    className="rounded-sm object-cover"
                    style={{ height: "auto" }}
                  />
                </div>
              ) : typeof value === "string" ? (
                <div className="ml-4">
                  <Image
                    src={ensureBaseUrl(value as string)}
                    alt="Selected Logo"
                    width={70}
                    height={70}
                    className=" rounded-sm object-cover"
                    style={{ height: "auto" }}
                  />
                </div>
              ) : (
                <span className="absolute right-4 top-4 text-sm text-black dark:text-white">
                  Aucun fichier sélectionné
                </span>
              ))}
          </div>
        ) : type == "files" ? (
          <div className="flex items-center justify-between">
            <input
              id={id}
              name={name}
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={disabled}
              className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {Array.isArray(value) &&
              value.map((val) =>
                value instanceof File ? (
                  <div key={"val" + val.name} className="ml-4">
                    <Image
                      src={URL.createObjectURL(value)}
                      alt="Selected Logo"
                      width={60}
                      height={60}
                      className="rounded-sm object-cover"
                      style={{ height: "auto" }}
                    />
                  </div>
                ) : typeof value === "string" ? (
                  <div className="ml-4">
                    <Image
                      src={ensureBaseUrl(value as string)}
                      alt="Selected Logo"
                      width={70}
                      height={70}
                      className=" rounded-sm object-cover"
                      style={{ height: "auto" }}
                    />
                  </div>
                ) : (
                  <span className="absolute right-4 top-4 text-sm text-black dark:text-white">
                    Aucun fichier sélectionné
                  </span>
                ),
              )}
          </div>
        ) : (
          <input
            id={id}
            name={name}
            type={type === "password" ? inputType : type}
            value={value as string | number | readonly string[]}
            autoComplete={autoComplete}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={onChange}
            className={`w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
          />
        )}

        {type === "password" ? (
          <span
            className="absolute right-4 top-4"
            onClick={() =>
              setInputType(inputType === "password" ? "text" : "password")
            }
          >
            {inputType !== "password" ? (
              <Eye className="dark:text-white" />
            ) : (
              <EyeClosed className="dark:text-white" />
            )}
          </span>
        ) : (
          <>{icon && <span className="absolute right-4 top-4">{icon}</span>}</>
        )}
      </div>
    </div>
  );
};

export default AppInput;
