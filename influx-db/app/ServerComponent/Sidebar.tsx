import React from "react";
import BucketSelector from "./BucketSelector";
import MeasurementsSelector from "./MeasurementsSelector";
import FieldsSelector from "./FieldsSelector";
import TagsSelector from "../ClientComponent/TagsSelector";
import FilterSelector from "./FilterSelector";
import {
  BucketMeasurements,
  BucketFields,
  BucketTags,
  BucketTagsKeys,
  FilterConfig,
} from "@/app/types/types";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SidebarProps {
  buckets: string[];
  bucketMeasurements: BucketMeasurements;
  bucketFields: BucketFields;
  selectedBucket: string | null;
  onSelectBucket: (bucket: string | null) => void;
  selectedMeasurements: string[];
  onSelectMeasurement: (measurement: string) => void;
  selectedFields: string[];
  onSelectField: (field: string) => void;
  selectedFilters: FilterConfig[];
  onSelectFilter: (filter: FilterConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  buckets,
  bucketMeasurements,
  bucketFields,
  selectedBucket,
  onSelectBucket,
  selectedMeasurements,
  onSelectMeasurement,
  selectedFields,
  onSelectField,
  selectedFilters,
  onSelectFilter,
}) => {
  // console.log(buckets);
  // console.log(bucketMeasurements);
  // console.log(bucketFields);
  return (
    <ScrollArea className="w-[700px] bg-[#120F10] h-[800px] p-4 left-2 right-2">
      <div className=" mt-2">
        <BucketSelector
          buckets={buckets}
          selectedBucket={selectedBucket}
          onSelectBucket={onSelectBucket}
        />
        <MeasurementsSelector
          bucketMeasurements={bucketMeasurements}
          selectedBucket={selectedBucket}
          selectedMeasurements={selectedMeasurements}
          onSelectMeasurement={onSelectMeasurement}
        />
        <FieldsSelector
          bucketFields={bucketFields}
          selectedBucket={selectedBucket}
          selectedMeasurements={selectedMeasurements}
          selectedFields={selectedFields}
          onSelectField={onSelectField}
        />

        <FilterSelector
          selectedFilters={selectedFilters}
          onSelectFilter={onSelectFilter}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
export default Sidebar;
