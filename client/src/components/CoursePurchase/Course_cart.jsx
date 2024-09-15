import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import CheckoutForm from './CheckoutForm'; // Import the CheckoutForm
import { PAYMENT_URL } from '@/constant';
import { useNavigate } from 'react-router-dom';
import { addCourse, getCartCourses } from '@/app/slices/purchaseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toastErrorMessage } from '@/utils';

export default function CourseCart() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartData, loading, error } = useSelector((state) => state.purchase);

    useEffect(() => {
        const fetchCartData = async () => {
            setIsLoading(true);
            dispatch(getCartCourses());
            setIsLoading(false);
        };

        fetchCartData();
    }, [dispatch]);

    const handleBuy = (course) => {
        dispatch(addCourse({ courseId: course._id }))
            .then((res) => {
                if (res.payload) {
                    window.open(PAYMENT_URL.URL, '_blank');
                    navigate('/');
                } else {
                    toastErrorMessage('Failed to purchase course.');
                }
            })
            .catch((error) => {
                console.error('Error purchasing course:', error);
                toastErrorMessage(
                    'An error occurred while purchasing the course.'
                );
            });
    };
    const handleCheckoutAll = () => {
        setSelectedCourses(courses); // Select all courses
        setIsCheckoutOpen(true); // Open checkout dialog
    };

    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-start">Your Cart</h1>
            {cartData && cartData.length > 0 ? (
                <div className="flex flex-col gap-8">
                    {cartData.map((item) => (
                        <Card
                            key={item._id}
                            className="flex flex-col md:flex-row items-start transition-all duration-300 hover:shadow-lg overflow-hidden"
                        >
                            <div className="p-4 w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        {item.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 mb-4">
                                        {item.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="mt-4">
                                    <Button
                                        className="w-full"
                                        onClick={() => handleBuy(item.course)}
                                    >
                                        Enroll Now
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                    <Button onClick={handleCheckoutAll} className="mt-4">
                        Checkout All
                    </Button>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}

            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete Your Enrollment</DialogTitle>
                    </DialogHeader>
                    {cartData && cartData.length > 0 && (
                        <CheckoutForm
                            courses={cartData.map((item) => item.course)}
                            onSuccess={() => setIsCheckoutOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
