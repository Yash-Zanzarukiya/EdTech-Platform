import React, { useRef } from 'react';
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
import { updateUserProfile } from '@/app/slices/authSlice';
import { PROFILE_STATUS } from '@/constant';
import { useAllTopics } from '@/hooks';
import { Goal, Loader2 } from 'lucide-react';

function SetGoal({ firstTime = false }) {
    const dispatch = useDispatch();
    const topicsRef = useRef();

    const { loading } = useSelector(({ auth }) => auth);

    const { topicsNames: allTopics } = useAllTopics();

    function onSubmit() {
        if (firstTime) updateProfileStatus();
        const data = topicsRef.current.getSelectedValues();
        console.log(data);
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
                        <span>{firstTime ? 'Set Goal' : 'Set New Goal'}</span>
                        <Goal className="size-8 ml-2" />
                    </CardTitle>
                    <CardDescription>
                        {firstTime
                            ? 'Set Your First Learning Goal to Start with...'
                            : 'Set Your Learning Goal to Start with...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MultiSelect
                        ref={topicsRef}
                        OPTIONS={allTopics}
                        DEFAULTS={[]}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4 gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        onClick={() => onSubmit()}
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
