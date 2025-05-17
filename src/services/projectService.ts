
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        name,
        language,
        code,
        updatedAt: new Date(),
      });
      return projectId;
    } else {
      // Create new project
      const projectData = {
        userId,
        name,
        language,
        code,
        createdAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return {
        id: projectSnap.id,
        ...projectSnap.data(),
      };
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};
