# Audit access

AUDIT users can sign in and view all application read endpoints, including administrator-only lists, details, logs, catalog drafts, and reports. The database user role is checked on authenticated requests. POST, PUT, PATCH, DELETE, and other non-read methods are rejected with HTTP 403 for AUDIT; sign-in is the session entry point. System login records and session tokens are still maintained. Password changes and recovery cannot modify an audit account, including requests made without a token. Sign-up and account activation now require an authenticated super admin.

The frontend allows browsing, filtering and viewing reports. It hides mutation controls, hides settings, and redirects attempts to open new/edit pages. The backend remains authoritative even if browser cookies or client code are modified. Sign-out remains available.

Run from backend with a reachable MongoDB URI in `.env`:

```sh
npm run seed:audit
```

This creates the activated AUDIT account with user ID `3001` and the requested initial password. Passwords are stored as bcrypt hashes. Rerunning resets that audit account to the requested password and clears its refresh token. The script refuses to overwrite user 3001 if it belongs to another role. It does not create a salesperson profile or change other accounts.

Verify with `npm run test:access`, `npm run test:catalog`, `npm run build`, and frontend `npm run check`.
