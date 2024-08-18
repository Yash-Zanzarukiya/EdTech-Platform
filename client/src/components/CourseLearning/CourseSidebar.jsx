import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formate } from '@/utils';

function CourseSidebar({ sections = [], activeSection, activeVideo }) {
    return (
        <div className="border bg-background py-1 px-1">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <div className="mt-2 grid gap-[2px] border-b">
                {sections.map((section, index) => (
                    <Accordion type="single" collapsible>
                        <AccordionItem value="section-1">
                            <AccordionTrigger
                                className={`${
                                    section._id === activeSection._id &&
                                    'bg-muted'
                                } p-2 hover:bg-muted/60 hover:no-underline`}
                            >
                                <div className="flex flex-col w-full text-accent-foreground">
                                    <span className="flex items-center gap-1">
                                        <span>Section {index + 1} :</span>
                                        <strong>{section.name}</strong>
                                    </span>
                                    <span className=" flex text-sm text-left gap-2 place-items-center text-accent-foreground">
                                        <span className="flex w-fit items-center gap-2 text-muted-foreground">
                                            <VideoIcon className="h-4 w-4" />
                                            <span>
                                                0 / {section.videos.length}
                                            </span>
                                            <span>&#8209;</span>
                                        </span>
                                        <span className="flex w-fit items-center gap-1 text-muted-foreground">
                                            <Eye className="h-4 w-4" />
                                            <span>
                                                {formate.formateDuration(
                                                    section.totalDuration
                                                )}
                                            </span>
                                        </span>
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-muted/20 p-0 pt-[2px] grid gap-[2px]">
                                {section.videos.map((video, index) => (
                                    <div
                                        className={`${
                                            video._id === activeVideo._id &&
                                            'bg-muted/80'
                                        } p-1 border-b rounded hover:bg-muted/60`}
                                    >
                                        <Link to={`${video._id}`}>
                                            <div className="flex items-center rounded-md px-2 py-3 text-sm font-medium text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        defaultChecked={false}
                                                    />
                                                    <span>
                                                        {index + 1}.{' '}
                                                        {video.title}
                                                    </span>
                                                </div>
                                                <div className="flex ml-auto items-center gap-2 text-muted-foreground">
                                                    <VideoIcon className="h-4 w-4" />
                                                    <span>
                                                        {formate.formateDuration(
                                                            video.duration
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
        </div>
    );
}

export default CourseSidebar;
