import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { LectureForm } from '.';

function Lecture({ lecture, sectionId }) {
    return (
        <Card className="bg-muted/5">
            <CardHeader className="p-4">
                <CardTitle>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                            value={lecture._id}
                            className="border-transparent"
                        >
                            <AccordionTrigger className="p-0 text-sm">
                                Lecture {lecture?.order} :{' '}
                                {lecture?.title || 'Default Name'}
                            </AccordionTrigger>
                            <AccordionContent className="mt-4">
                                <LectureForm
                                    lecture={lecture}
                                    sectionId={sectionId}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

export default Lecture;
