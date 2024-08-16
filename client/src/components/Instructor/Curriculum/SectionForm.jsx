import { createSection } from '@/app/slices/courseSlice';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCustomForm } from '@/hooks';
import { sectionSchema } from '@/schema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function SectionForm({ cancelAction }) {
    const dispatch = useDispatch();

    const { courseId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useCustomForm(sectionSchema, {
        name: '',
    });

    async function onSubmit(data) {
        setIsSubmitting(() => true);
        dispatch(createSection({ courseId, data })).then(() => {
            setIsSubmitting(() => false);
            cancelAction();
        });
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>New Section</CardTitle>
                <CardDescription>
                    Add a new section to your course
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-1"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-2">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter section name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mr-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Create Section'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={cancelAction}
                        >
                            Cancel
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
