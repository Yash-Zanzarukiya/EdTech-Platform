import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { useDispatch } from 'react-redux';
import { useAllTopics, useCustomForm } from '@/hooks';
import { lectureSchema } from '@/schema';
import {
    deleteLecture,
    updateLecture,
    uploadLecture,
} from '@/app/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MultiSelect from '@/components/ui/MultiSelect';

export default function LectureForm({
    lecture = false,
    sectionId,
    cancelAction,
}) {
    const dispatch = useDispatch();
    const topicsRef = useRef();

    const [isSubmitting, setIsSubmitting] = useState(false);

    let form = useCustomForm(lectureSchema, {
        title: lecture ? lecture.title : '',
        description: lecture ? lecture.description : '',
    });

    useEffect(() => {
        if (lecture) {
            form.setValue('title', lecture.title);
            form.setValue('description', lecture.description);
        }
    }, [lecture]);

    const { topicsNames: allTopics } = useAllTopics();

    const lectureTopics = useMemo(
        () => lecture?.topics?.map((item) => item.name) || [],
        [lecture]
    );

    function onSubmit(data) {
        setIsSubmitting(() => true);

        const lectureData = {
            ...data,
            topics: topicsRef.current.getSelectedValues().join(','),
            sectionId,
            videoId: lecture?._id,
        };

        if (lecture) {
            dispatch(updateLecture(lectureData)).then(() =>
                setIsSubmitting(() => false)
            );
        } else {
            dispatch(uploadLecture(lectureData)).then(() => {
                setIsSubmitting(() => false);
                cancelAction();
            });
        }
    }

    const handleDelete = () => {
        setIsSubmitting(true);
        dispatch(deleteLecture(lecture._id)).then(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Card className="bg-transparent">
            <CardHeader className=" relative pb-2 pt-4 px-4 font-semibold text-lg">
                {lecture ? 'Update Lecture Content' : 'Add New Lecture'}
                {lecture && (
                    <Select
                        onValueChange={(value) => {
                            onSubmit({ status: value });
                        }}
                        disabled={isSubmitting}
                        defaultValue={lecture.status}
                    >
                        <SelectTrigger className=" absolute w-fit h-8 px-2 text-xs mr-2 right-2">
                            <SelectValue
                                className="h-2"
                                placeholder="Select Publish Status"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="unpublished">
                                UnPublished
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2">
                <Form {...form}>
                    <form
                        id="lecture-data-form"
                        encType="multipart/form-data"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                        {/* TITLE & VIDEO_FILE */}
                        <div className="flex flex-col gap-2">
                            {/* VIDEO_FILE */}
                            {!lecture && (
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="videoFile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Video File
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        required
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                            {/* TITLE */}
                            <div>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lecture Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter video title"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* THUMBNAIL */}
                        <div className="flex flex-col">
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {lecture
                                                ? 'Upload New Thumbnail'
                                                : 'Video Thumbnail'}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                required={!lecture}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* TOPICS */}
                        <div className="flex flex-col col-span-2">
                            <FormField
                                control={form.control}
                                name="topics"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lecture Topics</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                OPTIONS={allTopics}
                                                DEFAULTS={lectureTopics}
                                                ref={topicsRef}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="flex flex-col col-span-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your video"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <div className="mt-1 flex col-span-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mr-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : lecture ? (
                                    'Save Details'
                                ) : (
                                    'Add Lecture'
                                )}
                            </Button>
                            {!lecture && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelAction}
                                >
                                    Cancel
                                </Button>
                            )}
                            {lecture && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            disabled={isSubmitting}
                                            variant="destructive"
                                            className="ml-auto"
                                        >
                                            Delete Lecture
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. It
                                                also deletes the video contents
                                                in this section. Are you sure
                                                you want to permanently delete
                                                this video from our servers?
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
                                                    Delete Lecture
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
