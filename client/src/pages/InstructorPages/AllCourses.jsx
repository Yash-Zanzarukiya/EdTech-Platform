import { ListFilter, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInstructorCourses } from '@/app/slices/courseSlice';
import AllCourseSkeleton from '@/components/Instructor/Skeletons/AllCourseSkeleton';
import { CourseRow } from '@/components';

export default function AllCourses() {
    const dispatch = useDispatch();
    const { loading, courseData } = useSelector((state) => state.course);

    const { setRouteName } = useOutletContext();

    useEffect(() => {
        setRouteName('All Courses');
    }, [setRouteName]);

    useEffect(() => {
        dispatch(getInstructorCourses({}));
    }, [dispatch]);

    const tabList = ['all', 'published', 'unpublished', 'drafted'];

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <section className='grid gap-2'>
                <h2 className="text-2xl font-bold tracking-tighter hidden sm:block">
                    All Courses
                </h2>
                <h1>
                    Seamless Course Management - Manage Your Courses with Ease.
                </h1>
            </section>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        {tabList.map((status) => (
                            <TabsTrigger
                                key={Date.now() + status}
                                value={status}
                                className={`capitalize ${
                                    status == 'drafted' && 'hidden sm:flex'
                                }`}
                            >
                                {status}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                >
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                    Active
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Draft
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    Archived
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link to={'/instructor/add-course'}>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Course
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>
                {tabList.map((status) => (
                    <TabsContent value={status} key={'tablist' + status}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="hidden w-[100px] sm:table-cell">
                                                <span className="sr-only">
                                                    Image
                                                </span>
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Price
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Enrollments
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                                Created at
                                            </TableHead>
                                            <TableHead>
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <AllCourseSkeleton />
                                        ) : (
                                            courseData?.length > 0 &&
                                            courseData.map((course) =>
                                                status == 'all' ||
                                                status == course.status ? (
                                                    <CourseRow
                                                        key={course._id}
                                                        course={course}
                                                    />
                                                ) : null
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </main>
    );
}
