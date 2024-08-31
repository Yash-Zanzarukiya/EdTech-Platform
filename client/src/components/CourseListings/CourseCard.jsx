import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import CardHoverContent from './CardHoverContent';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
    return (
        <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild>
                <Link to={`/courses/${course._id}`}>
                    <Card className="w-[250px] rounded-lg">
                        <CardContent className="p-2 pb-2">
                            <img
                                alt={course.name}
                                className="h-36 w-full object-cover rounded-lg"
                                src={course.thumbnail}
                            />
                        </CardContent>
                        <CardFooter className=" justify-between pb-3 px-4">
                            <div className="flex flex-col">
                                <h2 className=" text-md font-bold tracking-tighter ">
                                    {course.name}
                                </h2>
                                <h2 className="text-xs tracking-tighter ">
                                    by {course.owner.fullName}
                                </h2>
                                <h6 className="text-sm">${course.price}</h6>
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-96">
                <CardHoverContent course={course} />
            </HoverCardContent>
        </HoverCard>
    );
}

export default CourseCard;
