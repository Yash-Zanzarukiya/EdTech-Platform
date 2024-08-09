import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { signInSchema } from '@/schema';
import { useAuthRedirect, useCustomForm } from '@/hooks';
import { APP_NAME } from '@/constant';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '@/app/slices/authSlice';

function SignIn() {
    const { status } = useSelector(({ auth }) => auth);

    useAuthRedirect();

    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useCustomForm(signInSchema, {
        identifier: '',
        password: '',
    });

    async function onSubmit(values) {
        setIsSubmitting(() => true);
        dispatch(signIn(values)).then(() => setIsSubmitting(() => false));
    }

    return (
        <div className="flex justify-center items-center grow overflow-hidden bg-gradient-to-r from-gray-700 to-black">
            <div className="w-full max-w-xl p-8 px-10 pt-10 space-y-6 bg-white rounded-lg shadow-md">
                {/* Headers */}
                <div className="text-center">
                    <h1 className="mb-6">
                        <span className="text-4xl font-extrabold tracking-tighter lg:text-5xl">
                            Welcome Back In
                            <br />
                        </span>
                        <Link
                            to={'/'}
                            className={`text-4xl font-bold tracking-tighter lg:text-5xl lg:text-[2.65rem]`}
                        >
                            {APP_NAME}
                        </Link>
                    </h1>
                    <p className="mb-4">
                        Sign in to continue your secret conversations
                    </p>
                </div>
                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 px-6"
                    >
                        {/* identifier */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your username or email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="show-password"
                                    onClick={() => {
                                        setShowPassword((pre) => !pre);
                                    }}
                                />
                                <Label
                                    htmlFor="show-password"
                                    className=" cursor-pointer"
                                >
                                    Show Password
                                </Label>
                            </div>
                        </div>
                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Sign-up */}
                <div className="text-center">
                    <p>
                        Not a member yet?{' '}
                        <Link
                            to="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign-up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
