#!/bin/bash

# Script to commit the remaining frontend changes atomically
set -e  # Exit on any error

echo "🚀 Starting atomic commits for remaining changes..."

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

# 1. Frontend Package and Dependencies
echo "📦 Committing frontend package changes..."
make_commit "feat: update frontend dependencies and package configuration" \
    "frontend/package.json" \
    "frontend/bun.lockb"

# 2. UI Components Library - New components
echo "🎨 Committing new UI components..."
make_commit "feat: add new UI components (dropdown, hover-card, select, spinner, tabs, textarea)" \
    "frontend/src/components/ui/dropdown-menu.tsx" \
    "frontend/src/components/ui/hover-card.tsx" \
    "frontend/src/components/ui/select.tsx" \
    "frontend/src/components/ui/spinner.tsx" \
    "frontend/src/components/ui/tabs.tsx" \
    "frontend/src/components/ui/textarea.tsx"

# 3. Core Frontend Components Updates
echo "🔧 Committing core frontend component updates..."
make_commit "feat: update core frontend navigation component" \
    "frontend/src/components/core/FloatingNav.tsx"

# 4. New Component Directories
echo "🏗️ Committing new component directories..."
make_commit "feat: add common and dev component utilities" \
    "frontend/src/components/common/" \
    "frontend/src/components/dev/"

# 5. Admin Components and Guards
echo "🛡️ Committing admin components and guards..."
make_commit "feat: implement admin interface components and route guards" \
    "frontend/src/components/admin/" \
    "frontend/src/components/guards/admin-guards.tsx"

# 6. API Client Libraries
echo "🌐 Committing API client libraries..."
make_commit "feat: implement comprehensive API client libraries" \
    "frontend/src/lib/api/admin.ts" \
    "frontend/src/lib/api/blog.ts" \
    "frontend/src/lib/api/users.ts"

# 7. Utility Libraries and Hooks
echo "🔗 Committing utility libraries and custom hooks..."
make_commit "feat: add utility libraries and custom React hooks" \
    "frontend/src/lib/hooks/" \
    "frontend/src/lib/utils/"

# 8. Admin Interface Pages
echo "📊 Committing admin interface pages..."
make_commit "feat: implement comprehensive admin dashboard and management pages" \
    "frontend/src/app/(admin)/admin/"

# 9. Admin Layout Update
echo "🏗️ Committing admin layout updates..."
make_commit "feat: update admin layout configuration" \
    "frontend/src/app/(admin)/layout.tsx"

# 10. Blog Interface Pages
echo "📖 Committing blog interface pages..."
make_commit "feat: implement blog interface with post management and public views" \
    "frontend/src/app/(blog)/"

# 11. Authentication Pages and Global Styles
echo "🎨 Committing authentication pages and global styles..."
make_commit "feat: update authentication pages and global styling" \
    "frontend/src/app/(main)/auth/verify-otp/page.tsx" \
    "frontend/src/app/globals.css"

# 12. Documentation and Assets
echo "📚 Committing documentation and assets updates..."
make_commit "docs: update README and project assets" \
    "README.md" \
    "frontend/public/lmevent.png"

# 13. Add the commit scripts
echo "🚀 Committing the atomic commit scripts..."
make_commit "chore: add atomic commit scripts for project changes" \
    "commit-changes.sh" \
    "commit-remaining.sh"

echo "🎉 All commits completed successfully!"
echo "📋 Summary of recent commits:"
git log --oneline -15

echo ""
echo "🔍 Current repository status:"
git status --short

echo ""
echo "✨ Atomic commits process completed! ✨"
