# Shared Workspace Booking API

A secure, enterprise-grade RESTful API built to manage room reservations, enforce hierarchical role-based access control (RBAC), and manage atomic user balances. Engineered using a structured MVC architecture, Node.js, Express, and PostgreSQL.

## 🚀 Key Architectural Features
- **Atomic Balance Transactions**: Utilizes PostgreSQL isolation pools (`BEGIN`, `COMMIT`, `ROLLBACK`) to guarantee user wallets are safely debited and automatically restored if a booking operation crashes midway.
- **Hierarchical Role Verification**: Maps structural authority metrics (`employee` < `manager` < `admin`) to dynamically protect executive spaces from unauthorized access tokens.
- **Race Condition & Overlap Prevention**: Implements strict time-interval collision algorithms to block duplicate booking reservations for identical hour windows.
- **Centralized Error Dispatch**: Connects a uniform Express error-handling middleware matrix to gracefully intercept validation, connection, or authentication exceptions.

---

## 🛠️ Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database Engine**: PostgreSQL
- **Migration Suite**: node-pg-migrate
- **Cryptography & Security**: bcryptjs, jsonwebtoken (JWT)
- **Environment Gateway**: cross-env, dotenv

---

## 📂 Project Directory Structure
```text
├── config/
│   └── db.js               # PostgreSQL connection pool allocation
├── controllers/
│   ├── bookingController.js # Handles reservation parsing and contextual requests
│   ├── roomController.js    # Logic boundaries for room setup
│   └── userController.js    # Governs onboarding and token verification
├── middleware/
│   ├── authMiddleware.js    # Intercepts, extracts, and decodes JWT payloads
│   └── errorHandler.js      # Global error capture and status mapping pipeline
├── migrations/              # Database schema evolutionary scripts
├── models/
│   ├── bookingModel.js      # High-isolation database query interactions
│   ├── roomModel.js         # Direct queries to the rooms catalog
│   └── userModel.js         # Direct queries for user profiles
├── routes/
│   ├── bookingRoute.js      # Enforces token guards on booking collection paths
│   ├── roomRoute.js         # Room operational endpoints
│   └── userRoute.js         # User registration and verification collection
├── scripts/
│   └── seed.js              # Automatic development sandbox data populator
├── .env                     # Environmental keys configuration
├── app.js                   # Express application bootstrap bootstrapper
└── package.json             # Engine dependency configuration manifest
```
## ⚙️ Installation & Local Setup Blueprint
### 1. Clone the repository and install dependencies
```bash
git clone <your-repository-url>
cd workspace-booking-api
npm install
```
### 2. Configure Environmental Profiles
Create a .env file inside the root workspace and set up your variables:

``` bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://postgres:<your_password>@localhost:5432/workspace_booking_db
PGSSLMODE=disable
JWT_SECRET=your_super_secret_corporate_cryptographic_key
```
### 3. Execute Schema Migrations and Populate Mock Data
Compile your relational tables and seed your system entities:

```bash
# Compile tables
npm run migrate:up
# Run automated seeder script
npm run db:seed
```
### 4. Boot the Development Engine
```bash
npm run dev
```
## 🔒 Security Specifications
All secure path segments mandate passing a valid signed JSON Web Token via the HTTP Authorization request header. The token payload securely encapsulates the caller's id and designated role
