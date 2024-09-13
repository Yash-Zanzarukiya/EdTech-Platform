import React from 'react';
import { CalendarDays, Eye, ShoppingCart, Video } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formate } from '@/utils';

function CardHoverContent({ course }) {
    return (
        <div className="space-y-2 w-full">
            <h4 className="text-xl font-semibold">{course.name}</h4>
            <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                <span className="text-xs text-muted-foreground">
                    Updated December 2021
                </span>
            </div>
            <h6 className="text-xs gap-1 font-semibold flex items-center">
                <span className="flex">
                    <Eye className="size-4 mr-1" />{' '}
                    <span>{formate.formateDuration(course.totalDuration)}</span>
                </span>
                {' · '}
                <span className="flex">
                    <span>
                        {course.totalVideos} video
                        {course.totalVideos > 1 && 's'}
                    </span>
                </span>
            </h6>
            <div className="flex gap-1 flex-wrap">
                {course.topics.map((topic) => (
                    <Badge variant="secondary" className="rounded-full">
                        {topic.name}
                    </Badge>
                ))}
            </div>
            <p className=" text-xs line-clamp-3">{course.description}</p>
            <div className="flex justify-between items-center">
                <Button className="text-xs px-3 py-1">
                    <ShoppingCart className="size-[14px] mr-2" />
                    <span>Add to Cart</span>
                </Button>
            </div>
        </div>
    );
}

export default CardHoverContent;
