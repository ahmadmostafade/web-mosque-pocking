# Gebetszeiten Page Update Summary

## Changes Made

### 1. Removed Mawaqit App Link
- ✅ Removed the "📱 Mawaqit App für mobile Gebetszeiten →" link
- ✅ Removed all references to https://mawaqit.net/

### 2. Combined Gebetszeiten & Iqamah Display
- ✅ Merged Adhan and Iqamah times into a single card
- ✅ Iqamah times now display minimally next to Adhan times (e.g., "+15 min")
- ✅ Clean, compact layout showing both times together

### 3. Jummah (Friday Prayer) Configuration
- ✅ Changed from "Iqāmah 13:45" to show both:
  - **Khutba**: 12:30 (configurable)
  - **Iqāmah**: 13:45 (configurable)
- ✅ Both times are now database-driven and editable via admin dashboard

### 4. Database Schema Updates
Added new table: `jummah_times`
```sql
CREATE TABLE jummah_times (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  khutba_time TEXT NOT NULL DEFAULT '12:30',
  iqamah_time TEXT NOT NULL DEFAULT '13:45',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);
```

### 5. New Files Created
- `src/lib/db-jummah.ts` - Database operations for Jummah times
- `src/app/api/jummah/route.ts` - API endpoint for Jummah times

### 6. Modified Files
- `src/app/gebetszeiten/page.tsx` - Combined display, removed Mawaqit link
- `src/app/admin/gebetszeiten/page.tsx` - Added Jummah configuration section
- `src/lib/db.ts` - Added jummah_times table
- `src/lib/iqamah-store.ts` - Removed Jummah (now separate)

## New Display Format

### Gebetszeiten Page (`/gebetszeiten`)

**Before:**
- Two separate cards (Gebetszeiten | Iqamah-Zeiten)
- Mawaqit app link at bottom
- Jummah only showed Iqamah time

**After:**
- Single combined card showing:
  ```
  Fajr (الفجر)        05:30    +15 min
  Sunrise (الشروق)    07:15
  Dhuhr (الظهر)       12:45    +15 min
  Asr (العصر)         15:30    +15 min
  Maghrib (المغرب)    18:00    +5 min
  Isha (العشاء)       19:45    +15 min
  ```
- Separate Jummah card showing:
  ```
  Khutba: 12:30
  Iqāmah: 13:45
  ```
- No Mawaqit link

### Admin Dashboard (`/admin/gebetszeiten`)

**New Sections:**

1. **Iqamah-Zeiten** (Daily prayers)
   - Fajr, Dhuhr, Asr, Maghrib, Isha
   - Format: "+X min" (offset from Adhan)

2. **Jumuʿah (Freitagsgebet)** (Friday prayer)
   - Khutba-Zeit (time input)
   - Iqamah-Zeit (time input)

## API Endpoints

### GET /api/jummah
Returns current Jummah times:
```json
{
  "khutba": "12:30",
  "iqamah": "13:45"
}
```

### PUT /api/jummah
Updates Jummah times (requires authentication):
```json
{
  "khutba": "12:30",
  "iqamah": "13:45"
}
```

## Default Values

- **Khutba**: 12:30
- **Iqamah**: 13:45
- **Iqamah offsets**: +15 min (most prayers), +5 min (Maghrib)

## Admin Usage

1. Navigate to `/admin/gebetszeiten`
2. Update Iqamah offsets for daily prayers (e.g., "+15 min")
3. Update Jummah Khutba and Iqamah times using time pickers
4. Click "Speichern" to save changes
5. Changes are immediately reflected on the public page

## Benefits

✅ Cleaner, more compact display
✅ All prayer times in one view
✅ Jummah times fully configurable
✅ No external dependencies (Mawaqit removed)
✅ Database-driven, persistent configuration
✅ Easy to update via admin dashboard
