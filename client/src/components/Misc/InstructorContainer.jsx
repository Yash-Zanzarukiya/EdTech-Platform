import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
    Book,
    Home,
    LineChart,
    Package2,
    PlusCircle,
    Settings,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { logout } from '@/app/slices/authSlice';
import { useDispatch } from 'react-redux';
import { ModeToggle } from '../mode-toggle';

const navItems = [
    {
        label: 'Home',
        path: 'dashboard',
        icon: <Home className="h-5 w-5" />,
    },
    {
        label: 'Analytics',
        path: 'analytics',
        icon: <LineChart className="h-5 w-5" />,
    },
    {
        label: 'Courses',
        path: 'courses',
        icon: <Book className="h-5 w-5" />,
    },
    {
        label: 'Add Course',
        path: 'add-course',
        icon: <PlusCircle className="h-5 w-5" />,
    },
];

function InstructorContainer() {
    const dispatch = useDispatch();
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* SIDEBAR */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <TooltipProvider>
                    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                        {/* LOGO */}
                        <Link
                            to={'/'}
                            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                        >
                            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        {/* NAV-ITEMS */}

                        {navItems.map((item, index) => (
                            <Tooltip key={index + Date.now()}>
                                <TooltipTrigger asChild>
                                    <NavLink
                                        to={item.path}
                                        end
                                        className={({ isActive }) =>
                                            ` ${
                                                isActive
                                                    ? 'text-accent-foreground bg-accent '
                                                    : ' text-muted-foreground '
                                            } flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`
                                        }
                                    >
                                        {item.icon}
                                        <span className="sr-only">
                                            {item.label}
                                        </span>
                                    </NavLink>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        ))}

                        {/* Dashboard */}
                        {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Dashboard
                            </TooltipContent>
                        </Tooltip> */}
                        {/* Analytics */}
                        {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to={`analytics`}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <LineChart className="h-5 w-5" />
                                    <span className="sr-only">Analytics</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Analytics
                            </TooltipContent>
                        </Tooltip> */}
                        {/* Courses */}
                        {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to={`courses`}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <Book className="h-5 w-5" />
                                    <span className="sr-only">Courses</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Courses
                            </TooltipContent>
                        </Tooltip> */}
                        {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <Package className="h-5 w-5" />
                                    <span className="sr-only">Products</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Products
                            </TooltipContent>
                        </Tooltip> */}
                        {/* Add Course */}
                        {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to={`add-course`}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span className="sr-only">Add Course</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Add Course
                            </TooltipContent>
                        </Tooltip> */}
                    </nav>
                    <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span className="sr-only">Settings</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Settings
                            </TooltipContent>
                        </Tooltip>
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="overflow-hidden rounded-full"
                                >
                                    <img
                                        src="https://picsum.photos/200/200"
                                        alt="Avatar"
                                        className="overflow-hidden rounded-full size-full"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => dispatch(logout())}
                                    className="text-red-500"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </TooltipProvider>
            </aside>
            {/* MAIN */}
            <Outlet />
            {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="overflow-hidden rounded-full"
                            >
                                <img
                                    src="https://picsum.photos/200/200"
                                    width={36}
                                    height={36}
                                    alt="Avatar"
                                    className="overflow-hidden rounded-full"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <Outlet />
            </div> */}
        </div>
    );
}

export default InstructorContainer;
