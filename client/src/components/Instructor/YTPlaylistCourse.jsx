import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AiFillYoutube } from 'react-icons/ai';
import { Separator } from '../ui/separator';
import { useRef, useState } from 'react';
import { toastMessage } from '@/App';
import { useDispatch } from 'react-redux';
import { createPlaylistCourse } from '@/app/slices/courseSlice';
import MultiSelect from '../ui/MultiSelect';
import { useAllTopics } from '@/hooks';
import { LoaderCircle } from 'lucide-react';

function YTPlaylistCourse() {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { topicsNames } = useAllTopics();

    const courseTopicRef = useRef();
    const videoTopicRef = useRef();
    const idRef = useRef();
    const urlRef = useRef();

    const handleSubmit = () => {
        setIsSubmitting(true);

        const id = idRef.current.value;
        const url = urlRef.current.value;
        let playlistId = id;

        if (!id && !url) {
            toastMessage({
                title: 'Please enter either Playlist ID or URL',
                variant: 'destructive',
            });
            setIsSubmitting(false);
            return;
        }

        if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            playlistId = urlParams.get('list');
        } else if (id.length !== 34) {
            toastMessage({
                title: 'Please enter a valid Playlist ID',
                variant: 'destructive',
            });
            return;
        } else {
            playlistId = id;
        }

        const courseTopics = courseTopicRef.current
            .getSelectedValues()
            ?.join(',');
        const videoTopics = videoTopicRef.current
            .getSelectedValues()
            ?.join(',');

        dispatch(
            createPlaylistCourse({ playlistId, courseTopics, videoTopics })
        ).then(() => {
            setIsSubmitting(false);
            idRef.current.value = '';
            urlRef.current.value = '';
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <AiFillYoutube className="mr-2 h-5 w-5 text-red-500" />
                    YouTube
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add from YouTube</DialogTitle>
                    <DialogDescription>
                        Add a YouTube Playlist id to save it as a course.
                        <br />
                        Please add either Playlist ID or URL.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-end gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="playlistId" className="text-right">
                            ID
                        </Label>
                        <Input
                            id="playlistId"
                            ref={idRef}
                            placeholder="34 Charecters Long Playlistid"
                            className="col-span-3"
                        />
                    </div>
                    <Separator asChild className="bg-transparent w-2/3 ml-28">
                        <div className="py-2 flex items-center text-xs text-muted-foreground uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:before:border-gray-700 dark:after:border-gray-700">
                            Or
                        </div>
                    </Separator>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="playlistURL" className="text-right">
                            URL
                        </Label>
                        <Input
                            id="playlistURL"
                            ref={urlRef}
                            placeholder="https://www.youtube.com/playlist?list=34_charecters_long_playlistid"
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex ml-20 items-center justify-center gap-4 max-w-md">
                            <Label className="text-right">Course</Label>
                            <MultiSelect
                                OPTIONS={topicsNames}
                                DEFAULTS={[]}
                                ref={courseTopicRef}
                            />
                        </div>
                        <div className="flex ml-20 items-center justify-center gap-4 max-w-md">
                            <Label className="text-right">Video</Label>
                            <MultiSelect
                                OPTIONS={topicsNames}
                                DEFAULTS={[]}
                                ref={videoTopicRef}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <LoaderCircle className="size-4 mr-1 animate-spin" />
                                Adding
                            </span>
                        ) : (
                            'Add Course'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default YTPlaylistCourse;
