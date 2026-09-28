import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getRelationships, addCompanion, revokeCompanionAccess, type Relationship } from '../../lib/supabase/relationshipService';

export const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [companionId, setCompanionId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadRelationships();
  }, [user]);

  const loadRelationships = async () => {
    if (!user) return;
    const data = await getRelationships(user.id);
    setRelationships(data);
    setLoading(false);
  };

  const handleAddCompanion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !companionId) return;
    try {
      await addCompanion(user.id, companionId);
      setCompanionId('');
      loadRelationships();
      alert('Companion added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add companion. Check if the ID is correct.');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this companion?')) return;
    try {
      await revokeCompanionAccess(id);
      loadRelationships();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading Settings...</div>;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-5 bg-white shadow-sm">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings & Privacy</h1>
      </header>

      <main className="max-w-md p-6 mx-auto space-y-6">
        
        {/* Friend Code Section */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Your Friend Code</h2>
          <p className="mb-4 text-sm text-gray-500">Share this ID with someone so they can invite you as a companion.</p>
          <code className="block p-3 text-xs bg-gray-100 rounded-lg select-all break-all">
            {user?.id}
          </code>
        </div>

        {/* Add Companion Section */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Add a Companion</h2>
          <p className="mb-4 text-sm text-gray-500">Enter a user's Friend Code to let them view your daily tracking data.</p>
          <form onSubmit={handleAddCompanion} className="flex gap-2">
            <input 
              type="text" 
              value={companionId} 
              onChange={(e) => setCompanionId(e.target.value)} 
              placeholder="Paste Friend Code..." 
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              required 
            />
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Add</button>
          </form>
        </div>

        {/* Manage Companions Section */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Authorized Companions</h2>
          {relationships.length === 0 ? (
            <p className="text-sm text-gray-500">You have not authorized anyone to view your data.</p>
          ) : (
            <div className="space-y-3">
              {relationships.map((rel) => (
                <div key={rel.id} className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{rel.profiles?.display_name || rel.companion_user_id}</p>
                    <span className={`text-xs font-semibold ${rel.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {rel.status.toUpperCase()}
                    </span>
                  </div>
                  {rel.status === 'active' && (
                    <button onClick={() => handleRevoke(rel.id)} className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};