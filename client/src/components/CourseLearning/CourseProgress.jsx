import React from 'react';
import { Button } from '@/components/ui/button';
import CircularProgress from './CircularProgress';
import { CalendarDays, Trophy } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

function CourseProgress({ total = 741, completed = 177 }) {
    return (
        <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
                <Button variant="link">
                    <CircularProgress value={completed} max={total} />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold flex items-center">
                            <Trophy className="size-5 mr-2" />
                            Your Course Progress
                        </h4>
                        <h4 className="text-md font-semibold pt-2">
                            {completed} of {total} complete.
                        </h4>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                            <span className="text-xs text-muted-foreground">
                                Joined December 2021
                            </span>
                        </div>
                        <p className="text-xs">
                            Finish course to get your certificate
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export default CourseProgress;
