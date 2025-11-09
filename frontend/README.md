# RateMyClass Frontend (React)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:8080`

3. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the frontend directory (optional):
```
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`

## Project Structure

```
src/
  components/
    Navigation.jsx    # Navigation bar component
    Home.jsx         # Home page with course listing
    AddRating.jsx    # Add rating form component
  services/
    api.js          # API service functions
  App.jsx           # Main app component with routing
  main.jsx          # React entry point
  index.css         # Global styles
```

## Features

- React Router for navigation
- Bootstrap 5 for styling
- API integration with backend
- Search functionality
- Star rating component
- Form validation

