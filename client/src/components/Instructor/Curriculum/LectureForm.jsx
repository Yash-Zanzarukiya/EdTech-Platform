import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
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
import { useDispatch } from 'react-redux';
import { useAllTopics, useCustomForm } from '@/hooks';
import { lectureSchema } from '@/schema';
import { updateLecture, uploadLecture } from '@/app/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const { topicData } = useAllTopics();
    const allTopics = useMemo(
        () => topicData?.map((item) => item.name) || [],
        [topicData]
    );

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

    return (
        <Card>
            <CardHeader className="pb-2 pt-4 px-4 font-semibold text-lg">
                {lecture ? 'Update Lecture Content' : 'Add New Lecture'}
            </CardHeader>
            <CardContent className="px-4 pb-4">
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
                        <div className="mt-1">
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
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// import { Button } from '@/components/ui/button';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { useCustomForm } from '@/hooks';
// import { sectionSchema } from '@/schema';
// import { Loader2 } from 'lucide-react';
// import { useState } from 'react';

// export default function LectureForm({ section }) {
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const form = useCustomForm(sectionSchema, {
//         name: section ? section.name : '',
//     });

//     async function onSubmit(data) {
//         setIsSubmitting(() => true);
//         // dispatch();
//     }

//     return (
//         <Card>
//             <CardHeader className="pb-2 pt-4 px-4">
//                 <CardTitle>New Lecture</CardTitle>
//             </CardHeader>
//             <CardContent className="px-4 pb-4">
//                 <Form {...form}>
//                     <form
//                         onSubmit={form.handleSubmit(onSubmit)}
//                         className="space-y-1"
//                     >
//                         <FormField
//                             control={form.control}
//                             name="title"
//                             render={({ field }) => (
//                                 <FormItem className="mb-2">
//                                     <FormLabel>Title</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             placeholder="Enter title of the lecture"
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
// <Button
//     type="submit"
//     disabled={isSubmitting}
//     className="mr-2"
// >
//     {isSubmitting ? (
//         <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Please wait
//         </>
//     ) : (
//         'Add Lecture'
//     )}
// </Button>
// <Button
//     type="button"
//     variant="outline"
//     className="text-red-500"
// >
//     Cancel
// </Button>
//                     </form>
//                 </Form>
//             </CardContent>
//         </Card>
//     );
// }
