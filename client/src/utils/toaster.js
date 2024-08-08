import { useToast } from '@/components/ui/use-toast';

export const toast = (title) => {
    const { toast } = useToast();
    toast({
        title: title || 'Something went wrong...',
        duration: 2000,
    });
};
