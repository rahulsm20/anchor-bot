import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { HTMLAttributes } from "react";

type SelectItemType = {
  value: string;
  label?: string;
  icon?: string;
};
type ABSelectProps = HTMLAttributes<HTMLSelectElement> & {
  triggerButton?: React.ReactNode;
  children?: React.ReactNode;
  options: SelectItemType[];
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};
const ABSelect = ({
  options,
  defaultValue,
  onChange,
  value,
  triggerButton,
  placeholder,
}: ABSelectProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue} value={value}>
      <SelectTrigger>
        {triggerButton ? (
          triggerButton
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.label}
              {option.icon && (
                <Image
                  src={option.icon}
                  alt={option.label || ""}
                  className="h-4 w-4"
                  height={20}
                  width={20}
                />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ABSelect;
