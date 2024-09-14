import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserGoals } from '@/app/slices/authSlice';

function useUserGoals(goalId) {
    const dispatch = useDispatch();

    const { goals, loading } = useSelector(({ auth }) => auth.userData);

    useEffect(() => {
        if (!goals) dispatch(getUserGoals(goalId));
    }, []);

    return { goals, loading };
}

export default useUserGoals;
