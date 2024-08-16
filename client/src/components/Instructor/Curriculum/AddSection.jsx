import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SectionForm } from '.';

function AddSection() {
    const [sectionForm, setSectionForm] = useState(false);
    return (
        <div>
            {sectionForm ? (
                <SectionForm cancelAction={() => setSectionForm(false)} />
            ) : (
                <Button
                    onClick={() => setSectionForm(true)}
                    className="w-fit ml-1"
                >
                    Add Section
                </Button>
            )}
        </div>
    );
}

export default AddSection;
