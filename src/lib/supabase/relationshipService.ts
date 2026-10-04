import { supabase } from './client';

export interface Relationship {
  id: string;
  primary_user_id: string;
  companion_user_id: string;
  status: 'pending' | 'active' | 'revoked';
  profiles?: { display_name: string } | null;
}

// Fetches relationships for the Settings UI (where user is the primary)
export const getRelationships = async (userId: string): Promise<Relationship[]> => {
  const { data, error } = await supabase
    .from('relationships')
    // Utilizes your existing join to fetch the companion's display name
    .select('*, profiles:companion_user_id(display_name)')
    .eq('primary_user_id', userId);

  if (error) {
    console.error('Error fetching relationships:', error);
    return [];
  }
  return data as Relationship[];
};

// Fetches relationships where the user is the companion (For the Companion Dashboard)
export const getCompanionRelationships = async (userId: string): Promise<Relationship[]> => {
  const { data, error } = await supabase
    .from('relationships')
    // Utilizes your existing join to fetch the primary user's display name
    .select('*, profiles:primary_user_id(display_name)')
    .eq('companion_user_id', userId);

  if (error) {
    console.error('Error fetching companion relationships:', error);
    return [];
  }
  return data as Relationship[];
};

// Primary User explicitly authorizes a companion (Replaces requestAccess for RLS compatibility)
export const addCompanion = async (primaryUserId: string, companionUserId: string): Promise<void> => {
  const { error } = await supabase
    .from('relationships')
    .insert([{ 
      primary_user_id: primaryUserId, 
      companion_user_id: companionUserId, 
      status: 'active' 
    }]);

  if (error) throw error;
};

// Primary user revokes access (Replaces updateRelationshipStatus for the Settings UI)
export const revokeCompanionAccess = async (relId: string): Promise<void> => {
  const { error } = await supabase
    .from('relationships')
    .update({ status: 'revoked' })
    .eq('id', relId);

  if (error) throw error;
};

// Enforce 1-to-1 partner rule
export const addCompanionStrict = async (myId: string, friendCode: string) => {
  // 1. Check if they already have an active partner
  const { data: existing, error: checkError } = await supabase
    .from('relationships')
    .select('id')
    .eq('primary_user_id', friendCode)
    .eq('status', 'active');
    
  if (checkError) throw checkError;
  if (existing && existing.length > 0) {
    throw new Error('This Friend Code is already occupied by another partner.');
  }

  // 2. Connect if available
  const { error } = await supabase
    .from('relationships')
    .insert([{ primary_user_id: friendCode, companion_user_id: myId, status: 'active' }]);
    
  if (error) throw error;
};

// Check who is tracking ME
export const getWhoIsTrackingMe = async (myUserId: string) => {
  const { data, error } = await supabase
    .from('relationships')
    .select('id, companion_user_id')
    .eq('primary_user_id', myUserId)
    .eq('status', 'active')
    .maybeSingle(); // Gets one or null
    
  if (error || !data) return null;

  // Get their display name
  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', data.companion_user_id).single();
  return { relationshipId: data.id, partnerName: profile?.display_name || 'Unknown User' };
};

// Revoke access
export const revokeAccess = async (relationshipId: string) => {
  const { error } = await supabase.from('relationships').update({ status: 'revoked' }).eq('id', relationshipId);
  if (error) throw error;
};