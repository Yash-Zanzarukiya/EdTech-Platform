import { Button } from '@/components/ui/button';
import { useLearnerCourse } from '@/hooks';
import { Clock, GraduationCap, Star, Play, Users, Globe } from 'lucide-react';
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { Section } from '@/components/Instructor/Curriculum';
import { formate } from '@/utils';

export default function Course() {
    const { courseId, videoId } = useParams();
    const { courseData, loading } = useLearnerCourse(courseId);

    console.log(courseData);

    if (!courseData || loading) return <div>Loading...</div>;

    if (courseData.sections.length == 0) return <div>No videos found</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                    {courseData.name}
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    {courseData.description}
                                </p>
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="flex items-center">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <Star className="h-4 w-4 fill-muted stroke-muted-foreground" />
                                    </span>
                                    <span className="font-medium">4.6</span>
                                    <span className="text-muted-foreground">
                                        (145,780 ratings)
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    730,782 students
                                </p>
                                <div className="flex items-center space-x-2 text-sm">
                                    <span>
                                        Created by {courseData.owner.fullName}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Last updated 5/2020</span>
                                    <Globe className="h-4 w-4 ml-2" />
                                    <span>English, Arabic [Auto], 14 more</span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                                    <img
                                        src={courseData.thumbnail}
                                        className="object-fill"
                                    />
                                </div>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <span className="text-3xl font-bold">
                                                    ₹{courseData.price}
                                                </span>
                                                <span className="text-sm text-muted-foreground line-through ml-2">
                                                    ₹4,499
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                86% off
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground mb-4">
                                            <Clock className="inline h-4 w-4 mr-1" />
                                            9 hours left at this price!
                                        </div>
                                        <Button className="w-full mb-2">
                                            Buy now
                                        </Button>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            Add to cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            Course Details
                        </h2>
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 mt-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Duration
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        12 weeks
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        3 hours per week
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Certificate
                                    </CardTitle>
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        Yes
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upon successful completion
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 mt-8">
                            Topic covered in course
                        </h2>
                        <div className="flex gap-3 text-3xl">
                            {courseData.topics.map((topic) => (
                                <Badge key={topic._id}>{topic.name}</Badge>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            Meet Your Instructor
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <img
                                src={courseData.owner.avatar}
                                width={200}
                                height={200}
                                alt="Instructor"
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="text-2xl font-bold tracking-wide">
                                    {courseData.owner.fullName}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Senior Web Developer with 10+ years of
                                    experience
                                </p>
                                <p>{courseData.owner.bio}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            Curriculum Overview
                        </h2>
                        {courseData.sections.map((section) => (
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>
                                        {section.name}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        Tatal videos : {section.videos.length}{' '}
                                        Total duration :{' '}
                                        {formate.formateDuration(
                                            section.totalDuration
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            Pricing
                        </h2>
                        <Card className="max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle>Full Course Access</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold mb-4">
                                    ₹{courseData.price}
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Badge
                                            variant="secondary"
                                            className="mr-2"
                                        >
                                            ✓
                                        </Badge>
                                        12 weeks of intensive training
                                    </li>
                                    <li className="flex items-center">
                                        <Badge
                                            variant="secondary"
                                            className="mr-2"
                                        >
                                            ✓
                                        </Badge>
                                        Live weekly Q&A sessions
                                    </li>
                                    <li className="flex items-center">
                                        <Badge
                                            variant="secondary"
                                            className="mr-2"
                                        >
                                            ✓
                                        </Badge>
                                        Access to course community
                                    </li>
                                    <li className="flex items-center">
                                        <Badge
                                            variant="secondary"
                                            className="mr-2"
                                        >
                                            ✓
                                        </Badge>
                                        Certificate upon completion
                                    </li>
                                </ul>
                                <Button className="w-full mt-6">
                                    Enroll Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            What Our Students Say
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alex Johnson</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    "This course was a game-changer for me. The
                                    practical projects and mentor support helped
                                    me land my dream job!"
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Samantha Lee</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    "As a designer, I wanted to understand the
                                    development process better. This course
                                    exceeded my expectations!"
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Michael Chen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    "The skills I learned here allowed me to
                                    build the MVP for my startup. Highly
                                    recommended for entrepreneurs!"
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
                            Contact Us
                        </h2>
                        <form className="max-w-md mx-auto space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Name
                                </label>
                                <Input id="name" placeholder="Your name" />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Your email"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Your message"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Ready to Start Your Learning Journey?
                                </h2>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Enroll now and take the first step towards
                                    your dream job.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button size="lg">Enroll Now</Button>
                                <Button variant="outline" size="lg">
                                    Download Syllabus
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
