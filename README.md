# 📝 Notes App (Full-Stack)
A full-stack Notes application that allows users to create, edit, manage, and export notes with a modern and responsive user interface. Built with a React-based frontend and a secure Node.js backend, the app focuses on usability, performance, and clean architecture.



## 📌 Description
This Notes App enables users to securely manage their personal notes with features like rich text editing, authentication, and smooth UI interactions. The application is designed with a scalable frontend and a RESTful backend, making it suitable for real-world use cases.

## 🚀 Features
- User authentication with JWT
- Create, edit, and delete notes
- Rich text editor for notes
- Responsive and animated UI
- Form validation and error handling
- Secure password hashing
- Email support (nodemailer)

## 🛠️ Tech Stack
### Frontend
- React (Vite)
- React Router DOM
- React Hook Form + Yup
- Tailwind CSS
- React Query
- Axios
- Framer Motion
- Rich Text Editors (React Quill / WYSIWYG)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (Password hashing)
- Nodemailer
- Yup (Validation)
- dotenv
- CORS

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
- git clone https://github.com/maneesh0333/notes-app.git
- cd notes-app

### 2️⃣ Frontend Setup
- cd frontend
- npm install
- npm run dev

Frontend will run on:
http://localhost:5173

### 3️⃣ Backend Setup
- cd backend
- npm install
- npm run dev

Backend will run on:
http://localhost:5000

### 4️⃣ Environment Variables
Create a .env file inside the backend folder:
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- EMAIL_USER=your_email
- EMAIL_PASS=your_email_password

## 🎥 Demo
https://github.com/user-attachments/assets/454706d7-19a0-4127-90fe-f9f042b230c5

