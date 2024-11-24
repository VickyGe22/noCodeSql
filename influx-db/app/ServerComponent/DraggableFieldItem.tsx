import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableFieldItemProps {
  field: string;
  selectedFields?: string[];
  onSelectField?: (field: string) => void;
  isOverlay?: boolean;
}

const DraggableFieldItem: React.FC<DraggableFieldItemProps> = ({
  field,
  selectedFields = [],
  onSelectField,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field,
    data: { type: "field", field },
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
        onClick: () => onSelectField && onSelectField(field),
      };

  return (
    <div
      {...props}
      className={cn(
        "py-3 px-3 cursor-pointer text-white rounded-lg mb-1 w-full",
        selectedFields.includes(field) ? "bg-[#2C2829]" : "hover:bg-[#2C2829]",
      )}
    >
      {field}
    </div>
  );
};

export default DraggableFieldItem;
