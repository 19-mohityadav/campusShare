# CampusShare 🚀
Campusshare is a MERN-stack application designed for students to share, lend, and borrow items within their campus community.

## 📦 Features
- **User Authentication**: Email/Password, Google OAuth, and OTP (Email/Phone).
- **Dashboard**: Browse items by category or location.
- **Item Management**: Add items with images (Cloudinary) and descriptions.
- **Chat System**: Real-time-ready chat with item context.
- **Responsive UI**: Glassmorphism design inspired by modern aesthetics.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Storage**: Cloudinary (Image handling).

---

## 🚀 Getting Started

### 1. Installation
Install dependencies for the root, client, and server:
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Environment Setup
Check `.env` files in both `client/` and `server/` directories.
- **Server**: Ensure `MONGO_URI` and `JWT_SECRET` are set.
- **Client**: Ensure `VITE_API_URL=http://localhost:5000` is set.

### 3. Database Seeding (Verifiability)
To populate the database with mock items and users for testing, run:
```bash
npm run seed
```
This will clear existing data and insert 3 users and 3 items with real relationships.

### 4. Running the App
Start both frontend and backend concurrently:
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## ✅ Verification Steps
1. **Import Data**: Run `npm run seed`.
2. **Login**: Use `mohit@college.edu` / `password123` to log in.
3. **Verify Dashboard**: Check if the "Scientific Calculator" and "Drawing Kit" are visible.
4. **View Item**: Click on an item to see its detailed description and owner info.
5. **Chat**: Click "Chat with Owner" from the item details page to verify the dynamic chat context.

---
Developed by Mohit Yadav & Antigravity.
