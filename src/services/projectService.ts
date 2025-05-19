
import { supabase } from '@/integrations/supabase/client';

interface SaveProjectParams {
  userId: string;
  name: string;
  language: string;
  code: string;
  projectId?: string;
}

export const getProjects = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('userid', userId)
      .order('createdat', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const saveProject = async ({ userId, name, language, code, projectId }: SaveProjectParams) => {
  try {
    let id = projectId;

    if (projectId) {
      // Update existing project
      const { error } = await supabase
        .from('projects')
        .update({
          name,
          language,
          code,
          updatedat: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;
    } else {
      // Create new project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          userid: userId,
          name,
          language,
          code,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      id = data.id;
    }

    return id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
