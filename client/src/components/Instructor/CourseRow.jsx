import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteCourse } from '@/app/slices/courseSlice';

function CourseRow({ course }) {
    const formatCreationDate = (date) => {
        const newDate = new Date(date);
        const dateString = newDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit',
            // hour12: false,
        });
        return dateString;
    };

    const dispatch = useDispatch();

    const handleDeleteCourse = () => {
        dispatch(deleteCourse(course._id));
    };

    return (
        <TableRow key={course._id}>
            <TableCell className="hidden sm:table-cell">
                <img
                    alt="CourseIMG"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={course.thumbnail}
                    width="64"
                />
            </TableCell>
            <TableCell className="font-medium">
                <Link to={`${course._id}`}>{course.name}</Link>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">
                    {course.status}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {course.price}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {course.price}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {formatCreationDate(course.createdAt)}
            </TableCell>
            {/* ACTIONS */}
            <TableCell>
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your Course and remove your
                                data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={handleDeleteCourse}
                                    variant="destructive"
                                >
                                    Delete Video
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}

export default CourseRow;
