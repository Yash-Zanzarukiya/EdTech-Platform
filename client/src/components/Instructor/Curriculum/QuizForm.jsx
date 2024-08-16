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

export default function QuizForm({ section, quiz, cancelAction }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useCustomForm(sectionSchema, {
        name: section ? section.name : '',
    });

    async function onSubmit(data) {
        setIsSubmitting(() => true);
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Add New Quiz</CardTitle>
                <CardDescription>
                    Add a new quiz to your section
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
                                'Create Quiz'
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
