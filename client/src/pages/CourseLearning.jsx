import { CourseNavbar, CourseSidebar } from '@/components';
import { useLearnerCourse } from '@/hooks';
import { Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CourseLearning() {
    const navigate = useNavigate();
    const { courseId, videoId } = useParams();
    const { courseData, loading } = useLearnerCourse(courseId);

    if (!courseData || loading) return <div>Loading...</div>;

    let activeVideo = null;
    let activeSection = courseData.sections.find((section) =>
        section.videos.find((video) => {
            const res = video._id === videoId;
            if (res) activeVideo = video;
            return res;
        })
    );

    if (!activeSection) {
        activeSection = courseData.sections[0];
        activeVideo = activeSection.videos[0];
        navigate(`/courses/${courseId}/${activeVideo._id}`);
    }

    return (
        <div className="flex h-screen w-full flex-col bg-muted/40">
            <CourseNavbar activeVideo={activeVideo} courseData={courseData} />
            <div className="flex flex-col sm:gap-4">
                <main className="grid flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-2 border bg-background">
                        <Outlet
                            context={{ courseData, activeSection, activeVideo }}
                        />
                    </div>
                    <CourseSidebar
                        sections={courseData.sections}
                        activeSection={activeSection}
                        activeVideo={activeVideo}
                    />
                </main>
            </div>
        </div>
    );
}

export default CourseLearning;
