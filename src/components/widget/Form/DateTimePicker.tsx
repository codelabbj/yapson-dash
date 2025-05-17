import { FC } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment, { Moment } from "moment";
import "moment/locale/fr";

interface AppDateTimePickerProps {
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  selectedDateTime: Date | Moment | undefined;
  onDateChange: (date: Date | Moment) => void;
}

const AppDateTimePicker: FC<AppDateTimePickerProps> = ({
  id,
  name,
  label,
  placeholder,
  selectedDateTime,
  onDateChange,
}) => {
  moment.locale("fr");

  return (
    <div>
      {label && (
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <Datetime
        value={selectedDateTime}
        onChange={(date) => {
          if (typeof date === "string") {
            onDateChange(moment(date));
          } else {
            onDateChange(date);
          }
        }}
        locale="fr-FR"
        className=" z-999999"
        inputProps={{
          id: id,
          name: name,
          placeholder: placeholder,

          className: `w-full block rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary z-99999`,
          autoComplete: "off",
        }}
        timeFormat="HH:mm"
        dateFormat="DD-MM-YYYY"
        closeOnSelect={false}
        // className={` w-full text-black text-md rounded-md bg-transparent py-1.5 px-2 border-2  border-gray-200 focus:outline-none focus:border-2 focus:border-secondary`}
      />
    </div>
  );
};

export default AppDateTimePicker;
