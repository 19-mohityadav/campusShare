# CampusShare

A modern, full-stack application for sharing, borrowing, and connecting with your campus community. 

## Features
- **Item Listings**: List items you're willing to share.
- **Request Flow**: Seamlessly borrow items from peers.
- **Real-time Chat**: Connect with lenders/borrowers.
- **Admin Dashboard**: Comprehensive management of users, listings, and reports.

## Project Structure
- `client/`: React/Vite/Tailwind frontend.
- `server/`: Node.js/Express/MongoDB backend.

## Getting Started
1. **Prerequisites**: Ensure you have Node.js and MongoDB installed.
2. **Install Dependencies**:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. **Environment Setup**:
   - Create `.env` files in both `client/` and `server/` using standard keys (PORT, MONGO_URI, CLOUDINARY_URL, etc.).
4. **Run the App**:
   From the root directory:
   ```bash
   npm run dev
   ```

## Design Aesthetics
The application uses a modern **Glassmorphism** aesthetic with a curated dark theme, smooth transitions using `framer-motion`, and responsive layouts.
