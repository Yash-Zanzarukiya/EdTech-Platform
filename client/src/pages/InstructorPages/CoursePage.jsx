import { Skeleton } from '@/components/ui/skeleton';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

export default function CoursePage() {
    const courseTabs = [
        { label: 'General', path: '' },
        { label: 'Topics', path: 'topics' },
        { label: 'Curriculum', path: 'content' },
        { label: 'Exam', path: 'preview' },
        { label: 'Preview', path: 'preview' },
    ];

    const { courseData } = useSelector(({ course }) => course);

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
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
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
