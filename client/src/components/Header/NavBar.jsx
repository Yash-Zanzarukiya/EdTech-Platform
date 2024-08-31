import { APP_NAME, ROLE } from '@/constant';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Package2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '../mode-toggle';
import { ProfileDropdown } from '..';

const NavBar = () => {
    const withoutAuthNavItems = [
        {
            label: 'Home',
            path: '/',
        },
        {
            label: 'Explore',
            path: '/explore',
        },
        {
            label: 'Courses',
            path: '/courses',
        },
        {
            label: 'Exams',
            path: '/sign-up',
        },
        {
            label: 'About',
            path: '/about',
        },
    ];

    const withAuthNavItemsForAdmin = [
        {
            label: 'Dashboard',
            path: '/admin-dashboard',
        },
    ];

    const withAuthNavItemsForUser = [
        {
            label: 'Dashboard',
            path: '/user-dashboard',
        },
        {
            label: 'Explore',
            path: '/explore',
        },
        {
            label: 'Courses',
            path: '/courses',
        },
        {
            label: 'Testing',
            path: '/testing',
        },
        {
            label: 'Instructor',
            path: '/instructor/dashboard',
        },
    ];

    const [navItems, setNavItems] = useState(withoutAuthNavItems);
    const { userData } = useSelector(({ auth }) => auth);

    useEffect(() => {
        if (userData) {
            setNavItems(
                userData?.role === ROLE.ADMIN
                    ? withAuthNavItemsForAdmin
                    : withAuthNavItemsForUser
            );
        } else {
            setNavItems(withoutAuthNavItems);
        }
    }, [userData, userData?.role]);

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/50 px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                {/* LOGO */}
                <Link
                    to={'/'}
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>

                {/* LINKS */}
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `${
                                isActive
                                    ? 'text-blue-500 text-foreground'
                                    : 'text-muted-foreground'
                            } transition-colors hover:text-foreground`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            to={'/'}
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>

                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'
                                    } transition-colors hover:text-foreground`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                {/* SEARCH BOX */}
                <form className="ml-auto mr-3 flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search courses..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[400px]"
                        />
                    </div>
                </form>
                {/* THEME */}
                <ModeToggle />
                {/* PROFILE DROPDOWN */}
                {userData ? (
                    <ProfileDropdown />
                ) : (
                    <>
                        <NavLink
                            key="login"
                            to={'/sign-in'}
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? 'text-blue-500 text-foreground'
                                        : 'text-muted-foreground'
                                } transition-colors hover:text-foreground text-sm`
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            key={'signup'}
                            to={'/sign-up'}
                            className={({ isActive }) =>
                                `${
                                    isActive
                                        ? 'text-blue-500 text-foreground'
                                        : 'text-muted-foreground'
                                } transition-colors hover:text-foreground text-sm`
                            }
                        >
                            SignUp
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
};

export default NavBar;
