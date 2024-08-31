import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FileIcon } from 'lucide-react';
import { CourseSidebar } from '..';

const tabList = [
    { label: 'Course Content', value: 'courseContent', className: 'lg:hidden' },
    { label: 'Description', value: 'description' },
    { label: 'Comments', value: 'comments' },
    { label: 'Resources', value: 'resources' },
];

// FIXME : Fix sidebar

function CourseTabsSection({ courseData, activeSection, activeVideo }) {
    return (
        <div className="p-4">
            <Tabs defaultValue="description">
                <TabsList>
                    {tabList.map((tab, index) => (
                        <TabsTrigger
                            key={index}
                            value={tab.value}
                            className={tab.className}
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="courseContent">
                    <CourseSidebar
                        sections={courseData.sections}
                        activeSection={activeSection}
                        activeVideo={activeVideo}
                    />
                </TabsContent>
                <TabsContent value="description">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">
                            Introduction to Web Development
                        </h2>
                        <p>
                            In this course, you'll learn the fundamentals of web
                            development, including HTML, CSS, and JavaScript.
                            We'll cover the basics of building a website from
                            scratch, including creating a responsive layout,
                            adding interactivity, and deploying your site.
                        </p>
                    </div>
                </TabsContent>
                <TabsContent value="comments">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Comments</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarImage
                                        src="/placeholder-user.jpg"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>AC</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            @iamwillpursell
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                            5 months ago
                                        </div>
                                    </div>
                                    <div>
                                        I really love the ecosystem Vercel is
                                        creating. The way each component can be
                                        added and modified with ease really
                                        makes these tools attractive.
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarImage
                                        src="/placeholder-user.jpg"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>AC</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            @HackSoft
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                            2 months ago
                                        </div>
                                    </div>
                                    <div>
                                        We are more than excited to leverage all
                                        the new stuff, building better products
                                        for our clients ✨
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarImage
                                        src="/placeholder-user.jpg"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>AC</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            @greed7513
                                        </div>
                                        <div className="text-muted-foreground text-xs">
                                            6 days ago
                                        </div>
                                    </div>
                                    <div>
                                        does anyone know which monospace are
                                        they using when showing code?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="resources">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Resources</h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-5 w-5" />
                                <a
                                    href="#"
                                    className="text-primary hover:underline hover:text-primary/80"
                                >
                                    HTML Cheatsheet
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-5 w-5" />
                                <a
                                    href="#"
                                    className="text-primary hover:underline hover:text-primary/80"
                                >
                                    CSS Fundamentals
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-5 w-5" />
                                <a
                                    href="#"
                                    className="text-primary hover:underline hover:text-primary/80"
                                >
                                    JavaScript Essentials
                                </a>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default CourseTabsSection;
