// import { UserProfile } from "@clerk/clerk-react";
// import { View } from "react-native";

// export default function UserProfilePage() {
//   return (
//     <View style={{ flex: 1 }}>
//       <UserProfile />
//     </View>
//   );
// }
// import { useUser } from '@clerk/clerk-expo';
// import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
// import { useEffect, useState } from 'react';

// export default function UserProfileScreen() {
//   const { user, isLoaded } = useUser();
//   const [name, setName] = useState('');

//   // ✅ Use useEffect to safely set initial name after user loads
//   useEffect(() => {
//     if (isLoaded && user && !name) {
//       const fullName = user.fullName || '';
//       setName(fullName);
//     }
//   }, [isLoaded, user]);

//   const handleUpdate = async () => {
//     if (!user) return alert('User not loaded');

//     const [firstName, ...lastNameParts] = name.trim().split(' ');
//     const lastName = lastNameParts.join(' ');

//     try {
//       await user.update({
//         firstName: firstName || '',
//         lastName: lastName || '',
//       });
//       alert('Profile updated!');
//     } catch (err) {
//       console.error(err);
//       alert('Update failed');
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//         <Text>Loading Profile...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Full Name</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
//       />
//       <Button title="Update Profile" onPress={handleUpdate} />
//     </View>
//   );
// }
import { useUser } from '@clerk/clerk-expo';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      const fullName = user.fullName || '';
      setName(fullName);
    }
  }, [isLoaded, user]);

  const handleUpdate = async () => {
    if (!user) return;

    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    try {
      await user.update({
        firstName: firstName || '',
        lastName: lastName || '',
      });
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Update failed');
    }
  };

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Full Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
};

export default UserProfilePage;
