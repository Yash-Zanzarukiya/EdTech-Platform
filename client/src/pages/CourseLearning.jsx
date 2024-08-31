import { CourseNavbar, CourseSidebar } from '@/components';
import { useLearnerCourse } from '@/hooks';
import { Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CourseLearning() {
    const navigate = useNavigate();
    const { courseId, videoId } = useParams();
    const { courseData, loading } = useLearnerCourse(courseId);

    if (!courseData || loading) return <div>Loading...</div>;

    if (courseData.sections.length == 0) return <div>No videos found</div>;

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
        <div className="flex max-h-screen w-full flex-col bg-muted/40">
            <CourseNavbar activeVideo={activeVideo} courseData={courseData} />
            <main className="grow relative flex w-full">
                <section className="grow overflow-y-auto course-main-section">
                    <Outlet
                        context={{ courseData, activeSection, activeVideo }}
                    />
                </section>
                <aside className="max-w-md w-full hidden lg:block overflow-y-auto course-sidebar-section">
                    <CourseSidebar
                        sections={courseData.sections}
                        activeSection={activeSection}
                        activeVideo={activeVideo}
                    />
                </aside>
            </main>
        </div>
    );
}

export default CourseLearning;
