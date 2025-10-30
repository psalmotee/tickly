# TicketFlow - Next.js Ticket Management System

A modern, full-featured ticket management application built with Next.js, React, and TypeScript. Manage tickets efficiently with real-time updates, status tracking, and team collaboration features.

## Features

- **User Authentication**: Secure login and signup with localStorage-based sessions
- **Dashboard**: Real-time statistics showing ticket counts by status
- **Ticket Management**: Full CRUD operations for tickets
- **Status Tracking**: Color-coded ticket statuses (Open, In Progress, Closed)
- **Priority Levels**: Organize tickets by priority (Low, Medium, High)
- **Form Validation**: Comprehensive client-side validation with detailed error messages
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Protected Routes**: Automatic redirection for unauthenticated users

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage
- **Validation**: Custom validation utilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

For testing purposes, use these credentials:

- **Email**: demo@example.com
- **Password**: demo123

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx           # Root layout with auth provider
│   ├── page.tsx             # Landing page
|   ├── admin/
│   │   └── page.tsx         # Admin page
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard with statistics
│   ├── tickets/
│   │   └── page.tsx         # Tickets management page
│   └── globals.css          # Global styles and design tokens
├── components/
│   ├── auth-provider.tsx    # Auth context and route protection
│   ├── dashboard-header.tsx # Header with user info
│   ├── stats-cards.tsx      # Statistics cards component
│   ├── ticket-list.tsx      # Ticket list with edit modal
│   ├── ticket-card.tsx      # Individual ticket card
│   ├── create-ticket-form.tsx # Form for creating tickets
│   ├── edit-ticket-form.tsx # Form for editing tickets
│   ├── login-form.tsx       # Login form component
│   ├── signup-form.tsx      # Signup form component
│   ├── modal.tsx            # Reusable modal component
│   ├── form-error.tsx       # Error message component
│   └── form-success.tsx     # Success message component
└── lib/
    ├── auth.ts              # Authentication utilities
    ├── tickets.ts           # Ticket management utilities
    └── validation.ts        # Form validation utilities
\`\`\`

## Usage

### Creating an Account

1. Click "Sign up" on the landing page
2. Fill in your name, email, and password
3. Confirm your password and submit
4. You'll be automatically logged in and redirected to the dashboard

### Logging In

1. Click "Log in" on the landing page
2. Enter your email and password
3. Click "Sign in" to access your dashboard

### Managing Tickets

1. From the dashboard, click "Go to Tickets" or navigate to the Tickets page
2. Click "New Ticket" to create a ticket
3. Fill in the title, description, and priority
4. Click "Create Ticket" to save
5. Edit tickets by clicking the edit icon
6. Delete tickets by clicking the delete icon
7. Update ticket status and priority from the edit form

### Dashboard

The dashboard displays:
- **Total Tickets**: Count of all your tickets
- **Open**: Tickets waiting to be started
- **In Progress**: Tickets currently being worked on
- **Closed**: Completed tickets

## Form Validation

All forms include comprehensive validation:

### Login Form
- Email must be a valid email address
- Password must be at least 6 characters

### Signup Form
- Name must be 2-100 characters
- Email must be a valid email address
- Password must be at least 6 characters
- Passwords must match

### Ticket Forms
- Title must be 3-200 characters
- Description must be 10-2000 characters
- Priority is required (Low, Medium, High)
- Status is required (Open, In Progress, Closed)

## Data Storage

This application uses browser localStorage for data persistence:
- User sessions are stored in `ticketflow_session`
- Tickets are stored in `ticketflow_tickets`

**Note**: Data is stored locally in the browser and will be lost if browser data is cleared.

## Styling

The application uses Tailwind CSS v4 with a custom design token system:

### Color Scheme
- **Primary**: Blue (#3b82f6) - Main brand color
- **Accent**: Purple (#8b5cf6) - Secondary accent
- **Status Colors**:
  - Open: Amber
  - In Progress: Blue
  - Closed: Green

### Design Tokens
All colors are defined as CSS variables in `globals.css` for easy theming and consistency.

## Accessibility

The application includes:
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly forms

## Troubleshooting

### Lost Data After Refresh
Data is stored in localStorage. If you clear your browser data, all tickets and sessions will be lost.

### Can't Login
Make sure you've created an account first. Use the demo credentials (demo@example.com / demo123) to test.

### Form Validation Errors
Check the error messages displayed below each field. They indicate what needs to be corrected.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
