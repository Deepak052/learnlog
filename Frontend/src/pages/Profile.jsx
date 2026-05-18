import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiUser, FiCamera } from 'react-icons/fi';

const Profile = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [photoPreview, setPhotoPreview] = useState(
        user?.photo ? `http://localhost:3000${user.photo}` : null
    );
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { register: regProfile, handleSubmit: handleProfile, formState: { isSubmitting: savingProfile } } = useForm({
        defaultValues: { name: user?.name, email: user?.email }
    });

    const { register: regPassword, handleSubmit: handlePassword, reset: resetPassword, formState: { isSubmitting: savingPassword } } = useForm();

    
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview dikhao
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };


    const handlePhotoUpload = async () => {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            toast.error('Pehle photo select karo');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        try {
            const res = await API.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            login(res.data);
            toast.success('Photo updated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };


    const onUpdateProfile = async (data) => {
        try {
            const res = await API.put('/auth/profile', data);
            login(res.data);
            toast.success('Profile updated!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };


    const onChangePassword = async (data) => {
        try {
            await API.put('/auth/change-password', data);
            toast.success('Password changed!');
            resetPassword();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                    <FiArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-indigo-600">Profile</h1>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-8">

                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-6">

                        
                        <div className="relative">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FiUser size={36} className="text-indigo-600" />
                                )}
                            </div>

                            
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition"
                            >
                                <FiCamera size={14} />
                            </button>

                           
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>

                        
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
                            <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
                            <button
                                onClick={handlePhotoUpload}
                                disabled={uploading}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                        </div>

                    </div>
                </div>

                
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-5 py-2.5 rounded-lg font-medium transition ${
                            activeTab === 'profile'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-5 py-2.5 rounded-lg font-medium transition ${
                            activeTab === 'password'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Change Password
                    </button>
                </div>

                
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleProfile(onUpdateProfile)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...regProfile('name', { required: true })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...regProfile('email', { required: true })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                
                {activeTab === 'password' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handlePassword(onChangePassword)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...regPassword('currentPassword', { required: true })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...regPassword('newPassword', { required: true, minLength: 6 })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {savingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;