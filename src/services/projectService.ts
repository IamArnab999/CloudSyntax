
import { supabase } from '@/lib/firebase';

interface SaveProjectParams {
  userId: string;
  name: string;
  language: string;
  code: string;
  projectId?: string;
}

export const saveProject = async ({
  userId,
  name,
  language,
  code,
  projectId,
}: SaveProjectParams) => {
  try {
    if (projectId) {
      // Update existing project
      const { error } = await supabase
        .from('projects')
        .update({
          name,
          language,
          code,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', projectId);
        
      if (error) throw error;
      return projectId;
    } else {
      // Create new project
      const projectData = {
        userId,
        name,
        language,
        code,
        createdAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    }
  } catch (error) {
    console.error('Error saving project:', error);
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
      
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        ...data,
      };
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};
