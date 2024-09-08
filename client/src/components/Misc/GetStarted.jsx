import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function GetStarted() {
    return (
        <div className="flex justify-center items-center bg-background">
            <div className="text-center">
                <section className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        You Have All Set !!!
                    </h1>
                    <p className="text-lg mb-4">
                        We are excited to have you on board.
                    </p>
                    <p className="text-lg mb-4">
                        Get ready to embark on an amazing learning journey.
                    </p>
                </section>

                <section className="mb-8">
                    <Button variant="outline" asChild>
                        <Link
                            to="/user-dashboard"
                            className="text-white font-bold"
                        >
                            Let's Get Started
                        </Link>
                    </Button>
                </section>
            </div>
        </div>
    );
}

export default GetStarted;
