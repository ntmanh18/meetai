import ResponsiveDialog from "@/components/ui/responsive-dialog";
import MeetingForm from "./meeting-form";
import { MeetingGetOne } from "../../type";

interface UpdateMeetingDialog {
    open: boolean;
    onOpenChange: (open:boolean) => void;
    initialValue: MeetingGetOne;
}

const UpdateMeetingDialog = ({open,onOpenChange,initialValue}:UpdateMeetingDialog) => {
    return ( 
        <ResponsiveDialog
        title="Edit Meeting"
        description="Edit the Meeting detail"
        open={open}
        onOpenChange={onOpenChange} >
           <MeetingForm
           onSuccess={() => {
            onOpenChange(false);
           }}
           onCancel={() => onOpenChange(false)}
           initialValue={initialValue}
            />
        </ResponsiveDialog>
     );
}
 
export default UpdateMeetingDialog;