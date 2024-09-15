import { Link } from 'react-router-dom';

export default function OrderSuccessful() {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-green-500">
                Enrollment Successful!
            </h1>
            <p className="text-lg mb-8">
                Thank you for enrolling in the course. We have sent you a confirmation email with the course details.
            </p>
            <Link to="/" className="text-primary font-bold underline">
                Go back to the Home Page
            </Link>
        </div>
    );
}
