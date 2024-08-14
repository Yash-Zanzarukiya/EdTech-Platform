import { useEffect } from 'react';
import { getAllTopics } from '@/app/slices/topicSlice';
import { useDispatch, useSelector } from 'react-redux';

function useAllTopics() {
    const dispatch = useDispatch();
    const { loading, topicData } = useSelector(({ topic }) => topic);

    useEffect(() => {
        dispatch(getAllTopics());
    }, []);

    return { topicData, topicsLoading: loading };
}

export default useAllTopics;
