"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
// FieldsSelector.tsx
import DraggableFieldItem from "@/app/ServerComponent/DraggableFieldItem";
import { BucketFields } from "@/app/types/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FieldsSelectorProps {
  bucketFields: BucketFields;
  selectedBucket: string | null;
  selectedMeasurements: string[];
  selectedFields: string[];
  onSelectField: (field: string) => void;
}

const FieldsSelector: React.FC<FieldsSelectorProps> = ({
  bucketFields,
  selectedBucket,
  selectedMeasurements,
  selectedFields,
  onSelectField,
}) => {
  const [search, setSearch] = useState<string>("");

  const fields = useMemo(() => {
    if (selectedBucket && selectedMeasurements.length > 0) {
      const measurementsFields = selectedMeasurements.map(
        (measurement) => bucketFields[selectedBucket]?.[measurement] || [],
      );

      // Remove duplicate fields
      const uniqueFields = Array.from(new Set(measurementsFields.flat()));

      return uniqueFields;
    }
    return [];
  }, [selectedBucket, selectedMeasurements, bucketFields]);

  const filteredFields = useMemo(() => {
    return fields.filter((field) =>
      field.toLowerCase().includes(search.toLowerCase()),
    );
  }, [fields, search]);

  // useEffect(() => {
  //   console.log("Selected Measurements:", selectedMeasurements);
  //   console.log("Fields:", fields);
  // }, [selectedMeasurements, fields]);

  return (
    <div className="flex flex-col space-y-2 p-4 bg-[#1D191A] rounded-lg mt-5">
      <label className="text-white text-sm font-sans tracking-wide mb-2">
        Fields
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
          {filteredFields.map((field) => (
            <DraggableFieldItem
              key={field}
              field={field}
              selectedFields={selectedFields}
              onSelectField={onSelectField}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FieldsSelector;
