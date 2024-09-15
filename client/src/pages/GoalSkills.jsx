import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { useUserGoals } from '@/hooks';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { topics } from '@/app/slices/quizSlice';

export default function GoalSkills() {
    const { goalId } = useParams();
    const { goals, loading } = useUserGoals(goalId);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = (topic) => {
        dispatch(topics({ topicsData: [topic.name] }));
        navigate(`/quiz`);
    };

    if (loading || !goals?.length) return <div>Loading...</div>;

    return (
        <div className="pt-10 flex items-start justify-center">
            <Card className="w-full max-w-xl mx-auto">
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle className="text-3xl font-semibold tracking-tight">
                            Goal Skills
                        </CardTitle>
                        <CardDescription>
                            Give a test to improve your Skills.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">
                                    Topic
                                </TableHead>
                                <TableHead className="text-center">
                                    Skill Tests
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goals[0].topics?.map((topic) => (
                                <TableRow key={topic.id}>
                                    <TableCell className="flex gap-1 justify-center text-center">
                                        <Badge
                                            key={topic._id}
                                            className="rounded-md py-2 px-3"
                                        >
                                            {topic.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-center">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleClick(topic)}
                                        >
                                            Take Test
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
