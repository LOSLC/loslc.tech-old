#!/usr/bin/env fish

# Script to create atomic commits for project changes
# This script is designed to run in the fish shell

set REPO_DIR "/home/frusadev/Workspace/Projects/Pro/loslc.tech"
cd $REPO_DIR

echo "🔍 Analyzing repository changes..."

# Define commit groups and their messages
# Format: "file pattern" "commit message"

# Array of file patterns and corresponding commit messages
set -l commits_array

# Configuration files
set -a commits_array "backend/.prettierrc" "Add Prettier configuration"
set -a commits_array "backend/eslint.config.mjs" "Add ESLint configuration"
set -a commits_array "backend/nest-cli.json" "Add NestJS configuration"
set -a commits_array "backend/.env.example" "Update environment example file"
set -a commits_array "backend/.gitignore" "Update gitignore rules"
set -a commits_array "backend/package.json" "Update package dependencies and scripts"
set -a commits_array "backend/pnpm-lock.yaml" "Add pnpm lockfile"
set -a commits_array "backend/bun.lockb" "Update bun lockfile"
set -a commits_array "backend/tsconfig.json" "Update TypeScript configuration"
set -a commits_array "backend/tsconfig.build.json" "Add TypeScript build configuration"
set -a commits_array "backend/drizzle.config.ts" "Update Drizzle ORM configuration"

# Backend structure
set -a commits_array "backend/entry-point.sh" "Add backend entry point script"
set -a commits_array "backend/README.md" "Update backend documentation"
set -a commits_array "backend/src/app.module.ts" "Create main NestJS application module"
set -a commits_array "backend/src/app.controller.ts" "Add main application controller"
set -a commits_array "backend/src/app.service.ts" "Add main application service"
set -a commits_array "backend/src/app.controller.spec.ts" "Add tests for main application controller"
set -a commits_array "backend/src/main.ts" "Update application bootstrap"

# Core modules
set -a commits_array "backend/src/core/env.ts" "Add environment configuration"
set -a commits_array "backend/src/core/db/db.ts" "Update database connection configuration"
set -a commits_array "backend/src/core/db/schema.ts" "Add main database schema definitions"
set -a commits_array "backend/src/core/db/schemas/" "Add individual schema definitions"
set -a commits_array "backend/src/core/services/" "Add core service implementations"
set -a commits_array "backend/src/core/utils/crypto.ts" "Update cryptography utilities"
set -a commits_array "backend/src/core/utils/random.ts" "Add random value generation utilities"

# Feature modules - Access Management
set -a commits_array "backend/src/accessmgt/accessmgt.module.ts" "Add access management module structure"
set -a commits_array "backend/src/accessmgt/accessmgt.controller.ts backend/src/accessmgt/accessmgt.controller.spec.ts" "Add access management controller and tests"
set -a commits_array "backend/src/accessmgt/accessmgt.service.ts backend/src/accessmgt/accessmgt.service.spec.ts" "Add access management service and tests"
set -a commits_array "backend/src/accessmgt/accessmgt.dto.ts" "Add access management DTOs"
set -a commits_array "backend/src/accessmgt/accessmgt.guard.ts backend/src/accessmgt/accessmgt.guard.spec.ts" "Add access management guard and tests"
set -a commits_array "backend/src/accessmgt/accessmgt.types.ts" "Add access management type definitions"
set -a commits_array "backend/src/accessmgt/bypassroles.decorator.ts" "Add role bypass decorator"
set -a commits_array "backend/src/accessmgt/permissions.decorator.ts" "Add permissions decorator"

# Feature modules - Authentication
set -a commits_array "backend/src/auth/auth.module.ts" "Add authentication module structure"
set -a commits_array "backend/src/auth/auth.controller.ts backend/src/auth/auth.controller.spec.ts" "Add authentication controller and tests"
set -a commits_array "backend/src/auth/auth.service.ts backend/src/auth/auth.service.spec.ts" "Add authentication service and tests"
set -a commits_array "backend/src/auth/auth.dto.ts" "Add authentication DTOs"
set -a commits_array "backend/src/auth/auth.guard.ts backend/src/auth/auth.guard.spec.ts" "Add authentication guard and tests"
set -a commits_array "backend/src/auth/auth.config.ts" "Add authentication configuration"

# Feature modules - Blog
set -a commits_array "backend/src/blog/blog.module.ts" "Add blog module structure"
set -a commits_array "backend/src/blog/blog.controller.ts backend/src/blog/blog.controller.spec.ts" "Add blog controller and tests"
set -a commits_array "backend/src/blog/blog.service.ts backend/src/blog/blog.service.spec.ts" "Add blog service and tests"
set -a commits_array "backend/src/blog/blog.dto.ts" "Add blog DTOs"

# Feature modules - Files
set -a commits_array "backend/src/files/files.module.ts" "Add files module structure"
set -a commits_array "backend/src/files/files.controller.ts backend/src/files/files.controller.spec.ts" "Add files controller and tests"
set -a commits_array "backend/src/files/files.service.ts backend/src/files/files.service.spec.ts" "Add files service and tests"
set -a commits_array "backend/src/files/files.dto.ts" "Add files DTOs"

# Feature modules - Forum
set -a commits_array "backend/src/forum/forum.module.ts" "Add forum module structure"

# Common utilities and helpers
set -a commits_array "backend/src/common/checkers/" "Add validation checkers"
set -a commits_array "backend/src/common/config/" "Add common configurations"
set -a commits_array "backend/src/common/decorators/" "Add common decorators"
set -a commits_array "backend/src/common/dto/" "Add common DTOs"
set -a commits_array "backend/src/common/types/" "Add common type definitions"

# Database migrations
set -a commits_array "backend/src/migrations/0000_sturdy_red_ghost.sql" "Add initial database schema migration"
set -a commits_array "backend/src/migrations/0001_silky_silhouette.sql" "Add user authentication tables migration"
set -a commits_array "backend/src/migrations/0002_flawless_wolverine.sql" "Add blog functionality tables migration"
set -a commits_array "backend/src/migrations/0003_faithful_snowbird.sql" "Add file storage tables migration"
set -a commits_array "backend/src/migrations/0004_volatile_ma_gnuci.sql" "Add forum tables migration"
set -a commits_array "backend/src/migrations/0005_marvelous_iron_monger.sql" "Add access control tables migration"
set -a commits_array "backend/src/migrations/0006_previous_brood.sql" "Add extended user profile tables migration"
set -a commits_array "backend/src/migrations/0007_groovy_hellfire_club.sql" "Add additional indexes and optimizations"
set -a commits_array "backend/src/migrations/meta/0000_snapshot.json" "Update migration snapshot"
set -a commits_array "backend/src/migrations/meta/_journal.json" "Update migration journal"

# File storage
set -a commits_array "backend/fs/storage/" "Add file storage directory structure"
set -a commits_array "backend/fs/storage/69799eb0-9130-4aa9-8c07-5ad14277cb7c" "Add file storage example"

# Frontend changes - Configuration
set -a commits_array "frontend/package.json" "Update frontend dependencies and scripts"
set -a commits_array "frontend/bun.lockb" "Update frontend lockfile"
set -a commits_array "frontend/next.config.ts" "Update Next.js configuration"
set -a commits_array "frontend/components.json" "Update UI component configuration"

# Frontend changes - Layout and Structure
set -a commits_array "frontend/src/app/layout.tsx" "Update app layout structure"
set -a commits_array "frontend/AUTH_README.md" "Add authentication documentation"

# Frontend changes - Core Components
set -a commits_array "frontend/src/components/core/FloatingNav.tsx" "Update floating navigation component"
set -a commits_array "frontend/src/components/core/Hero.tsx" "Update hero section component"
set -a commits_array "frontend/src/components/core/miscellaneous/ThemeSwitcher.tsx" "Update theme switcher component"

# Frontend changes - UI Components
set -a commits_array "frontend/src/components/ui/button.tsx" "Update button component styling and behavior"
set -a commits_array "frontend/src/components/ui/card.tsx" "Update card component styling and behavior"

# Cleanup deleted files - Docker configuration
set -a commits_array "backend/.dockerignore" "Remove backend dockerignore for restructuring"
set -a commits_array "backend/Dockerfile" "Remove backend Dockerfile for restructuring"

# Cleanup deleted files - Scripts
set -a commits_array "backend/entry.bash" "Remove legacy entry script in favor of new entrypoint"

# Cleanup deleted files - API structure
set -a commits_array "backend/src/api/v1/controllers/helloWorld.ts" "Remove legacy controller in favor of NestJS structure"
set -a commits_array "backend/src/api/v1/dto/helloWorld.ts" "Remove legacy DTOs in favor of NestJS structure"
set -a commits_array "backend/src/api/v1/providers/helloWorld.ts" "Remove legacy providers in favor of NestJS services"
set -a commits_array "backend/src/api/v1/router.ts" "Remove legacy router in favor of NestJS controllers"

# Cleanup deleted files - Database Schema
set -a commits_array "backend/src/core/db/schema/auth.ts" "Remove legacy auth schema in favor of new schema structure"
set -a commits_array "backend/src/core/db/schema/security.ts" "Remove legacy security schema in favor of new schema structure"
set -a commits_array "backend/src/core/db/schema/user.ts" "Remove legacy user schema in favor of new schema structure"

# Cleanup deleted files - Security
set -a commits_array "backend/src/core/security/permissions.ts" "Remove legacy permissions system in favor of NestJS guards"

# Cleanup deleted files - Legacy migrations
set -a commits_array "backend/src/migrations/0000_unusual_the_santerians.sql" "Remove outdated migration script"

# Cleanup deleted files - Frontend pages
set -a commits_array "frontend/src/app/code-of-conduct/page.tsx" "Remove code of conduct page for restructuring"
set -a commits_array "frontend/src/app/learn-more/page.tsx" "Remove learn more page for restructuring"
set -a commits_array "frontend/src/app/mission/page.tsx" "Remove mission page for restructuring"
set -a commits_array "frontend/src/app/page.tsx" "Remove home page for restructuring"
set -a commits_array "frontend/src/app/privacy-policy/page.tsx" "Remove privacy policy page for restructuring"
set -a commits_array "frontend/src/app/terms-of-service/page.tsx" "Remove terms of service page for restructuring"

echo "🚀 Starting atomic commits process..."

# Function to perform the atomic commit
function perform_commit
    set -l file_pattern $argv[1]
    set -l commit_message $argv[2]
    
    # Check if there are any files matching the pattern
    set matching_files (git ls-files --modified --others --exclude-standard $file_pattern 2>/dev/null)
    set deleted_files (git ls-files --deleted $file_pattern 2>/dev/null)
    
    if test -n "$matching_files" -o -n "$deleted_files"
        echo "📦 Creating commit: $commit_message"
        
        # Stage the files
        if test -n "$matching_files"
            git add $matching_files
        end
        
        # Stage deleted files
        if test -n "$deleted_files"
            git rm $deleted_files 2>/dev/null
        end
        
        # Commit with the specified message
        git commit -m "$commit_message" || echo "⚠️ Failed to commit: $commit_message"
    end
end

# Main execution loop
for i in (seq 1 2 (count $commits_array))
    set file_pattern $commits_array[$i]
    set commit_message $commits_array[(math $i + 1)]
    
    perform_commit "$file_pattern" "$commit_message"
end

# Check for any remaining changes
set remaining_changes (git status --porcelain)
if test -n "$remaining_changes"
    echo "⚠️ There are still uncommitted changes:"
    git status --short
    
    read -l -P "Do you want to commit these changes with a generic message? (y/n) " should_commit
    
    if test "$should_commit" = "y"
        git add --all
        git commit -m "Miscellaneous changes"
        echo "✅ Committed remaining changes"
    else
        echo "❗ Uncommitted changes remain"
    end
else
    echo "✅ All changes have been committed"
end

echo "🎉 Atomic commits process complete"
