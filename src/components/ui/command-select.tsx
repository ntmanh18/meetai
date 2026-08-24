import { ReactNode, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "./command";

interface Props {
    options : Array<{
        id: string;
        value: string;
        children: ReactNode;

    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
};

export const CommandSelect = ({options, onSelect, onSearch, value, placeholder,  className}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);
    const handleOpenChange = (value : boolean) => {
        onSearch?.("");
        setOpen(value);
    } 
    return (
        <>
        <Button type="button"
        variant="outline"
        className={cn("h-9 justify-between font-normal items-center px-2 py-6",
            !selectedOption && "text-muted-foreground",
            className)}
        onClick={()=>setOpen(true)}
        >
            <div className="flex items-center gap-2 flex-1">
                {selectedOption?.children ?? placeholder}
            </div>
            <ChevronDownIcon className="size-4" />
        </Button>
        <CommandResponsiveDialog
        shouldFilter = {false}
        open={open}
        onOpenChange={handleOpenChange}
        title="Select an option"
        >
        <CommandInput placeholder="Search...."
        onValueChange= {onSearch}
        />
            <CommandList>
                <CommandEmpty>
                    <span className="text-sm text-muted-foreground">
                        No  option found
                    </span>
                </CommandEmpty>
                {options.map((option) => {
                    return(
                    <CommandItem key={option.id} value={option.value} onSelect={() => {onSelect(option.value)
                        setOpen(false)
                    }}>
                        {option.children}
                    </CommandItem>
                    )
                })}
            </CommandList>
        </CommandResponsiveDialog>
        </>
    );
};
