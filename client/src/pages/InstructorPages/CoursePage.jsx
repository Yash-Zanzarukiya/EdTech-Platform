import { Skeleton } from '@/components/ui/skeleton';
import { useSelector } from 'react-redux';
import { NavLink, Outlet, useOutletContext } from 'react-router-dom';

export default function CoursePage() {
    const { setRouteName } = useOutletContext();
    const { courseData } = useSelector(({ course }) => course);

    const courseTabs = [
        { label: 'General', path: '' },
        { label: 'Topics', path: 'topics' },
        { label: 'Curriculum', path: 'curriculum' },
        { label: 'Exam', path: 'exam' },
        { label: 'Preview', path: `/courses/${courseData?._id}` },
        { label: 'Publish', path: 'publish' },
    ];

    return (
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
            <div className="hidden sm:block mx-auto w-full max-w-6xl">
                {courseData ? (
                    <h1 className="text-3xl font-semibold">
                        {courseData.name}
                    </h1>
                ) : (
                    <Skeleton className="h-9 w-56" />
                )}
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav
                    className="grid gap-4 text-sm text-muted-foreground"
                    x-chunk="dashboard-04-chunk-0"
                >
                    {courseTabs.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end
                            target={
                                item.label == 'Preview' ? '_blank' : '_self'
                            }
                            className={({ isActive }) =>
                                `${
                                    isActive && 'font-semibold text-primary'
                                } capitalize`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <Outlet context={{ setRouteName, courseData }} />
            </div>
        </main>
    );
}
