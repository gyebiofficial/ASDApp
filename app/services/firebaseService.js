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
import { handleFirebaseError } from '../utils/networkUtils';

// Children CRUD Operations
export const addChild = async (childData) => {
  try {
    const docRef = await addDoc(collection(db, 'children'), {
      ...childData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Child added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding child:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const getAllChildren = async () => {
  try {
    const q = query(collection(db, 'children'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const children = [];
    querySnapshot.forEach((doc) => {
      children.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to readable format
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      });
    });
    
    return children;
  } catch (error) {
    console.error('Error getting children:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const deleteChild = async (childId) => {
  try {
    await deleteDoc(doc(db, 'children', childId));
    
    // Also delete all assessments for this child
    const assessmentsQuery = query(
      collection(db, 'assessments'),
      where('childId', '==', childId)
    );
    const assessmentsSnapshot = await getDocs(assessmentsQuery);
    
    const deletePromises = assessmentsSnapshot.docs.map(assessmentDoc => 
      deleteDoc(doc(db, 'assessments', assessmentDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log('Child and assessments deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting child:', error);
    handleFirebaseError(error);
    throw error;
  }
};

// Assessment CRUD Operations
export const addAssessment = async (assessmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'assessments'), {
      ...assessmentData,
      completedAt: serverTimestamp(),
    });
    console.log('Assessment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding assessment:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const getChildAssessments = async (childId) => {
  try {
    const q = query(
      collection(db, 'assessments'),
      where('childId', '==', childId),
      orderBy('completedAt', 'desc')
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
    console.error('Error getting child assessments:', error);
    handleFirebaseError(error);
    throw error;
  }
};

export const getAllAssessments = async () => {
  try {
    const q = query(collection(db, 'assessments'), orderBy('completedAt', 'desc'));
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
    console.error('Error getting all assessments:', error);
    handleFirebaseError(error);
    throw error;
  }
};