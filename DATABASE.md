# Database Setup

This project uses SQLite with better-sqlite3 for data persistence.

## Database Location

The database file is stored at: `data/mosque.db`

## Schema

### Tables

1. **admin_users** - Admin user credentials
   - id, username, password_hash, created_at, updated_at

2. **iqamah_times** - Prayer time adjustments (Iqamah times)
   - id, prayer_name, offset_minutes, updated_at, updated_by

3. **donations** - Donation records
   - id, amount, source, anonymous, donor_name, created_at, updated_by

4. **settings** - General configuration (donation goal, adjustments)
   - key, value, updated_at, updated_by

5. **audit_log** - Audit trail for admin actions
   - id, username, action, resource, details, created_at

## Initial Setup

The database is automatically initialized on first run with:
- Default admin user (username: `admin`, password: `moschee2026!`)
- Default Iqamah offsets (15 minutes for most prayers, 5 for Maghrib)
- Default settings (donation goal: 60000€)

## Seeding Data

To seed the database with sample donations:

```bash
npm run db:seed
```

Or manually:

```bash
npx tsx src/lib/db-seed.ts
```

## Database Management

### Backup

```bash
cp data/mosque.db data/mosque.db.backup
```

### Reset

```bash
rm data/mosque.db
# Restart the application to reinitialize
```

### View Data

You can use any SQLite client to view the data:

```bash
sqlite3 data/mosque.db
```

## Production Considerations

For production deployment:

1. **Password Hashing**: Implement bcrypt for password hashing
2. **Backups**: Set up automated database backups
3. **Migration**: Consider using a migration tool like Prisma or Drizzle
4. **Scaling**: For high traffic, consider PostgreSQL or MySQL

## Security Notes

- The database file should never be committed to version control
- Admin passwords should be hashed with bcrypt in production
- Implement proper session management with Redis for production
- Use environment variables for sensitive configuration
