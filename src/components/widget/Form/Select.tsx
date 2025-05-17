import { FC, ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectItemProps {
  name: string;
  value: string;
}

interface AppSelectProps {
  id: string;
  name: string;
  label?: string;
  icon?: ReactNode;
  items: SelectItemProps[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const AppSelect: FC<AppSelectProps> = ({
  id,
  name,
  label,
  icon,
  items,
  value,
  onChange,
  disabled,
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}

      <div className="relative z-20 bg-white dark:bg-form-input">
        {icon && (
          <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
            {icon}
          </span>
        )}

        <select
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e);
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white 
           
          `}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {label}
          </option>

          {items.map((item, index) => (
            <option
              key={index}
              value={item.value}
              className="text-body dark:text-bodydark"
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AppSelect;
