import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, PlusIcon } from 'lucide-react';
import { LectureForm, QuizForm } from '.';

const States = {
    ADD_CONTENT: 'AddContent',
    CONTENT_OPTIONS: 'ContentOptions',
    LECTURE_FORM: 'LectureForm',
    QUIZ_FORM: 'QuizForm',
};

function AddContent({ sectionId }) {
    const [state, setState] = useState(States.ADD_CONTENT);

    return (
        <div>
            {/* Add content */}
            {state === States.ADD_CONTENT && (
                <Button
                    className="w-fit"
                    size="sm"
                    onClick={() => setState(States.CONTENT_OPTIONS)}
                >
                    <Plus className="size-4 mr-1" />
                    <span>Add Content</span>
                </Button>
            )}

            {/* Content options */}
            {state === States.CONTENT_OPTIONS && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setState(States.LECTURE_FORM)}
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Lecture
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setState(States.QUIZ_FORM)}
                    >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Quiz
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => setState(States.ADD_CONTENT)}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {/* Lecture Form */}
            {state === States.LECTURE_FORM && (
                <LectureForm
                    sectionId={sectionId}
                    cancelAction={() => setState(States.CONTENT_OPTIONS)}
                />
            )}

            {/* Quiz Form */}
            {state === States.QUIZ_FORM && (
                <QuizForm
                    sectionId={sectionId}
                    cancelAction={() => setState(States.CONTENT_OPTIONS)}
                />
            )}
        </div>
    );
}

export default AddContent;
