import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import DraggableFilterItem from "./DraggableFilterItem";
import { FilterConfig } from "@/app/types/types";

interface FilterSelectorProps {
  selectedFilters: FilterConfig[];
  onSelectFilter: (filter: FilterConfig) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedFilters,
  onSelectFilter,
}) => {
  const [search, setSearch] = useState("");
  const filters = ["Time Range", "Data Threshold", "Sort"];
  const filteredFilters = filters.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  );


  return (
    <div className="flex flex-col space-y-2 p-4 bg-[#1D191A] rounded-lg mt-5">
      <label className="text-white text-sm font-sans tracking-wide mb-2">
        Filters
      </label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-black font-sans font-light pl-10 pr-4 py-2 "
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
      </div>
      <ScrollArea className="h-[250px] w-full rounded-lg font-sans text-sm bg-[#201C1D] overflow-hidden">
        <div className="p-1">
          {filteredFilters.map((filter) => (
            <DraggableFilterItem
              key={filter}
              filter={filter}
              selectedFilters={selectedFilters}
              onSelectFilter={onSelectFilter}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FilterSelector;
