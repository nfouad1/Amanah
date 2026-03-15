# Default Login Credentials

## Admin Account

For testing and initial setup, a default admin account is automatically created:

### Login Details
- **Email**: `admin@sanad.fund`
- **Password**: `admin123`
- **Role**: Administrator
- **Permissions**: Full access to all features

## Features Available to Admin

### User Management
- View all users
- Change user roles (Admin, Contributor, Member, Viewer)
- Unlimited invite codes

### Campaign Management
- Create campaigns (with or without approval requirement)
- Edit/delete any campaign
- Vote on campaigns
- Contribute to campaigns

### Group Management
- Create groups
- Edit/delete any group
- Manage group members
- Invite members to groups

### Invite Management
- Create unlimited invite codes
- Deactivate invite codes
- View all invite codes and their usage

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

1. **Change Default Password**: The default password `admin123` should be changed immediately in production
2. **Remove Default User**: Consider removing the default admin user creation in `src/lib/auth.ts` for production
3. **Use Environment Variables**: Store credentials in environment variables, not in code
4. **Implement Proper Authentication**: Replace localStorage with a proper backend authentication system

## How It Works

The default admin user is automatically created when:
- No users exist in localStorage
- The application is accessed for the first time
- localStorage is cleared

Location in code: `src/lib/auth.ts` - `DEFAULT_ADMIN` constant

## Testing Other Roles

To test other roles, you can:
1. Login as admin
2. Go to "User Management" (👑 icon in dashboard)
3. Register new users with invite code: `FAMILY2024`
4. Change their roles using the admin panel

### Role Permissions

- **Admin**: Full access, unlimited invites
- **Contributor**: Can create campaigns, 5 invites
- **Member**: Can vote and contribute, 3 invites
- **Viewer**: Read-only access, 0 invites
