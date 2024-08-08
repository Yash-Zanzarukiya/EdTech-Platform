import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { signUpSchema } from '@/schema';
import { useAuthRedirect, useCustomForm } from '@/hooks';
import { APP_NAME } from '@/constant';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { signUp } from '@/app/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    useAuthRedirect();
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const form = useCustomForm(signUpSchema, {
        name: '',
        email: '',
        password: '',
    });

    async function onSubmit(values) {
        const { email, password, name } = values;

        setIsSubmitting(true);
        dispatch(signUp({ email, password, name })).then((res) =>
            navigate('/sign-in')
        );
        setIsSubmitting(false);
    }

    return (
        <div className="flex font-Inter justify-center items-center grow bg-gradient-to-r from-gray-700 to-black">
            <div className="w-full max-w-xl p-8 pt-10 space-y-6 bg-white rounded-lg shadow-md">
                {/* Headers */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tighter lg:text-5xl mb-4">
                        Join
                        <Link
                            to={'/'}
                            className={` text-4xl lg:text-[2.6rem] tracking-tighter font-bold ml-2`}
                        >
                            {APP_NAME}
                        </Link>
                    </h1>
                    <p>Sign up to start your adventure with us</p>
                </div>
                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 px-6"
                    >
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    {/* Input field */}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }}
                                            placeholder="Enter your full name"
                                        />
                                    </FormControl>
                                    {/* Unique username check response */}
                                    {/* <FormDescription>
                                        {isUsernameChecking ? (
                                            <Loader2 className=" animate-spin" />
                                        ) : (
                                            username &&
                                            usernameMessage && (
                                                <p
                                                    className={`text-sm ${
                                                        usernameMessage ===
                                                        'Username is available'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                    }`}
                                                >
                                                    {usernameMessage}
                                                </p>
                                            )
                                        )}
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
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
                                            placeholder="Create your password"
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
                                    Show Password{' '}
                                </Label>
                            </div>
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isUsernameAvailable}
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Sign In */}
                <div className="text-center mt-2">
                    <p>
                        Already a member?{' '}
                        <Link
                            to="/sign-in"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
