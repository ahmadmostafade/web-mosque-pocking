# Gebetszeiten - Final Implementation

## Summary of Changes

### 1. ✅ Removed Mawaqit App Link
- Completely removed "📱 Mawaqit App für mobile Gebetszeiten →" link
- No external dependencies

### 2. ✅ Table-Style Display for Prayer Times
**Before:** List-style layout with times side by side
**After:** Clean table with three columns:
- **Gebet** (Prayer name in German & Arabic)
- **Adhan** (Prayer time)
- **Iqāmah** (Offset like "+15 min")

### 3. ✅ Simplified Jummah Card
**Before:** Showed both Khutba and Iqamah times
**After:** Only shows Khutba time (12:30)
- Removed Iqamah from Jummah display
- Cleaner, simpler presentation

### 4. ✅ Database-Driven Iqamah Times
All Iqamah times are now stored in the database and fully configurable via admin dashboard.

### 5. ✅ Improved Admin Interface
**Iqamah Times Section:**
- Simple number input for minutes (e.g., 15 = +15 min)
- Clear labels: Fajr, Dhuhr, Asr, Maghrib, Isha
- Automatic "+X min" formatting

**Jummah Section:**
- Single time picker for Khutba
- Removed Iqamah input

## Current Display

### Public Page (`/gebetszeiten`)

```
┌─────────────────────────────────────────────────────┐
│ Gebetszeiten & Iqāmah                               │
│ Montag, 16. Februar 2026                            │
├──────────────┬──────────────┬──────────────────────┤
│ Gebet        │ Adhan        │ Iqāmah               │
├──────────────┼──────────────┼──────────────────────┤
│ Fajr الفجر   │ 05:30        │ +15 min              │
│ Sunrise      │ 07:15        │ —                    │
│ Dhuhr الظهر  │ 12:45        │ +15 min              │
│ Asr العصر    │ 15:30        │ +15 min              │
│ Maghrib      │ 18:00        │ +5 min               │
│ Isha العشاء  │ 19:45        │ +15 min              │
└──────────────┴──────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 🕌 Jumuʿah (Freitagsgebet)                          │
│                                                      │
│ Khutba                                               │
│ 12:30                                                │
└─────────────────────────────────────────────────────┘
```

### Admin Dashboard (`/admin/gebetszeiten`)

**Iqamah-Zeiten Section:**
```
Fajr     [+] [15] [min]
Dhuhr    [+] [15] [min]
Asr      [+] [15] [min]
Maghrib  [+] [5]  [min]
Isha     [+] [15] [min]

[Iqamah-Zeiten speichern]
```

**Jumuʿah Section:**
```
Khutba   [12:30] (time picker)

[Jumuʿah-Zeit speichern]
```

## Database Schema

### `iqamah_times` Table
```sql
CREATE TABLE iqamah_times (
  id INTEGER PRIMARY KEY,
  prayer_name TEXT UNIQUE NOT NULL,
  offset_minutes INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);
```

**Default Values:**
- Fajr: 15 minutes
- Dhuhr: 15 minutes
- Asr: 15 minutes
- Maghrib: 5 minutes
- Isha: 15 minutes

### `jummah_times` Table
```sql
CREATE TABLE jummah_times (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  khutba_time TEXT NOT NULL DEFAULT '12:30',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);
```

**Default Value:**
- Khutba: 12:30

## API Endpoints

### GET /api/iqamah
Returns current Iqamah times:
```json
{
  "times": {
    "Fajr": "+15 min",
    "Dhuhr": "+15 min",
    "Asr": "+15 min",
    "Maghrib": "+5 min",
    "Isha": "+15 min",
    "lastUpdated": "2026-02-16T..."
  }
}
```

### PUT /api/iqamah
Updates Iqamah times (requires authentication):
```json
{
  "Fajr": "+15 min",
  "Dhuhr": "+15 min",
  "Asr": "+15 min",
  "Maghrib": "+5 min",
  "Isha": "+15 min"
}
```

### GET /api/jummah
Returns Jummah Khutba time:
```json
{
  "khutba": "12:30"
}
```

### PUT /api/jummah
Updates Jummah Khutba time (requires authentication):
```json
{
  "khutba": "12:30"
}
```

## Features

✅ **Table Layout** - Clear three-column table for prayer times
✅ **Database-Driven** - All times stored in SQLite database
✅ **Easy Admin Interface** - Simple number inputs for Iqamah offsets
✅ **Automatic Formatting** - Admin enters "15", displays as "+15 min"
✅ **Persistent Storage** - All changes saved to database
✅ **Audit Logging** - All updates tracked in audit log
✅ **Responsive Design** - Works on mobile and desktop
✅ **Next Prayer Highlight** - Current prayer highlighted in gold

## Admin Workflow

1. Navigate to `/admin/gebetszeiten`
2. **To update Iqamah times:**
   - Enter minutes (e.g., 15 for +15 min)
   - Click "Iqamah-Zeiten speichern"
3. **To update Jummah Khutba:**
   - Select time using time picker
   - Click "Jumuʿah-Zeit speichern"
4. Changes are immediately visible on `/gebetszeiten`

## Benefits

✅ Clean, professional table layout
✅ Easy to read and understand
✅ Simple admin interface
✅ No manual text formatting needed
✅ Database-backed persistence
✅ Audit trail for all changes
✅ Mobile-friendly responsive design
