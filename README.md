# SEAPEDIA

A fullstack multi-role e-commerce marketplace built for the COMPFEST Academy Technical Challenge.

**Tech Stack:**
- **Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL, JWT (access + refresh token), Zod validation
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router
- **API Docs:** Swagger/OpenAPI via swagger-jsdoc + swagger-ui-express

---

## Demo Accounts

| Role   | Email                 | Password  |
|--------|-----------------------|-----------|
| Admin  | admin@seapedia.com    | password  |
| Seller | seller@seapedia.com   | password  |
| Buyer  | buyer@seapedia.com    | password  |
| Driver | driver@seapedia.com   | password  |

Admin account is created via seed — no registration needed.
Non-admin accounts can own multiple roles and must select an active role after login.

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend

```bash
cd backend
cp .env.example .env   # edit with your database credentials
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Server runs at `http://localhost:3000`. API base: `http://localhost:3000/api`.

### Frontend

```bash
cd frontend
cp .env.example .env   # or just use defaults
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Environment Variables

**Backend `.env`:**

| Variable       | Description              | Default |
|---------------|--------------------------|---------|
| `PORT`        | API server port          | `3000`  |
| `DATABASE_URL`| PostgreSQL connection (with pgBouncer) | required |
| `DIRECT_URL`  | Direct PostgreSQL connection | required |
| `JWT_SECRET`  | JWT signing key          | required |
| `JWT_EXPIRES_IN` | Access token expiry   | `15m`   |
| `CORS_ORIGIN` | Allowed CORS origin      | `http://localhost:5173` |

**Frontend:** Backend URL is configured in `src/api/client.ts` (default: `http://localhost:3000/api`).

---

## API Documentation

Swagger UI is available at **`http://localhost:3000/api-docs`** when the backend is running.

The spec is auto-generated from JSDoc annotations in `src/modules/**/*.routes.ts`.

---

## Business Rules

### Single-Store Checkout
A cart may only contain products from **one store**. If a buyer tries to add a product from a different store, the system rejects it with an error message. The buyer must clear the cart first before switching stores.

### Delivery Methods & Fees

| Method     | Fee       | SLA (Overdue Threshold) |
|------------|-----------|-------------------------|
| Instant    | Rp 25.000 | 1 day                   |
| Next Day   | Rp 15.000 | 2 days                  |
| Regular    | Rp 8.000  | 5 days                  |

### Tax (PPN)
PPN is **12%** of `(subtotal - discount)`. The calculation order:
1. Subtotal = sum of `(price × quantity)` for all items
2. Discount = coupon value (percent/nominal) applied to subtotal
3. PPN = 12% of `(subtotal - discount)`
4. Total = `(subtotal - discount) + PPN + deliveryFee`

### Discount Rules
- **Voucher** — percent or nominal discount, has max usage count
- **Promo** — percent or nominal discount, no usage limit
- Voucher and Promo **cannot be combined** in a single checkout
- A coupon is validated against: expiry date, usage count, min purchase
- Expired or exhausted coupons are rejected

### Order Status Lifecycle
```
sedang_dikemas → menunggu_pengirim → sedang_dikirim → pesanan_selesai
                                                       → dikembalikan (overdue)
```
- Seller moves `sedang_dikemas` → `menunggu_pengirim`
- Driver takes job → `sedang_dikirim`
- Driver completes → `pesanan_selesai`
- Admin overdue process → `dikembalikan`

### Driver Earnings
Driver earnings = sum of `deliveryFee` from all orders where `status = pesanan_selesai` and `driverId` matches.

### Overdue SLA & Time Simulation
Orders are considered overdue when `NOW() + timeOffset > deliveryDeadline` and status is not `pesanan_selesai` or `dikembalikan`.

**Time simulation:** Admin can click "Simulate +1 Day" in the admin dashboard (`POST /admin/simulate-time`) to advance an in-memory clock. This affects `deliveryDeadline` comparisons for demo purposes.

**Overdue processing:** Admin clicks "Process Overdue" (`POST /admin/process-overdue`) which:
1. Finds all overdue orders
2. Changes status to `dikembalikan`
3. Refunds the total to buyer's wallet (with `refund` transaction record)
4. Restores product stock via `UPDATE products SET stock = stock + quantity`

Refund is idempotent — already-returned orders are skipped.

---

## Security Measures

| Measure | Implementation |
|---------|---------------|
| **SQL Injection** | Prisma ORM with parameterized queries. Raw SQL (`$executeRawUnsafe`) is used only in stock batch operations with parameterized values. |
| **XSS** | User input is trimmed and validated via Zod before storage. React's JSX auto-escapes rendered content. No `dangerouslySetInnerHTML` is used. |
| **Input Validation** | All mutation endpoints use Zod schemas. String fields are `.trim()`-ed. Invalid input returns 400 with field-level errors. |
| **Authentication** | JWT access tokens (15 min expiry) + refresh tokens (7 days, stored hashed in DB). Rate-limited login (10 attempts per 15 min). |
| **Authorization** | Backend enforces role-based access via `requireRole` middleware on every protected route. Active role is checked server-side, not trusted from UI alone. |
| **Password Storage** | bcrypt with salt rounds = 10. Minimum 8 chars, 1 uppercase, 1 number. |
| **HTTP Headers** | Helmet.js for security headers (CSP, X-Frame-Options, HSTS, etc.). |
| **CORS** | Restricted to frontend origin (`http://localhost:5173`). |
| **Request Size** | JSON body limited to 10kb. |
| **Error Handling** | Global error handler returns `{ error: message }` — no stack traces leaked to client. |
| **Logging** | Morgan dev logging for request/response monitoring. |

---

## Testing Guide

### End-to-End Demo Flow

1. **Guest:** Browse `/` → view products → view product detail → read/submit app reviews
2. **Register:** Create account at `/register` → login at `/login`
3. **Role Select:** Multi-role users choose active role at `/role-select`
4. **Seller:** Create store → add products → view incoming orders → process order → mark ready
5. **Buyer:** Top up wallet → add address → add products to cart → checkout with coupon → view order history
6. **Driver:** View queue → take job → mark shipped → mark completed → check earnings
7. **Admin:** View dashboard → manage users/products/orders/coupons → create voucher/promo → simulate +1 day → process overdue → verify refund

### Quick Smoke Test (API)

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"testuser","email":"test@test.com","password":"Test1234"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"buyer@seapedia.com","password":"password"}'

# Use the returned accessToken for authenticated requests:
curl http://localhost:3000/api/products
```

### Security Test Cases

- **XSS:** Submit `<script>alert('xss')</script>` as review comment → should display as plain text
- **SQL Injection:** Try `' OR 1=1 --` in login email field → should return 401
- **Role Escalation:** Try accessing `/admin/users` with a buyer token → should return 403
- **Token Expiry:** Wait 15 min or use expired token → should get 401, then auto-refresh

---

## Project Structure

```
seapedia/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app setup
│   │   ├── index.ts               # Entry point
│   │   ├── config/                # Prisma, Swagger config
│   │   ├── types/                 # TypeScript types + express.d.ts
│   │   ├── utils/                 # JWT, time simulation utils
│   │   ├── middlewares/           # authenticate, requireRole
│   │   └── modules/
│   │       ├── auth/              # Register, login, refresh, logout
│   │       ├── users/             # Profile, roles, active role
│   │       ├── reviews/           # Application reviews
│   │       ├── stores/            # Seller store CRUD
│   │       ├── products/          # Product CRUD, public catalog
│   │       ├── wallet/            # Buyer wallet, topup
│   │       ├── address/           # Buyer addresses
│   │       ├── cart/              # Cart (single-store)
│   │       ├── order/             # Checkout, orders, status
│   │       ├── coupon/            # Seller coupon CRUD
│   │       ├── productReview/     # Product reviews
│   │       ├── dashboard/         # Stats per role
│   │       ├── delivery/          # Driver queue, assign, status
│   │       └── admin/             # Admin monitoring, coupons, overdue
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
├── frontend/
│   └── src/
│       ├── api/                   # Axios client + API functions
│       ├── components/            # Reusable UI (Button, Input, Layout)
│       ├── context/               # AuthContext
│       ├── pages/
│       │   ├── public/            # Landing, Login, Register, ProductDetail
│       │   ├── seller/            # Store, Products, Orders, Coupons
│       │   ├── buyer/             # Cart, Checkout, Orders, Address, TopUp
│       │   ├── driver/            # Queue, MyDeliveries, DeliveryDetail
│       │   └── admin/             # Dashboard, Users, Products, Orders, Coupons
│       └── types/                 # Shared TypeScript types
└── README.md
```

---

## Deployment (Optional)

For deployment bonus points, deploy:
- **Backend:** Any Node.js hosting (Railway, Render, Fly.io, etc.) with PostgreSQL
- **Frontend:** Vite build → static hosting (Vercel, Netlify, etc.)

Update `CORS_ORIGIN` and frontend API base URL to match the deployed backend URL.
