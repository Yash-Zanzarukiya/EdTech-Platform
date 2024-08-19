import React from 'react';
import { Link } from 'react-router-dom';

function About() {
    const contributors = [
        {
            name: 'Yash Zanzarukiya',
            gitProfile: 'https://github.com/Yash-Zanzarukiya',
        },
        {
            name: 'Alpesh Baria',
            gitProfile: 'https://github.com/Yash-Zanzarukiya',
        },
        {
            name: 'Nikunj Navdiya',
            gitProfile: 'https://github.com/Yash-Zanzarukiya',
        },
        {
            name: 'Harsh Vaghamshi',
            gitProfile: 'https://github.com/Yash-Zanzarukiya',
        },
        // Add more contributors here
    ];

    return (
        <div className="flex flex-col items-center justify-center">
            <section className="bg-background py-8 border mt-24 rounded">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-4">About</h1>
                    <p className="text-lg text-gray-700">
                        Welcome to our project! Here you can find information
                        about the contributors who have made this project
                        possible.
                    </p>
                </div>

                <section className="py-8">
                    <div className="container mx-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            Contributors
                        </h2>
                        <ul className="contributors-list flex flex-col gap-y-1">
                            {contributors.map((contributor, index) => (
                                <li key={contributor.name} className="text-lg">
                                    <Link
                                        to={contributor.gitProfile}
                                        className="text-blue-500 hover:underline flex gap-x-1 items-center"
                                    >
                                        <span className="size-6">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="black"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.88 8.14 6.86 9.45.5.09.68-.22.68-.48v-1.68c-2.8.61-3.39-1.35-3.39-1.35-.46-1.17-1.13-1.48-1.13-1.48-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.91 1.56 2.39 1.11 2.98.85.09-.66.35-1.11.64-1.36-2.24-.25-4.6-1.12-4.6-4.96 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0112 6.77c.85 0 1.7.12 2.5.35 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.41.1 2.66.64.69 1.03 1.6 1.03 2.7 0 3.85-2.36 4.7-4.6 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.57.69.48C19.12 20.14 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
                                            </svg>
                                        </span>
                                        <span className="mr-2">
                                            {contributor.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </section>
        </div>
    );
}

export default About;
