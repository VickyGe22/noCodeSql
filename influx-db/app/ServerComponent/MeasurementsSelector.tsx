"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BucketMeasurements } from "../types/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import DraggableMeasurementItem from "./DraggableMeasurementItem";

interface MeasurementsSelectorProps {
  bucketMeasurements: BucketMeasurements;
  selectedBucket: string | null;
  selectedMeasurements: string[];
  onSelectMeasurement: (measurement: string) => void;
}

const MeasurementsSelector: React.FC<MeasurementsSelectorProps> = ({
  bucketMeasurements,
  selectedBucket,
  selectedMeasurements,
  onSelectMeasurement,
}) => {
  const [search, setSearch] = useState("");
  const measurements = selectedBucket
    ? bucketMeasurements[selectedBucket] || []
    : [];
  const filteredMeasurements = measurements.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col space-y-2 p-4 bg-[#1D191A] rounded-lg mt-5">
      <label className="text-white text-sm font-sans tracking-wide mb-2">
        Measurements
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
      <ScrollArea className="h-[250px] w-full rounded-lg bg-[#201C1D] font-sans text-sm overflow-hidden">
        <div className="p-1">
          {filteredMeasurements.map((measurement) => (
            <DraggableMeasurementItem
              key={measurement}
              measurement={measurement}
              selectedMeasurements={selectedMeasurements}
              onSelectMeasurement={onSelectMeasurement}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
export default MeasurementsSelector;
