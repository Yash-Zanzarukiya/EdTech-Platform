import React from 'react';

const CircularProgress = ({ value = 60, max = 100, size = 15 }) => {
    const circumference = 2 * Math.PI * size;
    const progress = ((max - value) / max) * circumference;

    return (
        <div className="flex size-10 items-center justify-center mt-[1px]">
            <svg className="size-full transform rotate-[-90deg]">
                <circle
                    className="text-muted-foreground/20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r={size}
                    cx="50%"
                    cy="50%"
                />
                <circle
                    className="text-accent-foreground"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={size}
                    cx="50%"
                    cy="50%"
                />
            </svg>
            <div className="absolute flex items-center justify-center">
                <span className="text-[10px] font-semibold tracking-tighter">
                    {value}%
                </span>
            </div>
        </div>
    );
};

export default CircularProgress;
