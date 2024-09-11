import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPublicVideos } from '@/app/slices/videoSlice';

function useAllPublicVideos() {
    const dispatch = useDispatch();

    const { videoData, loading } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getAllPublicVideos());
    }, [dispatch]);

    return { videoData, loading };
}

export default useAllPublicVideos;
