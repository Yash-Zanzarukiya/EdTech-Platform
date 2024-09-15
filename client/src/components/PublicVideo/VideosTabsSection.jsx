import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FileIcon } from 'lucide-react';
import { CourseSidebar, RecommendedVideos } from '@/components';
import { Badge } from '../ui/badge';

const tabList = [
    { label: 'Course Content', value: 'courseContent', className: 'lg:hidden' },
    { label: 'Description', value: 'description' },
    { label: 'Comments', value: 'comments' },
    { label: 'Resources', value: 'resources' },
];

export default function VideosTabsSection({ video }) {
    if (!video) return;
    const topics = video.topics.map((topic) => topic.name);
    return (
        <div className="p-4">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{video.title}</h2>
                <div className="space-y-2">
                    <p className="font-semibold tracking-tighter">Topics</p>
                    <div className="flex items-center gap-4 w-fit rounded-md">
                        {topics.map((topic) => (
                            <Badge key={topic} className="rounded-full">
                                {topic}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold tracking-tighter">
                        Description
                    </p>
                    <p className="bg-muted rounded-md p-4 max-w-5xl">
                        {video.description}
                    </p>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold tracking-tighter">
                        Uploaded by
                    </p>
                    <div className="flex items-center gap-4 bg-muted w-fit p-3 rounded-md">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage
                                src={video.owner.avatar}
                                alt="@shadcn"
                            />
                            <AvatarFallback>YZ</AvatarFallback>
                        </Avatar>
                        <div className="font-semibold">
                            {video.owner.fullName}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
