/**
 * Upload logo to Supabase Storage
 *
 * Usage:
 * 1. Place your logo image as 'logo.png' in the scripts directory
 * 2. Run: node scripts/upload-logo.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zvdqkxkgrgclecjhkqny.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('\nPlease set the service role key:');
    console.log('Windows: set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    console.log('Mac/Linux: export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadLogo() {
    try {
        const logoPath = path.join(__dirname, 'logo.png');

        // Check if logo file exists
        if (!fs.existsSync(logoPath)) {
            console.error(`❌ Error: Logo file not found at ${logoPath}`);
            console.log('\nPlease place your logo image as "logo.png" in the scripts directory');
            process.exit(1);
        }

        console.log('📤 Uploading logo to Supabase Storage...');

        // Read the file
        const fileBuffer = fs.readFileSync(logoPath);

        // First, create the bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets();
        const assetsBucket = buckets?.find(b => b.name === 'assets');

        if (!assetsBucket) {
            console.log('📦 Creating "assets" bucket...');
            const { error: createError } = await supabase.storage.createBucket('assets', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            });

            if (createError) {
                console.error('❌ Error creating bucket:', createError);
                process.exit(1);
            }
            console.log('✅ Bucket created successfully');
        }

        // Upload the file
        const { data, error } = await supabase.storage
            .from('assets')
            .upload('logo.png', fileBuffer, {
                contentType: 'image/png',
                upsert: true, // Overwrite if exists
            });

        if (error) {
            console.error('❌ Upload error:', error);
            process.exit(1);
        }

        console.log('✅ Logo uploaded successfully!');
        console.log('\n📋 Logo URL:');
        console.log(`${supabaseUrl}/storage/v1/object/public/assets/logo.png`);
        console.log('\nThe header component has already been updated to use this URL.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

uploadLogo();
