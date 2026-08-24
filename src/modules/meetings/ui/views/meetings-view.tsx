"use client"
import ErrorState from "@/components/ui/error-state";
import LoadingState from "@/components/ui/loading-state";
import { DataTable } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import useMeetingFilters from "../../hooks/use-meetings-filters";
import DataPagination from "../components/data-pagination";

const MeetingsView = () => {
    const trpc = useTRPC();
    const router=useRouter();
    const [filter,setFilter] = useMeetingFilters();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({...filter}));
    return ( 
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4 bg-background-beige whitespace-pre-wrap break-all">
           <DataTable data={data.items} columns={columns} onRowClick={(row) => router.push(`/meetings/${row.id}`)} />
           <DataPagination 
           page={filter.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilter({page})}/>
        </div>
     );
}
 
export default MeetingsView;

export const MeetingsViewLoading = () => {
    return (
        <LoadingState titlle="Loading Meetings" description="This may take a few seconds"/>
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState titlle="Failed to load Meetings" description="Please try again later"/>
    )
}