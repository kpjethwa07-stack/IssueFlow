# IssueFlow

A full-stack issue tracking and project management application that helps teams organize projects, create issues, and track development progress.

🌐 **Live Demo:** [IssueFlow](https://issue-flow-coral.vercel.app/)

---

## Features

- **User Authentication** – Secure registration and login using JWT authentication.
- **Project Management** – Create and manage projects.
- **Issue Tracking** – Create, view, and manage issues within projects.
- **User Profiles** – Usernames and account-based identification.
- **Activity Tracking** – Maintain project and issue activity records.
- **Persistent Database** – Store application data in MongoDB.
- **Responsive Interface** – Modern frontend experience.
- **Cloud Deployment** – Frontend and backend deployed using Vercel.

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Deployment
- Vercel
- MongoDB Atlas

---

## Project Structure

```text
IssueFlow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kpjethwa07-stack/IssueFlow.git
cd IssueFlow
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Configure the API base URL in the frontend API configuration if required.

Start the frontend:

```bash
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `NODE_ENV` | Application environment |

**Never commit your `.env` files or expose database credentials and JWT secrets.**

---

## Deployment

- **Frontend:** [Vercel](https://issue-flow-coral.vercel.app/)
- **Backend API:** [IssueFlow API](https://issue-flow-hc3p.vercel.app/api/health)
- **Database:** MongoDB Atlas

---

## Author

**Kaushal Jethwa**

- GitHub: [kpjethwa07-stack](https://github.com/kpjethwa07-stack)

---

## License

This project is developed for learning and portfolio purposes.
