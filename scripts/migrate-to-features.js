#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const readline = require('readline');
const { globby } = require('globby');
const execAsync = promisify(exec);

// Configuration for the migration
const config = {
  // Old paths to new paths mapping
  paths: {
    // Auth (optional)
    'src/lib/supabase/client.ts': 'src/features/auth/client.ts',
    'src/app/login/page.tsx': 'src/features/auth/pages/login.tsx',

    // Profile
    'src/services/profileService.ts': 'src/features/profile/service.ts',

    // Bitcoin
    'src/services/bitcoin/index.ts': 'src/features/bitcoin/service.ts',
    'src/hooks/useBitcoinWallet.ts': 'src/features/bitcoin/hooks.ts',
  },
  
  // Directories to create
  directories: [
    'src/features/auth',
    'src/features/auth/pages',
    'src/features/profile',
    'src/features/profile/components',
    'src/features/bitcoin',
  ],

  // File patterns to exclude from import updates
  excludePatterns: [
    'src/app/fund-us/**',
    'src/app/blog/**',
    'src/__tests__/**',
    'src/app/api/**',
    'src/app/dashboard/**',
    'src/app/about/**',
    'src/app/create/**',
    'src/app/not-found.tsx',
    'src/app/loading.tsx',
    'src/app/error.tsx',
    'src/app/globals.css',
    'src/app/layout.tsx',
    'src/app/metadata.ts',
    'src/app/page.tsx',
  ],

  // Files that are optional (won't fail if missing)
  optionalFiles: [
    'src/lib/supabase/client.ts',
    'src/app/login/page.tsx',
  ],
};

// Import path mapping for updating imports
const importMappings = {
  '@/lib/supabase/client': '@/features/auth/client',
  '@/services/profileService': '@/features/profile/service',
  '@/services/bitcoin': '@/features/bitcoin/service',
  '@/hooks/useBitcoinWallet': '@/features/bitcoin/hooks',
};

// Store rollback commands
const rollbackCommands = [];

async function createDirectories(dryRun = false) {
  console.log('Creating feature directories...');
  for (const dir of config.directories) {
    try {
      if (dryRun) {
        console.log(`Would create directory: ${dir}`);
      } else {
        await fs.mkdir(dir, { recursive: true });
        console.log(`✓ Created directory: ${dir}`);
      }
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Error creating directory ${dir}:`, error);
        process.exit(1);
      }
    }
  }
}

async function moveFiles(dryRun = false) {
  console.log(dryRun ? 'Planning file moves...' : 'Moving files...');
  
  // Group files by destination to handle merges
  const filesByDestination = {};
  for (const [oldPath, newPath] of Object.entries(config.paths)) {
    if (!filesByDestination[newPath]) {
      filesByDestination[newPath] = [];
    }
    filesByDestination[newPath].push(oldPath);
  }
  
  for (const [newPath, oldPaths] of Object.entries(filesByDestination)) {
    try {
      if (oldPaths.length === 1) {
        // Single file move
        const oldPath = oldPaths[0];
        try {
          await fs.access(oldPath);
          
          if (dryRun) {
            console.log(`Would move: ${oldPath} -> ${newPath}`);
          } else {
            try {
              // Check if destination exists
              await fs.access(newPath);
              
              // If destination exists, merge the files
              const oldContent = await fs.readFile(oldPath, 'utf8');
              const newContent = await fs.readFile(newPath, 'utf8');
              
              // For hooks.ts or service.ts, we want to merge the exports
              if (newPath.endsWith('hooks.ts') || newPath.endsWith('service.ts')) {
                // Extract the exports from both files
                const oldExports = extractExports(oldContent);
                const newExports = extractExports(newContent);
                
                // Merge the exports, keeping the ones from the new file
                const mergedContent = mergeExports(newContent, oldExports);
                
                // Write the merged content
                await fs.writeFile(newPath, mergedContent, 'utf8');
                console.log(`✓ Merged: ${oldPath} -> ${newPath}`);
                
                // Delete the old file
                await fs.unlink(oldPath);
              } else {
                // For other files, just move them
                await execAsync(`git mv "${oldPath}" "${newPath}"`);
                console.log(`✓ Moved: ${oldPath} -> ${newPath}`);
              }
            } catch (error) {
              if (error.code === 'ENOENT') {
                // Destination doesn't exist, just move the file
                await execAsync(`git mv "${oldPath}" "${newPath}"`);
                console.log(`✓ Moved: ${oldPath} -> ${newPath}`);
              } else {
                throw error;
              }
            }
            
            // Store rollback command
            rollbackCommands.push(`git mv "${newPath}" "${oldPath}"`);
          }
        } catch (error) {
          if (error.code === 'ENOENT') {
            if (config.optionalFiles.includes(oldPath)) {
              console.warn(`⚠️ Optional file does not exist: ${oldPath}`);
            } else {
              console.error(`❌ Required file does not exist: ${oldPath}`);
              process.exit(1);
            }
          } else {
            console.error(`Error moving ${oldPath}:`, error);
            process.exit(1);
          }
        }
      } else {
        // Multiple files to merge
        if (dryRun) {
          console.log(`Would merge ${oldPaths.join(', ')} -> ${newPath}`);
        } else {
          try {
            // Check if destination exists
            await fs.access(newPath);
            const newContent = await fs.readFile(newPath, 'utf8');
            
            // Merge all source files
            let mergedContent = newContent;
            for (const oldPath of oldPaths) {
              try {
                const oldContent = await fs.readFile(oldPath, 'utf8');
                const oldExports = extractExports(oldContent);
                mergedContent = mergeExports(mergedContent, oldExports);
                await fs.unlink(oldPath);
                console.log(`✓ Merged: ${oldPath} -> ${newPath}`);
              } catch (error) {
                if (error.code === 'ENOENT') {
                  if (config.optionalFiles.includes(oldPath)) {
                    console.warn(`⚠️ Optional file does not exist: ${oldPath}`);
                  } else {
                    console.error(`❌ Required file does not exist: ${oldPath}`);
                    process.exit(1);
                  }
                } else {
                  throw error;
                }
              }
            }
            
            // Write the merged content
            await fs.writeFile(newPath, mergedContent, 'utf8');
            
            // Store rollback commands
            for (const oldPath of oldPaths) {
              rollbackCommands.push(`git mv "${newPath}" "${oldPath}"`);
            }
          } catch (error) {
            if (error.code === 'ENOENT') {
              // Destination doesn't exist, move the first file and merge others
              const firstPath = oldPaths[0];
              try {
                await execAsync(`git mv "${firstPath}" "${newPath}"`);
                console.log(`✓ Moved: ${firstPath} -> ${newPath}`);
                
                // Merge remaining files
                for (const oldPath of oldPaths.slice(1)) {
                  try {
                    const oldContent = await fs.readFile(oldPath, 'utf8');
                    const newContent = await fs.readFile(newPath, 'utf8');
                    const oldExports = extractExports(oldContent);
                    const mergedContent = mergeExports(newContent, oldExports);
                    await fs.writeFile(newPath, mergedContent, 'utf8');
                    await fs.unlink(oldPath);
                    console.log(`✓ Merged: ${oldPath} -> ${newPath}`);
                  } catch (error) {
                    if (error.code === 'ENOENT') {
                      if (config.optionalFiles.includes(oldPath)) {
                        console.warn(`⚠️ Optional file does not exist: ${oldPath}`);
                      } else {
                        console.error(`❌ Required file does not exist: ${oldPath}`);
                        process.exit(1);
                      }
                    } else {
                      throw error;
                    }
                  }
                }
              } catch (error) {
                if (error.code === 'ENOENT') {
                  if (config.optionalFiles.includes(firstPath)) {
                    console.warn(`⚠️ Optional file does not exist: ${firstPath}`);
                  } else {
                    console.error(`❌ Required file does not exist: ${firstPath}`);
                    process.exit(1);
                  }
                } else {
                  throw error;
                }
              }
            } else {
              throw error;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing ${newPath}:`, error);
      process.exit(1);
    }
  }
}

function extractExports(content) {
  const exportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g;
  const exports = [];
  let match;
  
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[0]);
  }
  
  return exports;
}

function mergeExports(baseContent, additionalExports) {
  // Find the last export in the base content
  const lastExportIndex = baseContent.lastIndexOf('export');
  if (lastExportIndex === -1) return baseContent;
  
  // Insert the additional exports before the last export
  const beforeLastExport = baseContent.substring(0, lastExportIndex);
  const lastExport = baseContent.substring(lastExportIndex);
  
  return beforeLastExport + additionalExports.join('\n\n') + '\n\n' + lastExport;
}

async function updateImports(dryRun = false) {
  console.log(dryRun ? 'Planning import updates...' : 'Updating imports...');
  
  // Find all TypeScript/JavaScript files
  const files = await findFiles();
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let updated = false;
      
      for (const [oldImport, newImport] of Object.entries(importMappings)) {
        const regex = new RegExp(`from ['"]${oldImport}['"]`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `from '${newImport}'`);
          updated = true;
        }
      }
      
      if (updated) {
        if (dryRun) {
          console.log(`Would update imports in: ${file}`);
        } else {
          await fs.writeFile(file, content, 'utf8');
          console.log(`✓ Updated imports in: ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error updating imports in ${file}:`, error);
    }
  }
}

async function findFiles() {
  const patterns = [
    'src/**/*.{ts,tsx}',
    ...config.excludePatterns.map(pattern => `!${pattern}`)
  ];
  
  return await globby(patterns, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
  });
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

async function promptForConfirmation(message) {
  const rl = createReadlineInterface();
  
  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  try {
    console.log('Starting migration to feature-first structure...');
    console.log(dryRun ? '(DRY RUN - No changes will be made)' : '');
    
    if (!dryRun) {
      const confirmed = await promptForConfirmation('Do you want to proceed with the migration?');
      if (!confirmed) {
        console.log('Migration cancelled.');
        process.exit(0);
      }
    }
    
    await createDirectories(dryRun);
    await moveFiles(dryRun);
    await updateImports(dryRun);
    
    console.log('\nMigration completed successfully!');
    
    if (!dryRun && rollbackCommands.length > 0) {
      console.log('\nRollback commands have been logged to rollback.log');
      await fs.writeFile('rollback.log', rollbackCommands.join('\n'), 'utf8');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 