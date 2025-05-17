import Championship from "@/models/championship.model";
import Club from "@/models/club.model";
import React, { useEffect, useState } from "react";
import AppInput from "./Input";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";
import AppButton from "./Button";
import Match from "@/models/match.model";
import Event from "@/models/event.model";
import Image from "next/image";
import EventCard from "../EventCard";
//import EventCard from "../EventCard";

export type ItemsResponse = {
  items: any[];
  canLoadMore: boolean;
};

interface SelectAddItemsProps {
  title: string;
  onItemSelected: (item: any) => void;
  getItemsfn: (query: string) => Promise<ItemsResponse>;
  loadMoreItemsfn: (query: string) => Promise<ItemsResponse>;
  addItemfn: (query: string) => Promise<any>;
}

const SelectAddItems: React.FC<SelectAddItemsProps> = ({
  title,
  onItemSelected,
  getItemsfn,
  loadMoreItemsfn,
  addItemfn,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  useEffect(() => {
    loadItems("");
    return () => {
      setSuggestions([]);
      setCanLoadMore(false);
      setIsLoading(false);
      setLoadingMore(false);
      setIsAdding(false);
      setLastQuery("");
    };
  }, []);

  const loadItems = async (query: string) => {
    setIsLoading(true);
    setLastQuery(query);

    const response = await getItemsfn(query);

    setSuggestions(response.items);
    setCanLoadMore(response.canLoadMore);
    setIsLoading(false);
  };

  const handleAddItem = async () => {
    setIsAdding(true);
    const newItem = await addItemfn(lastQuery);
    if (newItem) {
      setSuggestions((prev) => [...prev, newItem]);
    }
    setIsAdding(false);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const response = await loadMoreItemsfn(lastQuery);
    setSuggestions((prev: any[]) => [...prev, ...response.items]);
    setCanLoadMore(response.canLoadMore);
    setLoadingMore(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ProcessingLoader />;
    }

    /*
    if (suggestions.length === 0 && lastQuery) {
      return renderEmptyStateWithCreate();
    }
    */

    return renderSuggestionsList();
  };

  const renderEmptyStateWithCreate = () => (
    <div>
      <div className="flex items-center justify-between p-4">
        <span className="truncate">{lastQuery}</span>
        {isAdding ? (
          <ProcessingLoader />
        ) : (
          <AppButton name="Create" width="150px" onClick={handleAddItem} />
        )}
      </div>
      <ul className="mt-4 space-y-2">
        {suggestions.map((item, index) => (
          <li key={index} className="rounded-lg border p-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSuggestionsList = () => (
    <div className="w-full">
      <ul className="space-y-2">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="rounded-sm px-2 py-2.5 text-black hover:cursor-pointer dark:text-white"
            onClick={() => {
              onItemSelected(item);
              //  setSuggestions([]);
            }}
          >
            {item instanceof Match ? (
              <div className="flex flex-col items-center">
                <span className="mb-3 font-medium">
                  {item.championship.name}
                </span>
                <div className="ml-4 flex justify-between">
                  <div className="mr-4 flex">
                    <Image
                      src={item.clubHome.logo as string}
                      alt={item.clubHome.name}
                      width={30}
                      height={30}
                    />
                    <span className="ml-2">{item.clubHome.name}</span>
                  </div>

                  <span className="font-medium">vs</span>

                  <div className="ml-4 flex">
                    <Image
                      src={item.clubForeign.logo as string}
                      alt={item.clubForeign.name}
                      width={30}
                      height={30}
                    />
                    <span className="ml-2 ">{item.clubForeign.name}</span>
                  </div>
                </div>
              </div>
            ) : item instanceof Event ? (
              <EventCard event={item as Event} />
            ) : (
              <span>{item.name}</span>
            )}
          </li>
        ))}
      </ul>
      {canLoadMore && (
        <a
          className="my-2 flex w-full justify-center rounded-sm px-4 py-2 text-center font-medium text-primary hover:cursor-pointer"
          onClick={handleLoadMore}
        >
          {loadingMore ? <ProcessingLoader /> : <>Chargez plus ...</>}
        </a>
      )}
    </div>
  );

  return (
    <div className="overscroll-none ">
      <AppInput
        label={title}
        id={`${title}-search`}
        name={`${title}-search`}
        type="text"
        placeholder={`Rechercher ...`}
        value={searchedValue}
        onChange={(e) => {
          setSearchedValue(e.target.value);
          return loadItems(e.target.value);
        }}
      />
      <div className=" mt-6 max-h-100 overflow-scroll ">{renderContent()}</div>
    </div>
  );
};

export default SelectAddItems;
