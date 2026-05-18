import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [sentTo, setSentTo] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await API.post('/auth/forgot-password', data);
            setSentTo(data.email);
            setEmailSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Kuch galat ho gaya');
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail size={32} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Email send</h2>
                    <p className="text-gray-500 mb-1">Reset link send</p>
                    <p className="text-indigo-600 font-medium mb-4">{sentTo}</p>
                    <p className="text-gray-400 text-sm mb-6">
                        Check Inbox <strong>Reset Password</strong> button pe click karo.
                        Link <strong>15 minutes</strong> mein expire ho jayega.
                    </p>
                    <Link
                        to="/login"
                        className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Go to Login Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMail size={28} className="text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Email daalo — reset link bhej denge
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="rahul@gmail.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('email', { required: 'Email required hai' })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Bhej rahe hain...' : 'Reset Link Bhejo'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 text-sm"
                    >
                        <FiArrowLeft size={16} />
                        Login pe wapas jao
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;