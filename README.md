# BizTrack Mobile App (React Native & Expo)

Mobile app version converted directly from the web project `C:\Users\nts0195\Music\Business`.

---

## 📱 Features Converted from Business Web Application

### 1. 🔐 Authentication & Session
- **Login Screen** (`LoginScreen.tsx`): Phone & password login connected to backend API `POST /api/login`.
- **Password Visibility**: Eye toggle for password input.
- **Session Persistence**: Stored with `@react-native-async-storage/async-storage` (`biz_session`).
- **Auto-Login**: Resumes active session on app restart.
- **Logout**: Safe session clearance and redirects to login.

### 2. 👥 Customer Details (Core Module)
- **Live Backend Integration**: Connected to live API (`https://business-be-xdp6.onrender.com/api/customers`).
- **Real-Time Search**: Search across name, email, phone, native, district, and address.
- **Summary Metrics Bar**: Instant view of Total Customers, Received amount, and Outstanding Balance.
- **Customer Cards**:
  - Customer index, name, phone, email, native, district, address.
  - Financial strip displaying Total Amount, Paid, and Balance.
  - Status indicator: `Completed` (Green) or `Pending` (Amber).
- **Add / Edit Modal** (`CustomerFormModal.tsx`):
  - Full Name, Email, 10-digit Phone, Native, District, Total Amount, Amount Received, auto-calculated Balance and Status, multi-line Address.
  - Complete form field validation.
- **Record Payment Modal** (`PaymentModal.tsx`):
  - Record payment amounts and optional notes (`POST /api/customers/:id/payment`).
- **Payment History Modal** (`PaymentHistoryModal.tsx`):
  - View all prior payments in reverse chronological order with formatted dates and notes.
- **Delete Customer**: Confirmation prompt and soft delete (`DELETE /api/customers/:id`).
- **Pull to Refresh**: Seamless list refreshing.

### 3. 🔒 Self Details & Security
- **PIN Protection**: Requires 6-digit PIN before granting access to Self Details (`PinModal.tsx`).
- **Dynamic Check**: Checks `GET /api/user/:userId` for `has_menu_pin`.
  - If unset: Prompts to set 6-digit PIN (`POST /api/set-menu-pin`).
  - If set: Prompts to verify 6-digit PIN (`POST /api/verify-menu-pin`).
- **Auto-Lock**: Automatically locks when navigating away from the screen.

### 4. 🧭 Mobile Navigation & Drawer
- **Header** (`Header.tsx`):
  - Hamburger menu toggle.
  - Screen title.
  - Theme toggle (Light ☀️ / Dark 🌙).
  - Profile avatar with initial letter.
- **Slide-in Drawer Menu** (`DrawerMenu.tsx`):
  - BizTrack branding.
  - Direct navigation to all screens:
    - 📊 Dashboard
    - 👥 Customer Details
    - 🔒 Self Details (triggers PIN unlock flow)
    - 📈 Analytics
    - 📦 Orders
    - 👥 Customers
    - 🏷️ Products
    - 💬 Messages
    - ⚙️ Settings
  - Footer displaying active administrator profile.

### 5. 👤 Profile & Account Actions
- **Profile Modal** (`ProfileModal.tsx`):
  - Change Username (`POST /api/change-username`).
  - Change Password (`POST /api/change-password` with strength checks).
  - Change 6-Digit PIN (`POST /api/set-menu-pin`).
  - Logout confirmation.

### 6. 🎨 Theme Support
- Full **Light Mode** & **Dark Mode** with persistent theme saving in AsyncStorage (`ThemeContext.tsx`).
- LinearGradient branding matching web design (`#667eea` to `#764ba2`).

### 7. 📄 Supplementary Screens
- **DashboardScreen**: Revenue, orders, customer metrics, growth cards, and recent orders.
- **CustomersScreen**: Customer directory overview.
- **OrdersScreen**: Orders list with status filter chips (All, Completed, Pending, Processing, Cancelled).
- **ProductsScreen**: Product catalog with category, stock, and pricing.
- **MessagesScreen**: Customer inbox with unread counter.
- **AnalyticsScreen**: Traffic and engagement channels.
- **SettingsScreen**: Account profile details, notifications toggle, and password change.

---

## 🚀 How to Run the App

### 1. Start the Expo Development Server
```bash
npx expo start
```

### 2. View on Device
- **Physical Phone**: Install **Expo Go** from Google Play Store or Apple App Store and scan the QR code.
- **Android Emulator**: Press `a` in the terminal.
- **Web Browser**: Press `w` in the terminal.

### 3. Verify Code Quality
```bash
# Typecheck
npx tsc --noEmit

# Diagnostic check
npx expo-doctor
```

---

## 🌐 API Configuration
API endpoints are defined in [`src/config/api.ts`](file:///c:/Users/nts0195/Music/Mobile/src/config/api.ts):
- Defaults to live backend: `https://business-be-xdp6.onrender.com`
- Easily switchable to local `http://localhost:4000` or local network IP if running the Express server locally.
