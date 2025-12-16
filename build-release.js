/**
 * Build Release Script
 * Builds the plugin and packages release files into a zip archive
 */

import { execSync } from 'child_process';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import archiver from 'archiver';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current git tag or commit hash
function getVersion() {
    try {
        // Try to get current tag
        const tag = execSync('git describe --tags --exact-match 2>nul', { encoding: 'utf8' }).trim();
        return tag;
    } catch (error) {
        // If no tag, use short commit hash
        const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        return hash;
    }
}

// Build the plugin
function build() {
    console.log('Building plugin...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build complete!');
}

// Create release archive
async function packageRelease(version) {
    const outputDir = join(__dirname, 'releases');
    const archiveName = `activity-graph-${version}.zip`;
    const outputPath = join(outputDir, archiveName);

    // Create releases directory if it doesn't exist
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
    }

    console.log(`Creating release archive: ${archiveName}`);

    return new Promise((resolve, reject) => {
        const output = createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        output.on('close', () => {
            console.log(`Archive created: ${archiveName}`);
            console.log(`Total size: ${archive.pointer()} bytes`);
            resolve(outputPath);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Add files to archive
        const files = [
            'main.js',
            'manifest.json',
            'styles.css',
            'LICENSE',
            'README.md',
            'README_ru.md'
        ];

        files.forEach(file => {
            const filePath = join(__dirname, file);
            if (existsSync(filePath)) {
                archive.file(filePath, { name: file });
                console.log(`  Added: ${file}`);
            } else {
                console.warn(`  Warning: ${file} not found, skipping`);
            }
        });

        archive.finalize();
    });
}

// Main execution
async function main() {
    try {
        const version = getVersion();
        console.log(`Version: ${version}\n`);

        // Build
        build();

        // Package
        await packageRelease(version);

        console.log('\n✅ Release package created successfully!');
    } catch (error) {
        console.error('❌ Error creating release:', error.message);
        process.exit(1);
    }
}

main();
