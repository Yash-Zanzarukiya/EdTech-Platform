import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { PAYMENT_URL } from '@/constant';

export default function CheckoutForm({ courses, totalPrice, onSuccess }) {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsProcessing(true);

        onSuccess();
        window.href.location = PAYMENT_URL.URL;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Selected Courses:</h3>
                {courses.map((course) => (
                    <div key={course.id} className="mb-2">
                        <p className="text-sm font-bold">{course.name}</p>
                        <p className="text-sm text-gray-600">
                            {course.description}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                            ${course.price.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input
                        id="card"
                        placeholder="1234 5678 9012 3456"
                        required
                    />
                </div>
            </div>
            <div className="font-bold text-lg mt-6 mb-4 text-primary">
                Total: ${totalPrice.toFixed(2)}
            </div>
            <DialogFooter>
                <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                >
                    {isProcessing ? 'Processing...' : 'Complete Enrollment'}
                </Button>
            </DialogFooter>
        </form>
    );
}
