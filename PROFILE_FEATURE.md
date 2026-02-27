# Profile Management Feature

## 🎯 Overview

Users can now edit their profile, change password, and upload a profile picture.

## ✨ Features

### Profile Tab
- **Profile Picture**: Upload, change, or remove profile photo
- **Name**: Update display name
- **Email**: Change email address
- **Phone Number**: Add/update phone number (optional)
- **Bio**: Add personal description (optional)

### Password Tab
- **Current Password**: Verify identity
- **New Password**: Set new password (min 6 characters)
- **Confirm Password**: Confirm new password

## 🚀 How to Access

### From Dashboard
1. Click on your name in the header (top right)
2. Or visit: `/dashboard/profile`

### Direct Link
- URL: `https://amanah.app/dashboard/profile`

## 📸 Profile Picture

### Upload
- Click "Upload Photo" button
- Select image file (JPG, PNG, GIF)
- Max size: 2MB
- Image is stored as base64 in localStorage

### Change
- Click "Change Photo" to replace existing photo
- Select new image

### Remove
- Click "Remove Photo" to delete profile picture
- Fallback: Shows first letter of name in colored circle

## 🔐 Security

### Password Change
1. Enter current password (for verification)
2. Enter new password (min 6 characters)
3. Confirm new password
4. Submit

### Validation
- Current password must be correct
- New passwords must match
- New password must be at least 6 characters

## 💾 Data Storage

Currently using localStorage:

### Profile Data
```typescript
// Basic info (in amanah_users)
{
  id: string,
  email: string,
  name: string,
  password: string,
  createdAt: string
}

// Extended profile (in amanah_user_profiles)
{
  [userId]: {
    phone: string,
    bio: string,
    avatar: string (base64)
  }
}
```

### Storage Keys
- `amanah_users` - User accounts
- `amanah_user_profiles` - Extended profile data
- `amanah_current_user` - Current session

## 🌍 Multi-Language Support

All profile UI is translated:
- English
- Swedish (Svenska)
- Arabic (العربية) with RTL support

### Translation Keys
- `profile` - Profile
- `editProfile` - Edit Profile
- `profileSettings` - Profile Settings
- `personalInfo` - Personal Information
- `changePassword` - Change Password
- `currentPassword` - Current Password
- `newPassword` - New Password
- `confirmNewPassword` - Confirm New Password
- `updateProfile` - Update Profile
- `profilePicture` - Profile Picture
- `uploadPhoto` - Upload Photo
- `removePhoto` - Remove Photo
- `changePhoto` - Change Photo
- `phoneNumber` - Phone Number
- `bio` - Bio
- `aboutYou` - Tell us about yourself

### Success Messages
- `profileUpdated` - Profile updated successfully!
- `passwordUpdated` - Password updated successfully!

### Error Messages
- `currentPasswordWrong` - Current password is incorrect
- `passwordsNotMatch` - New passwords do not match
- `passwordTooShortNew` - New password must be at least 6 characters

## 🎨 UI Components

### Tabs
- **Profile Tab**: Edit personal information
- **Password Tab**: Change password

### Profile Picture Display
- Shows uploaded image if available
- Shows first letter of name in colored circle if no image
- Circular avatar (24x24 on mobile, larger on desktop)

### Form Fields
- All fields have proper labels
- Required fields marked with *
- Validation messages shown inline
- Success/error messages at top

## 📱 Responsive Design

- Mobile-friendly layout
- Touch-friendly buttons
- Responsive image upload
- Collapsible sections on small screens

## 🔄 Migration to Database

When moving to a real database:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### File Storage
For profile pictures, use:
- **Supabase Storage** (recommended)
- **AWS S3**
- **Cloudinary**
- **Vercel Blob**

Instead of base64, store:
```typescript
avatar_url: "https://storage.supabase.co/bucket/avatars/user-123.jpg"
```

## 🎯 Best Practices

### For Users
1. **Use a strong password**: At least 6 characters (recommend 12+)
2. **Keep email updated**: For account recovery
3. **Add phone number**: For better communication
4. **Upload profile picture**: Makes you recognizable

### For Admins
1. **Monitor profile updates**: Check for inappropriate content
2. **Set image size limits**: Currently 2MB max
3. **Validate email changes**: Ensure no duplicates
4. **Backup user data**: Regular backups recommended

## 🚀 Future Enhancements

Possible improvements:
- [ ] Email verification on email change
- [ ] Two-factor authentication (2FA)
- [ ] Password strength meter
- [ ] Profile visibility settings
- [ ] Social media links
- [ ] Account deletion option
- [ ] Export user data
- [ ] Activity log
- [ ] Profile completion percentage
- [ ] Image cropping tool

## 🔧 Technical Details

### Functions Added to `src/lib/auth.ts`

```typescript
// Update user profile
updateProfile(userId, updates): { success, error?, user? }

// Change password
changePassword(userId, currentPassword, newPassword): { success, error? }

// Get user profile (extended data)
getUserProfile(userId): profile | null

// Save user profile (extended data)
saveUserProfile(userId, profile): void
```

### Component Structure

```
ProfilePage
├── Header (with back button and language switcher)
├── Tabs (Profile | Password)
├── Profile Tab
│   ├── Profile Picture Upload
│   ├── Name Field
│   ├── Email Field
│   ├── Phone Field
│   └── Bio Field
└── Password Tab
    ├── Current Password
    ├── New Password
    └── Confirm New Password
```

## 📊 Validation Rules

### Profile
- **Name**: Required, min 1 character
- **Email**: Required, valid email format, unique
- **Phone**: Optional, any format
- **Bio**: Optional, max 500 characters (recommended)
- **Avatar**: Max 2MB, image files only

### Password
- **Current Password**: Required, must match existing
- **New Password**: Required, min 6 characters
- **Confirm Password**: Required, must match new password

## 💡 Tips

### For Better Security
1. Change password regularly
2. Use unique password (not used elsewhere)
3. Don't share password with anyone
4. Log out on shared devices

### For Better Profile
1. Use a clear profile picture
2. Add contact information
3. Write a brief bio
4. Keep information updated

## 🐛 Troubleshooting

### Image Upload Issues
- **File too large**: Compress image before upload
- **Wrong format**: Use JPG, PNG, or GIF
- **Upload fails**: Check browser console for errors

### Password Change Issues
- **Current password wrong**: Double-check typing
- **Passwords don't match**: Retype carefully
- **Too short**: Use at least 6 characters

### Profile Update Issues
- **Email already in use**: Choose different email
- **Changes not saving**: Check browser console
- **Page not loading**: Clear browser cache

---

**Your profile is now fully customizable!** 🎉
