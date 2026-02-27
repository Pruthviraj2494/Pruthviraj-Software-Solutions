## Pruthviraj Software Solutions – Role-Based Portal

This is a full-stack role-based management portal for **Pruthviraj Software Solutions**, built with a Node/Express + MongoDB backend and a React + TypeScript + Vite frontend.

Roles:
- **Admin**: manage users, services, projects, service requests, messaging, profile.
- **Employee**: view/update assigned projects, messaging (admin + clients), profile.
- **Client**: view projects, request services, messaging (admin + assigned employees), profile.

### Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Socket.io
- **Frontend**: React 18, TypeScript, Vite, Redux Toolkit, React Router, Tailwind CSS

### Live Demo

- **Live URL**: [https://pruthviraj-software-solutions-1.onrender.com]
- **GitHub Repository**: [https://github.com/Pruthviraj2494/Pruthviraj-Software-Solutions]

### Setup Instructions

1. **Clone & install**
```bash
git clone https://github.com/Pruthviraj2494/Pruthviraj-Software-Solutions.git
cd "Pruthviraj Software Solutions"
npm install
```

2. **Environment variables**

- `server/.env`:
  - `MONGODB_URI=mongodb://localhost:27017`
  - `MONGO_DB_NAME=pruthviraj_software_solutions`
  - `JWT_SECRET=your_jwt_secret_here`

- `client/.env`:
  - `VITE_API_BASE_URL=http://localhost:5000/api/v1`

3. **Seed database**
```bash
cd server
node seed/admin.js       # seeds admins
node seed/users.js       # employees + clients
```

4. **Run locally**
```bash
npm run dev
```

Visit `http://localhost:5173`.

### Test Login Credentials

After running the seed script:

- **Admin**
  - Email: `pruthviraj@pruthvirajsoft.com`
  - Password: `admin123`

- **Employees**
  - Email: `rohit.employee@pruthvirajsoft.com` – Password: `employee123`
  - Email: `ananya.employee@pruthvirajsoft.com` – Password: `employee123`
  - Email: `karan.employee@pruthvirajsoft.com` – Password: `employee123`

- **Clients**
  - Email: `contact@acme-industries.example` – Password: `client123`
  - Email: `it@bluesky-retail.example` – Password: `client123`

### Deployment

This project is deployed as a monorepo on **Render** with both client and server running together:

- The frontend is built with `npm run build` (Vite) and served as static files by the Express server.
- The backend serves the API at `/api/v1` and the frontend catch-all from the same origin.
- No separate frontend hosting needed — everything runs from a single Render service.

#### Render Environment Variables

Set the following in your Render service dashboard:

- `MONGODB_URI` – your MongoDB Atlas connection string
- `MONGO_DB_NAME` – your database name
- `JWT_SECRET` – your JWT secret
- `NODE_ENV=production`