'use client';

import React from 'react';
import useRole from '../hooks/useRole';
import { ROLE } from '@/constant';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const withRoleProtection = (Component, allowedRoles) => {
    return (props) => {
        const { userData } = useSelector(({ auth }) => auth);
        const isAuthorized = useRole(allowedRoles);
        const navigate = useNavigate();

        React.useEffect(() => {
            if (!userData || !userData?.role) {
                navigate('/sign-in');
            } else if (!isAuthorized && userData?.role === ROLE.USER) {
                navigate('/user-dashboard');
            } else if (!isAuthorized && userData?.role === ROLE.ADMIN) {
                navigate('/admin-dashboard');
            }
        }, [userData, userData?.role, isAuthorized, navigate]);

        if (!userData || !userData?.role || !isAuthorized) {
            return null;
        }

        return <Component {...props} />;
    };
};

export default withRoleProtection;
