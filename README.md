# To-Do List Application

A modern, clean, and professional To-Do List application built with **Angular 19** and **Tailwind CSS**, featuring a **Node.js/Express** backend with **SQLite** for data persistence.

## Features

- **Task Management**: Create, update, complete, and delete tasks.
- **Date Grouping**: Tasks are automatically grouped by their due dates for better organization.
- **Modern UI**: Styled with Tailwind CSS, featuring a responsive design, modal overlays, and clean typography.
- **Recycle Bin**: Restore deleted tasks from the "Deleted" view.
- **Persistent Storage**: Data is stored locally in a SQLite database.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Angular CLI](https://angular.dev/tools/cli) (v19 or later)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/niyi-16/to-do-list.git
cd to-do-list
```


### 2. Install dependencies

```bash
npm install
```
____
# Runnig the application
You can run the application by:

### 1. Running the application through the start script

```bash
npm start
```

Once the Application is running, open your browser and navigate to `http://localhost:4201/`.

## Development Commands

### Code Scaffolding

To generate a new component, run:

```bash
ng generate component component-name
```

### Building

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```text
.
├── angular.json
├── dbserver.js         # Node.js/Express server logic
├── package.json
├── public/             # Static assets (SVG icons, favicon)
├── src/
│   ├── app/            # Main application component and config
│   ├── components/     # Reusable UI components (Tasks, Input, etc.)
│   ├── interfaces/     # TypeScript interfaces (Task)
│   ├── services/       # Angular services (TaskService)
│   ├── styles.css      # Global styles (Tailwind CSS)
│   └── tasks.db        # SQLite database file (auto-generated)
├── tsconfig.json
└── start-task-list.sh
```
