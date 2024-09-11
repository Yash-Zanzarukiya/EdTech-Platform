import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import SectionVideoComponent from './SectionVideoComponent';
import SectionComponent from './SectionComponent';

function CourseSidebar({ sections = [], activeSection, activeVideo }) {
    return (
        <div className="max-h-full border bg-background py-1 px-1">
            <h2 className="text-2xl font-bold px-3 py-1">Course Content</h2>
            <div className="mt-2 grid gap-[2px] ">
                {sections.map((section, index) => {
                    const isActiveSection = section._id === activeSection._id;
                    return (
                        <Accordion
                            type="single"
                            collapsible
                            className={`${
                                isActiveSection &&
                                'border border-accent-foreground'
                            }   `}
                        >
                            <AccordionItem value="section-1">
                                <AccordionTrigger
                                    className={`p-2 hover:bg-muted/60 hover:no-underline border-b`}
                                >
                                    <SectionComponent
                                        key={section._id}
                                        section={section}
                                        order={index + 1}
                                        isActive={isActiveSection}
                                    />
                                </AccordionTrigger>
                                <AccordionContent
                                    className={`${
                                        isActiveSection &&
                                        'border-t border-muted-foreground/30'
                                    } bg-muted/20 p-0 pt-[2px] grid gap-[2px]`}
                                >
                                    {section.videos.map((video, index) => (
                                        <SectionVideoComponent
                                            key={video._id}
                                            video={video}
                                            order={index + 1}
                                            isActive={
                                                video._id === activeVideo._id
                                            }
                                        />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                })}
            </div>
        </div>
    );
}

export default CourseSidebar;
