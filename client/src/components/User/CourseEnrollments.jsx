'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosConfig } from '@/utils';

export default function CourseEnrollments() {
    const [courses, setCourses] = useState([
        {
            course: {
                _id: '1',
                name: 'Learn React',
                progress: 50,
            },
            hasCertificate: false,
        },
        {
            course: {
                _id: '2',
                name: 'Java Tutorial',
                progress: 100,
            },
            hasCertificate: true,
        },
        {
            course: {
                _id: '3',
                name: 'Python for Data Science',
                progress: 75,
            },
            hasCertificate: false,
        },
        {
            course: {
                _id: '4',
                name: 'Fundamentals of Web Development',
                progress: 39,
            },
            hasCertificate: true,
        },
        {
            course: {
                _id: '5',
                name: 'Learn Node.js',
                progress: 50,
            },
            hasCertificate: false,
        },
    ]);

    useEffect(() => {
        // fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axiosConfig.get('/purchase');
            setCourses(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getCertificate = async (courseRoot) => {
        if (courseRoot.hasCertificate) {
        } else {
            try {
                const response = await axiosConfig.post(
                    `/purchase/cert/${courseRoot.course._id}`
                );
                console.log(response.data);
                fetchCourses();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader>
                <CardTitle>My Enrollments</CardTitle>
                <CardDescription>
                    Latest enrollments in your courses.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>Course Name</TableHead>
                            <TableHead className="text-center">
                                Progress
                            </TableHead>
                            <TableHead className="text-center">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map(({ course, hasCertificate }) => (
                            <TableRow key={course._id}>
                                <TableCell>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={`/placeholder.svg?height=36&width=36&text=${course.name.charAt(
                                                0
                                            )}`}
                                            alt={`${course.name} avatar`}
                                        />
                                        <AvatarFallback>
                                            {course.name
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{course.name}</p>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Progress
                                            value={course.progress}
                                            className="w-[60px]"
                                        />
                                        <span className="text-sm">
                                            {course.progress}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {hasCertificate ? (
                                        <Button
                                            onClick={() =>
                                                getCertificate(course._id)
                                            }
                                            className="text-xs"
                                        >
                                            View Certificate
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                getCertificate(course._id)
                                            }
                                            className="text-xs"
                                            variant="outline"
                                            disabled={course.progress < 100}
                                        >
                                            {course.progress < 100
                                                ? 'In Progress'
                                                : 'Get Certificate'}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
