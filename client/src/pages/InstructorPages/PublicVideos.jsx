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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PublicVideosTable } from '@/components';
import { useAllPublicVideos, useCourseDataInstructor } from '@/hooks';
import { Badge } from '@/components/ui/badge';
import { formate } from '@/utils';
import { Separator } from '@/components/ui/separator';
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
import { useDispatch } from 'react-redux';
import { deletePublicVideo, updatePublicVideo } from '@/app/slices/videoSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

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
            <div className="capitalize">
                <Link to={`${row.original._id}`}>{row.getValue('title')}</Link>
            </div>
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
        cell: ({ row }) => {
            const video = row.original;
            const dispatch = useDispatch();

            const onSubmit = (data) =>
                dispatch(updatePublicVideo({ ...data, videoId: video._id }));

            return (
                <Select
                    onValueChange={(value) => {
                        onSubmit({ status: value });
                    }}
                    defaultValue={video.status}
                >
                    <SelectTrigger className="w-fit h-8 px-2 text-xs mr-2">
                        <SelectValue
                            className="h-2"
                            placeholder="Select Publish Status"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        {video.section && (
                            <SelectItem value="private">Private</SelectItem>
                        )}
                        <SelectItem value="unpublished">UnPublished</SelectItem>
                    </SelectContent>
                </Select>
            );
            // (
            //     <Badge variant="outline" className="capitalize">
            //         {row.getValue('status')}
            //     </Badge>
            // );
        },
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
            const dispatch = useDispatch();
            const video = row.original;
            const handleDelete = () => dispatch(deletePublicVideo(video._id));

            return (
                <Dialog>
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
                                This action cannot be undone. It also deletes
                                the video contents in this section. Are you sure
                                you want to permanently delete this video from
                                our servers?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                >
                                    Delete Video
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];

export default function PublicVideos() {
    useCourseDataInstructor('Public Videos');

    const { videoData, loading } = useAllPublicVideos({ owner: 'me' });

    if (loading || !videoData) return <Skeleton />;

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
