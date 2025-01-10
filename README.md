# Event Calendar Application

A fully interactive calendar application built with React, TypeScript, and date-fns. This app allows users to create, edit, delete, and drag-and-drop events on a calendar. It also includes features like event color customization, exporting events as JSON or CSV, and a responsive sidebar for easy navigation.

## Table of Contents
1. [Features](#features)  
2. [Technologies Used](#technologies-used)  
3. [Installation](#installation)  
4. [Available Scripts](#available-scripts)  
5. [Deployed App](#deployed-app)  
6. [Screenshots](#screenshots)  
7. [Contributing](#contributing)  
8. [License](#license)  

## Features

- **Interactive Calendar:** View events by day, week, or month.  
- **Event Management:**  
  - Add, edit, and delete events.  
  - Drag-and-drop events to reschedule them.  
  - Customize event colors using a color picker.  
- **Responsive Sidebar:**  
  - Mini calendar for quick navigation.  
  - List of all events with details.  
- **Export Options:** Export events as JSON or CSV for the current month.  
- **Dark/Light Mode:** Toggle between themes using the ModeToggle button.  
- **Local Storage:** Events are saved in the browser's local storage for persistence.  

## Technologies Used

- **React:** Frontend library for building the user interface.  
- **TypeScript:** Adds type safety to the codebase.  
- **date-fns:** Date utility library for handling dates and times.  
- **React Beautiful DnD:** Enables drag-and-drop functionality for events.  
- **Sonner:** Toast notifications for user feedback.  
- **Tailwind CSS:** Utility-first CSS framework for styling.  

## Installation

### Prerequisites
- Node.js (v16 or higher)  
- npm or yarn  

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/event-calendar.git
   cd event-calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open the app:**
   - The app should automatically open in your default browser at `http://localhost:3000`.  
   - If it doesn't, manually navigate to the URL.  

## Available Scripts

- `npm start`: Runs the app in development mode.  
- `npm build`: Builds the app for production.  
- `npm test`: Runs the test suite.  
- `npm eject`: Ejects the app from Create React App (use with caution).  

## Deployed App

You can access the deployed version of the app here: **[Deployed App Link](#)**  
*(Replace this with the actual link once deployed.)*

## Screenshots

### Calendar View
![Calendar View](src\assets\calender.png)

### Event Dialog
![Event Dialog](src\assets\dialouge.png)

### Sidebar
![Sidebar](src\assets\sidebar.png)

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. **Fork** the repository.  
2. **Create a new branch** for your feature or bugfix.  
3. **Commit** your changes.  
4. **Push** your branch and submit a **pull request**.  

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
