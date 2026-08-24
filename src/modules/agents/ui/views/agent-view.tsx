"use client";

import ErrorState from "@/components/ui/error-state";
import LoadingState from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import EmptyState from "@/components/ui/empty-state";
import useAgentsFilters from "../../hooks/use-agents-filters";
import DataPagination from "../components/data-pagination";
import { useRouter } from "next/navigation";

const AgentView = () => {
    const router = useRouter();
    const [filters,setFilters] = useAgentsFilters();
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));
    return ( 
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4 bg-background-beige">
                    <DataTable data={data.items} columns={columns}
                    onRowClick = {(row) => router.push(`/agents/${row.id}`)} />
            <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({page})}
            />
            {
                data.items.length === 0 && (
                    <EmptyState
                    titlle="Create your first agent"
                    description="Create your agent to join your meeting. Each agent will follow your instructions andcan interact with participants during the call" />
                )
            }
        </div>
     );
}
 
export default AgentView;

export const AgentsViewLoading = () => {
    return (
        <LoadingState titlle="Loading Agents" description="This may take a few seconds"/>
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState titlle="Failed to load Agents" description="Please try again later"/>
    )
}