import {
    ListFilter,
    PlusCircle,
    Home,
    LineChart,
    Package2,
    Package,
    PanelLeft,
    ShoppingCart,
    Search,
    Users2,
} from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '@/app/slices/courseSlice';
import AllCourseSkeleton from '@/components/Instructor/Skeletons/AllCourseSkeleton';
import { CourseRow } from '@/components';

export default function AllCourses() {
    const dispatch = useDispatch();
    const { loading, courseData } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getCourses({}));
    }, [dispatch]);

    const tabList = ['all', 'published', 'unpublished', 'drafted'];

    return (
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="sm:hidden"
                        >
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                            >
                                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Home className="h-5 w-5" />
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Orders
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-foreground"
                            >
                                <Package className="h-5 w-5" />
                                Products
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Users2 className="h-5 w-5" />
                                Customers
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <LineChart className="h-5 w-5" />
                                Settings
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <h2 className="text-lg font-bold tracking-tighter sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100">
                    Courses
                </h2>
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <h1>
                    Seamless Course Management - Manage Your Courses with Ease.
                </h1>
                <Tabs defaultValue="all">
                    {/* Tabs */}
                    <div className="flex items-center">
                        <TabsList>
                            {tabList.map((status) => (
                                <TabsTrigger
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
                            {/* FILTER */}
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
                                    <DropdownMenuLabel>
                                        Filter by
                                    </DropdownMenuLabel>
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
                            {/* EXPORT
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1"
                            >
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Export
                                </span>
                            </Button> */}
                            {/* ADD COURSE */}
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
                    {/* Content */}
                    {tabList.map((status) => (
                        <TabsContent value={status}>
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardContent>
                                    <Table>
                                        {/* TABLE HEAD */}
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
                                        {/* TABLE BODY */}
                                        <TableBody>
                                            {loading ? (
                                                <AllCourseSkeleton />
                                            ) : (
                                                courseData?.length > 0 &&
                                                courseData.map((course) =>
                                                    status == 'all' ||
                                                    status == course.status ? (
                                                        <CourseRow
                                                            course={course}
                                                        />
                                                    ) : null
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                {/* <CardFooter>
                                        <div className="text-xs text-muted-foreground">
                                            Showing <strong>1-10</strong> of{' '}
                                            <strong>32</strong> products
                                        </div>
                                    </CardFooter> */}
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    );
}
