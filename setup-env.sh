#!/bin/bash

# LOSLC.tech Environment Setup Script
# This script helps set up the environment configuration files

set -e

echo "🚀 LOSLC.tech Environment Setup"
echo "================================"

# Check if .env files already exist
if [ -f ".env" ]; then
    echo "⚠️  Root .env file already exists. Backup created as .env.backup"
    cp .env .env.backup
fi

if [ -f "backend/.env" ]; then
    echo "⚠️  Backend .env file already exists. Backup created as backend/.env.backup"
    cp backend/.env backend/.env.backup
fi

if [ -f "frontend/.env.local" ]; then
    echo "⚠️  Frontend .env.local file already exists. Backup created as frontend/.env.local.backup"
    cp frontend/.env.local frontend/.env.local.backup
fi

# Copy example files
echo "📁 Copying environment example files..."
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

echo "✅ Environment files created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Edit backend/.env file with your email settings"
echo "3. Update BACKEND_URL in frontend/.env.local if needed"
echo ""
echo "📝 Important files to configure:"
echo "   - .env (Docker Compose configuration)"
echo "   - backend/.env (Backend API configuration)"
echo "   - frontend/.env.local (Frontend configuration)"
echo ""
echo "🚨 Security reminder:"
echo "   - Never commit actual credentials to version control"
echo "   - Use strong passwords for database access"
echo "   - Set up proper email service credentials"
echo ""
echo "🐳 To start with Docker:"
echo "   docker-compose up -d"
echo ""
echo "💻 To start manually:"
echo "   # Terminal 1 - Backend"
echo "   cd backend && bun install && bun run dev"
echo "   # Terminal 2 - Frontend" 
echo "   cd frontend && bun install && bun run dev"
