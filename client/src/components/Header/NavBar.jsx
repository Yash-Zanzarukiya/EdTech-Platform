import { APP_NAME, ROLE } from '@/constant';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/app/slices/authSlice';

const NavBar = () => {
    const withoutAuthNavItems = [
        {
            label: 'Home',
            path: '/',
        },
        {
            label: 'Sign-in',
            path: '/sign-in',
        },
        {
            label: 'Sign-up',
            path: '/sign-up',
        },
        {
            label: 'About',
            path: '/about',
        },
    ];

    const withAuthNavItemsForAdmin = [
        {
            label: 'Home',
            path: '/admin-dashboard',
        },
    ];

    const withAuthNavItemsForUser = [
        {
            label: 'Home',
            path: '/user-dashboard',
        },
    ];

    const { userData } = useSelector(({ auth }) => auth);
    const dispatch = useDispatch();

    const [navItems, setNavItems] = useState(withoutAuthNavItems);
    const navigate = useNavigate();

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
        <header className="px-4 lg:px-6 h-16 flex items-center ">
            <Link to="/" className="flex items-center justify-center">
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {APP_NAME}
                </span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `${
                                isActive ? 'text-blue-500' : 'text-gray-700'
                            } text-md flex items-center justify-center font-semibold hover:scale-110 transition-all delay-50 dark:text-gray-300`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
                {userData && (
                    <Button
                        variant="outline"
                        className="h-8 hover:border-red-400"
                        onClick={() => dispatch(logout())}
                    >
                        Logout
                    </Button>
                )}
            </nav>
        </header>
    );
};

export default NavBar;
