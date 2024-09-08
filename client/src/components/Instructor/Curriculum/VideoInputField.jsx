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
// import { useCustomForm } from '@/hooks';
// import { PlusIcon } from 'lucide-react';
// import { youtubeVideoSchema } from '@/schema';

// function VideoInputField({ plus = false, plusAction }) {
//     let form = useCustomForm(youtubeVideoSchema, {
//         videoURLs: '',
//     });

//     const validateURL = async (value) => {
//         const isValid =
//             /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
//                 value
//             );

//         if (isValid || value === '') {
//             form.clearErrors('videoURLs');
//         } else {
//             form.setError('videoURLs', {
//                 type: 'manual',
//                 message: 'Invalid YouTube URL',
//             });
//         }
//     };

//     return (
//         <Form {...form}>
//             <form className="grid grid-cols-1 gap-2">
//                 <div className="flex flex-col col-span-2">
//                     <FormField
//                         control={form.control}
//                         name="videoURLs"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormControl>
//                                     <div
//                                         className="flex gap-2"
//                                         key={Date.now()}
//                                     >
//                                         <Input
//                                             placeholder="https://www.youtube.com/watch?v=exampleid"
//                                             {...field}
//                                             onInput={(e) => {
//                                                 validateURL(e.target.value);
//                                             }}
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="secondary"
//                                             size="icon"
//                                             disabled={
//                                                 form.getValues('videoURLs') ===
//                                                     '' ||
//                                                 form.getFieldState('videoURLs')
//                                                     .invalid
//                                             }
//                                             onClick={plusAction}
//                                             className={`p-2 ${
//                                                 !plus && ' hidden'
//                                             }`}
//                                         >
//                                             <PlusIcon />
//                                         </Button>
//                                     </div>
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>
//             </form>
//         </Form>
//     );
// }

// export default VideoInputField;

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { PlusIcon } from 'lucide-react';

function VideoInputField({ name, control, plus = false, plusAction }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://www.youtube.com/watch?v=exampleid"
                                {...field}
                                onInput={(e) => {
                                    field.onChange(e); // Update form state
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                disabled={
                                    !field.value ||
                                    control.getFieldState(name).invalid
                                }
                                onClick={plusAction}
                                className={`p-2 ${!plus && 'hidden'}`}
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default VideoInputField;
