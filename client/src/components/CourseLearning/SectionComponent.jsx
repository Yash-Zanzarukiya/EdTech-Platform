import React from 'react';
import { formate } from '@/utils';
import { Eye, VideoIcon } from 'lucide-react';

function SectionComponent({ section, isActive, order }) {
    return (
        <div className="flex flex-col w-full text-accent-foreground">
            <span className="flex items-center gap-1">
                <span>Section {order} :</span>
                <strong>{section.name}</strong>
            </span>
            <span className=" flex text-sm text-left gap-2 place-items-center text-accent-foreground">
                <span className="flex w-fit items-center gap-2 text-muted-foreground">
                    <VideoIcon className="h-4 w-4" />
                    <span>
                        {section.completedVideos} / {section.videos.length}
                    </span>
                    <span>&#8209;</span>
                </span>
                <span className="flex w-fit items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>
                        {formate.formateDuration(section.totalDuration)}
                    </span>
                </span>
            </span>
        </div>
    );
}

export default SectionComponent;
