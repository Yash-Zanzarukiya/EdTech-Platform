import React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MountainIcon, Package2 } from 'lucide-react';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ModeToggle } from '../mode-toggle';
import CourseProgress from './CourseProgress';
import { ProfileDropdown } from '..';
import { Link } from 'react-router-dom';

function CourseNavbar({ courseData, activeVideo }) {
    return (
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b px-4 py-3 sm:static sm:border-0 sm:px-6">
            <div className="flex items-center gap-6">
                <Link to={'/courses'}>
                    <Package2 className="h-6 w-6" />
                </Link>
                <span className="text-lg font-semibold line-clamp-2">
                    {courseData.name} - {activeVideo.title}
                </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <CourseProgress
                    total={courseData.totalVideos}
                    completed={courseData.completedVideos}
                />
                <ModeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="fit"
                            variant="outline"
                            className="overflow-hidden p-2"
                        >
                            <DotsVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ProfileDropdown />
            </div>
        </header>
    );
}

export default CourseNavbar;
