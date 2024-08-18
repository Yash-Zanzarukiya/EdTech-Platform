import { Section, AddSection } from './Curriculum';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Separator } from '../ui/separator';
import { useCourseDataInstructor } from '@/hooks';

export default function CourseCurriculum() {
    const { courseData } = useCourseDataInstructor();
    return (
        <Card x-chunk="dashboard-04-chunk-1" className="p-4 pt-2 bg-muted/5">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">
                    Course Curriculum
                </CardTitle>
                <CardDescription>
                    <Separator />
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <main className="container mx-auto grid gap-4 px-4 md:px-6">
                    <section>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Instructions
                            </h2>
                            <p className="text-muted-foreground">
                                To create a new course, start by adding
                                sections, lectures, and practice activities. Use
                                the course outline to structure your content,
                                and keep in mind the limitations on video
                                content for free courses.
                            </p>
                            <Separator />
                        </div>
                    </section>
                    {courseData?.sections?.map((section, index) => (
                        <Section
                            key={section._id}
                            section={{ ...section, order: index + 1 }}
                        />
                    ))}
                    <AddSection />
                </main>
            </CardContent>
        </Card>
    );
}
