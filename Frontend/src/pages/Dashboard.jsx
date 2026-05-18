import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiClock, FiTrendingUp, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await API.get('/dashboard');
                setStats(res.data);
            } catch (error) {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-indigo-600">LearnLog</h1>
                <div className="flex items-center gap-4">
                    <Link to="/journal" className="text-gray-600 hover:text-indigo-600 font-medium">
                        Journal
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-indigo-600">
                        <FiUser size={20} />
                    </Link>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
                        <FiLogOut size={20} />
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">

                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name}! 
                    </h2>
                    <p className="text-gray-500 mt-1">Here's your learning summary</p>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <FiBook className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Entries</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.totalEntries || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <FiClock className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Hours</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.totalHours || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <FiTrendingUp className="text-yellow-600" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">This Week</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.weeklyEntries || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FiClock className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Weekly Hours</p>
                            <p className="text-2xl font-bold text-gray-800">{stats?.weeklyHours || 0}</p>
                        </div>
                    </div>

                </div>

               
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Recent Entries</h3>
                        <Link
                            to="/journal"
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                        >
                            <FiPlus size={16} />
                            Add Entry
                        </Link>
                    </div>

                    {stats?.recentEntries?.length === 0 ? (
                        <div className="text-center py-12">
                            <FiBook size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No entries yet. Start learning!</p>
                            <Link
                                to="/journal"
                                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Add First Entry
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats?.recentEntries?.map((entry) => (
                                <div key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{entry.topicName}</p>
                                        <p className="text-sm text-gray-500">{entry.studyDuration} hours</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        entry.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-700' :
                                        entry.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {entry.difficultyLevel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;