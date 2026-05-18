import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await API.post(`/auth/reset-password/${token}`, {
                newPassword: data.newPassword
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Link expire ho gaya ya invalid hai');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle size={36} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Password Reset Ho Gaya! ✅
                    </h2>
                    <p className="text-gray-500 mb-6">
                        3 seconds mein login page pe redirect ho rahe hain...
                    </p>
                    <Link
                        to="/login"
                        className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        Abhi Login Karo
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
                        <FiLock size={28} className="text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">New Password Set Karo</h1>
                    <p className="text-gray-500 mt-2 text-sm">Apna naya strong password daalo</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
                                {...register('newPassword', {
                                    required: 'Password required hai',
                                    minLength: { value: 6, message: 'Minimum 6 characters' }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
                                {...register('confirmPassword', {
                                    required: 'Confirm password required hai',
                                    validate: (val) =>
                                        val === watch('newPassword') || 'Passwords match nahi kar rahe'
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Reset ho raha hai...' : 'Reset Password'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ResetPassword;