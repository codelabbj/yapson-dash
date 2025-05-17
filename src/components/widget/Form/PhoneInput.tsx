import { FC, ReactNode } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface AppPhoneInputProps {
  label?: string;
  id: string;
  name: string;
  value?: string;
  placeholder: string;

  disabled?: boolean;
  onChange: (country: any, value: string) => void;
}

const AppPhoneInput: FC<AppPhoneInputProps> = ({
  id,
  label,
  name,
  value,
  placeholder,
  disabled,
  onChange,
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <PhoneInput
          inputProps={{
            id: `${id}`,
            name: `${name}`,
            placeholder: `${placeholder}`,
          }}
          country={"bj"}
          value={value}
          onChange={(value, country, e, formattedValue) => {
            onChange(country, value);
          }}
          regions={["africa"]}
          autoFormat={false}
          disableDropdown={disabled}
          enableSearch={disabled}
          disableSearchIcon={true}
          searchPlaceholder="Rechercher"
          showDropdown={true}
          inputClass={`!w-full !font-satoshi !rounded-sm !border-2 !border-stroke !bg-transparent !pr-5 !py-6 !text-black !outline-none transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white  dark:focus:!border-primary`}
          buttonClass={`!bg-transparent !font-satoshi focus:!border-primary active:!border-primary !rounded-sm transition focus:!border-primary dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary dark:!bg-boxdark dark:hover:!bg-boxdark`}
          dropdownClass={`!font-satoshi !z-99999 dark:!bg-boxdark dark:hover:!bg-boxdark`}
        />
      </div>
    </div>
  );
};

export default AppPhoneInput;
