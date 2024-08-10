import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/app/slices/authSlice';

function PersonalInfoForm() {
    const dispatch = useDispatch();
    const { userData, loading } = useSelector(({ auth }) => auth);

    const form = useForm({
        defaultValues: {
            email: userData?.email || '',
            fullName: userData?.fullName || '',
            university: userData?.university || '',
            gradYear: userData?.gradYear || '',
            branch: userData?.branch || '',
            bio: userData?.bio || '',
            avatar: '',
        },
    });

    function onSubmit(data) {
        dispatch(updateUserProfile(data));
    }

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <CardTitle className="text-xl">
                            Complete your profile
                        </CardTitle>
                        <CardDescription>
                            Fill out the details below to set up your account.
                        </CardDescription>
                    </div>
                    <div className="bg-primary rounded-full p-2 text-primary-foreground">
                        <SparkleIcon className="w-6 h-6" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        id="personal-info-form"
                        encType="multipart/form-data"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-x-4 gap-y-3"
                    >
                        {/* EMAIL */}
                        <FormField
                            control={form.control}
                            name="email"
                            disabled
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* FULL NAME */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* UNIVERSITY */}
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your university name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {/* BRANCH */}
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter branch name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* GRADUATION YEAR */}
                            <FormField
                                control={form.control}
                                name="gradYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Graduation Year</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* AVATAR */}
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* BIO */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write down something about yourself"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Profile'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function SparkleIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    );
}

export default PersonalInfoForm;
