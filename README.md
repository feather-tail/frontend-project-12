[![Actions Status](https://github.com/feather-tail/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/feather-tail/frontend-project-12/actions)

# React Chat Application

This project is a simple yet functional chat application built using **React** and **Redux Toolkit**. It features real-time messaging via **Socket.io**, user authentication, channel management, and internationalization.

## Deployed project
https://frontend-project-12-a4j7.onrender.com

## Features

- 🔐 User registration and login (JWT-based authentication)
- 💬 Real-time chat functionality
- 📢 Channel creation, renaming, and removal
- 🧼 Profanity filter (using `leo-profanity`)
- 🔒 Protected routes for authenticated users only
- ⚛️ Fully powered by Redux Toolkit for state management

## Tech Stack

- **Frontend:** React, React Router, Redux Toolkit, Formik, Yup, i18next, React Bootstrap
- **State Management:** Redux Toolkit
- **Styling:** Bootstrap 5
- **Real-time:** Socket.io client
- **Notifications:** React Toastify

## Installation

To install project dependencies:

```
make install
```

## Running the Application

Start the development server (assumes backend is running separately):

```
make start
```

## Building for Production

To build the app for production:

```
make build
```

## Linting

To run ESLint with automatic fixes:

```
make lint
```

## Project Structure

```
.
├── components/         # Reusable UI components (Header, ProtectedRoute)
├── modals/             # Modal windows for adding, renaming, removing channels
├── pages/              # Main application pages (ChatPage, LoginPage, SignupPage)
├── services/           # API routes, i18n config, profanity filter init
├── store/              # Redux slices and store setup
├── assets/             # Global CSS styles
└── App.jsx             # Main routing logic
```
