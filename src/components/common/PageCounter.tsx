import { FC } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PageCounterProps {
  totalPage: number;
  currentPage: number;
  pageSize?: number;
  fetchPage: (page: number) => void;
}

const PageCounter: FC<PageCounterProps> = ({
  totalPage,
  currentPage,
  pageSize,
  fetchPage,
}) => {
  return (
    <Stack spacing={2}>
      <Pagination page={currentPage} onChange={(e, pg) => {
        fetchPage(pg);
      }} count={Math.ceil(totalPage / (pageSize ?? 10))} color="primary" />
    </Stack>
    // <div className="flex items-center text-boxdark dark:text-white ">
    //   {Array.from(
    //     { length: Math.ceil(totalPage / (pageSize ?? 10)) },
    //     (_, index) =>
    //       index + 1 == currentPage ? (
    //         <span
    //           key={index}
    //           className="mx-1.5 flex flex-1 items-center justify-center rounded-full bg-primary px-3 py-1 font-bold text-white
    //       "
    //         >
    //           {index + 1}
    //         </span>
    //       ) : (
    //         <span
    //           key={index}
    //           className="mx-1.5 flex-1 font-normal hover:cursor-pointer"
    //           onClick={() => fetchPage(index + 1)}
    //         >
    //           {index + 1}
    //         </span>
    //       ),
    //   )}
    // </div>
  );
};

export default PageCounter;
