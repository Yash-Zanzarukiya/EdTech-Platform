import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROFILE_STATUS, ROLE } from '@/constant';
import { useSelector } from 'react-redux';

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const { userData } = useSelector(({ auth }) => auth);

    useEffect(() => {
        if (userData) {
            if (userData?.role === ROLE.ADMIN) {
                navigate('/admin-dashboard');
            } else if (userData?.role === ROLE.USER) {
                if (userData?.profileStatus === PROFILE_STATUS.COMPLETED) {
                    navigate('/user-dashboard');
                } else {
                    navigate('/welcome');
                }
            }
        }
    }, [userData, userData?.role, navigate]);
};

export default useAuthRedirect;
