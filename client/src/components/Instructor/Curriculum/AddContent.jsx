import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LectureForm, QuizForm, YTVideoForm } from '.';
import { useSelector } from 'react-redux';
import { Plus, Video } from 'lucide-react';
import { AiFillYoutube, AiOutlineBulb } from 'react-icons/ai';

const States = {
    ADD_CONTENT: 'AddContent',
    CONTENT_OPTIONS: 'ContentOptions',
    LECTURE_FORM: 'LectureForm',
    YT_VIDEO_FORM: 'YTVideoForm',
    QUIZ_FORM: 'QuizForm',
};

function AddContent({ sectionId }) {
    const [state, setState] = useState(States.ADD_CONTENT);
    const { userData } = useSelector(({ auth }) => auth);
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
                    {(userData.role === 'admin' ||
                        userData.username === 'yashpz') && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setState(States.YT_VIDEO_FORM)}
                        >
                            <AiFillYoutube className="size-4 mr-2 text-red-500" />
                            YouTube
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setState(States.LECTURE_FORM)}
                    >
                        <Video className="h-4 w-4 mr-2 text-purple-500" />
                        Lecture
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setState(States.QUIZ_FORM)}
                    >
                        <AiOutlineBulb className="h-4 w-4 mr-1 text-yellow-400" />
                        Quiz
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
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

            {/* YouTube Video Form */}
            {state === States.YT_VIDEO_FORM && (
                <YTVideoForm
                    sectionId={sectionId}
                    cancelAction={() => setState(States.CONTENT_OPTIONS)}
                />
            )}
        </div>
    );
}

export default AddContent;
