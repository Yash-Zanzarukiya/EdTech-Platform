import { useEffect } from 'react';
import { getAllTopics } from '@/app/slices/topicSlice';
import { useDispatch, useSelector } from 'react-redux';

function useAllTopics() {
    const dispatch = useDispatch();
    const { loading, topicData } = useSelector(({ topic }) => topic);

    useEffect(() => {
        dispatch(getAllTopics());
    }, []);

    const topicsNames = [];
    const topicsIds = [];

    topicData?.forEach((topic) => {
        topicsNames.push(topic.name);
        topicsIds.push(topic._id);
    });

    return { topicData, topicsNames, topicsIds, topicsLoading: loading };
}

export default useAllTopics;
