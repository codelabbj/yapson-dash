import { useState } from "react";
import Modal from "./Modal";
import {
  downloadFile,
  downloadFile2,
  toggleModal,
} from "@/utils/functions.util";
import SelectAddItems, { ItemsResponse } from "./SelectAddItems";
import Club from "@/models/club.model";
import Championship from "@/models/championship.model";
import Image from "next/image";
import Sport from "@/models/sport.model";
import Match from "@/models/match.model";

interface ItemSelectorProps {
  itemName: string;
  placeholder: string;
  modalId: string;
  name: string;
  item: any;
  onItemSelected: (name: string, item: any) => void;
  defautItem: any;
  getItemsfn: (
    searchField?: string,
    page?: number,
    pageSize?: number,
  ) => Promise<any>;
  addItemfn: (item: any) => Promise<any>;
  error?: boolean;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  itemName,
  placeholder,
  modalId,
  name,
  item,
  defautItem,
  onItemSelected,
  getItemsfn,
  addItemfn,
  error,
}) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(item);
  const [currentItemPage, setCurrentItemPage] = useState(1);
  const [dynamicKey, setDynamicKey] = useState(new Date().toDateString());

  const handleOpenModal = () => {
    return toggleModal(modalId);
  };

  const handleCloseModal = () => {
    setCurrentItemPage(1);
  };

  const handleItemSelect = (selectedItem: any) => {
    setSelectedItem(selectedItem);
    onItemSelected(name, selectedItem);
    toggleModal(modalId);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col ">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {itemName}
      </label>

      <div
        onClick={handleOpenModal}
        className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      >
        {selectedItem !== null &&
        selectedItem !== undefined &&
        !Array.isArray(selectedItem) &&
        typeof selectedItem == "object" &&
        selectedItem.hasOwnProperty("name") ? (
          <span> {selectedItem.name}</span>
        ) : selectedItem instanceof Match ? (
          <div className="mb-1 flex flex-col items-center">
            <span className="mb-3 font-medium">
              {selectedItem.championship.name}
            </span>
            <div className="ml-4 flex justify-between">
              <div className="mr-4 flex">
                <Image
                  src={selectedItem.clubHome.logo as string}
                  alt={selectedItem.clubHome.name}
                  width={30}
                  height={30}
                />
                <span className="ml-2">{selectedItem.clubHome.name}</span>
              </div>

              <span className="font-medium">vs</span>

              <div className="ml-4 flex">
                <Image
                  src={selectedItem.clubForeign.logo as string}
                  alt={selectedItem.clubForeign.name}
                  width={30}
                  height={30}
                />
                <span className="ml-2 ">{selectedItem.clubForeign.name}</span>
              </div>
            </div>
          </div>
        ) : (
          <span className="">{placeholder}</span>
        )}

        {/* {selectedItem !== null &&
        selectedItem !== undefined &&
        !Array.isArray(selectedItem) &&
        !(selectedItem instanceof Event) ? (
          selectedItem instanceof Match ? (
            <div className="mb-1 flex flex-col items-center">
              <span className="mb-3 font-medium">
                {selectedItem.championship.name}
              </span>
              <div className="ml-4 flex justify-between">
                <div className="mr-4 flex">
                  <Image
                    src={selectedItem.clubHome.logo as string}
                    alt={selectedItem.clubHome.name}
                    width={30}
                    height={30}
                  />
                  <span className="ml-2">{selectedItem.clubHome.name}</span>
                </div>

                <span className="font-medium">vs</span>

                <div className="ml-4 flex">
                  <Image
                    src={selectedItem.clubForeign.logo as string}
                    alt={selectedItem.clubForeign.name}
                    width={30}
                    height={30}
                  />
                  <span className="ml-2 ">{selectedItem.clubForeign.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <span>
              {selectedItem.name} {`${selectedItem.id}`}
            </span>
          )
        ) : (
          <span className="">{placeholder}</span>
        )} */}
      </div>

      {error && (
        <span className="text-xs text-red-500">{itemName} est requis</span>
      )}

      <Modal
        id={modalId}
        onClose={() => {
          handleCloseModal();
          setDynamicKey(new Date().toDateString());
        }}
      >
        <SelectAddItems
          key={dynamicKey}
          title={itemName}
          getItemsfn={async (value: string) => {
            try {
              const response = await getItemsfn(value, 1);
              setCurrentItemPage(1);

              return {
                items: response?.results || [],
                canLoadMore: !!response?.next,
              };
            } catch (error) {
              console.error("Error fetching Item:", error);
              return {
                items: [],
                canLoadMore: false,
              };
            }
          }}
          loadMoreItemsfn={async (value: string) => {
            try {
              setCurrentItemPage((prev) => prev + 1);
              const response = await getItemsfn(value, currentItemPage);
              return {
                items: response?.results || [],
                canLoadMore: !!response?.next,
              };
            } catch (error) {
              console.error("Error loading more Item:", error);
              return {
                items: [],
                canLoadMore: false,
              };
            }
          }}
          addItemfn={async (value: string) => {
            try {
              if (defautItem instanceof Sport) {
                defautItem.name = value;
              } else if (defautItem instanceof Club) {
                const file = await downloadFile2({
                  url: "/images/cover/cover-01.png",
                  filename: "defaultImage",
                });

                defautItem.name = value;
                defautItem.logo = file;
              } else if (defautItem instanceof Championship) {
                defautItem.name = value;
              }
              return await addItemfn(defautItem);
            } catch (error) {
              console.error("Error creating Item:", error);
              return null;
            }
          }}
          onItemSelected={(item: any) => {
            handleItemSelect(item);
            setDynamicKey(new Date().toDateString());
          }}
        />
      </Modal>
    </div>
  );
};

export default ItemSelector;
