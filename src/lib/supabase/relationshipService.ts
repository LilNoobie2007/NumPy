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