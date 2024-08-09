import { toastMessage } from '@/App';

export default function toastSuccessMessage(title, response, duration = 2000) {
    const message = response?.data?.message;
    toastMessage({
        title: title || 'Success...',
        description: message || '',
        duration,
    });
}
