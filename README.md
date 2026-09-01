<div align="center">

# ✈️ BRAC Airline Booking Service

**A full-stack airline management and booking platform, built with Next.js and MySQL following a strict MVC architecture.**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

</div>

---

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture-mvc)
- [Role-Based Access Control](#role-based-access-control)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Demo Accounts](#demo-accounts)
- [Team & Contributions](#team--contributions)
- [Course Information](#course-information)

---

## About

BRAC Airline Booking Service is an end-to-end airline management system covering everything from flight scheduling and dynamic pricing to seat selection, digital boarding passes, crew operations, and revenue analytics. It was built incrementally across four sprints for a Software Engineering course, following the **Model-View-Controller (MVC)** pattern required by the course, with every layer — Model, View, and Controller — kept strictly separated.

## Features

<details>
<summary><strong>🔐 Foundation & Auth</strong></summary>

- Role-based authentication (Admin / Passenger / Crew / Ground Staff) with JWT sessions
- A single, fixed administrator account — no self-registration as Admin
- Forgot password / reset password via emailed reset link
</details>

<details>
<summary><strong>🛫 Flight Operations</strong></summary>

- Flight scheduling (full CRUD)
- Real-time flight status board (auto-refreshing) + quick status updates
- Aircraft fleet & gate management, aircraft/gate assignment
- Dynamic fare pricing based on seat occupancy and days-to-departure
- Integration logic: cancelling or landing a flight automatically releases its aircraft and gate
</details>

<details>
<summary><strong>🎫 Passenger Experience</strong></summary>

- Flight search & booking (guest checkout, or logged-in with bookings linked to "My Bookings")
- Interactive seat map + meal preference selection
- Digital, QR-coded boarding pass, emailed on request
- Passenger self-service booking cancellation
- Baggage registration, tracking, and extra-fee calculation
- Lost & found baggage reporting
- Special assistance requests
- Loyalty points program (Bronze → Silver → Gold → Platinum)
- Feedback & complaints
</details>

<details>
<summary><strong>👨‍✈️ Crew & Ground Operations</strong></summary>

- Crew attendance (clock in/out) and personal work history
- Crew scheduling and each crew member's personal flight schedule
- Crew certification monitoring (Valid / Expiring Soon / Expired)
- Aircraft maintenance scheduling
- Aircraft fault reporting — Major/Critical faults automatically ground the aircraft
- Priority boarding groups & boarding queue management (Ground Staff)
</details>

<details>
<summary><strong>📊 Admin</strong></summary>

- Central dashboard with live operational stats and alerts
- Revenue & expense analytics dashboard (Chart.js)
- Search + pagination on high-traffic admin tables
</details>

## Tech Stack

| Category | Technology |
|---|---|
| Language | JavaScript |
| Framework | Next.js (Pages Router) |
| Styling | Bootstrap 5 + a custom design system |
| Database | MySQL |
| DB Driver | mysql2 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| QR Codes | qrcode |
| Email | Nodemailer |
| Charts | Chart.js |
| Testing | Jest |
| Icons / Font | Bootstrap Icons / Inter (Google Fonts) |

## Architecture (MVC)

```
Browser (React Views)
      │  fetch()
      ▼
pages/api/**        ← Route layer — receives the HTTP request, delegates to a controller
      │
      ▼
controllers/**       ← Business logic, validation, authorization (requireRole)
      │
      ▼
models/**            ← The only layer that talks to MySQL directly
      │
      ▼
MySQL Database
```

- **Model** (`models/*.js`) — raw, parameterized SQL queries only. No business logic.
- **View** (`pages/*.js`, non-API) — React components that fetch from the API and render UI.
- **Controller** (`controllers/*.js`) — validation, business rules, and authorization checks, invoked by the thin route handlers in `pages/api/`.

## Role-Based Access Control

Every role sees only what belongs to it. Authorization is enforced **server-side** (`lib/auth.js`'s `requireRole()`) on every restricted route — not just hidden in the UI — so it can't be bypassed by calling the API directly.

| Area | Passenger | Crew | Ground Staff | Admin |
|---|:---:|:---:|:---:|:---:|
| Book flights, seats/meals, boarding pass, cancel own booking | ✅ | ✅ | ✅ | ✅ |
| Register/track own baggage, submit requests & feedback | ✅ | ✅ | ✅ | ✅ |
| Crew dashboard, attendance, schedule, certifications, fault reporting | ❌ | ✅ | ❌ | ✅ |
| Ground staff dashboard, boarding queue, assistance & lost-baggage management | ❌ | ❌ | ✅ | ✅ |
| Admin dashboard, flight/fleet CRUD, crew scheduling, maintenance, analytics, expenses | ❌ | ❌ | ❌ | ✅ |

Admin accounts cannot be self-registered — see [Demo Accounts](#demo-accounts).

## Project Structure

```
components/     Shared UI (Navbar, Footer, Toasts, Skeletons, guards)
controllers/    Business logic + authorization
models/         Database access layer
lib/            DB connection, JWT/auth helpers, dynamic pricing, mailer, hooks
pages/          Next.js Views and pages/api Routes
public/         Static assets, favicon
sql/            Schema files — run in order, see below
styles/         Global design system
__tests__/      Jest unit tests
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (LTS)
- [Git](https://git-scm.com)
- A MySQL database — this project was built against [Aiven](https://aiven.io)'s free MySQL tier (any MySQL 8+ instance works)

### 1. Clone the repository
```bash
git clone https://github.com/Tahim-Chy/airline-management-system.git
cd airline-management-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the project root:
```env
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=a-long-random-string
```

### 4. Set up the database
Run every file in `/sql`, **in this exact order**, against your database (MySQL Workbench, Aiven's console, or any MySQL client):

1. `schema-sprint1.sql`
2. `schema-sprint2.sql`
3. `schema-sprint3.sql`
4. `schema-sprint4.sql`
5. `schema-final-polish.sql`
6. `schema-enhancements.sql`
7. `schema-rbac-admin-seed.sql`

All of them are additive (`CREATE TABLE` / `ALTER TABLE ... ADD COLUMN`) — none drop existing data, so they're safe to run once and leave alone.

### 5. Run the app
```bash
npm run dev
```
Visit **http://localhost:3000**.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run Jest in watch mode |

## Testing

Two layers back this project:
1. **Automated tests** (`__tests__/`, run via `npm test`) — 35 tests covering the pure business-logic functions (dynamic pricing, baggage fees, loyalty tiers, certification status) and the authorization logic (`requireRole`) itself.
2. **Manual test plan** — a 58-case spreadsheet covering every feature across all four sprints and cross-module integration scenarios (included separately in the project submission).

## Demo Accounts

**Admin** — there is exactly one, seeded by `sql/schema-rbac-admin-seed.sql`, not through registration:
```
Email:    bracu470admin@gmail.com
Password: bracu470admin
```

**Passenger / Crew / Ground Staff** — register your own at `/register`; the role is selectable there (Admin is intentionally not an option).

## Team & Contributions

| Member | ID | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
|---|---|---|---|---|---|
| **Tahamidul Alam Chowdhury** | 22299066 | Auth Foundation, Flight Scheduling Management | Aircraft Assignment, Gate Allocation | Flight Status Tracking, Dynamic Fare Management | Module Integration & Testing |
| **Asif Ad Deen Udatta** | 21301630 | Online Ticket Booking | Seat Selection & Meal Preference | Special Assistance, Loyalty Program | Digital Boarding Pass Generation |
| **Mydul Islam Lisun** | 21301594 | Baggage Tracking System | Extra Baggage Fee, Priority Boarding & Queue | Lost & Found Baggage Management | Revenue & Expense Analytics, Complaint & Feedback |
| **Swagata Dey** | 22201512 | Crew Attendance & Data Login | Crew Scheduling System | Crew Certification Monitoring, Aircraft Maintenance | Aircraft Fault Reporting System |

The final design overhaul, feature enhancements (My Bookings, cancellation, forgot password, search/pagination, automated testing), and the role-based access control fix were applied as team-wide integration passes on top of all four sprints.

## Course Information

Built for **CSE470 (Software Engineering)**, BRAC University — Summer 2026, following the MVC architectural pattern required by the course.
