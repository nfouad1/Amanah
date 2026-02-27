# Amanah Invite-Only System

## 🔐 Overview

Amanah now uses an **invite-only registration system** to prevent spam accounts and maintain a private family platform.

## ✨ Features

- **Invite Codes Required**: Users must have a valid invite code to register
- **One-Time Use**: Each invite code can only be used once
- **Expiration**: Codes can expire after a set number of days
- **Admin Management**: Create, view, and deactivate invite codes
- **URL Support**: Invite codes can be shared via URL: `https://amanah.app/register?invite=CODE`

## 🚀 How It Works

### For Admins (Creating Invites)

1. **Access Invite Management**
   - Go to Dashboard
   - Click "Manage Invites" in Quick Actions
   - Or visit: `/dashboard/invites`

2. **Create New Invite**
   - Click "+ Create Invite" button
   - Set expiration (default: 30 days)
   - Click "Create Invite"
   - Copy the generated code or invite link

3. **Share Invite**
   - Copy invite link and send to family member
   - Or share the code directly
   - Example link: `https://amanah.app/register?invite=FAM-ABC123`

4. **Manage Invites**
   - View all invite codes (active, used, expired)
   - Deactivate unused codes
   - Track who used each code

### For New Users (Registering)

1. **Receive Invite**
   - Get invite link from family admin
   - Or get invite code directly

2. **Register**
   - Click invite link (code auto-fills)
   - Or go to register page and enter code manually
   - Fill in registration form
   - Submit

3. **Validation**
   - System validates invite code
   - Checks if code is:
     - Valid (exists)
     - Active (not deactivated)
     - Unused (not already used)
     - Not expired

4. **Account Created**
   - If valid, account is created
   - Invite code is marked as used
   - User is redirected to dashboard

## 📋 Default Invite Code

For testing/demo purposes, there's a default invite code:

**Code**: `FAMILY2024`
- Never expires
- Can be used multiple times (for demo)
- Always active

**For production**: Delete or deactivate this code!

## 🔧 Technical Details

### Invite Code Structure

```typescript
interface InviteCode {
  id: string;              // Unique ID
  code: string;            // The actual code (e.g., "FAM-ABC123")
  createdBy: string;       // Who created it
  createdAt: string;       // When created
  usedBy?: string;         // Who used it (if used)
  usedAt?: string;         // When used (if used)
  expiresAt?: string;      // Expiration date (optional)
  isActive: boolean;       // Can be deactivated
}
```

### Code Generation

- Format: `FAM-XXXXXX`
- Random 6-character alphanumeric
- Uppercase for consistency
- Example: `FAM-A7B9C2`

### Storage

Currently stored in `localStorage`:
- Key: `amanah_invite_codes`
- When migrating to database, update these functions in `src/lib/mockData.ts`:
  - `getInviteCodes()`
  - `validateInviteCode()`
  - `useInviteCode()`
  - `createInviteCode()`
  - `deactivateInviteCode()`

## 🎯 Benefits

### Security
- ✅ No spam accounts
- ✅ Controlled user growth
- ✅ Family members only

### Privacy
- ✅ Private family platform
- ✅ Invite-only access
- ✅ No public registration

### Control
- ✅ Admin manages access
- ✅ Track invitations
- ✅ Revoke access anytime

## 🔄 Migration to Database

When moving to a real database, create this table:

```sql
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Index for fast lookups
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_active ON invite_codes(is_active) WHERE is_active = TRUE;
```

## 📱 User Experience

### Registration Flow

```
1. User receives invite link
   ↓
2. Clicks link → Register page opens
   ↓
3. Invite code auto-filled in form
   ↓
4. User fills name, email, password
   ↓
5. Submits form
   ↓
6. System validates invite code
   ↓
7. If valid: Account created
   If invalid: Error message shown
   ↓
8. Redirect to dashboard
```

### Error Messages

- **No code entered**: "Invite code is required"
- **Invalid code**: "Invalid or expired invite code"
- **Already used**: "This invite code has already been used"
- **Expired**: "This invite code has expired"
- **Deactivated**: "This invite code has been deactivated"

## 🌍 Multi-Language Support

All invite system text is translated:
- English
- Swedish (Svenska)
- Arabic (العربية)

Translation keys in `src/lib/i18n.ts`:
- `inviteCode`
- `inviteCodeRequired`
- `enterInviteCode`
- `inviteCodeInvalid`
- `inviteOnly`
- `inviteOnlyDesc`
- `noInviteCode`
- `contactAdmin`

## 🎨 UI Components

### Registration Page
- Invite code field (first field)
- Blue info box explaining invite-only system
- Help text for users without code
- Auto-fill from URL parameter

### Invite Management Page
- List of all invite codes
- Status badges (Active, Used, Deactivated)
- Copy invite link button
- Deactivate button
- Create new invite modal

## 🔐 Best Practices

### For Admins

1. **Create codes as needed**
   - Don't create too many at once
   - Set reasonable expiration (30 days)

2. **Track usage**
   - Check who used each code
   - Deactivate unused codes after time

3. **Share securely**
   - Send invite links directly to family
   - Don't post publicly

### For Production

1. **Remove default code**
   ```typescript
   // Delete FAMILY2024 from defaultInviteCodes
   ```

2. **Set expiration**
   - Always set expiration dates
   - Recommended: 7-30 days

3. **Monitor usage**
   - Check for suspicious patterns
   - Deactivate if needed

## 📊 Statistics

Track invite code usage:
- Total codes created
- Active codes
- Used codes
- Expired codes
- Deactivated codes

## 🚀 Future Enhancements

Possible improvements:
- [ ] Email invitations (send invite via email)
- [ ] Bulk invite creation
- [ ] Invite code analytics
- [ ] Role-based invites (admin vs member)
- [ ] Group-specific invites
- [ ] Invite code templates

## 💡 Tips

1. **For testing**: Use `FAMILY2024` code
2. **For production**: Create unique codes for each family member
3. **Share via**: WhatsApp, Email, SMS with invite link
4. **Monitor**: Check invite page regularly for usage

---

**Your family platform is now secure with invite-only access!** 🎉
