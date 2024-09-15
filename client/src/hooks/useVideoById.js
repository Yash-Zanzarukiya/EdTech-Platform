import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideoById } from "@/app/slices/videoSlice";

function useVideoById(id) {
    const dispatch = useDispatch();

    const { videoData, loading } = useSelector(({ video }) => video);

    useEffect(()=>{
        dispatch(getVideoById(id))
    },[dispatch]);

    return { videoData, loading };
}

export default useVideoById