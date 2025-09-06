# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# My Daily Bill - Super Admin Dashboard

A modern, responsive admin dashboard built with React, Vite, and Tailwind CSS for managing the My Daily Bill platform.

## Features

- 🔐 **Secure Authentication** - Real API integration with token-based auth
- 📱 **Responsive Design** - Works perfectly on all devices
- 🏢 **Company Management** - View and manage all companies
- 📊 **Dashboard Analytics** - Overview of key metrics
- 🎨 **Modern UI** - Clean, professional interface
- ⚡ **Fast Performance** - Built with Vite for optimal speed

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Configuration

The app connects to:
- **Base URL**: `https://mydailybill.com/api/super-admin`
- **Login Endpoint**: `/login`

## Default Credentials

- **Email**: `nishsnth199707@gmail.com`
- **Password**: `password`

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- Lucide React Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── services/           # API services
├── utils/              # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # App entry point
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:3000

