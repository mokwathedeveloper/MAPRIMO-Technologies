# Database Schema & Security

## Access Matrix
| Table | Anon (Read) | Anon (Write) | Admin (CRUD) |
| :--- | :--- | :--- | :--- |
| `projects` | Yes (Published) | No | Yes |
| `leads` | No | Yes | Yes |
| `podcasts` | Yes | No | Yes |
| `directors` | Yes | No | Yes |

## RLS Policy Examples
```sql
-- Example: Only allow admins to insert projects
CREATE POLICY "Admins can insert" ON projects 
FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
```

## Relationships
- `admins.user_id` links to `auth.users.id`.
- Most content tables are independent to allow flat, fast querying.
