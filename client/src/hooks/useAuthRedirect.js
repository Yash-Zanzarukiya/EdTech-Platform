import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '@/constant';
import { useSelector } from 'react-redux';

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const { userData } = useSelector(({ auth }) => auth);

    useEffect(() => {
        if (userData) {
            if (userData?.role === ROLE.ADMIN) {
                navigate('/admin-dashboard');
            } else if (userData?.role === ROLE.USER) {
                console.log({ userData });
                navigate('/user-dashboard');
            }
        }
    }, [userData, userData?.role, navigate]);
};

export default useAuthRedirect;
