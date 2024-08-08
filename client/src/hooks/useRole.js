import { useSelector } from 'react-redux';

const useRole = (allowedRoles) => {
    const { userData } = useSelector(({ auth }) => auth);

    if (
        !userData ||
        !userData?.role ||
        !allowedRoles.includes(userData?.role)
    ) {
        return false;
    }
    return true;
};

export default useRole;
