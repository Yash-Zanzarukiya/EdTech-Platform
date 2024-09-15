import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '@/app/slices/videoSlice';
import { VIDEO_STATUS } from '@/constant';

function useAllPublicVideos(options) {
    const dispatch = useDispatch();

    const { videoData, loading } = useSelector((state) => state.video);

    useEffect(() => {
        dispatch(getAllVideos({ status: VIDEO_STATUS.PUBLIC, ...options }));
    }, [dispatch]);

    return { videoData, loading };
}

export default useAllPublicVideos;
