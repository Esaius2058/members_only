# Exclusive Clubhouse App

## Description
An exclusive community platform where users can sign up, post messages, and gain membership status through a secret passcode. The app implements authentication, role-based access control, and secure message management.

## Features
- **User Authentication**: Secure login and signup with password hashing (bcrypt) and session management (passport.js).
- **Membership System**: Users must enter a secret passcode to gain membership status.
- **Message Posting**: Members can create messages with a title, timestamp, and text.
- **Role-Based Access Control (RBAC)**:
  - Guests can view messages but cannot see authors.
  - Members can view message authors and timestamps.
  - Admins can delete messages and manage content.
- **Admin Privileges**: Admins can remove inappropriate messages and manage users.
- **Security**: Input validation, sanitization, and password encryption.
- **Server-Side Rendering (SSR)**: Uses **EJS** for rendering views.
- **Deployment**: Hosted on a PaaS provider with PostgreSQL integration.

## Tech Stack
- **Backend**: Node.js, Express, EJS
- **Database**: PostgreSQL (with Prisma ORM)
- **Authentication**: Passport.js, bcrypt

## Installation & Setup

### Prerequisites
- Node.js & npm
- PostgreSQL database

### Clone the Repository
```bash
git clone https://github.com/yourusername/exclusive-clubhouse.git
cd exclusive-clubhouse
```

### Backend Setup
1. Install dependencies:
```bash
npm install
```
2. Set up your `.env` file:
3. Run database migrations:
```bash
npx prisma migrate dev
```
4. Start the backend server:
```bash
npm start
```

## Views & Routing
- **Homepage (`/`)**: Displays all messages (author hidden for non-members).
- **Signup (`/users/register`)**: User registration form.
- **Login (`/users/log-in`)**: User authentication form.
- **Logout (`/users/log-out`)**: Ends user session.
- **Dashboard (`/users/dashboard`)**: Displays user-specific content.
- **User Profile (`/user-profile`)**: View and update profile.
- **Membership (`/users/join-club`)**: Page to enter the secret passcode.
- **Admin Authentication (`/users/admin-auth`)**: Page for admin verification.
- **Admin Dashboard (`/users/admin/dashboard`)**: Admin panel for managing users/messages.
- **Profile Update (`/users/profile/update`)**: Page to update user profile.
- **New Post (`/posts/new`)**: Form to submit new messages (members only).
- **User Posts (`/posts/:userId`)**: Displays all messages by a specific user.
- **Delete Post (`/posts/delete`)**: Allows deletion of a post (admins only).

## API Endpoints
- **POST** `/users/register` → Register a new user
- **POST** `/users/log-in` → User login
- **POST** `/users/log-out` → User logout
- **POST** `/users/join-club` → Enter passcode to gain membership
- **POST** `/users/admin-auth` → Authenticate admin
- **POST** `/users/profile/update` → Update user profile
- **POST** `/posts/new` → Create a new message (members only)
- **GET** `/posts/:userId` → Fetch all messages by a user
- **POST** `/posts/delete` → Delete a message (admins only)

## Deployment
### Backend (Railway/Render/Fly.io)
1. Push the repository to GitHub.
2. Set environment variables in your hosting platform.
3. Deploy the backend service.

## License
This project is licensed under the MIT License.
