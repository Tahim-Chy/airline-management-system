# BRAC Airline Booking Service

A full-stack airline management and booking system built for the CSE470 Software Engineering course, following the **Model-View-Controller (MVC)** architecture as required by the course guidelines.

## Tech Stack

| Category | Technology |
|---|---|
| Language | JavaScript |
| Framework | Next.js (Pages Router) |
| Styling | Bootstrap 5 + a custom design system (CSS variables) |
| Database | MySQL |
| DB Driver | mysql2 |
| Authentication | JWT + bcryptjs |
| QR Codes | qrcode |
| Email | Nodemailer (Ethereal test SMTP) |
| Charts | Chart.js |
| Testing | Jest (automated) + a 58-case manual test plan |
| Icons | Bootstrap Icons |
| Font | Inter (Google Fonts) |

## Features

**Foundation**
- Role-based authentication (Admin / Passenger / Crew / Ground Staff), JWT sessions
- Forgot password / reset password via emailed reset link

**Flight Operations**
- Flight scheduling (CRUD), real-time status board, quick status updates
- Aircraft fleet & gate management, aircraft/gate assignment
- Dynamic fare pricing based on seat occupancy and days-to-departure
- Module integration: cancelling/landing a flight auto-releases its aircraft and gate

**Passenger Experience**
- Flight search & booking (guest or logged-in — logged-in bookings link to "My Bookings")
- Interactive seat map + meal preference selection
- Digital QR-coded boarding pass, emailed on request
- Passenger self-service booking cancellation
- Baggage registration, tracking, and extra-fee calculation
- Lost & found baggage reporting
- Special assistance requests
- Loyalty points program (Bronze → Platinum tiers)
- Feedback & complaints

**Crew & Operations**
- Crew attendance (clock in/out), crew scheduling, personal flight schedule
- Crew certification monitoring (Valid / Expiring Soon / Expired)
- Aircraft maintenance scheduling
- Aircraft fault reporting (grounds the aircraft automatically for Major/Critical faults)
- Priority boarding groups & boarding queue management

**Admin**
- Central dashboard with live stats and alerts
- Revenue & expense analytics dashboard (Chart.js)
- Search + pagination on the busiest admin tables

## Architecture (MVC)

```
Browser (React pages)
      ↓ fetch()
/pages/api/**            ← Route layer: receives the HTTP request,
                            delegates to a controller
      ↓
/controllers/**           ← Business logic, validation
      ↓
/models/**                ← Only layer that talks to MySQL directly
      ↓
MySQL Database
```

- **Model** — `models/*.js`: raw parameterized SQL queries only, no business logic.
- **View** — `pages/*.js` (non-API): React components that fetch from the API and render UI.
- **Controller** — `controllers/*.js`: validation and business rules, called by the thin route handlers in `pages/api/`.

## Project Structure

```
components/     Shared UI (Navbar, Footer, Toasts, Skeletons, table controls)
controllers/    Business logic layer
models/         Database access layer
lib/            DB connection, JWT helpers, dynamic pricing, mailer, hooks
pages/          Next.js pages (Views) and pages/api (Routes)
public/         Static assets, favicon
sql/            Schema files, run in order (schema-sprint1.sql → ... → schema-enhancements.sql)
styles/         Global design system
__tests__/      Jest unit tests
```

## Setup

### 1. Prerequisites
- Node.js (LTS)
- Git
- A MySQL database — this project uses [Aiven](https://aiven.io)'s free MySQL tier (or any MySQL 8+ instance)

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables
Create `.env.local` in the project root:
```
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=a-long-random-string
```

### 4. Run the database schema
Run every file in `/sql` **in order** against your database:
```
schema-sprint1.sql
schema-sprint2.sql
schema-sprint3.sql
(Sprint 4 introduced no new schema)
schema-final-polish.sql
schema-enhancements.sql
```
Each is additive (`CREATE TABLE` / `ALTER TABLE ... ADD COLUMN`) — none of them drop existing data.

### 5. Run the app
```
npm run dev
```
Visit `http://localhost:3000`.

### 6. Run the automated tests
```
npm test
```

## Available Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Jest test suite |
| `npm run test:watch` | Run Jest in watch mode |

## Testing

Two layers of testing back this project:
1. **Automated unit tests** (`__tests__/`, run via `npm test`) — cover the pure business-logic functions: dynamic fare pricing, baggage fee calculation, loyalty tier thresholds, and certification status computation.
2. **Manual test plan** (`Sprint1-4-Test-Plan.xlsx`, if included in your submission) — 58 test cases covering every feature across all four sprints, including cross-module integration scenarios.

## Demo Accounts
After registering your own accounts at `/register`, you'll need at least one account per role to demo the full system: **Admin**, **Passenger**, and **Crew**. The role is selectable at registration for demo purposes.

## Team
_Add your team members and individual contributions here for submission._

## Course
Built for CSE470 (Software Engineering), following the MVC architectural pattern as required by the course.
