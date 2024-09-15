import React, { useState } from 'react';
import { CalendarDays, Eye, ShoppingCart, Video } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formate, toastErrorMessage, toastSuccessMessage } from '@/utils';
import { useDispatch } from 'react-redux';
import { addCoursesToCart } from '@/app/slices/purchaseSlice';

function CardHoverContent({ course }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleAddToCart = () => {
        setLoading(true);

        // Change: Pass the course._id directly, no need for an object
        dispatch(addCoursesToCart(course._id))
            .then((res) => {
                if (res.payload) {
                    toastSuccessMessage('Course added to cart successfully...');
                }
            })
            .catch((error) => {
                console.error('Failed to add course to cart', error);
                toastErrorMessage('An error occurred while adding the course.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="space-y-2 w-full">
            <h4 className="text-xl font-semibold">{course.name}</h4>
            <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                <span className="text-xs text-muted-foreground">
                    Updated December 2021
                </span>
            </div>
            <h6 className="text-xs gap-1 font-semibold flex items-center">
                <span className="flex">
                    <Eye className="size-4 mr-1" />{' '}
                    <span>{formate.formateDuration(course.totalDuration)}</span>
                </span>
                {' · '}
                <span className="flex">
                    <span>
                        {course.totalVideos} video
                        {course.totalVideos > 1 && 's'}
                    </span>
                </span>
            </h6>
            <div className="flex gap-1 flex-wrap">
                {course.topics.map((topic) => (
                    <Badge variant="secondary" className="rounded-full">
                        {topic.name}
                    </Badge>
                ))}
            </div>
            <p className=" text-xs line-clamp-3">{course.description}</p>
            <div className="flex justify-between items-center">
                <Button className="text-xs px-3 py-1">
                    <ShoppingCart className="size-[14px] mr-2" />
                    <Button
                        className="text-xs px-3 py-1"
                        onClick={handleAddToCart}
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Adding...</span>
                        ) : (
                            <>
                                <ShoppingCart className="size-[14px] mr-2" />
                                <span>Buy</span>
                            </>
                        )}
                    </Button>
                </Button>
            </div>
        </div>
    );
}

export default CardHoverContent;
