import React, { useEffect, useRef, useState } from 'react';
import { Edit, LucideUpload, Trash } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCustomForm } from '@/hooks';
import { sectionSchema } from '@/schema';
import { useDispatch } from 'react-redux';
import { deleteSection, updateSection } from '@/app/slices/courseSlice';

function SectionHeader({ section }) {
    const inputRef = useRef();
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useCustomForm(sectionSchema, {
        name: section ? section.name : '',
    });

    useEffect(() => {
        if (isEditing) inputRef.current?.focus();
    }, [isEditing]);

    const handleEditing = () => setIsEditing(true);

    const handleCancel = () => setIsEditing(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        dispatch(deleteSection(section._id)).then(() => {
            setIsEditing(false);
            setIsSubmitting(false);
        });
    };

    function handleUpdate(data) {
        setIsSubmitting(true);
        dispatch(
            updateSection({
                sectionId: section._id,
                data,
            })
        ).then(() => {
            setIsEditing(false);
            setIsSubmitting(false);
        });
    }

    return (
        <CardHeader className="relative">
            <CardTitle>
                <div className="flex relative">
                    Section {section.order} :{' '}
                    <Form {...form}>
                        <div className="absolute left-20 -top-3">
                            <FormField
                                control={form.control}
                                name="name"
                                disabled={!isEditing || isSubmitting}
                                render={({ field }) => (
                                    <FormItem className="mb-2">
                                        <FormControl>
                                            <>
                                                <Input
                                                    {...field}
                                                    ref={inputRef}
                                                    placeholder="Enter section name"
                                                    className="p-1 text-md w-96 pt-[6px] disabled:font-bold disabled:border-transparent disabled:shadow-none disabled:bg-transparent disabled:hover:cursor-default"
                                                />
                                            </>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                </div>
            </CardTitle>
            <CardDescription className="absolute right-4 top-3">
                <div className="flex">
                    <Select
                        onValueChange={(value) => {
                            handleUpdate({ status: value });
                        }}
                        disabled={isSubmitting}
                        defaultValue={section.status}
                    >
                        <SelectTrigger className="h-8 px-2 text-xs mr-2 relative -top-[2px]">
                            <SelectValue
                                className=" h-2"
                                placeholder="Select Publish Status"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="unpublished">
                                UnPublished
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        disabled={isSubmitting}
                        className="ml-1 p-1 size-fit bg-transparent shadow-none hover:bg-transparent"
                    >
                        {isEditing ? (
                            <LucideUpload
                                onClick={() =>
                                    handleUpdate({
                                        name: inputRef.current?.value,
                                    })
                                }
                                className="size-5 text-black dark:text-white"
                            />
                        ) : (
                            <Edit
                                onClick={handleEditing}
                                className="size-5 text-black dark:text-white"
                            />
                        )}
                    </Button>
                    {isEditing ? (
                        <Button
                            disabled={isSubmitting}
                            className="ml-1 p-1 size-fit bg-transparent shadow-none hover:bg-transparent"
                        >
                            <CrossCircledIcon
                                onClick={handleCancel}
                                className="size-5 text-black dark:text-white"
                            />
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    disabled={isSubmitting}
                                    className="ml-1 p-1 size-fit bg-transparent shadow-none hover:bg-transparent"
                                >
                                    <Trash className="size-5 text-destructive hover:text-destructive/60" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Are you absolutely sure?
                                    </DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. It also
                                        deletes all the course contents in this
                                        section. Are you sure you want to
                                        permanently delete this section from our
                                        servers?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button
                                            onClick={handleDelete}
                                            disabled={isSubmitting}
                                            variant="destructive"
                                        >
                                            Delete Section
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardDescription>
        </CardHeader>
    );
}

export default SectionHeader;
