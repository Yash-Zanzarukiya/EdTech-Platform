'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';

export default function CourseEnrollments() {
    const courses = [
        {
            _id: '66e2b091932333a9f737aa76',
            name: 'React Fundamentals',
            progress: 60,
        },
        {
            _id: '66e2b091932333a9f737aa76',
            name: 'React Fundamentals',
            progress: 60,
        },
        {
            _id: '66e2b091932333a9f737aa76',
            name: 'React Fundamentals',
            progress: 60,
        },
        {
            _id: '66e2b091932333a9f737aa76',
            name: 'React Fundamentals',
            progress: 60,
        },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>
                    Latest enrollments in your courses.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {courses.map((course) => (
                    <>
                        <Separator />
                        <Link to={`/courses/${course._id}`}>
                            <div
                                className="flex items-center gap-4"
                                key={course._id}
                            >
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    <AvatarImage
                                        src="/avatars/01.png"
                                        alt="Avatar"
                                    />
                                    <AvatarFallback>OM</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="text-md font-medium leading-none">
                                        {course.name}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    <span className="text-md">
                                        {course.progress}%
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </>
                ))}
            </CardContent>
        </Card>
    );
}
