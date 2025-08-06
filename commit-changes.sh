#!/bin/bash

# Script to make atomic commits of all changes
# This script groups related changes into logical commits

set -e  # Exit on any error

echo "🚀 Starting atomic commits process..."

# Function to make a commit with message
make_commit() {
    local message="$1"
    echo "📝 Committing: $message"
    git add "${@:2}"
    git commit -m "$message"
    echo "✅ Committed: $message"
    echo ""
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# 1. Environment and Setup Configuration
echo "🔧 Committing environment and setup changes..."
make_commit "feat: add environment setup script and update configs" \
    "setup-env.sh" \
    ".env.example" \
    "backend/.env.example" \
    "backend/.gitignore" \
    "backend/entry-point.sh" \
    "docker-compose.yml"

# 2. Database Schema and Migrations
echo "🗄️ Committing database changes..."
make_commit "feat: update database schema and add new migration" \
    "backend/src/core/db/schema.ts" \
    "backend/src/migrations/0008_opposite_hellcat.sql" \
    "backend/src/migrations/meta/0008_snapshot.json" \
    "backend/src/migrations/meta/_journal.json"

# 3. Core Backend Configuration
echo "⚙️ Committing backend core config changes..."
make_commit "feat: update backend core configuration and environment handling" \
    "backend/src/core/env.ts" \
    "backend/src/main.ts"

# 4. Authentication and Access Management Backend
echo "🔐 Committing authentication and access management changes..."
make_commit "feat: enhance authentication and access management system" \
    "backend/src/auth/auth.service.ts" \
    "backend/src/accessmgt/accessmgt.controller.ts" \
    "backend/src/accessmgt/accessmgt.service.ts"

# 5. User Management Backend
echo "👥 Committing user management backend changes..."
make_commit "feat: update user management system with new features" \
    "backend/src/users/users.controller.ts" \
    "backend/src/users/users.dto.ts" \
    "backend/src/users/users.service.ts"

# 6. Blog System Backend
echo "📝 Committing blog system backend changes..."
make_commit "feat: implement comprehensive blog management system" \
    "backend/src/blog/blog.controller.ts" \
    "backend/src/blog/blog.dto.ts" \
    "backend/src/blog/blog.service.ts"

# 7. File Management Backend
echo "📁 Committing file management changes..."
make_commit "feat: enhance file management system" \
    "backend/src/files/files.controller.ts" \
    "backend/src/files/files.service.ts"

# 8. Remove obsolete files (skip ignored files)
echo "🗑️ Committing file deletions..."
if git ls-files --deleted | grep -q "frontend/src/app/dashboard/page.tsx"; then
    make_commit "chore: remove obsolete dashboard page" \
        "frontend/src/app/dashboard/page.tsx"
else
    echo "ℹ️ No obsolete files to remove or they are ignored"
fi

# 9. Frontend Package and Dependencies
echo "📦 Committing frontend package changes..."
make_commit "feat: update frontend dependencies and package configuration" \
    "frontend/package.json" \
    "frontend/bun.lockb"

# 10. UI Components Library - New components
echo "🎨 Committing new UI components..."
make_commit "feat: add new UI components (dropdown, hover-card, select, spinner, tabs, textarea)" \
    "frontend/src/components/ui/dropdown-menu.tsx" \
    "frontend/src/components/ui/hover-card.tsx" \
    "frontend/src/components/ui/select.tsx" \
    "frontend/src/components/ui/spinner.tsx" \
    "frontend/src/components/ui/tabs.tsx" \
    "frontend/src/components/ui/textarea.tsx"

# 11. Core Frontend Components Updates
echo "🔧 Committing core frontend component updates..."
make_commit "feat: update core frontend navigation component" \
    "frontend/src/components/core/FloatingNav.tsx"

# 12. New Component Directories
echo "🏗️ Committing new component directories..."
make_commit "feat: add common and dev component utilities" \
    "frontend/src/components/common/" \
    "frontend/src/components/dev/"

# 13. Admin Components and Guards
echo "🛡️ Committing admin components and guards..."
make_commit "feat: implement admin interface components and route guards" \
    "frontend/src/components/admin/" \
    "frontend/src/components/guards/admin-guards.tsx"

# 14. API Client Libraries
echo "🌐 Committing API client libraries..."
make_commit "feat: implement comprehensive API client libraries" \
    "frontend/src/lib/api/admin.ts" \
    "frontend/src/lib/api/blog.ts" \
    "frontend/src/lib/api/users.ts"

# 15. Utility Libraries and Hooks
echo "🔗 Committing utility libraries and custom hooks..."
make_commit "feat: add utility libraries and custom React hooks" \
    "frontend/src/lib/hooks/" \
    "frontend/src/lib/utils/"

# 16. Admin Interface Pages
echo "📊 Committing admin interface pages..."
make_commit "feat: implement comprehensive admin dashboard and management pages" \
    "frontend/src/app/(admin)/admin/"

# 17. Admin Layout Update
echo "🏗️ Committing admin layout updates..."
make_commit "feat: update admin layout configuration" \
    "frontend/src/app/(admin)/layout.tsx"

# 18. Blog Interface Pages
echo "📖 Committing blog interface pages..."
make_commit "feat: implement blog interface with post management and public views" \
    "frontend/src/app/(blog)/"

# 19. Authentication Pages and Global Styles
echo "🎨 Committing authentication pages and global styles..."
make_commit "feat: update authentication pages and global styling" \
    "frontend/src/app/(main)/auth/verify-otp/page.tsx" \
    "frontend/src/app/globals.css"

# 20. Documentation and Assets
echo "📚 Committing documentation and assets updates..."
make_commit "docs: update README and project assets" \
    "README.md" \
    "frontend/public/lmevent.png"

# 21. Add the commit script itself
echo "🚀 Committing the atomic commit script..."
make_commit "chore: add atomic commit script for project changes" \
    "commit-changes.sh"

echo "🎉 All commits completed successfully!"
echo "📋 Summary of commits made:"
git log --oneline -18

echo ""
echo "🔍 Current repository status:"
git status --short

echo ""
echo "✨ Atomic commits process completed! ✨"
