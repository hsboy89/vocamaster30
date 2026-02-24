# Logo Upload Instructions

## Steps to Upload Logo to Supabase

### 1. Save the Logo Image
- Save your logo image (from the second screenshot) as `logo.png` in the `scripts` folder
- The path should be: `d:\SideProject\vocamaster30\scripts\logo.png`

### 2. Get Supabase Service Role Key
You need the Supabase service role key to upload files. You can find it:
1. Go to your Supabase project dashboard
2. Navigate to: Settings → API
3. Copy the "service_role" key (NOT the anon key)

### 3. Set Environment Variable
Open a new terminal and set the service role key:

**Windows (Command Prompt):**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Windows (PowerShell):**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

**Mac/Linux:**
```bash
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Run the Upload Script
```bash
node scripts/upload-logo.js
```

### 5. Verify
After successful upload, the logo will be available at:
```
https://zvdqkxkgrgclecjhkqny.supabase.co/storage/v1/object/public/assets/logo.png
```

The header component has already been updated to use this URL automatically!

## What Has Been Updated

### Header Component Changes
- ✅ Changed title from "Voca Master 30" to "The First Voca Master"
- ✅ Added logo image display with fallback to emoji if image doesn't load
- ✅ Logo URL is configured to: `https://zvdqkxkgrgclecjhkqny.supabase.co/storage/v1/object/public/assets/logo.png`

### Current Status
- The header will show the 📚 emoji until you upload the logo
- Once you upload the logo, refresh the page and it will automatically display your logo image
- The logo is set to fit within a 40x40px rounded container

## Troubleshooting

**If the upload fails:**
- Make sure the logo.png file exists in the scripts directory
- Verify your SUPABASE_SERVICE_ROLE_KEY is correct
- Check that you have internet connection to reach Supabase

**If the logo doesn't appear after upload:**
- Clear your browser cache
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check the browser console for errors
- Verify the logo uploaded successfully by visiting the URL directly in your browser
