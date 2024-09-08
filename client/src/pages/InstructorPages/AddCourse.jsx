import { Button } from '@/components/ui/button';
import {
    BookOpenIcon,
    BrushIcon,
    CodeIcon,
    CpuIcon,
    PlusIcon,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

export default function AddCourse() {
    const navigate = useNavigate();

    const { setRouteName } = useOutletContext();

    useEffect(() => {
        setRouteName('Add Course');
    }, [setRouteName]);

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                        Add a New Course
                    </h1>
                    <p className="text-muted-foreground">
                        Expand your curriculum with a new course. Fill out the
                        details below to get started.
                    </p>
                </div>
                <div className="mt-6">
                    <Button to={'new'} onClick={() => navigate('new')}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Course
                    </Button>
                </div>
            </div>
            <div className="grid gap-2 mt-8">
                <h2 className="text-xl text-center font-semibold">
                    Popular Categories
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <Link
                        href="#"
                        className="bg-muted px-2 py-4 rounded-md flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                        prefetch={false}
                    >
                        <CodeIcon className="size-6" />
                        <span className="text-xs font-medium">Programming</span>
                    </Link>
                    <Link
                        href="#"
                        className="bg-muted px-2 py-4 rounded-md flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                        prefetch={false}
                    >
                        <BookOpenIcon className="size-6" />
                        <span className="text-xs font-medium">Business</span>
                    </Link>
                    <Link
                        href="#"
                        className="bg-muted px-2 py-4 rounded-md flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                        prefetch={false}
                    >
                        <CpuIcon className="size-6" />
                        <span className="text-xs font-medium">
                            IT & Software
                        </span>
                    </Link>
                    <Link
                        href="#"
                        className="bg-muted px-2 py-4 rounded-md flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                        prefetch={false}
                    >
                        <BrushIcon className="size-6" />
                        <span className="text-xs font-medium">Design</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
