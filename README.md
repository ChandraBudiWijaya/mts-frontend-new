# MTS Frontend Dashboard

A modern React TypeScript dashboard for the Mandor Tracking System (MTS) built with Vite and Tailwind CSS.

## Features

### 🔐 Authentication
- Beautiful login page with background image and modern design
- Token-based authentication with Laravel backend integration
- Role-based access control (RBAC)
- Automatic session management

### 📊 Dashboard
- Real-time statistics and KPIs
- Interactive charts and data visualization
- Employee activity tracking
- Geofence and coverage monitoring
- Regional visit analytics

### 🎨 UI/UX
- Modern, responsive design with Tailwind CSS
- Custom UI components (Input, Button, Alert, etc.)
- Consistent color scheme and typography
- Mobile-first responsive layout

### 🏗️ Architecture
- Clean code architecture with TypeScript
- Modular component structure
- Custom hooks for data management
- Context API for state management
- Axios for API communication

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Date Utils**: date-fns

## Project Structure

```
src/
├── components/
│   ├── common/          # Layout, Header, Sidebar
│   └── ui/              # Reusable UI components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mts-frontend-new
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend is designed to integrate with a Laravel backend API. Key API endpoints include:

- **Authentication**: `/api/login`, `/api/logout`
- **Dashboard**: `/api/reports/dashboard`
- **Employees**: `/api/employees`
- **Live Tracking**: `/api/live-tracking`
- **Geofences**: `/api/geofences`
- **Work Plans**: `/api/work-plans`

Configure the API base URL in `src/services/api.ts`.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Demo Credentials

For development purposes, use these demo credentials:
- **Email**: admin@example.com
- **Password**: password

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, readable code with proper comments

### Component Guidelines
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper loading and error states
- Follow the established naming conventions

### State Management
- Use React Context for global state
- Use local state for component-specific data
- Implement custom hooks for complex logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

This project is developed by Chandra Budi Wijaya (122140093) for the MTS (Mandor Tracking System).

## Support

For support or questions, contact: chandrabw.cjcc@gmail.com
