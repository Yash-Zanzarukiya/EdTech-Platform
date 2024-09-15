import { useState } from 'react';
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
import CheckoutForm from "./CheckoutForm" // Import the CheckoutForm
import { PAYMENT_URL } from '@/constant';
import { useNavigate } from 'react-router-dom';

// Sample course data
const courses = [
    {
        id: 1,
        name: 'JavaScript Basics',
        description: 'Learn the fundamentals of JavaScript programming.',
        price: 29.99,
        image: '/placeholder.svg?height=200&width=300',
        duration: '4 weeks',
        level: 'Beginner',
    },
    {
        id: 2,
        name: 'React Fundamentals',
        description:
            'Master the basics of building user interfaces with React.',
        price: 49.99,
        image: '/placeholder.svg?height=200&width=300',
        duration: '6 weeks',
        level: 'Intermediate',
    },
    {
        id: 3,
        name: 'Node.js Essentials',
        description: 'Dive into server-side JavaScript with Node.js.',
        price: 39.99,
        image: '/placeholder.svg?height=200&width=300',
        duration: '5 weeks',
        level: 'Intermediate',
    },
];

export default function CourseCart() {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const navigate = useNavigate();
    const handleBuy = () => {
        window.open(PAYMENT_URL.URL, '_blank');
        navigate("/")
    };

    const handleCheckoutAll = () => {
        setSelectedCourses(courses); // Select all courses
        setIsCheckoutOpen(true); // Open checkout dialog
    };


    const totalPrice = selectedCourses.reduce(
        (total, course) => total + course.price,
        0
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-start">Your Cart</h1>
            <div className="flex flex-col gap-8">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        className="flex flex-col md:flex-row items-start transition-all duration-300 hover:shadow-lg overflow-hidden"
                    >
                        <div className="p-4 w-full">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {course.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 mb-4">
                                    {course.description}
                                </p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{course.duration}</span>
                                    <span>{course.level}</span>
                                </div>
                                <p className="font-bold text-lg mt-4 text-primary">
                                    ${course.price.toFixed(2)}
                                </p>
                            </CardContent>
                            <CardFooter className="mt-4">
                                <Button
                                    className="w-full"
                                    onClick={() => handleBuy(course)}
                                >
                                    Enroll Now
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <Button
                    className="w-full md:w-1/2 lg:w-1/4"
                    onClick={handleCheckoutAll}
                >
                    Checkout All
                </Button>
            </div>

            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complete Your Enrollment</DialogTitle>
                    </DialogHeader>
                    {selectedCourses.length > 0 && (
                        <CheckoutForm
                            courses={selectedCourses}
                            totalPrice={totalPrice}
                            onSuccess={() => setIsCheckoutOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
