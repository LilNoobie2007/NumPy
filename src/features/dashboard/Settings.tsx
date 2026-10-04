import { useState, useEffect } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { addCompanionStrict, getWhoIsTrackingMe, revokeAccess } from '../../lib/supabase/relationshipService';

export const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [friendCode, setFriendCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track who is viewing MY data
  const [myPartner, setMyPartner] = useState<{relationshipId: string, partnerName: string} | null>(null);

  useEffect(() => {
    if (user) {
      loadMyPartner();
    }
  }, [user]);

  const loadMyPartner = async () => {
    if (!user) return;
    const partner = await getWhoIsTrackingMe(user.id);
    setMyPartner(partner);
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !friendCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addCompanionStrict(user.id, friendCode.trim());
      setFriendCode('');
      alert('Partner connected successfully! Go to the Friends tab to see their data.');
    } catch (error: any) {
      alert(error.message || 'Failed to add partner. Make sure the code is correct.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (!myPartner) return;
    const confirmRevoke = window.confirm(`Are you sure you want to revoke ${myPartner.partnerName}'s access to your data?`);
    if (!confirmRevoke) return;

    try {
      await revokeAccess(myPartner.relationshipId);
      setMyPartner(null);
      alert('Access revoked.');
    } catch (error) {
      alert('Failed to revoke access.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex items-center gap-4 mb-8 max-w-md mx-auto">
        <button onClick={() => navigate('/')} className="text-gray-400 transition-colors hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* Your Code */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-2">My Friend Code</h2>
          <p className="text-xs text-gray-500 mb-3">Share this code with your partner so they can track your progress.</p>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 break-all font-mono text-sm text-gray-800">
            {user?.id}
          </div>
        </div>

        {/* Who is tracking you */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-4">My Partner</h2>
          {myPartner ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Connected</p>
                <p className="text-sm font-medium text-gray-900">{myPartner.partnerName} can view your data.</p>
              </div>
              <button onClick={handleRevoke} className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                Revoke
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No one is currently tracking your data.</p>
          )}
        </div>

        {/* Connect to someone else */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase mb-4">Track a Partner</h2>
          <form onSubmit={handleAddFriend} className="flex gap-2">
            <input 
              type="text" 
              value={friendCode} 
              onChange={(e) => setFriendCode(e.target.value)} 
              placeholder="Paste their Friend Code" 
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 transition-colors border shadow-sm bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};