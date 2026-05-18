import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const verified = searchParams.get('verified');
        const error = searchParams.get('error');

        if (verified === 'true') {
            toast.success('Email verified! Ab login karo 🎉');
        } else if (error === 'invalid_token') {
            toast.error('Verification link invalid ya expire ho chuka hai.');
        }

        if (verified || error) {
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    const onSubmit = async (data) => {
        try {
            const res = await API.post('/auth/login', data);
            login(res.data);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';

            
            if (msg === 'Please verify your email first') {
                toast.error('Pehle email verify karo! Inbox check karo 📧');
            } else {
                toast.error(msg);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-600">LearnLog</h1>
                    <p className="text-gray-500 mt-2">Welcome back!</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="rahul@gmail.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;