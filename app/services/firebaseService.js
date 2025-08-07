import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../screens/firebaseConfig';

// ✅ Children Operations - Always include userId
export const addChild = async (childData, userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const docRef = await addDoc(collection(db, 'children'), {
      ...childData,
      userId: userId, // 🔑 KEY: Links child to specific user
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Child added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding child:', error);
    throw error;
  }
};

// ✅ Get ONLY current user's children
export const getAllChildren = async (userId) => {
  console.log('🔍 getAllChildren called with userId:', userId);
  
  try {
    if (!userId) {
      console.error('❌ getAllChildren: No userId provided');
      throw new Error('User ID is required');
    }
    
    const q = query(
      collection(db, 'children'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const children = [];
    querySnapshot.forEach((doc) => {
      children.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return children;
  } catch (error) {
    console.error('❌ getAllChildren error:', error);
    throw error;
  }
};

// ✅ Assessment Operations - Always include userId
export const addAssessment = async (assessmentData) => {
  try {
    if (!assessmentData.userId) {
      throw new Error('User ID is required for assessments');
    }

    const docRef = await addDoc(collection(db, 'assessments'), {
      ...assessmentData,
      completedAt: serverTimestamp(),
    });
    console.log('Assessment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding assessment:', error);
    throw error;
  }
};

// ✅ Get ONLY current user's assessments
export const getAllAssessments = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const q = query(
      collection(db, 'assessments'), 
      where('userId', '==', userId),
      orderBy('completedAt', 'desc') // ✅ Restore after index creation
    );
    const querySnapshot = await getDocs(q);
    
    const assessments = [];
    querySnapshot.forEach((doc) => {
      assessments.push({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate(),
      });
    });
    
    return assessments;
  } catch (error) {
    console.error('Error getting assessments:', error);
    throw error;
  }
};

// ✅ Get user-specific stats
export const getUserStats = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const [childrenSnapshot, assessmentsSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'children'), where('userId', '==', userId))),
      getDocs(query(collection(db, 'assessments'), where('userId', '==', userId)))
    ]);

    return {
      childrenCount: childrenSnapshot.size,
      assessmentCount: assessmentsSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};
