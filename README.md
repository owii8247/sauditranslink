This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



trukker/
├─ .env
├─ .env.local
├─ .gitignore
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ [...nextauth]/
│  │  │     └─ route.ts
│  │  └─ orders/
│  │     └─ create
                └─ route.ts
│  ├─ create-order/
│  │  └─ page.tsx
│  ├─ dashboard/
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ order-details/
│  │  └─ page.tsx
│  ├─ page.tsx
│  └─ view-order/
│     └─ page.tsx
├─ components/
│  ├─ Navbar.tsx
│  ├─ OrderCard.tsx
│  ├─ SessionWrapper.tsx
│  └─ Sidebar.tsx
├─ eslint.config.mjs
├─ lib/
│  └─ mongodb.ts
├─ models/
│  └─ Order.ts
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ uploads/ 
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ styles/
├─ tailwind.config.ts
└─ tsconfig.json




add a section as Customer Details
in that Input and label as Customer Name , Customer Type as select with option Domestic or International
Region Input Manually as well as select with KSA, Riyadh, Saudi, Qatar
Invoice Number
add a section as Order Details
Move Type  as select with option Domestic or International
Move Date & Time from date and time picker
Asset,Loading POC, Commodity,UnLoading POC,Order Price , Order Cost, Platform Source , Inquiry Received On,
Source Address, Destination Address
add a section as Line Item SLA
Total Cost 
add a section as Trip Info
Trip Type as select Full Truck, Half Truck, Empty Truck
Truck Reg No, Driver Name,Supplier Name,Sourcing POC, Trip Cost,
add a section as Line Items
Category, sub category, quantity, unit price,amount, vat%,, vat charges, total, task
add calculation formula here 
unit price * quantity = Amount
Amount%Vat= Vat Charge
Total = Amount + Vat Charge
this section should be an array add + icon to add one more filed to enter these details with these fields
Trip Status as select with option 
Upcoming,Start for pick up, at loading,completed loading , enroute, at unloading, completed this should be updated every time with date and time of every update is needed