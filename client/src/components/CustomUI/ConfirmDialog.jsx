import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

function ConfirmDialog({
    trigger,
    heading,
    description,
    confirmText,
    onConfirm,
    onCancel,
    onConfirmClose = true,
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {heading || 'Are you absolutely sure?'}
                    </DialogTitle>
                    <DialogDescription>
                        {description ||
                            'This action cannot be undone. It also deletes the video contents in this section. Are you sure you want to permanently delete this video from our servers?'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild={onConfirmClose}>
                        <Button onClick={onConfirm} variant="destructive">
                            {confirmText || 'Yes Proceed'}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDialog;
