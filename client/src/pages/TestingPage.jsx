import React from 'react';
import HeroFormSignUpForm from './Auth/HeroFormSignUpForm';
import { PersonalInfoForm, SetGoal } from '@/components';

function TestingPage() {
    return (
        <>
            <div className="flex items-center justify-center grow">
                <SetGoal />
            </div>
        </>
    );
}

export default TestingPage;
