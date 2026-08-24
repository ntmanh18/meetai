"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import NewMeetingDialog from "./new-meeting-dialog";
import { useState } from "react";
import MeetingSearchFilter from "./meeting-search-filter";
import { StatusFilter } from "./staus-filter";
import { AgentIdFilter } from "./agent-id-filter";
import useMeetingFilters from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const MeetingListHeader = () => {
   const [isDialogOpen, setIsDialopOpen] = useState(false)
   const [filter, setFilter] = useMeetingFilters();
   const isFilterModified = 
   !!filter.agentId || !! filter.search || !!filter.status 
   const onClearFilter = () => {
    setFilter({
        agentId:"",
        page: 1,
        search:"",
        status: null,
    })
   }
    return ( 
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialopOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4 bg-background-beige">
            <div className="flex items-center justify-between">
                <h5 className="font-bold text-xl">My Meetings</h5>
                <Button onClick={() => setIsDialopOpen(true)}>
                <PlusIcon />
                New Meeting
                </Button>
            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <MeetingSearchFilter />
                <StatusFilter />
                <AgentIdFilter />
                {isFilterModified && (
                    <Button variant="outline" onClick={onClearFilter}>
                        <XCircleIcon className="size-4"/>
                        Clear
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
        </>
     );
}

export default MeetingListHeader;