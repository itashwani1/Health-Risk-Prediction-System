# Health Risk Prediction System

A modern, full-stack web application for assessing personal health risks and predicting medical conditions based on user health metrics. Built with **Next.js**, **TypeScript**, **Supabase**, and **Tailwind CSS**.

---

## 🎯 Overview

The Health Risk Prediction System allows users to:
- Create an account and securely authenticate
- Complete a comprehensive health assessment form
- Receive AI-powered risk predictions based on their health profile
- View their prediction history and track changes over time

This is a collaborative college group project designed to demonstrate modern web development practices using cutting-edge technologies.

---

## ✨ Features

- **User Authentication**: Secure sign-up and login system powered by Supabase Auth
- **Health Risk Assessment**: Interactive form to collect health metrics and lifestyle data
- **AI-Powered Predictions**: Real-time health risk calculations and recommendations
- **Prediction History**: View past assessments and track health trends
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Component Library**: 40+ pre-built UI components for consistency and accessibility
- **Type Safety**: Full TypeScript support for enhanced development experience
- **Error Handling**: User-friendly error pages and validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS 3.x, PostCSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **API** | Next.js API Routes |
| **Charts/Data** | Recharts, Chart.js integration |
| **UI Components** | Custom component library (40+ components) |
| **Package Manager** | pnpm |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** 18.x or higher ([download](https://nodejs.org/))
- **pnpm** 8.x or higher (`npm install -g pnpm`)
- **Git** for version control
- A **Supabase** account ([create free account](https://supabase.com))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/health-risk-prediction.git
cd health-risk-prediction
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Server-side Supabase Key (for sensitive operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**How to get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and anon key

### 4. Set Up the Database

Run the migration script to create the predictions table:

```bash
# Using psql (if you have PostgreSQL installed)
psql -U postgres -d your_database -f scripts/001_create_predictions_table.sql
```

Or execute the SQL directly in Supabase SQL Editor:
```sql
-- Open Supabase Dashboard → SQL Editor → Create New Query
-- Copy contents from: scripts/001_create_predictions_table.sql
```

### 5. Run the Development Server

```bash
pnpm dev
```

Visit **http://localhost:3000** in your browser.

---

## 📁 Project Structure

```
health-risk-prediction/
├── app/                           # Next.js app directory
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── auth/                     # Authentication routes
│       ├── login/                # Login page
│       ├── sign-up/              # Registration page
│       ├── sign-up-success/      # Success confirmation
│       └── error/                # Error page
│   └── history/                  # User prediction history
│
├── components/                    # React components
│   ├── header.tsx                # Navigation header
│   ├── health-risk-form.tsx      # Main assessment form
│   ├── risk-results.tsx          # Results display component
│   ├── theme-provider.tsx        # Theme configuration
│   └── ui/                       # 40+ UI components (button, form, card, etc.)
│
├── lib/                          # Utility functions & logic
│   ├── health-risk.ts            # Core risk calculation algorithm
│   ├── utils.ts                  # Helper functions
│   └── supabase/
│       ├── client.ts             # Client-side Supabase configuration
│       ├── server.ts             # Server-side Supabase configuration
│       └── proxy.ts              # API proxy layer
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── public/                       # Static assets
│   ├── index.html                # Static HTML
│   ├── app.js                    # Static scripts
│   └── styles.css                # Static styles
│
├── scripts/                      # Database scripts
│   └── 001_create_predictions_table.sql
│
├── styles/                       # Additional stylesheets
│   └── globals.css
│
├── components.json               # Component configuration
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs           # PostCSS configuration
├── middleware.ts                 # Next.js middleware
└── pnpm-lock.yaml               # Dependency lock file
```

---

## 🔑 Key Features Explained

### Authentication Flow
```
Sign Up → Verification → Login → Dashboard → Take Assessment
```
- Secure password handling via Supabase Auth
- Email verification for new accounts
- Session management with JWT tokens

### Health Risk Assessment Form
Collects the following information:
- Personal demographics (age, gender, height, weight)
- Medical history (chronic conditions, medications)
- Lifestyle habits (exercise frequency, diet, smoking status)
- Family medical history
- Current symptoms

### Risk Prediction Algorithm
Located in `lib/health-risk.ts`, uses:
- BMI calculation
- Risk scoring based on health metrics
- Machine learning model integration (if applicable)
- Personalized recommendations

### Prediction History
Users can view:
- All past assessments with timestamps
- Risk score trends over time
- Changes in health metrics
- Doctor recommendations

---

## 📊 Database Schema

### Predictions Table
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  risk_score NUMERIC,
  health_metrics JSONB,
  prediction_date TIMESTAMP,
  status VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/predictions` | POST | Submit health assessment |
| `/api/predictions` | GET | Retrieve prediction history |
| `/api/predictions/:id` | GET | Get specific prediction details |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

The app is fully responsive using Tailwind CSS utilities.

---

## 🧪 Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting (if configured)
pnpm lint

# Format code (if configured)
pnpm format
```

---

## 🐛 Troubleshooting

### Issue: "Supabase connection failed"
**Solution**: Verify your `.env.local` file has correct Supabase credentials.

### Issue: "Port 3000 already in use"
**Solution**: Use a different port:
```bash
pnpm dev -- -p 3001
```

### Issue: "Module not found" error
**Solution**: Clear node_modules and reinstall:
```bash
rm -r node_modules
pnpm install
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project" and import your repository
4. Add environment variables in Project Settings
5. Click "Deploy"

### Deploy to Other Platforms
- **Netlify**: Connect GitHub repo, add env vars, deploy
- **Railway**: Connect GitHub repo, add env vars, deploy
- **Docker**: Create `Dockerfile` and push to container registry

---

## 👥 Contributors

This is a collaborative college group project. Team members:
- [Add team member names]

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support & Contact

For questions or issues:
1. Open an issue on GitHub
2. Contact the development team
3. Check the [Supabase Documentation](https://supabase.com/docs)
4. Review [Next.js Documentation](https://nextjs.org/docs)

---

## 🎓 Learning Resources

- [Next.js Fundamentals](https://nextjs.org/learn)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hooks API](https://react.dev/reference/react/hooks)

---

**Last Updated**: April 2024 | **Status**: Active Development
