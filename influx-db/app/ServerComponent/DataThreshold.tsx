import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataThresholdFilterConfig } from "@/app/types/types";

interface DataThresholdProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
  selectedFields: string[];
}

const DataThreshold: React.FC<DataThresholdProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedFields,
}) => {
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCondition(event.target.value);
    // Reset input values when condition changes
    setInputValue("");
    setMinValue("");
    setMaxValue("");
  };

  const handleSave = () => {
    const config: DataThresholdFilterConfig = {
      config: {
        field: selectedField,
        condition: selectedCondition,
      },
    };

    if (selectedCondition === "Between") {
      config.config.minValue = minValue;
      config.config.maxValue = maxValue;
    } else if (
      selectedCondition !== "Is empty" &&
      selectedCondition !== "Is not empty"
    ) {
      config.config.value = inputValue;
    }

    if (!selectedField || !selectedCondition) {
      alert("Please select a field and condition.");
      return;
    }

    onSave(config);
    onClose();
  };

  const isFormValid = () => {
    if (!selectedField || !selectedCondition) return false;

    if (
      [
        "Is",
        "Is not",
        "Greater than",
        "Less than",
        "Greater than or equal to",
        "Less than or equal to",
      ].includes(selectedCondition)
    ) {
      return inputValue.trim() !== "";
    }

    if (selectedCondition === "Between") {
      return minValue.trim() !== "" && maxValue.trim() !== "";
    }

    return true;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Data Threshold</AlertDialogTitle>
          <AlertDialogDescription>
            Select the options you want to apply for filtering.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Field Selector */}
        <CardContent>
          <div className="flex items-center space-x-4 mt-6"> {/* Adjusted space-x-12 to space-x-4 */}
            <label htmlFor="field" className="text-md font-medium -ml-5">
              Field
            </label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="p-2 w-full border rounded-lg bg-white text-black">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectedFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Condition */}
        <CardContent>
          <div className="flex items-center space-x-4 mt-6"> {/* Adjusted space-x-12 to space-x-4 */}
            <label htmlFor="Condition" className="text-md font-medium -ml-5">
              Condition
            </label>
            <Select
              value={selectedCondition}
              onValueChange={setSelectedCondition}
            >
              <SelectTrigger className="p-2 w-full border rounded-lg bg-white text-black">
                <SelectValue placeholder="Select a condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Is">Is</SelectItem>
                  <SelectItem value="Is not">Is not</SelectItem>
                  <SelectItem value="Greater than">Greater than</SelectItem>
                  <SelectItem value="Less than">Less than</SelectItem>
                  <SelectItem value="Between">Between</SelectItem>
                  <SelectItem value="Greater than or equal to">
                    Greater than or equal to
                  </SelectItem>
                  <SelectItem value="Less than or equal to">
                    Less than or equal to
                  </SelectItem>
                  <SelectItem value="Is empty">Is empty</SelectItem>
                  <SelectItem value="Is not empty">Is not empty</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Conditional Input Rendering */}
        {[
          "Is",
          "Is not",
          "Greater than",
          "Less than",
          "Greater than or equal to",
          "Less than or equal to",
        ].includes(selectedCondition) && (
          <div className="flex items-center space-x-4 ml-1 mb-5 mt-4"> {/* Adjusted space-x-20 to space-x-4 */}
            <label htmlFor="value" className="text-md font-medium">
              Value
            </label>
            <Input
              type="text"
              placeholder="Enter the value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {selectedCondition === "Between" && (
          <div className="mt-4 flex space-x-4">
            <div className="flex-1">
              <label htmlFor="minValue" className="text-md font-medium">
                Min Value
              </label>
              <Input
                type="text"
                placeholder="Min value"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="maxValue" className="text-md font-medium">
                Max Value
              </label>
              <Input
                type="text"
                placeholder="Max value"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={!isFormValid()}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DataThreshold;