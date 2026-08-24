"use client";
import ErrorState from "@/components/ui/error-state";
import LoadingState from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import AgentIdViewHeader from "../components/agent-id-header";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useConfirm from "../../hooks/use-confirm";
import { useState } from "react";
import UpdateAgentDialog from "../components/update-agent-dialog";
interface AgentIdViewProps {
    agentId: string;
}
const AgentIdView = ({ agentId }: AgentIdViewProps) => {
    const trpc= useTRPC();
    const {data} = useSuspenseQuery(
        trpc.agents.getOne.queryOptions({id: agentId})
    );

    const router = useRouter();
    const queryClient = useQueryClient();
    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                router.push('/agents')
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove ${data.meetingCount} associated meetings`
    )

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove();
        if(!ok) return;
        await removeAgent.mutateAsync({id:agentId})
    }

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    return ( 
        
        <>
        <RemoveConfirmation />
        <UpdateAgentDialog 
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        initialvalue={data} />

        <div className = "flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader 
            agentId={agentId}
            agentName={data.name}
            onEdit = {() => setUpdateDialogOpen(true)}
            onRemove = {handleRemoveAgent} />
            <div className="bg-whie rounded-lg border">
                <div className="px-4 py-5 flex flex-col col-span-5 gap-3">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar
                        variant="dylan"
                        seed={data.name}
                        className="size-10"
                         />
                        <h2 className="text-2xl font-medium">
                           {data.name} 
                        </h2>
                    </div>
                <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&svg]:size-4"
                >
                    <VideoIcon className="text-blue-700" />
    {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                </Badge>
                <div className="flex flex-col gap-y-4">
                    <p className="text-lg font-medium">
                        Instruction
                    </p>
                    <p className="text-neutral-800">{data.instructions}</p>
                </div>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default AgentIdView;
export const AgentIdViewLoading = () => {
    return (
        <LoadingState titlle="Loading Agents" description="This may take a few seconds"/>
    )
}

export const AgentIdViewError = () => {
    return (
        <ErrorState titlle="Failed to load Agents" description="Please try again later"/>
    )
}