# Backend Changes Overview

Difficulty ratings: 🟢 Easy · 🟡 Medium · 🔴 Hard

---

## Settings

| Change                                            | What's needed                                                                                                                                     | Difficulty                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Profile (name, avatar)                            | Add `first_name`, `last_name`, `avatar_url` to `users` table. Add `PATCH /users/me` route. Model + controller is a one-liner update query.        | 🟢 Easy                             |
| Preferences (dark mode, language, timezone, etc.) | New `user_preferences` table + `GET`/`PUT /users/me/preferences` routes. Straightforward upsert.                                                  | 🟢 Easy                             |
| Change password                                   | New `POST /users/me/password` route. Verify old password with bcrypt, hash and save new one.                                                      | 🟢 Easy                             |
| Deactivate account                                | Add `status` + `deactivated_at` columns to `users`. New `POST /users/me/deactivate` route. Auth middleware needs a check to block inactive users. | 🟡 Medium — touches auth middleware |

---

## Resource Management

| Change                                                       | What's needed                                                                                                         | Difficulty |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------- |
| Venue CRUD routes                                            | `venueModel.js` already has full CRUD. Just need to create a `venues.js` route file and register it in `index.js`.    | 🟢 Easy    |
| Venue extra fields (location, description, image)            | Add 3 columns to `venues`, extend the existing update query.                                                          | 🟢 Easy    |
| Venue amenities                                              | Add `amenities TEXT[]` column to `venues`. Include it in create/update endpoints.                                     | 🟢 Easy    |
| Edit/delete a resource                                       | `resourceModel.js` already has `updateResource` and `deleteResource`. Just add `PATCH /:id` and `DELETE /:id` routes. | 🟢 Easy    |
| Resource extra fields (description, image, furniture counts) | Add `description`, `image_url`, `num_desks`, `num_seats` columns to `resources`. Include in create/update payloads.   | 🟢 Easy    |

---

## Users

| Change                                                        | What's needed                                                                                                                                                             | Difficulty                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| List all users (`GET /users`)                                 | New route + query. Needs a `COUNT` join on `bookings` and a join on `venue_managers` for managed venue names. Model work required — currently only `findUserById` exists. | 🟡 Medium                           |
| Role & status management (`PATCH /users/:id/role`, `/status`) | `updateUserRole` already exists in the model. Status needs the `status` column from Settings work above. Straightforward once schema is in place.                         | 🟢 Easy (depends on status column)  |
| `department` field                                            | Add `department VARCHAR(100)` to `users`, include in list/detail responses.                                                                                               | 🟢 Easy                             |
| `last_active_at` tracking                                     | Add column to `users`, update it on each authenticated request (middleware one-liner).                                                                                    | 🟡 Medium — needs middleware change |

---

## Reporting

| Change                                   | What's needed                                                                                                                                                                            | Difficulty |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Overview stats (`GET /reports/overview`) | New route + several SQL aggregate queries (COUNT, GROUP BY). No schema changes. The queries themselves are moderately complex (booking trends by month, peak hours, per-type breakdown). | 🟡 Medium  |
| Per-resource / per-user report endpoints | Same pattern — SQL aggregation queries, no schema changes. Complexity scales with how much filtering (date range, venue) is required.                                                    | 🟡 Medium  |
| Booking trend index (performance)        | One `CREATE INDEX` statement. Optional but good practice for larger datasets.                                                                                                            | 🟢 Easy    |

---

## Schema Changes

### `users` table — `ALTER TABLE`

```sql
ALTER TABLE users
  ADD COLUMN first_name      VARCHAR(100),
  ADD COLUMN last_name       VARCHAR(100),
  ADD COLUMN avatar_url      TEXT,
  ADD COLUMN status          VARCHAR(20) NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active', 'inactive')),
  ADD COLUMN deactivated_at  TIMESTAMPTZ,
  ADD COLUMN department      VARCHAR(100),
  ADD COLUMN last_active_at  TIMESTAMPTZ;
```

### `venues` table — `ALTER TABLE`

```sql
ALTER TABLE venues
  ADD COLUMN location    VARCHAR(255),
  ADD COLUMN description TEXT,
  ADD COLUMN image_url   TEXT,
  ADD COLUMN amenities   TEXT[] NOT NULL DEFAULT '{}';
```

### `resources` table — `ALTER TABLE`

```sql
ALTER TABLE resources
  ADD COLUMN description TEXT,
  ADD COLUMN image_url   TEXT,
  ADD COLUMN num_desks   INT NOT NULL DEFAULT 0,
  ADD COLUMN num_seats   INT NOT NULL DEFAULT 0;
```

### New `user_preferences` table

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id     INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  dark_mode   BOOLEAN NOT NULL DEFAULT FALSE,
  language    VARCHAR(10) NOT NULL DEFAULT 'en',
  timezone    VARCHAR(60) NOT NULL DEFAULT 'America/New_York',
  date_format VARCHAR(20) NOT NULL DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(10) NOT NULL DEFAULT '12h'
);
```

### Optional index (reporting performance)

```sql
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
```

---

## Overall Assessment

- **~70% of the work is straightforward** — adding columns, registering routes that already have model implementations, or writing simple CRUD controllers following existing patterns in the codebase.
- **The venues route file** is the most impactful single task since the UI has multiple pages that need it (`BrowseVenuesPage`, `ResourcesPage`, edit modal), yet the model layer is already fully written.
- **Reporting** is the only area requiring non-trivial SQL — but no schema changes are needed, making it lower risk.
- **Settings deactivation** is the only change that touches the auth middleware, which deserves careful testing.
