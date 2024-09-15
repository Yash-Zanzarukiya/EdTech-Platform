import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '@/app/slices/videoSlice';

function useAllVideos({ ...options }) {
    const dispatch = useDispatch();

    const { videoData = [], loading = false } = useSelector((state) => state.video || {});

    useEffect(() => {
        dispatch(getAllVideos({ ...options }));
    }, [dispatch]);

    return { videoData, loading };
}

export default useAllVideos;
