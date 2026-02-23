# MantaHQ Integration Guide

This document explains how the Tickly application has been integrated with MantaHQ's Authenticate Access service for user authentication and profile management.

## Overview

The application now uses MantaHQ for:
- **Authentication**: User signup, login, and logout
- **User Profiles**: Storing and retrieving user data (name, email, role)
- **Session Management**: Managing authenticated sessions

## Environment Setup

You need to set the following environment variable in your `.env.local` file:

```env
NEXT_PUBLIC_MANTAHQ_SDK_KEY=manta_sk_live_xxxx
```

### Getting Your SDK Key

1. Go to [MantaHQ Dashboard](https://app.mantahq.com)
2. Create or sign into your workspace
3. Navigate to **Settings** → **API Keys** or **Keys & Authentication**
4. Find or generate your SDK Key (starts with `manta_sk_live_`)
5. Add it to your `.env.local` file as `NEXT_PUBLIC_MANTAHQ_SDK_KEY`

## Architecture

### Authentication Flow

#### Sign Up
1. User submits email, password, and name
2. Form validation occurs on the client
3. `signup()` function calls MantaHQ Auth API to create account
4. User profile is stored in MantaHQ database (users collection)
5. User is redirected to login page

#### Login
1. User submits email and password
2. Form validation occurs on the client
3. `login()` function calls MantaHQ Auth API
4. User profile is fetched from database
5. Session is created and stored in localStorage
6. User is redirected to dashboard or admin panel

#### Logout
1. User clicks logout button
2. `logout()` function calls MantaHQ Auth API
3. Local session is cleared from localStorage
4. User is redirected to home page

### Database Schema

#### Users Collection
```typescript
{
  id: string;           // User ID from MantaHQ Auth
  email: string;        // User's email (unique)
  name: string;         // User's full name
  role: "user" | "admin"; // User's role
  createdAt: string;    // ISO timestamp of account creation
}
```

## Modified Files

### `src/lib/auth.ts`
- Replaced mock authentication with MantaHQ SDK calls
- All auth functions are now async
- Added MantaHQ client initialization
- Uses MantaHQ database for user profiles

### `src/components/login-form.tsx`
- Updated to handle async `login()` function
- Removed demo credentials
- Added proper error handling

### `src/components/signup-form.tsx`
- Updated to handle async `signup()` and `login()` functions
- Improved error handling

### `src/components/dashboard-header.tsx`
- Updated logout handler to call async `logout()` function

### `src/components/admin-header.tsx`
- Updated logout handler to call async `logout()` function

### `src/components/admin-users-list.tsx`
- Updated to fetch users asynchronously with `getAllUsers()`

### `package.json`
- Added `@mantahq/sdk` dependency

## Running the Setup Script

To initialize the MantaHQ database schema:

```bash
node scripts/setup-mantahq.js
```

This script:
- Validates your MantaHQ credentials
- Prepares the users table for the application
- Outputs the expected schema structure

## API Reference

### `signup(email: string, password: string, name: string)`
Creates a new user account and profile.

**Returns**: Promise<{success: boolean; error?: string}>

```typescript
const result = await signup("user@example.com", "password123", "John Doe");
if (result.success) {
  // Signup successful
}
```

### `login(email: string, password: string)`
Authenticates a user and creates a session.

**Returns**: Promise<{success: boolean; session?: AuthSession; error?: string}>

```typescript
const result = await login("user@example.com", "password123");
if (result.success && result.session) {
  saveSession(result.session);
}
```

### `logout()`
Signs out the current user and clears the session.

**Returns**: Promise<{success: boolean; error?: string}>

```typescript
await logout();
```

### `getSession()`
Retrieves the current authenticated session from localStorage.

**Returns**: AuthSession | null

```typescript
const session = getSession();
if (session) {
  console.log("User:", session.user.name);
}
```

### `saveSession(session: AuthSession)`
Stores the authenticated session in localStorage.

```typescript
saveSession(authSession);
```

### `clearSession()`
Removes the stored session from localStorage.

```typescript
clearSession();
```

### `getAllUsers()`
Fetches all registered users from the database.

**Returns**: Promise<Array<{email: string; name: string; role: "user" | "admin"}>>

```typescript
const users = await getAllUsers();
users.forEach(user => {
  console.log(user.name, user.email, user.role);
});
```

## Security Considerations

1. **Password Security**: Passwords are sent directly to MantaHQ over HTTPS and are never stored in localStorage
2. **Session Tokens**: Session tokens are stored in localStorage for persistence across page reloads
3. **API Keys**: Use `.env.local` for sensitive keys (never commit to Git)
4. **User Roles**: The `role` field controls admin access within the application

## Troubleshooting

### "NEXT_PUBLIC_MANTAHQ_API_KEY is not set"
- Ensure you've added the environment variable to `.env.local`
- Restart your dev server after adding environment variables

### "Invalid email or password"
- Verify the user exists in MantaHQ
- Check that the password is correct
- Ensure the user was created with the signup form

### "Failed to fetch users"
- Verify your MantaHQ credentials are correct
- Check that the users collection exists in your workspace
- Review MantaHQ dashboard for any database errors

### Users table not found
- Run the setup script: `node scripts/setup-mantahq.js`
- Verify your workspace ID is correct
- Check MantaHQ dashboard for collection creation

## Next Steps

1. ✅ Install @mantahq/sdk in package.json
2. ✅ Update `src/lib/auth.ts` with MantaHQ integration
3. ✅ Update forms and components to use async auth functions
4. ⏳ Test signup and login flows
5. ⏳ Verify user profiles are stored correctly
6. ⏳ Test admin panel user listing

## Support

For issues with MantaHQ integration, consult:
- [MantaHQ Documentation](https://docs.mantahq.com)
- [MantaHQ Quickstart Guide](https://docs.mantahq.com/quickstart)
- MantaHQ Support Dashboard
