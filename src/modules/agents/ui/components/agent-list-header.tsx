"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import NewAgentDIalog from "./new-agent-dialog";
import { useState } from "react";
import useAgentsFilters from "../../hooks/use-agents-filters";
import AgentSearchFilter from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constant";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const AgentListHeader = () => {
    const [filter, setFilter] = useAgentsFilters();
    const isAnyFilterModified = !!filter.search;
    const onClearFilters = () => {
        setFilter({
            search: "",
            page: DEFAULT_PAGE,
        })
    }
    const[isDialogOpen, setIsDialogOpen] = useState(false);
    return ( 
        <>
        <NewAgentDIalog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4 bg-background-beige">
            <div className="flex items-center justify-between">
                <h5 className="font-bold text-xl">My Agents</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                <PlusIcon />
                New Agent
                </Button>
            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <AgentSearchFilter />
                {isAnyFilterModified && (
                    <Button variant="outline" size="sm"
                            onClick={onClearFilters}>
                        Clear Filters
                        <XCircleIcon/>
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
        </>
     );
}
 
export default AgentListHeader;