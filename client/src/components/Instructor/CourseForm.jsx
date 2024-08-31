import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import { useCustomForm } from '@/hooks';
import { courseFormSchema } from '@/schema';
import { createCourse, updateCourse } from '@/app/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function CourseForm({ updateForm = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // FIXME Fix 'Expected number, received string' error in price and duration.

    const { loading, courseData: course } = useSelector(({ course }) => course);

    let form = useCustomForm(courseFormSchema, {
        name: course && updateForm ? course.name : '',
        price: course && updateForm ? parseInt(course.price) : 0,
        description: course && updateForm ? course.description : '',
    });

    useEffect(() => {
        if (course) {
            form.setValue('name', course.name);
            form.setValue('price', course.price);
            form.setValue('description', course.description);
        }
    }, [course]);

    function onSubmit(data) {
        if (course) {
            dispatch(updateCourse({ courseId: course._id, data }));
        } else {
            dispatch(createCourse(data)).then((res) => {
                res.payload &&
                    navigate(`/instructor/courses/${res.payload._id}`);
            });
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    {updateForm
                        ? 'Update Course Details'
                        : 'Create a New Course'}
                </CardTitle>
                {!updateForm && (
                    <CardDescription>
                        Fill out the details below to list your course.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        id="course-data-form"
                        encType="multipart/form-data"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="grid gap-4">
                            {/* NAME */}
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter course name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid col-span-2 gap-2">
                            <div className="grid grid-cols-2 gap-4">
                                {/* THUMBNAIL */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="thumbnail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Course Thumbnail
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* PRICE */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        type="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="INR"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid col-span-2 gap-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Course Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your course"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-fit px-8"
                        >
                            {loading && course ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                    {updateForm ? 'Saving...' : ' Creating...'}
                                </>
                            ) : updateForm ? (
                                'Save Details'
                            ) : (
                                'Create Course'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
