import React, { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { checkUsername } from '@/app/slices/authSlice';

function useUniqueUsername() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);
    const [debouncedUsername, setDebouncedUsername] = useDebounceValue(
        username,
        500
    );

    useEffect(() => {
        const checkUsernameUnique = async () => {
            setIsUsernameChecking(true);
            setUsernameMessage('');

            const response = await checkUsername(username);
            setUsernameMessage(response.message);
            setIsUsernameAvailable(response.isAvailable);

            setIsUsernameChecking(false);
        };
        if (username?.length >= 2) checkUsernameUnique();
        else setUsernameMessage('');
    }, [debouncedUsername]);

    return {
        username,
        usernameMessage,
        isUsernameAvailable,
        isUsernameChecking,
        debouncedUsername,
        setUsername,
    };
}

export { useUniqueUsername };
