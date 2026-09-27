# JEV Ticket Classifier

An AI-powered support ticket classification platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The application allows teams to upload CSV files containing customer support issues, classify them in parallel using `@typesafe-ai/sdk`, and view real-time category distribution analytics and data previews.

---

## Features

- **CSV File Upload & Parsing**: Drag-and-drop support for `.csv` files with instant client-side parsing via PapaParse.
- **Built-in Sample Dataset**: One-click option to load and test the pre-packaged `support-ticket-classification.csv` dataset.
- **Parallel AI Classification**: Concurrently classifies ticket issues using `@typesafe-ai/sdk` through the `/api/classify` endpoint.
- **Ticket Categories**:
  - `account_access`: Login, password resets, 2FA, permissions, and session issues.
  - `billing`: Payment inquiries, subscription renewals, card declines, and invoices.
  - `refund_request`: Returns, money-back requests, and order cancellations.
  - `bug_report`: App crashes, technical glitches, profile loading errors, and broken features.
  - `shipping_delivery`: Tracking, delivery delays, missing packages, and address updates.
- **Analytics & Summary Dashboard**:
  - **Processing Time**: Displays total duration for batch parallel processing.
  - **Category Breakdown**: Frequency-sorted breakdown with counts and percentage share.
  - **Total Tickets Processed**: Real-time counter of classified records.
- **Interactive Data Table**:
  - Paginated table showing `id`, `subject`, `text`, and the newly classified `category` badge.
  - Responsive layout with clean light theme aesthetics.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Classification**: [`@typesafe-ai/sdk`](https://www.npmjs.com/package/@typesafe-ai/sdk)
- **CSV Engine**: [PapaParse](https://www.papaparse.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Project Structure

```text
jev-demo/
├── app/
│   ├── api/
│   │   └── classify/
│   │       └── route.ts          # POST API: Parallel ticket classification
│   ├── favicon.ico
│   ├── globals.css               # Global stylesheet & Tailwind directives
│   ├── layout.tsx                # Root layout & page metadata
│   └── page.tsx                  # Main home page component
├── components/
│   ├── CsvUploader.tsx           # Main container: handles upload, state & API calls
│   ├── DataPreviewTable.tsx      # Paginated table displaying tickets and categories
│   ├── DropZone.tsx              # Drag-and-drop CSV upload & demo selector
│   └── SummaryStats.tsx          # Metrics cards (time taken, category breakdown)
├── lib/
│   ├── csvUtils.ts               # PapaParse helpers & type detection
│   └── demoData.ts               # Fallback demo datasets
├── public/
│   └── support-ticket-classification.csv # 2,000 sample customer support tickets
├── utils/
│   └── classifyTickets.ts        # TypeSafe AI client integration
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   cd jev-demo
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Configure any required API credentials for the `@typesafe-ai/sdk` in a `.env.local` file at the root of the project:

```env
TYPESAFE_API_KEY=your_api_key_here
```

### Running Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### `POST /api/classify`

Classifies an array of support ticket issues in parallel.

#### Request Body

```json
{
  "issues": [
    "I can't log in to my account because my PIN is locked.",
    "My credit card was charged twice for this month's plan."
  ]
}
```

#### Response (`200 OK`)

```json
{
  "success": true,
  "totalTimeMs": 320,
  "totalTickets": 2,
  "categoryCounts": {
    "account_access": 1,
    "billing": 1
  },
  "results": [
    {
      "index": 0,
      "issue": "I can't log in to my account because my PIN is locked.",
      "success": true,
      "isClassified": true,
      "category": "account_access"
    },
    {
      "index": 1,
      "issue": "My credit card was charged twice for this month's plan.",
      "success": true,
      "isClassified": true,
      "category": "billing"
    }
  ]
}
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the Next.js development server on `http://localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality issues |

---

## License

This project is private and intended for internal use.
