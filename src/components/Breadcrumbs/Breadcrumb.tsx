import Link from "next/link";
import { ReactNode } from "react";
interface BreadcrumbProps {
  pageName: string;

  children?: ReactNode;

  onClick?: () => void;
}
const Breadcrumb = ({ pageName, children, onClick }: BreadcrumbProps) => {
  return (
    <div
      className={`mb-5 flex  items-center justify-between gap-3 sm:flex-row md:mb-8 `}
    >
      <span
        className="flex items-center text-title-md2 font-semibold text-black hover:cursor-pointer dark:text-white"
        onClick={onClick}
      >
        {pageName}
      </span>

      {children ? (
        children
      ) : (
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">{pageName}</li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default Breadcrumb;
