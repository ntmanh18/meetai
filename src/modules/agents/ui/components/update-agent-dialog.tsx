import ResponsiveDialog from "@/components/ui/responsive-dialog";
import AgentForm from "./agent-form";
import { AgentGetOne } from "../../type";

interface UpdateAgentProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
    initialvalue: AgentGetOne;
}

const UpdateAgentDialog = ({open,onOpenChange,initialvalue}:UpdateAgentProps) => {
    return ( 
        <ResponsiveDialog
        title="Edit Agent"
        description="Edit the Agent value"
        open={open}
        onOpenChange={onOpenChange} >
            <AgentForm
            onSuccess={() => onOpenChange(false)}
            onCancel={()=> onOpenChange(false)}
            initialValue={initialvalue} />
        </ResponsiveDialog>
     );
}
 
export default UpdateAgentDialog;