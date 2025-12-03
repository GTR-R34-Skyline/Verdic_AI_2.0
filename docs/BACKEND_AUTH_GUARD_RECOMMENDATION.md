# Backend Auth Guard Recommendation

## Overview

While frontend auth gating has been implemented for the backlog manager, **real security must be enforced on the backend**. Frontend checks can be bypassed by determined attackers.

## Current Frontend Protection

The following frontend protections are in place:

1. **ProtectedRoute wrapper** - Already wraps `/backlog` route in `App.tsx`
2. **Navbar link hiding** - Backlog link shows a lock icon for unauthenticated users
3. **Redirect to auth** - Unauthenticated users are redirected to `/auth` page

## Recommended Backend Changes

### 1. RLS Policies (Already Implemented)

The `cases` table already has RLS policies restricting access to assigned parties:

```sql
-- Existing policy
CREATE POLICY "Users can view assigned cases" 
ON public.cases 
FOR SELECT 
USING (
  auth.uid() = created_by OR
  auth.uid() = petitioner_lawyer_id OR
  auth.uid() = respondent_lawyer_id OR
  auth.uid() = assigned_judge_id OR
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
```

### 2. Additional API-Level Auth (If Adding Custom Endpoints)

If you add custom API endpoints for backlog management, ensure they:

```typescript
// Example edge function auth check
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

const { data: { user }, error } = await supabase.auth.getUser(
  authHeader.replace('Bearer ', '')
);

if (error || !user) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Optionally check user role
const { data: roles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single();

const allowedRoles = ['admin', 'judge', 'lawyer'];
if (!roles || !allowedRoles.includes(roles.role)) {
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 3. Verify JWT on All Backlog-Related Functions

Ensure `supabase/config.toml` has JWT verification enabled:

```toml
[functions.backlog-management]  # If you add this function
verify_jwt = true
```

## Testing Checklist

- [ ] Verify unauthenticated API requests to `/cases` return 401
- [ ] Verify unauthorized users cannot access other users' cases
- [ ] Verify RLS policies are enforced at database level
- [ ] Test case reassignment only works for authorized users

## Security Layers

```
┌─────────────────────────────────────────┐
│           Frontend Layer                │
│  • ProtectedRoute component             │
│  • Navbar link hiding                   │
│  • Redirect to /auth                    │
│  ⚠️ Can be bypassed                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           API Layer                     │
│  • JWT verification (verify_jwt=true)   │
│  • Auth header validation               │
│  • Role-based access control            │
│  ✅ Enforced server-side                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Database Layer                │
│  • Row-Level Security (RLS) policies    │
│  • Column-level permissions             │
│  • Audit logging                        │
│  ✅ Final security boundary             │
└─────────────────────────────────────────┘
```

## Conclusion

The frontend auth gating provides UX protection but not security. The backend RLS policies and JWT verification provide the actual security layer. Always assume the frontend can be compromised.
