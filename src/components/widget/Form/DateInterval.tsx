import { FC } from "react";
import { Moment } from "moment";
import AppDateIntervalDateTimePicker from "./DateTimePicker";
import { History } from "lucide-react";

interface DatesIntervallProps {
  selectedStartDate: Date | Moment | undefined;
  selectedEndDate: Date | Moment | undefined;
  onStartDateChange: (date: Date | Moment) => void;
  onEndDateChange: (date: Date | Moment) => void;
  resetDatesInterval: () => void;
}

const DatesIntervall: FC<DatesIntervallProps> = ({
  selectedStartDate,
  selectedEndDate,
  onStartDateChange,
  onEndDateChange,
  resetDatesInterval,
}) => {
  return (
    <div className="flex' date-config my-3 flex w-max items-center justify-between rounded-md border-2 border-secondary px-2  py-1.5  text-[14px] shadow-sm sm:text-[15px] md:mx-3 md:text-[16px] lg:text-[17px]">
      {/* <p className=" font-medium text-secondary">Période allant</p> */}
      <div className="flex flex-col md:flex-row ">
        <div className="mb-0.5 flex md:mb-0">
          <p className="mx-2 flex items-center text-center font-medium text-secondary">
            Du
          </p>
          <AppDateIntervalDateTimePicker
            id="startDate"
            name="startDate"
            placeholder="Date de début"
            selectedDateTime={selectedStartDate}
            onDateChange={onStartDateChange}
          />
        </div>
        <div className="mt-0.5 flex md:mt-0">
          <p className="mx-2 flex items-center text-center font-medium text-secondary">
            Au
          </p>
          <AppDateIntervalDateTimePicker
            id="endDate"
            name="endDate"
            placeholder="Date de fin"
            selectedDateTime={selectedEndDate}
            onDateChange={onEndDateChange}
          />
        </div>
      </div>
      <div className="mt-2">
        <History
          className="ml-3 text-secondary hover:cursor-pointer"
          onClick={() => {
            //    forceUpdate()
            resetDatesInterval();
          }}
        />
      </div>
    </div>
  );
};

export default DatesIntervall;
