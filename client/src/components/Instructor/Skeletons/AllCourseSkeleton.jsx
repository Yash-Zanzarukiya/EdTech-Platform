import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

function AllCourseSkeleton() {
    const numberOfSkeletonRows = 5;
    return (
        <>
            {Array(numberOfSkeletonRows)
                .fill()
                .map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="hidden sm:table-cell">
                            {/* THUMBNAIL */}
                            <Skeleton className="aspect-square rounded-md size-16" />
                        </TableCell>
                        <TableCell className="font-medium">
                            {/* NAME */}
                            <Skeleton className="h-5 w-[250px]" />
                        </TableCell>
                        <TableCell>
                            {/* STATUS */}
                            <Skeleton className="h-6 w-16" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {/* PRICE */}
                            <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {/* ENROLLMENTS */}
                            <Skeleton className="h-5 w-12" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {/* CREATION DATE */}
                            <Skeleton className="h-5 w-36" />
                        </TableCell>
                        <TableCell>
                            {/* ACTIONS */}
                            <Skeleton className="h-3 w-6" />
                        </TableCell>
                    </TableRow>
                ))}
        </>
    );
}

export default AllCourseSkeleton;
