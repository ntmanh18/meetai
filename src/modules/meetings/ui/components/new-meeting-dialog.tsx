import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { useRouter } from "next/navigation";
import MeetingForm from "./meeting-form";

interface NewMeetingDialog {
    open: boolean;
    onOpenChange: (open:boolean) => void;
}

const NewMeetingDialog = ({open,onOpenChange}:NewMeetingDialog) => {
    const router = useRouter();
    return ( 
        <ResponsiveDialog
        title="New Meeting"
        description="Create a new Meeting"
        open={open}
        onOpenChange={onOpenChange} >
           <MeetingForm
           onSuccess={(id?:string) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`);
           }}
           onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
     );
}
 
export default NewMeetingDialog;