import { FC, useState } from "react";

interface AppCheckbox {
  label?: string;
  id: string;
  name: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

const AppCheckbox: FC<AppCheckbox> = ({ label, id, name, value, onChange }) => {
  return (
    <div className="flex w-full items-center justify-evenly">
      {label && (
        <span className="font-medium text-black dark:text-white">{label}</span>
      )}

      <input
        type="checkbox"
        id={id}
        name={name}
        className={`h-6 w-6 rounded-full bg-bodydark`}
        checked={value}
        onChange={() => {
          onChange(!value);
        }}
      />
    </div>
  );
};

export default AppCheckbox;
