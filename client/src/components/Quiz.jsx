'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { toastErrorMessage } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Quiz() {
    const [quizData, setQuizData] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tabSwitchCount, setTabSwitchCount] = useState(0); // For counting tab switches
    const [disqualified, setDisqualified] = useState(false);

    const navigate = useNavigate();
    const topics = useSelector((state) => state.quiz.topicsData);
    useEffect(() => {
        fetchQuizData();
        document.addEventListener('visibilitychange', handleTabSwitch);

        return () => {
            document.removeEventListener('visibilitychange', handleTabSwitch);
        };
    }, []);

    const fetchQuizData = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/quiz',
                { topics }
            );
            console.log(response.data.data);
            if (response.data.success) {
                setQuizData(response.data.data);
                setAnswers(new Array(response.data.data.length).fill(null));
                setLoading(false);
            } else {
                console.error('Failed to fetch quiz data');
            }
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    };

    const handleAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        let newScore = 0;
        answers.forEach((answer, index) => {
            if (answer === quizData[index].answer) {
                newScore++;
            }
        });
        setScore(newScore);
        setQuizCompleted(true);
    };

    const handleTabSwitch = () => {
        if (document.visibilityState === 'hidden') {
            setTabSwitchCount((prevCount) => {
                const newCount = prevCount + 1;

                if (newCount === 1) {
                    toastErrorMessage("Warning: You will be disqualified if you switch tabs again.")
                } else if (newCount === 2) {
                    toastErrorMessage("Final Warning: One more tab switch and you will be disqualified.")
                } else if (newCount > 2) {
                    navigate("/disqualified")
                    setDisqualified(true); // Disqualify the user
                }

                return newCount;
            });
        }
    };

    const passPercentage = 75;
    const finalScore = (score / quizData.length) * 100;
    const passed = finalScore >= passPercentage;

    const renderResult = () => (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mb-2">
                Your score: {score}/{quizData.length} ({finalScore.toFixed(2)}%)
            </p>
            <p
                className={`text-2xl font-bold ${
                    passed ? 'text-green-600' : 'text-red-600'
                }`}
            >
                {passed
                    ? 'Congratulations! You passed the exam.'
                    : 'Sorry, you did not pass the exam.'}
            </p>
            <p className="mt-4 text-gray-600">
                {passed
                    ? `Great job! You've demonstrated a solid understanding of the material.`
                    : `Don't worry! Review the material and try again. You need ${passPercentage}% to pass.`}
            </p>
        </div>
    );

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    if (disqualified) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600">
                    You have been disqualified for switching tabs multiple times.
                </h2>
                <p className="mt-4 text-gray-600">Please contact the administrator if you have any issues.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-2xl">Exam Quiz</CardTitle>
                    {!quizCompleted && (
                        <CardDescription className="text-primary-foreground/80">
                            Question {currentQuestion + 1} of {quizData.length}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="pt-6">
                    {!quizCompleted ? (
                        <>
                            <Progress
                                value={
                                    (currentQuestion / quizData.length) * 100
                                }
                                className="mb-6"
                            />
                            <h2 className="text-xl font-semibold mb-4">
                                {quizData[currentQuestion].question}
                            </h2>
                            <RadioGroup
                                value={answers[currentQuestion]?.toString()}
                                onValueChange={(value) =>
                                    handleAnswer(parseInt(value))
                                }
                            >
                                {quizData[currentQuestion].options.map(
                                    (option, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 mb-4 p-3 rounded-lg transition-colors hover:bg-secondary"
                                        >
                                            <RadioGroupItem
                                                value={index.toString()}
                                                id={`option-${index}`}
                                                className="border-2"
                                            />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="flex-grow cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        </>
                    ) : (
                        renderResult()
                    )}
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-secondary">
                    {!quizCompleted ? (
                        <>
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="bg-primary hover:bg-primary/90 mt-2"
                            >
                                Previous
                            </Button>
                            {currentQuestion === quizData.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={answers.some(
                                        (answer) => answer === null
                                    )}
                                    className="bg-primary hover:bg-primary/90 mt-2"
                                >
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    disabled={answers[currentQuestion] === null}
                                    className="bg-primary hover:bg-primary/90 mt-2"
                                >
                                    Next
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-primary/90 mx-auto mt-2"
                        >
                            Recommend a course
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
