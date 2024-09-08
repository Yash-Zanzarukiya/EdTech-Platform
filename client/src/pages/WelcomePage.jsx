import React from 'react';
import { GetStarted, PersonalInfoForm, SetGoal } from '@/components';
import { PROFILE_STATUS } from '@/constant';
import { useSelector } from 'react-redux';

function WelcomePage() {
    const { userData } = useSelector(({ auth }) => auth);

    const stage = userData?.profileStatus || PROFILE_STATUS.PENDING;

    console.log('\nstage: ', stage);
    console.log('status: ', PROFILE_STATUS.PENDING);
    console.log('res: ', stage === PROFILE_STATUS.PENDING);

    return (
        <div className="flex justify-center items-center grow overflow-hidden bg-background">
            {stage === PROFILE_STATUS.PENDING && <PersonalInfoForm firstTime />}
            {stage === PROFILE_STATUS.GOAL && <SetGoal firstTime />}
            {stage === PROFILE_STATUS.COMPLETED && <GetStarted />}
        </div>
    );
}

export default WelcomePage;
