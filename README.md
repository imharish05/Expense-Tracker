# Amount Manager - Frontend

A modern, responsive React dashboard for the Amount Manager project management system. Built with React 18, Redux Toolkit, Bootstrap 5, and ApexCharts for comprehensive data visualization.

## 🎯 Project Overview

The Amount Manager frontend provides a complete user interface for:
- Project management and tracking
- Staff directory and assignments
- Payment processing and tracking
- Customer relationship management
- Role-based permission management
- Real-time notifications and reminders
- Document and file management
- Interactive dashboards and reports

## 📋 Prerequisites

- **Node.js**: v14+ (v16+ recommended)
- **npm**: v6+
- **Backend API**: Running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Installation

```bash
cd Frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### 3. Start Development Server

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Optimized production build will be created in the `build/` folder.

## 📁 Project Structure

```
Frontend/
├── public/
│   ├── index.html              # Main HTML file
│   ├── robots.txt              # SEO robots file
│   ├── _redirects              # Netlify redirects
│   └── assets/
│       ├── css/                # Global stylesheets
│       ├── fonts/              # Custom fonts
│       ├── images/             # Static images
│       ├── webfonts/           # Web fonts
│       └── favicon/            # App icons
├── src/
│   ├── App.js                  # Main App component
│   ├── index.js                # React entry point
│   ├── api/
│   │   └── axios.js            # Axios configuration
│   ├── components/             # Reusable components
│   │   ├── DashBoardLayerOne.jsx    # Dashboard
│   │   ├── ProjectListLayer.jsx     # Project listing
│   │   ├── StaffListLayer.jsx       # Staff directory
│   │   ├── PermissionManagement.jsx # Permissions
│   │   ├── ReportLayer.jsx          # Reports
│   │   ├── ProtectedRoute.jsx       # Route protection
│   │   ├── SignInLayer.jsx          # Login page
│   │   ├── SignUpLayer.jsx          # Registration
│   │   ├── AddProjectLayer.jsx      # Project creation
│   │   ├── EditProjectLayer.jsx     # Project editing
│   │   ├── AddStaffLayer.jsx        # Staff creation
│   │   ├── EditStaffLayer.jsx       # Staff editing
│   │   ├── DocumentUploadModal.jsx  # File uploads
│   │   ├── ProjectRemainders.jsx    # Reminders
│   │   ├── ErrorLayer.jsx           # Error handling
│   │   ├── AccessDeniedLayer.jsx    # Access control

│   │   ├── Breadcrumb.jsx           # Navigation breadcrumbs
│   │   └── child/                   # Child components
│   ├── features/                # Redux feature slices
│   │   ├── auth/                # Authentication
│   │   ├── projects/            # Project state
│   │   ├── staff/               # Staff state
│   │   ├── payment/             # Payment state
│   │   ├── customers/           # Customer state
│   │   ├── permissions/         # Permission state
│   │   ├── notification/        # Notification state
│   │   └── stages/              # Stage state
│   ├── pages/                   # Page components
│   │   ├── HomePageOne.jsx      # Dashboard page
│   │   ├── AddProjectPage.jsx   # Project creation
│   │   ├── EditProjectPage.jsx  # Project editing
│   │   ├── AddStaffPage.jsx     # Staff creation
│   │   ├── EditStaffListPage.jsx# Staff management
│   │   ├── AddUserPage.jsx      # User creation
│   │   ├── EditUserListPage.jsx # User management
│   │   ├── ErrorPage.jsx        # Error page
│   │   └── ForgotPasswordPage.jsx# Password reset
│   ├── helper/                  # Utility helpers
│   │   ├── MobileMenuToggle.jsx # Mobile menu
│   │   ├── ThemeToggleButton.jsx# Theme switching
│   │   ├── RouteScrollToTop.jsx # Scroll behavior
│   │   └── SortableTask.js      # Task sorting
│   ├── hook/                    # Custom React hooks
│   │   ├── event-utils.js       # Event utilities
│   │   ├── usePaymentReminders.js # Payment hook
│   │   └── useReactApexChart.js # Chart hook
│   ├── masterLayout/            # Layout components
│   │   └── MasterLayout.jsx     # Main layout wrapper
│   ├── store/                   # Redux configuration
│   ├── utils/                   # Utility functions
│   └── setupTests.js            # Test configuration
├── package.json
├── README.md                    # This file
└── .env                         # Environment variables
```

## 🎨 Key Features

### Dashboard & Analytics
- Real-time project overview
- Performance charts and graphs
- Key metrics visualization
- ApexCharts integration

### Project Management
- Create, edit, and delete projects
- Organize projects by stages
- Assign staff to projects
- Track project progress
- Upload project documents

### Staff & User Management
- Comprehensive staff directory
- User profile management
- Role-based access control
- Department organization
- Permission management

### Payment Processing
- Track payments and invoices
- Payment history
- Automated payment reminders
- Financial reporting

### Customer Management
- Maintain customer database
- Customer details and contacts
- Customer-project relationships
- Communication history

### File Management
- Document uploads for projects
- Secure file storage
- File organization
- Download functionality

### Notifications & Alerts
- Payment reminders
- Project updates
- System notifications
- Toast notifications for user feedback

## 📱 Responsive Design

- Mobile-first approach
- Bootstrap 5 grid system
- Tablet and desktop optimization
- Touch-friendly interface

## 🔧 Technologies Used

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Redux Toolkit** | State management |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests |
| **Bootstrap 5** | CSS framework |
| **ApexCharts** | Data visualization |
| **React Hot Toast** | Notifications |
| **React Quill** | Rich text editor |
| **Flatpickr** | Date picker |
| **React Datepicker** | Date selection |
| **Lucide React** | Icon library |

## 📦 Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.1",
  "redux": "included in @reduxjs/toolkit",
  "@reduxjs/toolkit": "^2.11.2",
  "react-redux": "^9.2.0",
  "axios": "^1.15.0",
  "bootstrap": "^5.3.3",
  "react-bootstrap": "^2.10.5",
  "apexcharts": "^4.3.0",
  "react-apexcharts": "^1.9.0",
  "react-hot-toast": "^2.6.0",
  "react-quill": "^2.0.0",
  "lucide-react": "^1.9.0"
}
```

## 🔑 Redux Store Structure

```
store/
├── auth/          # User authentication & login state
├── projects/      # Project management state
├── staff/         # Staff directory state
├── payment/       # Payment tracking state
├── customers/     # Customer data state
├── permissions/   # Permission & role state
├── notification/  # Notification state
└── stages/        # Project stages state
```

## 🔐 Authentication

- JWT token-based authentication
- Secure login/logout functionality
- Protected routes with ProtectedRoute component
- Permission-based access control
- Token storage in localStorage
- Automatic token refresh

## 🎯 Component Hierarchy

```
App
├── ProtectedRoute (if authenticated)
│   └── MasterLayout
│       ├── Navigation/Sidebar
│       └── Main Content
│           ├── Dashboard
│           ├── Projects
│           ├── Staff
│           ├── Payments
│           ├── Customers
│           └── Permissions
└── Auth Routes
    ├── SignIn
    ├── SignUp
    └── ForgotPassword
```

## 🚀 Available Scripts

### Development
```bash
npm start                   # Start dev server (http://localhost:3000)
npm run build              # Production build
npm test                   # Run tests
npm run eject              # Eject configuration (one-way operation)
```

### Build Process
- Webpack bundling
- Code splitting
- Asset optimization
- Source maps for debugging

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_ENVIRONMENT` | Environment type | development/production |

## 🛡️ Security Features

- XSS protection via React
- CSRF token handling
- Secure API communication over HTTPS
- Protected routes
- Role-based access control
- Secure localStorage usage

## 🎨 Styling

- Bootstrap 5 utility classes
- Custom CSS variables
- Responsive design patterns
- Dark mode support (via ThemeToggleButton)
- SCSS preprocessing

## 📊 Charts & Visualizations

- ApexCharts for interactive charts
- Pie charts, bar charts, line graphs
- Real-time data updates
- Customizable chart options

## 🔄 State Management Flow

1. User actions trigger Redux actions
2. Reducers update state
3. Components subscribe to store changes
4. UI updates based on new state

## 🧪 Testing

```bash
npm test                   # Run all tests
npm test -- --coverage     # Coverage report
npm test -- --watch       # Watch mode
```

Test files: `*.test.js`

## 📈 Performance Optimization

- Code splitting with React.lazy()
- Image lazy loading
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists
- Efficient Redux selectors

## 🚨 Error Handling

- Error boundaries for component errors
- API error handling with try-catch
- User-friendly error messages
- ErrorLayer component for displaying errors
- Validation on forms

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support & Troubleshooting

### API Connection Issues
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Check browser console for CORS errors

### State Management Issues
- Use Redux DevTools extension
- Check Redux actions in store
- Verify action creators are dispatched

### Styling Issues
- Clear browser cache
- Verify Bootstrap 5 is loaded
- Check CSS specificity conflicts

## 📄 License

ISC

## 👥 Author

Amount Manager Development Team

---

**Last Updated**: April 2026

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
