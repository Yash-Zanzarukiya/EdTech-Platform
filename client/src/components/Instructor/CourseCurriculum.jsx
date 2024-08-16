import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Section, AddSection } from './Curriculum';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Separator } from '../ui/separator';

export default function CourseCurriculum() {
    const { courseData } = useSelector(({ course }) => course);
    return (
        <Card x-chunk="dashboard-04-chunk-1" className="p-4 pt-2">
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

function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}
