// import { Card, CardHeader, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from '@/components/ui/form';
// import { useDispatch } from 'react-redux';
// import { useCustomForm } from '@/hooks';
// import { addYTLecture } from '@/app/slices/courseSlice';
// import { Loader2, PlusIcon } from 'lucide-react';
// import { useState } from 'react';
// import { youtubeVideoSchema } from '@/schema';
// import VideoInputField from './VideoInputField';

// export default function YTVideoForm({
//     lecture = false,
//     sectionId,
//     cancelAction,
// }) {
//     const dispatch = useDispatch();

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [urlCount, setUrlCount] = useState(1);

//     let form = useCustomForm(youtubeVideoSchema, {
//         videoURLs: '',
//     });

//     function onSubmit(data) {
//         setIsSubmitting(() => true);

//         const lectureData = {
//             ...data,
//             sectionId,
//         };

//         dispatch(addYTLecture(lectureData)).then(() => {
//             setIsSubmitting(() => false);
//             cancelAction();
//         });
//     }

//     return (
//         <Card className="bg-transparent">
//             <CardHeader className=" relative pb-2 pt-4 px-4 font-semibold text-lg">
//                 Add New Lectures from YouTube
//             </CardHeader>
//             <CardContent className="px-4 pb-4 pt-2">
//                 <span className="text-sm">Video URLs</span>
//                 <div className="flex flex-col gap-2 mt-1">
//                     {Array(urlCount)
//                         .fill(1)
//                         .map((_, index) => (
//                             <VideoInputField
//                                 plus={index === urlCount - 1}
//                                 plusAction={() =>
//                                     setUrlCount((prev) => prev + 1)
//                                 }
//                             />
//                         ))}
//                 </div>
//                 {/* Submit */}
//                 <div className="mt-2">
//                     <Button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="mr-2"
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Please wait
//                             </>
//                         ) : (
//                             'Add'
//                         )}
//                     </Button>
//                     {!lecture && (
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={cancelAction}
//                         >
//                             Cancel
//                         </Button>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useDispatch } from 'react-redux';
import { useCustomForm } from '@/hooks';
import { addYTLecture } from '@/app/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { youtubeVideoSchema } from '@/schema';
import VideoInputField from './VideoInputField';

export default function YTVideoForm({
    lecture = false,
    sectionId,
    cancelAction,
}) {
    const dispatch = useDispatch();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [urlCount, setUrlCount] = useState(1);

    // Use a single form instance for the entire form
    const form = useCustomForm(youtubeVideoSchema, {
        videoURLs: [''], // Start with an array of URLs (initially empty)
    });

    function onSubmit(data) {
        setIsSubmitting(true);
        const lectureData = {
            videoURLs: data.videoURLs.filter((url) => url !== ''),
            sectionId,
        };

        dispatch(addYTLecture(lectureData)).then(() => {
            setIsSubmitting(false);
            cancelAction();
        });
    }

    return (
        <Card className="bg-transparent">
            <CardHeader className="relative pb-2 pt-4 px-4 font-semibold text-lg">
                Add New Lectures from YouTube
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2">
                <span className="text-sm">Video URLs</span>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-2 mt-1">
                            {Array(urlCount)
                                .fill(1)
                                .map((_, index) => (
                                    <VideoInputField
                                        key={index}
                                        name={`videoURLs.${index}`} // Pass unique name for each field
                                        control={form.control} // Pass form control to each VideoInputField
                                        plus={index === urlCount - 1}
                                        plusAction={() =>
                                            setUrlCount((prev) => prev + 1)
                                        }
                                    />
                                ))}
                        </div>
                        {/* Submit */}
                        <div className="mt-2">
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
                                ) : (
                                    'Add'
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
