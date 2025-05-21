import React, { useEffect, useState } from 'react';

const Assigning = () => {
  const [advisors, setAdvisors] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [advisorRes, usersRes] = await Promise.all([
          fetch('/api/AuthRoute/approved-advisors', { method: 'GET', credentials: 'include' }),
          fetch('/api/applicationRoute/getApprovedApplicationsForAdmin', { method: 'GET', credentials: 'include' })
        ]);
        const advisorData = await advisorRes.json();
        const usersData = await usersRes.json();

        setAdvisors(advisorData.advisors || []);
        setApprovedUsers(usersData || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    const AdminId = localStorage.getItem('AdminId');
    setError('');
    setMessage('');

    if (!selectedAdvisorId || !selectedUserId || !startDate || !endDate || !AdminId) {
      setError('Please select advisor, student, start date, and end date.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/advisorAssignmentRoute/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          advisorId: selectedAdvisorId,
          userId: selectedUserId,
          AdminId,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Assignment failed');
      setMessage('Advisor assigned successfully!');
      setSelectedAdvisorId('');
      setSelectedUserId('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl space-y-6">
      <h2 className="text-3xl font-bold text-white tracking-wide">🎓 Assign Advisor</h2>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin w-10 h-10 border-4 border-t-blue-500 border-white rounded-full" />
        </div>
      )}

      {!loading && (
        <>
          {/* Advisor Select */}
          <div>
            <label className="block mb-2 text-lg font-medium text-white">Select Advisor</label>
            <select
              className="w-full p-3 rounded-2xl bg-gray-800 text-white border border-gray-600 shadow-lg"
              value={selectedAdvisorId}
              onChange={(e) => setSelectedAdvisorId(e.target.value)}
            >
              <option value="">-- Select Advisor --</option>
              {advisors.map((advisor) => (
                <option key={advisor._id} value={advisor._id}>
                  {advisor.userName} — {advisor.email}
                </option>
              ))}
            </select>
          </div>

          {/* Student Select */}
          <div>
            <label className="block mb-2 text-lg font-medium text-white">Select Approved Student</label>
            <select
              className="w-full p-3 rounded-2xl bg-gray-800 text-white border border-gray-600 shadow-lg"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Select Approved Student --</option>
              {approvedUsers.map((user) => (
                <option key={user.applicantId._id} value={user.applicantId._id}>
                  {user.firstName} {user.lastName} — {user.university}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block mb-2 text-lg font-medium text-white">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-gray-800 text-white border border-gray-600 shadow-lg"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block mb-2 text-lg font-medium text-white">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-gray-800 text-white border border-gray-600 shadow-lg"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleAssign}
            className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-lg py-3 rounded-2xl shadow-md hover:from-cyan-700 hover:to-blue-800 transition-all"
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign Advisor'}
          </button>

          {/* Feedback */}
          {message && <div className="text-green-400 font-medium text-center">{message}</div>}
          {error && <div className="text-red-400 font-medium text-center">{error}</div>}
        </>
      )}
    </div>
  );
};

export default Assigning;
