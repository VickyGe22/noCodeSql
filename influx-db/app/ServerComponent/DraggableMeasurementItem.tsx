import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableMeasurementItemProps {
  measurement: string;
  selectedMeasurements?: string[];
  onSelectMeasurement?: (measurement: string) => void;
  isOverlay?: boolean;
}

const DraggableMeasurementItem: React.FC<DraggableMeasurementItemProps> = ({
  measurement,
  selectedMeasurements = [],
  onSelectMeasurement,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: measurement,
    data: { type: "measurement", measurement },
  });

  const style = {
    transform:
      transform && !isOverlay
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
  };

  const props = isOverlay
    ? {}
    : {
        ref: setNodeRef,
        style,
        ...listeners,
        ...attributes,
        onClick: () => onSelectMeasurement && onSelectMeasurement(measurement),
      };

  return (
    <div
      {...props}
      className={cn(
        "py-3 px-3 cursor-pointer text-white rounded-lg mb-1 w-full",
        selectedMeasurements.includes(measurement)
          ? "bg-[#2C2829]"
          : "hover:bg-[#2C2829]",
      )}
    >
      {measurement}
    </div>
  );
};

export default DraggableMeasurementItem;
