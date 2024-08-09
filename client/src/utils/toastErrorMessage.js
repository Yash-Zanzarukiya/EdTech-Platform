import React from 'react';
import { toastMessage } from '@/App';

export default function toastErrorMessage(title, error, duration = 3000) {
    console.log('toastErr: ' + error);
    const errMessage = error?.response?.data?.message;
    toastMessage({
        title: title || 'Oops! Something went wrong...',
        description:
            errMessage ||
            'There was a problem with your request. please try again',
        variant: 'destructive',
        duration,
    });
}
