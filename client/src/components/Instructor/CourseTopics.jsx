import React, { useEffect, useMemo, useRef } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import MultiSelect from '../ui/MultiSelect';
import { getCourses, updateCourse } from '@/app/slices/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAllTopics } from '@/hooks';

function CourseTopics() {
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const topicsRef = useRef();

    const { loading, courseData } = useSelector(({ course }) => course);
    const courseTopics = useMemo(
        () => courseData?.topics?.map((item) => item.name) || [],
        [courseData]
    );

    const { topicData } = useAllTopics();
    const allTopics = useMemo(
        () => topicData?.map((item) => item.name) || [],
        [topicData]
    );

    useEffect(() => {
        if (!courseData) dispatch(getCourses({ courseId }));
    }, [courseData, courseId]);

    function onSubmit() {
        const data = topicsRef.current.getSelectedValues();
        dispatch(
            updateCourse({
                courseId,
                data: { topics: data.join(',') },
            })
        );
        console.log('Submitted');
    }

    return (
        <Card x-chunk="dashboard-04-chunk-1" className="p-8">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    Course Topics
                </CardTitle>
                <CardDescription>
                    Used to search and recommend your courses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MultiSelect
                    ref={topicsRef}
                    OPTIONS={allTopics}
                    DEFAULTS={courseTopics}
                />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button
                    type="submit"
                    disabled={loading}
                    onClick={() => onSubmit()}
                    className="w-36"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        'Save Topics'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default CourseTopics;
