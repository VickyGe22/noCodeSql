import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { GoDatabase } from "react-icons/go";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BucketSelectorProps {
  buckets: string[];
  selectedBucket: string | null;
  onSelectBucket: (bucket: string | null) => void;
}

const BucketSelector: React.FC<BucketSelectorProps> = ({
  buckets,
  selectedBucket,
  onSelectBucket,
}) => {
  return (
    <div className="flex flex-col space-y-2 relative p-4 bg-[#1D191A] rounded-lg">
      <h2 className="font-sans tracking-wide text-sm leading-6 text-[#E9E8E8] mb-2">
        Buckets
      </h2>
      <div className="relative">
        <Select
          onValueChange={(value) => onSelectBucket(value)}
          value={selectedBucket || ""}
        >
          <SelectTrigger className="w-full rounded bg-[#4D494A] text-white appearance-none">
            <SelectValue placeholder="Select a bucket" />
          </SelectTrigger>
          <SelectContent className="max-h-60 w-fit overflow-y-auto bg-[#1D191A]">
            {buckets.map((bucket) => (
              <SelectItem key={bucket} value={bucket}>
                {bucket}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BucketSelector;
