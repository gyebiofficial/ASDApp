import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../screens/firebaseConfig';

// ✅ Children Operations - Always include userId
export const addChild = async (childData, userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    // Ensure birthDate is stored as a Firestore timestamp
    const processedChildData = {
      ...childData,
      userId: userId,
      // Convert birthDate to Firestore timestamp if it's a Date object
      birthDate: childData.birthDate instanceof Date 
        ? Timestamp.fromDate(childData.birthDate)
        : Timestamp.fromDate(new Date(childData.birthDate || childData.dateOfBirth)),
      // Store the calculated age data
      ageInMonths: childData.ageInMonths || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    console.log('Saving child data:', processedChildData);
    
    const docRef = await addDoc(collection(db, 'children'), processedChildData);
    console.log('✅ Child added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding child:', error);
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
      where('userId', '==', userId),
      orderBy('createdAt', 'desc') // Most recent children first
    );
    const querySnapshot = await getDocs(q);
    
    // Helper function to calculate current age in months
    const calculateCurrentAgeInMonths = (birthDate) => {
      if (!birthDate) return 0;
      
      let birthDateObj;
      
      if (birthDate.toDate && typeof birthDate.toDate === 'function') {
        birthDateObj = birthDate.toDate();
      } else if (birthDate instanceof Date) {
        birthDateObj = birthDate;
      } else if (typeof birthDate === 'string') {
        birthDateObj = new Date(birthDate);
      } else {
        return 0;
      }
      
      const today = new Date();
      const birthYear = birthDateObj.getFullYear();
      const birthMonth = birthDateObj.getMonth();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      let ageInMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
      
      // Adjust if birthday hasn't occurred this month
      if (today.getDate() < birthDateObj.getDate()) {
        ageInMonths--;
      }
      
      return Math.max(0, ageInMonths);
    };
    
    const children = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Get birth date - prioritize the Firestore timestamp
      const birthDate = data.birthDate || data.dateOfBirth;
      
      // Calculate current age (this updates as time passes)
      const currentAgeInMonths = calculateCurrentAgeInMonths(birthDate);
      
      children.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to Date object
        birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : new Date(birthDate),
        // Use calculated current age (fresh calculation each time)
        ageInMonths: currentAgeInMonths,
        age: currentAgeInMonths, // Alias for milestone tracker
        ageInYears: Math.floor(currentAgeInMonths / 12),
        ageInMonthsRemainder: currentAgeInMonths % 12,
        // Convert other timestamps
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
      });
    });
    
    console.log('✅ Children retrieved with fresh age calculations:', children);
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

// ✅ ADD THIS MISSING FUNCTION
export const deleteChild = async (childId, userId) => {
  try {
    if (!childId) {
      throw new Error('Child ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Delete the child document
    await deleteDoc(doc(db, 'children', childId));
    
    // Optional: Also delete all assessments for this child
    const assessmentsQuery = query(
      collection(db, 'assessments'),
      where('childId', '==', childId),
      where('userId', '==', userId)
    );
    
    const assessmentsSnapshot = await getDocs(assessmentsQuery);
    
    // Delete all assessments for this child
    const deletePromises = assessmentsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    console.log(`Child ${childId} and ${assessmentsSnapshot.size} assessments deleted successfully`);
    
  } catch (error) {
    console.error('Error deleting child:', error);
    throw error;
  }
};

// ✅ ALSO ADD THIS HELPER FUNCTION (optional but useful)
export const getChildAssessments = async (childId, userId) => {
  try {
    if (!childId || !userId) {
      throw new Error('Child ID and User ID are required');
    }
    
    const q = query(
      collection(db, 'assessments'),
      where('childId', '==', childId),
      where('userId', '==', userId),
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
    throw error;
  }
};
