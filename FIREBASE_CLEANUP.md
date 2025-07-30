# Firebase User Cleanup Guide

## 1. Delete All Firebase Users

### Option A: Firebase Console (Recommended)
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Authentication** → **Users**
4. Select all users and delete them
5. This will clean up all existing user data

### Option B: Firebase CLI (Bulk Delete)
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Delete all users (run in terminal)
firebase auth:export users.json --project your-project-id
firebase auth:import users.json --project your-project-id --hash-algo SCRYPT --hash-key="" --salt-separator="" --rounds=8 --mem-cost=14 --delete-existing-users
```

### Option C: Firebase Admin SDK (Programmatic)
```javascript
// Delete all users programmatically
const admin = require('firebase-admin');

async function deleteAllUsers() {
  const listUsers = await admin.auth().listUsers();
  const uids = listUsers.users.map(user => user.uid);
  
  if (uids.length > 0) {
    await admin.auth().deleteUsers(uids);
    console.log(`Deleted ${uids.length} users`);
  }
}
```

## 2. Clean Firebase Realtime Database

1. Go to **Realtime Database** in Firebase Console
2. Delete all data under `/users` node
3. This removes all stored user profiles

## 3. Update Application Configuration

The app is already configured to:
- ✅ Use Firebase for authentication only
- ✅ Store all user data in Supabase
- ✅ No more Firebase user profiles

## 4. Verify Clean State

After cleanup:
- Firebase Authentication: Empty user list
- Firebase Database: No user data
- Supabase: Will be the single source of truth

## 5. Fresh Start Benefits

- **Single Database**: All users in Supabase only
- **Better Analytics**: Centralized user tracking
- **Consistent Data**: No sync issues between systems
- **Easier Management**: One place for all user data

## Next Steps

1. Delete Firebase users using preferred method above
2. All new signups will create users in Supabase only
3. Existing localStorage data will be migrated to Supabase on next login
4. Clean, fresh start with better architecture!