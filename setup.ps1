# Create Client structure
$clientDirs = @(
    "client/public",
    "client/src/assets/images",
    "client/src/assets/icons",
    "client/src/assets/illustrations",
    "client/src/components/common",
    "client/src/components/ui",
    "client/src/components/cards",
    "client/src/components/chat",
    "client/src/components/layout",
    "client/src/pages/auth",
    "client/src/pages/onboarding",
    "client/src/pages/dashboard",
    "client/src/pages/requests",
    "client/src/pages/chat",
    "client/src/pages/activity",
    "client/src/pages/profile",
    "client/src/pages/notifications",
    "client/src/pages/admin",
    "client/src/routes",
    "client/src/context",
    "client/src/services",
    "client/src/hooks",
    "client/src/utils"
)

foreach ($dir in $clientDirs) {
    New-Item -ItemType Directory -Force -Path $dir
}

$clientFiles = @(
    "client/public/index.html",
    "client/src/components/common/Navbar.jsx",
    "client/src/components/common/Sidebar.jsx",
    "client/src/components/common/Footer.jsx",
    "client/src/components/common/ProtectedRoute.jsx",
    "client/src/components/common/Loader.jsx",
    "client/src/components/ui/Button.jsx",
    "client/src/components/ui/Input.jsx",
    "client/src/components/ui/Card.jsx",
    "client/src/components/ui/Modal.jsx",
    "client/src/components/ui/Badge.jsx",
    "client/src/components/cards/ItemCard.jsx",
    "client/src/components/cards/RequestCard.jsx",
    "client/src/components/cards/NotificationCard.jsx",
    "client/src/components/cards/ActivityCard.jsx",
    "client/src/components/chat/ChatWindow.jsx",
    "client/src/components/chat/ChatHeader.jsx",
    "client/src/components/chat/MessageBubble.jsx",
    "client/src/components/chat/ChatInput.jsx",
    "client/src/components/layout/AuthLayout.jsx",
    "client/src/components/layout/MainLayout.jsx",
    "client/src/components/layout/AdminLayout.jsx",
    "client/src/pages/auth/Landing.jsx",
    "client/src/pages/auth/Login.jsx",
    "client/src/pages/auth/Signup.jsx",
    "client/src/pages/onboarding/Onboarding.jsx",
    "client/src/pages/dashboard/Dashboard.jsx",
    "client/src/pages/dashboard/SearchResults.jsx",
    "client/src/pages/dashboard/ItemDetails.jsx",
    "client/src/pages/requests/RequestFlow.jsx",
    "client/src/pages/requests/LenderRequests.jsx",
    "client/src/pages/chat/ChatPage.jsx",
    "client/src/pages/activity/Activity.jsx",
    "client/src/pages/profile/Profile.jsx",
    "client/src/pages/profile/EditProfile.jsx",
    "client/src/pages/notifications/Notifications.jsx",
    "client/src/pages/admin/AdminDashboard.jsx",
    "client/src/pages/admin/Users.jsx",
    "client/src/pages/admin/Listings.jsx",
    "client/src/pages/admin/Reports.jsx",
    "client/src/routes/AppRoutes.jsx",
    "client/src/context/AuthContext.jsx",
    "client/src/context/AppContext.jsx",
    "client/src/context/SocketContext.jsx",
    "client/src/services/api.js",
    "client/src/services/authService.js",
    "client/src/services/itemService.js",
    "client/src/services/requestService.js",
    "client/src/services/chatService.js",
    "client/src/services/notificationService.js",
    "client/src/services/adminService.js",
    "client/src/hooks/useAuth.js",
    "client/src/hooks/useSocket.js",
    "client/src/hooks/useDebounce.js",
    "client/src/utils/constants.js",
    "client/src/utils/helpers.js",
    "client/src/utils/formatters.js",
    "client/src/App.jsx",
    "client/src/main.jsx",
    "client/.env",
    "client/tailwind.config.js"
)

foreach ($file in $clientFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file
    }
}

# Create Server structure
$serverDirs = @(
    "server/config",
    "server/controllers",
    "server/models",
    "server/routes",
    "server/middleware",
    "server/utils"
)

foreach ($dir in $serverDirs) {
    New-Item -ItemType Directory -Force -Path $dir
}

$serverFiles = @(
    "server/config/db.js",
    "server/config/cloudinary.js",
    "server/config/socket.js",
    "server/controllers/authController.js",
    "server/controllers/userController.js",
    "server/controllers/itemController.js",
    "server/controllers/requestController.js",
    "server/controllers/chatController.js",
    "server/controllers/notificationController.js",
    "server/controllers/ratingController.js",
    "server/controllers/adminController.js",
    "server/models/User.js",
    "server/models/Item.js",
    "server/models/Request.js",
    "server/models/Chat.js",
    "server/models/Message.js",
    "server/models/Notification.js",
    "server/models/Review.js",
    "server/models/Report.js",
    "server/routes/authRoutes.js",
    "server/routes/userRoutes.js",
    "server/routes/itemRoutes.js",
    "server/routes/requestRoutes.js",
    "server/routes/chatRoutes.js",
    "server/routes/notificationRoutes.js",
    "server/routes/ratingRoutes.js",
    "server/routes/adminRoutes.js",
    "server/middleware/authMiddleware.js",
    "server/middleware/adminMiddleware.js",
    "server/middleware/errorMiddleware.js",
    "server/middleware/uploadMiddleware.js",
    "server/utils/generateToken.js",
    "server/utils/sendEmail.js",
    "server/utils/validators.js",
    "server/app.js",
    "server/server.js",
    "server/.env"
)

foreach ($file in $serverFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file
    }
}

# Root files
$rootFiles = @(
    ".gitignore",
    "README.md"
)

foreach ($file in $rootFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file
    }
}
