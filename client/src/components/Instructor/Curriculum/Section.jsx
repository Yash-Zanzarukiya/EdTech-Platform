import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from './SectionHeader';
import { AddContent, Lecture } from '.';

function Section({ section }) {
    return (
        <Card>
            <SectionHeader section={section} />
            <CardContent className="flex flex-col gap-y-2">
                {section?.videos?.map((lecture, index) => (
                    <Lecture
                        key={lecture._id}
                        sectionId={section._id}
                        lecture={{ ...lecture, order: index + 1 }}
                    />
                ))}
                <AddContent sectionId={section._id} />
            </CardContent>
        </Card>
    );
}

export default Section;
