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
import { TableCell, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';

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
                        <DropdownMenuItem className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default CourseRow;
