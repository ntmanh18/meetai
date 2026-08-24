import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "../../../meetings/type";
import { useState } from "react";
import { CommandSelect } from "@/components/ui/command-select";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import NewAgentDIalog from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps {
    onSuccess?: (id?:string) => void;
    onCancel?: () => void;
    initialValue?: MeetingGetOne;
}
const MeetingForm = ({onSuccess, onCancel, initialValue}:MeetingFormProps) => {
    const trpc= useTRPC();
    const queryCLient = useQueryClient();
    const [agentSearch, setAgentSearch] = useState("");
    const [opeNewAgentDialog, setOpenNewAgentDialog] = useState(false)
    const agents = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search:agentSearch
    }));
    const createMeeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryCLient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
               
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    );
     const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryCLient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );
                if(initialValue?.id){
                    await queryCLient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({
                            id: initialValue.id
                        })
                    )
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    );
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValue?.name ?? "",
            agentId: initialValue?.agentId ?? ""
        },
    });

    const isEdit = !!initialValue?.id;
    const isPending = createMeeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if(isEdit){
            updateMeeting.mutate({...values,id: initialValue.id})
        } else {
            createMeeeting.mutate(values)
        }
    }
    return ( 
        <>
        <NewAgentDIalog
            open={opeNewAgentDialog}
            onOpenChange={setOpenNewAgentDialog}
        />
        <Form {...form}>
            <form className="space-y" onSubmit={form.handleSubmit(onSubmit)}>

            <FormField
            name= "name"
            control={form.control}
            render={({field}) => {
                return <FormItem className="pt-3 gap-1"> 
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Taylor" />
                    </FormControl>
                    <FormMessage />
                </FormItem>;
            }}/>
              <FormField
            name= "agentId"
            control={form.control}
            render={({field}) => {
                return <FormItem className="pt-3 gap-1"> 
                    <FormLabel>Agent</FormLabel>
                    <FormControl>
                        <CommandSelect
                        options={(agents.data?.items ?? []).map((agent) => ({
                            id: agent.id,
                            value: agent.id,
                            children: (
                                <div className="flex items-center gap-x-2">
                                    <GeneratedAvatar
                                    seed={agent.name}
                                    variant="dylan"
                                    className="border"
                                    />
                                    <span>{agent.name}</span>
                                </div>
                            )
                        }))}
                        onSearch={setAgentSearch}
                        onSelect={field.onChange}
                        value={field.value}
                        placeholder="Select an agent"
                        />
                    </FormControl>
                    <FormDescription>
                        Not found what you are looking for?{" "}
                        <button type="button"
                                className="text-primary hover:underline"
                                onClick={() => setOpenNewAgentDialog(true)}
                        >
                            Create new agent
                        </button>
                    </FormDescription>
                    <FormMessage />
                </FormItem>;
            }}/>
            <div className="flex justify-between gap-x-2 pt-3">
                {onCancel && (
                    <Button variant="outline"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}>
                        Cancel
                    </Button>
                )}
                <Button disabled={isPending}
                        type="submit">
                    {isEdit ? "Update" : "Create"}
                </Button>
            </div>
            </form>
        </Form>
        </>
     );
}
 
export default MeetingForm;