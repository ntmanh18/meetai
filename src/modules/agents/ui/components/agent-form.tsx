import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValue?: AgentGetOne;
}
const AgentForm = ({onSuccess, onCancel, initialValue}:AgentFormProps) => {
    const trpc= useTRPC();
    const queryCLient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryCLient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );
               
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    );
     const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryCLient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );
                if(initialValue?.id){
                    await queryCLient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({
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
    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValue?.name ?? "",
            instructions: initialValue?.instructions ?? ""
        },
    });

    const isEdit = !!initialValue?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if(isEdit){
            updateAgent.mutate({...values,id: initialValue.id})
        } else {
            createAgent.mutate(values)
        }
    }
    return ( 
        <Form {...form}>
            <form className="space-y" onSubmit={form.handleSubmit(onSubmit)}>
            <GeneratedAvatar seed={form.watch("name")}
            variant="dylan"
            className="border size-16"/>
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
            name= "instructions"
            control={form.control}
            render={({field}) => {
                return <FormItem className="pt-3 gap-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea {...field} placeholder="You are a helpful friend!" />
                    </FormControl>
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
     );
}
 
export default AgentForm;