import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function FirstCoursePublish({ onSubmit, isSubmitting, courseData }) {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-04-chunk-1" className="p-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                                Publish Your Course
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                                Your course is ready, let's get it published!
                            </p>
                            <h1 className="mt-8 text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                                {courseData.name}
                            </h1>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="border-t px-6 py-4 justify-center">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => onSubmit('published')}
                        className="w-36"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                Publishing...
                            </>
                        ) : (
                            'Publish Now'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}

export default FirstCoursePublish;
