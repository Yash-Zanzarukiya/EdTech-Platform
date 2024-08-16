import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { LectureForm } from '.';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

function Lecture({ lecture, sectionId }) {
    return (
        <Card>
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
                            <AccordionContent className="mt-2">
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
