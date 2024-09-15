import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { useUserGoals } from '@/hooks';
import { useDispatch } from 'react-redux';
import { deleteGoal } from '@/app/slices/authSlice';
import { Badge } from '@/components/ui/badge';

export default function UserGoals() {
    const { goals } = useUserGoals();
    const dispatch = useDispatch();

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    const handleDelete = () => {
        setDeleteConfirmOpen(false);
        dispatch(deleteGoal(goalToDelete));
    };

    return (
        <div className="pt-10 flex items-start justify-center">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle className="text-3xl font-semibold tracking-tight">
                            Goal Tracking
                        </CardTitle>
                        <CardDescription>
                            Track your progress on various goals.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-2">
                        <Link to="new">Start New Goal</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Goal Name</TableHead>
                                <TableHead>Topics</TableHead>
                                <TableHead className="text-center">
                                    Progress
                                </TableHead>
                                <TableHead className="text-center">
                                    Learn
                                </TableHead>
                                <TableHead className="text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals?.map((goal) => (
                                <TableRow key={goal.id}>
                                    <TableCell className="font-medium">
                                        <Link to={`/goals/${goal._id}`}>
                                            {goal.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="flex gap-1 w-fit">
                                        {goal.topics.map((topic) => (
                                            <Badge
                                                key={topic._id}
                                                className="rounded-full"
                                            >
                                                {topic.name}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={goal.progress}
                                                className="w-[80%]"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {goal.progress}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button size="sm">Let's Go</Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="small"
                                                    >
                                                        <Link
                                                            to={`/goals/${goal._id}`}
                                                        >
                                                            <span className="flex">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                <span>
                                                                    Edit
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setGoalToDelete(
                                                            goal._id
                                                        );
                                                        setDeleteConfirmOpen(
                                                            true
                                                        );
                                                    }}
                                                    className="text-red-600 flex items-center justify-center"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <AlertDialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the goal from your list.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    );
}
