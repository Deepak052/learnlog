import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { FiMail } from 'react-icons/fi';

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [isRegistered, setIsRegistered] = useState(false);
    const [sentTo, setSentTo] = useState('');

    const onSubmit = async (data) => {
        try {
            await API.post('/auth/register', data);
            setSentTo(data.email);
            setIsRegistered(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };


    if (isRegistered) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
                    <p className="text-gray-500 mb-1">Aapka account successfully ban gaya hai:</p>
                    <p className="text-indigo-600 font-medium mb-6">{sentTo}</p>
                    <p className="text-gray-400 text-sm mb-6">
                        Aap ab directly login kar sakte hain.
                    </p>
                    <Link
                        to="/login"
                        className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Login Page Pe Jao
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-600">LearnLog</h1>
                    <p className="text-gray-500 mt-2">Create your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Rahul Sharma"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

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
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Minimum 6 characters' }
                            })}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;