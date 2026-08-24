"use client"

import ErrorState from "@/components/ui/error-state";
import LoadingState from "@/components/ui/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdViewHeader from "../components/meeting-id-header";
import { useRouter } from "next/navigation";
import useConfirm from "@/modules/agents/hooks/use-confirm";
import { useState } from "react";
import UpdateMeetingDialog from "../components/update-meeting-dialog";
import { UpcomingState } from "@/components/ui/upcoming-state";
import { ActiveState } from "@/components/ui/active-state";
import { CancelState } from "@/components/ui/cancelled-state";
import { ProcessingState } from "@/components/ui/processing-state copy";

interface Props {
    meetingId: string
}

export const MeetingIdView= ({meetingId}:Props) => {
    const tRPC = useTRPC();
    const queryClient = useQueryClient();
    const {data} = useSuspenseQuery(
        tRPC.meetings.getOne.queryOptions({id:meetingId})
    )

    const router = useRouter()

    const [removeConfirmation, confirmRemove] = useConfirm("Are you sure?", "The following action will remove this meeting");
    
    const removeMeeting = useMutation(
        tRPC.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(tRPC.meetings.getMany.queryOptions({}))
                router.push('/meetings')
            },
            
        })
    )

    const handleRemoveMeeting =async () => {
        const ok = confirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({id:meetingId})
    }

    const[updateMeetingDialog, setUpdateMeetingDialog] = useState(false)
    const isActive = data.status === "active";
    const isUpcoming   = data.status === "upcoming";
    const isCancelled  = data.status === "cancelled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";
    return(
        <>
        <UpdateMeetingDialog
        initialValue={data}
        open={updateMeetingDialog}
        onOpenChange={setUpdateMeetingDialog}/>
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4 ">
            <MeetingIdViewHeader
            meetingId={data.id}
            meetingName={data.name}
            onEdit={()=>setUpdateMeetingDialog(true)}
            onRemove={handleRemoveMeeting} />
            {isCancelled && <CancelState/>}
            {isActive && <ActiveState
                            meetingId={data.id}
                           />}
            {isUpcoming && <UpcomingState
                            meetingId={data.id}
                            onCancelMeeting={() => {}}
                            isCancelling={false}/>}
            {isCompleted && <div>completed</div>}
            {isProcessing && <ProcessingState/>}
        </div>
        </>
    )
}

export const MeetingIdViewLoading = () => {
    return (
        <LoadingState titlle="Loading Meeting" description="This may take a few seconds"/>
    )
}

export const MeetingIdViewError = () => {
    return (
        <ErrorState titlle="Failed to load Meeting" description="Please try again later"/>
    )
}