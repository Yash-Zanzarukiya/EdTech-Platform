import React, { useState } from 'react';
import { formate } from '@/utils';
import { VideoIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProgress } from '@/app/slices/courseSlice';
import { Checkbox } from '@/components/ui/checkbox';

function SectionVideoComponent({ video, isActive, order }) {
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleProgress = (e) => {
        console.log('here: ');
        setIsSubmitting(true);
        dispatch(
            updateProgress({
                videoId: video._id,
                courseId,
            })
        ).then(() => setIsSubmitting(false));
    };

    return (
        <div
            className={`${
                isActive && 'text-blue-500'
            } p-1 border-b rounded hover:bg-muted/60`}
        >
            <div className="flex items-center rounded-md px-2 py-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                    <Checkbox
                        disabled={isSubmitting}
                        onCheckedChange={handleProgress}
                        defaultChecked={video.progress === 100}
                    />
                    <Link to={`${video._id}`}>
                        <span>
                            {order}. {video.title}
                        </span>
                    </Link>
                </div>
                <Link
                    className="flex grow text-transparent text-xs"
                    to={`${video._id}`}
                >
                    H
                </Link>
                <div className="flex ml-auto items-center gap-2 text-muted-foreground">
                    <VideoIcon className="h-4 w-4" />
                    <span>
                        <Link to={`${video._id}`}>
                            {formate.formateDuration(video.duration)}
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SectionVideoComponent;
