import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/ui/responsive-dialog";
import { JSX, useState } from "react";

const useConfirm = (
    title : string,
    description: string,
) : [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve : (value: boolean) => void;
    } | null>(null);

    const confirm= () => {
        return new Promise((resolve) => {
            setPromise({resolve})
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleCOnfirm = () => {
        promise?.resolve(true);
        handleClose();
    } 

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationDialog = () => (
        <ResponsiveDialog
        open = {promise !== null}
        onOpenChange={handleClose}
        title={title}
        description={description}>
            <div className="pt-4 w-full   flex flex-col-reverse gap-y-2 lg:flex-row items-center justify-end gap-x-2">
                <Button
                onClick = {handleCancel}
                variant='outline'
                className="w-full lg:w-auto"
                >
                Cancel
                </Button>
                 <Button
                onClick = {handleCOnfirm}
                variant='outline'
                className="w-full lg:w-auto"
                >
                Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    )

    return [ConfirmationDialog, confirm]
}
 
export default useConfirm;