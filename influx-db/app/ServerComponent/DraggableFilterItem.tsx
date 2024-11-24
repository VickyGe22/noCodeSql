import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableFilterItemProps {
  filter: string;
  selectedFilters: FilterConfig[];
  onSelectFilter?: (filter: FilterConfig) => void;
  isOverlay?: boolean;
}

interface FilterConfig {
  filter: string;
  config: any;
}

const DraggableFilterItem: React.FC<DraggableFilterItemProps> = ({
  filter,
  selectedFilters = [],
  onSelectFilter,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: filter,
    data: { type: "filter", filter },
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
        onClick: () => onSelectFilter && onSelectFilter({ filter, config: {} }),
      };

  const isSelected = selectedFilters.some((f) => f.filter === filter);
  return (
    <div
      {...props}
      className={cn(
        "py-3 px-3 cursor-pointer text-white rounded-lg mb-1 w-full",
        isSelected ? "bg-[#2C2829]" : "hover:bg-[#2C2829]",
      )}
    >
      {filter}
    </div>
  );
};

//   return (
//     <divs
//       {...props}
//       className={cn(
//         "py-3 px-3 cursor-pointer text-white rounded-lg mb-1 w-full",
//         selectedFilters.includes(filter) ? "bg-[#2C2829]" : "hover:bg-[#2C2829]"
//       )}
//     >
//       {filter}
//     </div>
//   );
// };

export default DraggableFilterItem;
