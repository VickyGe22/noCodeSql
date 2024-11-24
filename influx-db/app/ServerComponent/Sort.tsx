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
import { FilterConfig } from "@/app/types/types";

const Sort: React.FC<any> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const Columns = ["Time", "Value"];

  const handleSave = () => {
    if (onSave && isFormValid()) {
      const filterConfig: FilterConfig = {
        filter: "Sort",
        config: {
          column: selectedColumn,
          order: selectedOrder
        }
      };
      onSave(filterConfig);
    }
  };


  const isFormValid = () => {
    if (!selectedColumn || !selectedOrder) return false;
    return selectedColumn && selectedOrder;
  };

  // Debugging logs for selectedColumn and selectedOrder
  console.log("Selected Column:", selectedColumn);
  console.log("Selected Order:", selectedOrder);


  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sort</AlertDialogTitle>
          <AlertDialogDescription>
            Select the options you want to apply for filtering.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Field Selector */}
        <CardContent>
        <div className="flex flex-row items-center space-x-6 mt-2">
            <label htmlFor="field" className="text-md font-medium w-24">
            Columns
            </label>
            <Select
            value={selectedColumn}
            onValueChange={(value) => {
                console.log("Column selected:", value); // Debugging the value
                setSelectedColumn(value);
              }}
            >
            <SelectTrigger className="p-2 w-full border rounded-lg bg-white text-black">
                <SelectValue placeholder="Select a column" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                {Columns.map((column) => (
                    <SelectItem key={column} value={column}>
                    {column}
                    </SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
        </CardContent>

        <CardContent>
        <div className="flex flex-row items-center space-x-6">
            <label htmlFor="Order" className="text-md font-medium w-24">
            Order
            </label>
            <Select
            value={selectedOrder}
            onValueChange={(value) => setSelectedOrder(value)}
            >
            <SelectTrigger className="p-2 w-full border rounded-lg bg-white text-black">
                <SelectValue placeholder="Select a condition" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="Ascending">Ascending</SelectItem>
                <SelectItem value="Descending">Descending</SelectItem>
                </SelectGroup>
            </SelectContent>
            </Select>
        </div>
        </CardContent>

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

export default Sort;
