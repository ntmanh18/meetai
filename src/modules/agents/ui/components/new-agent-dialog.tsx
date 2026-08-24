import ResponsiveDialog from "@/components/ui/responsive-dialog";
import AgentForm from "./agent-form";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
}

const NewAgentDIalog = ({open,onOpenChange}:NewAgentDialogProps) => {
    return ( 
        <ResponsiveDialog
        title="New Agent"
        description="Create a new Agent"
        open={open}
        onOpenChange={onOpenChange} >
            <AgentForm
            onSuccess={() => onOpenChange(false)}
            onCancel={()=> onOpenChange(false)} />
        </ResponsiveDialog>
     );
}
 
export default NewAgentDIalog;