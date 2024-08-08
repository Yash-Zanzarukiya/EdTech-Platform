import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FirstLoading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-500" />
                <p className="text-gray-500">Littile bit of patience please... Magic is happening</p>
            </div>
        </div>
    )
}

export default FirstLoading
