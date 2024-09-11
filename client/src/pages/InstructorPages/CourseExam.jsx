import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCourseDataInstructor } from '@/hooks';
import { useDispatch } from 'react-redux';
import { updateCourse } from '@/app/slices/courseSlice';

export default function CourseExam() {
    const { courseData } = useCourseDataInstructor();

    const defaultStatus = courseData?.hasExam || false;

    const [status, setStatus] = useState(defaultStatus);
    const [isSubmitting, setIsSubmitting] = useState(defaultStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        if (courseData) setStatus(courseData.hasExam);
    }, [courseData]);

    const onchange = (newStatus) => {
        setStatus(newStatus);
        setIsSubmitting(true);
        dispatch(
            updateCourse({
                courseId: courseData._id,
                data: { hasExam: newStatus },
            })
        ).then(() => setIsSubmitting(false));
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-04-chunk-1" className="p-8">
                <CardHeader>
                    <CardTitle>
                        <span className="text-xl md:text-2xl lg:text-3xl tracking-tighter font-semibold">
                            Course Certification Exam
                        </span>
                        <h3 className="mt-4 text-sm text-foreground">
                            Do you want A.I. Generated Exam for Certification of
                            Course?
                        </h3>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4 mt-2">
                        <Label
                            className={
                                status &&
                                'text-muted-foreground transition-colors ease-in-out'
                            }
                        >
                            No Exam
                        </Label>
                        <Switch
                            id="airplane-mode"
                            checked={status}
                            disabled={isSubmitting || !courseData}
                            onCheckedChange={onchange}
                        />
                        <Label
                            className={
                                !status &&
                                'text-muted-foreground transition-colors ease-in-out'
                            }
                        >
                            A.I. Exam
                        </Label>
                    </div>
                    <Separator />
                </CardContent>
            </Card>
        </main>
    );
}
