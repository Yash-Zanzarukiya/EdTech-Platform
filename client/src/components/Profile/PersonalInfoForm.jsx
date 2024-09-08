import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/app/slices/authSlice';
import { useCustomForm } from '@/hooks';
import { userProfileSchema } from '@/schema';
import { PROFILE_STATUS } from '@/constant';

function PersonalInfoForm({ firstTime = false }) {
    const dispatch = useDispatch();
    const { userData, loading } = useSelector(({ auth }) => auth);

    const form = useCustomForm(userProfileSchema, {
        email: userData?.email || '',
        fullName: userData?.fullName || '',
        university: userData?.university || '',
        gradYear: userData?.gradYear || 2000,
        branch: userData?.branch || '',
        bio: userData?.bio || '',
        avatar: '',
    });

    function onSubmit(data) {
        dispatch(
            updateUserProfile({
                ...data,
                avatar: true,
                profileStatus: firstTime
                    ? PROFILE_STATUS.GOAL
                    : PROFILE_STATUS.COMPLETED,
            })
        );
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
                    <div className="size-10 bg-primary mr-2 rounded-full text-primary-foreground">
                        <img
                            className="rounded-full"
                            src="https://ui.shadcn.com/avatars/04.png"
                            alt="Image Description"
                        />
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
                        <div className="grid grid-cols-2 gap-4">
                            {/* FULL NAME */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter full name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                        </div>
                        {/* UNIVERSITY */}
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your University's name"
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
                                        <FormLabel>Stream</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your main Stream"
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

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-fit tracking-tight font-semibold"
                        >
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

export default PersonalInfoForm;
