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
import { Separator } from '../ui/separator';

function ToggleCoursePublish({ onSubmit, isSubmitting, courseData }) {
    const defaultStatus = courseData?.status === 'published' || false;

    const [status, setStatus] = useState(defaultStatus);

    useEffect(() => {
        if (courseData) setStatus(courseData.status === 'published');
    }, [courseData]);

    const onchange = (status) => {
        setStatus(status);
        onSubmit(status ? 'published' : 'unpublished');
    };

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-04-chunk-1" className="p-8">
                <CardHeader>
                    <CardTitle>
                        <span className="text-xl md:text-2xl lg:text-3xl tracking-tighter font-bold">
                            Course Publish Status
                        </span>
                        <h3 className="mt-4 text-sm text-foreground">
                            Update the publish status of the course
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
                            UnPublished
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
                            Published
                        </Label>
                    </div>
                    <Separator />
                </CardContent>
            </Card>
        </main>
    );
}

export default ToggleCoursePublish;
