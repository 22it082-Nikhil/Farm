#!/bin/bash

# FarmConnect - Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting FarmConnect..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Backend directory
BACKEND_DIR="$SCRIPT_DIR/backend"
# Frontend directory
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Check if node_modules exists in backend
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$BACKEND_DIR"
    npm install
fi

# Check if node_modules exists in frontend
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$FRONTEND_DIR"
    npm install
fi

echo ""
echo -e "${GREEN}✅ Dependencies ready!${NC}"
echo ""
echo -e "${BLUE}🔧 Starting servers...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC} http://localhost:5001"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping servers...${NC}"
    kill 0
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Start backend in background
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait
