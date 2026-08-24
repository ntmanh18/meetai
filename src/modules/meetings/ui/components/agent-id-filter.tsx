import { useTRPC } from "@/trpc/client";
import useMeetingFilters from "../../hooks/use-meetings-filters"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "@/components/ui/command-select";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";

export const AgentIdFilter = () => {
    const [filter, setFilter] = useMeetingFilters();
    const trpc = useTRPC();
    const[agentSearch, setAgentSearch] = useState("");
    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize:100,
            search: agentSearch,
        })
    )

    return (
        <CommandSelect
        className="py-0"
        placeholder="Agent"
        options={(data?.items ?? []).map((agent) => ({
            id: agent.id,
            value: agent.id,
            children: (
                <div className="flex items-center gap-x-2">
                    <GeneratedAvatar
                    seed={agent.name}
                    variant="dylan"
                    className="size-4"
                    />
                    {agent.name}
                </div>
            )
        }))}
        onSelect={(value) => setFilter({agentId : value})}
        onSearch={setAgentSearch}
        value={filter.agentId ?? ""}
        />
    )

}