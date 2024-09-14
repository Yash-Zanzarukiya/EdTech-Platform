import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { getUserGoals } from '@/app/slices/authSlice';
import GoalRow from './GoalRow';

export default function DashboardGoalsCard() {
    const { goals } = useSelector((state) => state.auth.userData);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserGoals());
    }, []);

    const handleDeleteGoal = (goalId) => {};

    return (
        <Card className="xl:col-span-1" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Your Goals</CardTitle>
                    <CardDescription>Set and track your goals.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/goals">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Goal</TableHead>
                            <TableHead className="text-center">
                                Progress
                            </TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goals?.length ? (
                            goals.map((goal) => (
                                <GoalRow key={goal._id} goal={goal} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan="3"
                                    className="text-center pt-6"
                                >
                                    No Goals Set Yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
