import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiArrowLeft, FiX } from 'react-icons/fi';

const Journal = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingJournal, setEditingJournal] = useState(null);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [date, setDate] = useState(''); 

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

    const fetchJournals = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (difficulty) params.difficulty = difficulty;
            if (date) params.date = date;  
            const res = await API.get('/journal', { params });
            setJournals(res.data);
        } catch (error) {
            toast.error('Failed to load journals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [search, difficulty, date]); 

   
    const clearFilters = () => {
        setSearch('');
        setDifficulty('');
        setDate('');
    };

    const onSubmit = async (data) => {
        try {
            if (editingJournal) {
                await API.put(`/journal/${editingJournal._id}`, data);
                toast.success('Entry updated!');
            } else {
                await API.post('/journal', data);
                toast.success('Entry added!');
            }
            reset();
            setShowForm(false);
            setEditingJournal(null);
            fetchJournals();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (journal) => {
        setEditingJournal(journal);
        setValue('topicName', journal.topicName);
        setValue('description', journal.description);
        setValue('studyDuration', journal.studyDuration);
        setValue('difficultyLevel', journal.difficultyLevel);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this entry?')) return;
        try {
            await API.delete(`/journal/${id}`);
            toast.success('Entry deleted');
            fetchJournals();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingJournal(null);
        reset();
    };

    
    const activeFilters = [search, difficulty, date].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50">

            
            <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
                    <FiArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-indigo-600">My Journal</h1>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8">

                
                {!showForm && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            <FiPlus size={18} />
                            Add Entry
                        </button>
                    </div>
                )}

                
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">
                            {editingJournal ? 'Edit Entry' : 'New Entry'}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React Hooks"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    {...register('topicName', { required: 'Topic is required' })}
                                />
                                {errors.topicName && <p className="text-red-500 text-sm mt-1">{errors.topicName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="What did you learn today?"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Study Duration (hours)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        {...register('studyDuration', { required: 'Duration is required' })}
                                    />
                                    {errors.studyDuration && <p className="text-red-500 text-sm mt-1">{errors.studyDuration.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        {...register('difficultyLevel', { required: 'Difficulty is required' })}
                                    >
                                        <option value="">Select</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    {errors.difficultyLevel && <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel.message}</p>}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : editingJournal ? 'Update' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

                    
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search topics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        
                        {activeFilters > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                            >
                                <FiX size={16} />
                                Clear ({activeFilters})
                            </button>
                        )}
                    </div>

                    
                    <div className="grid grid-cols-2 gap-3">

                        
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                                Difficulty
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                            >
                                <option value="">All Levels</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                                Filter by Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                            />
                        </div>

                    </div>

                   
                    {activeFilters > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                            {search && (
                                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                                    Search: {search}
                                    <button onClick={() => setSearch('')}>
                                        <FiX size={12} />
                                    </button>
                                </span>
                            )}
                            {difficulty && (
                                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                                    Level: {difficulty}
                                    <button onClick={() => setDifficulty('')}>
                                        <FiX size={12} />
                                    </button>
                                </span>
                            )}
                            {date && (
                                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                                    Date: {date}
                                    <button onClick={() => setDate('')}>
                                        <FiX size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                </div>

                
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : journals.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 mb-2">No entries found.</p>
                        {activeFilters > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-indigo-600 text-sm font-medium hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {journals.map((journal) => (
                            <div key={journal._id} className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg">{journal.topicName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                journal.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-700' :
                                                journal.difficultyLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {journal.difficultyLevel}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{journal.description}</p>
                                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                                            <span>⏱ {journal.studyDuration} hours</span>
                                            <span>📅 {new Date(journal.createdAt).toLocaleDateString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(journal)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                        >
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(journal._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Journal;