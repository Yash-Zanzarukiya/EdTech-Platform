import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';

export default function VideoCard({video}) {
    return (
        <Link to={`/`}>
            <Card className="w-[250px] h-[250px] rounded-lg flex flex-col ">
                <CardContent className="p-2 pb-2">
                    <img
                        alt={video.name}
                        className="h-36 w-full object-cover rounded-lg"
                        src={video.thumbnail}
                    />
                </CardContent>
                <CardFooter className="pb-3 px-4">
                    <div className="flex flex-col">
                        <h2 className=" text-md font-bold tracking-tighter ">
                            {video.title}
                        </h2>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
