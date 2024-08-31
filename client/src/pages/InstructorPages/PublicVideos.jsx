import * as React from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PublicVideosTable } from '@/components';
import { useAllVideos, useCourseDataInstructor } from '@/hooks';
import { Badge } from '@/components/ui/badge';
import { formate } from '@/utils';
import { Separator } from '@/components/ui/separator';

export const columns = [
    {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: ({ row }) => (
            <img
                className="size-12 object-contain rounded"
                src={row.getValue('thumbnail')}
                alt="img"
            />
        ),
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('title')}</div>
        ),
    },
    {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => (
            <div className=" lowercase">
                {formate.formateDuration(row.getValue('duration'))}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <div>
                <Badge variant="outline" className="capitalize">
                    {row.getValue('status')}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Uploaded on
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">
                {formate.formateDate(row.getValue('createdAt'))}
            </div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const video = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function PublicVideos() {
    useCourseDataInstructor('Public Videos');

    const { videoData, loading } = useAllVideos({
        owner: 'me',
        status: 'public',
    });

    if (loading || !videoData) return <div>Loading...</div>;

    return (
        <div className="w-full p-6 pt-0 ">
            <h2 className="text-2xl font-bold tracking-tighter hidden sm:block">
                Public Videos
            </h2>
            <p className="pt-2">Manage your public and row videos here...</p>
            <Separator className="mt-4" />
            <PublicVideosTable data={videoData} columns={columns} />
        </div>
    );
}
