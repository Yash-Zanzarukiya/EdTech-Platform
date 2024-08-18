import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function Analytics() {
    const { setRouteName } = useOutletContext();

    useEffect(() => {
        setRouteName('Analytics');
    }, [setRouteName]);

    return <div>Analytics</div>;
}

export default Analytics;
