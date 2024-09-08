import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { logout } from '@/app/slices/authSlice';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { CircleUser } from 'lucide-react';

function ProfileDropdown() {
    const { userData } = useSelector(({ auth }) => auth);
    const dispatch = useDispatch();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                >
                    <img
                        src={
                            userData.avatar ??
                            'https://ui.shadcn.com/avatars/04.png'
                        }
                        className="h-7 w-7 rounded-full"
                    />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => dispatch(logout())}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ProfileDropdown;
