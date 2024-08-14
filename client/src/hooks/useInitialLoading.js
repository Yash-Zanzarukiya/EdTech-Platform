import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from '@/app/slices/authSlice';
import { healthCheck } from '@/app/slices/healthSlice';

function useInitialLoading() {
    const dispatch = useDispatch();
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        dispatch(healthCheck()).then(() => {
            dispatch(getUser()).then(() => {
                setInitialLoading(false);
            });
        });
    }, [dispatch]);

    return initialLoading;
}

export default useInitialLoading;
