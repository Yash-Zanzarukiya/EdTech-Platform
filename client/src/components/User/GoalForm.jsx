import React from 'react';
import { SetGoal } from '..';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function GoalForm() {
    const { goalId } = useParams();
    const { goals } = useSelector((state) => state.auth.userData);

    let goal = null;

    if (goalId !== 'new') {
        goal = goals?.find((goal) => goal._id === goalId);
    }

    return (
        <div className={'flex items-start justify-center grow'}>
            <SetGoal goal={goal} />
        </div>
    );
}

export default GoalForm;
