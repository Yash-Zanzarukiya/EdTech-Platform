import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MultiSelect from '@/components/ui/MultiSelect';
import { useDispatch, useSelector } from 'react-redux';
import {
    createGoal,
    updateGoal,
    updateUserProfile,
} from '@/app/slices/authSlice';
import { PROFILE_STATUS } from '@/constant';
import { useAllTopics, useUserGoals } from '@/hooks';
import { Goal, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';

function SetGoal({ firstTime = false, goal }) {
    const { goalId } = useParams();
    useUserGoals(goalId);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const topicsRef = useRef();
    const nameRef = useRef();

    const { loading } = useSelector((state) => state.auth);
    const { topicsNames: allTopics } = useAllTopics();

    const [DEFAULTS, setDEFAULTS] = useState([]);

    useEffect(() => {
        if (!goal) return;
        const def = goal.topics?.map((topic) => topic.name) || [];
        setDEFAULTS(() => def);
        if (nameRef.current) nameRef.current.value = goal.name;
    }, [goal]);

    const handleSubmit = () => {
        if (goal) updateUserGoal();
        else setGoal();
    };

    function setGoal() {
        if (firstTime) updateProfileStatus();
        const topics = topicsRef.current.getSelectedValues().join(',');
        const name = nameRef.current.value;
        const data = { name, topics };
        dispatch(createGoal(data)).then(() => navigate('/goals'));
    }

    function updateUserGoal() {
        console.log('updateUserGoal');
        const topics = topicsRef.current.getSelectedValues().join(',');
        const name = nameRef.current.value;
        const data = { name, topics };

        dispatch(updateGoal({ goalId: goal._id, data })).then(() =>
            navigate('/goals')
        );
    }

    function updateProfileStatus() {
        dispatch(
            updateUserProfile({ profileStatus: PROFILE_STATUS.COMPLETED })
        );
    }

    return (
        <div className="w-full max-w-3xl p-4 rounded-2xl border shadow-md">
            <Card x-chunk="dashboard-04-chunk-1" className="p-8 pb-4">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold flex">
                        <span>{firstTime ? 'Set Goal' : 'Set a New Goal'}</span>
                        <Goal className="size-8 ml-2" />
                    </CardTitle>
                    <CardDescription>
                        {firstTime
                            ? 'Set Your First Learning Goal to Start with...'
                            : 'Set Your Learning Goal to Start with...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <Label>Goal name</Label>
                            <Input
                                ref={nameRef}
                                className="max-w-xs"
                                placeholder="Name Your Goal"
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label>Topics to learn</Label>
                            <MultiSelect
                                ref={topicsRef}
                                OPTIONS={allTopics}
                                DEFAULTS={DEFAULTS}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-fit"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                please wait...
                            </>
                        ) : (
                            'Save goal'
                        )}
                    </Button>
                    {firstTime && (
                        <Button
                            disabled={loading}
                            onClick={() => updateProfileStatus()}
                            variant="outline"
                            className="w-fit"
                        >
                            Skip for now
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

export default SetGoal;
