# Financial Management System

A comprehensive full-stack application for managing financial operations, user authentication, expense tracking, and treasury management through an intuitive web-based interface.

## 📦 Project Structure

```
├── Frontend/                # Client-side application
│   ├── public/
│   │   ├── assets/         # Static resources (CSS, images, fonts)
│   │   └── index.html      # Main HTML file
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Feature modules (auth, expense)
│   │   ├── store/          # State management
│   │   └── api/            # API client configuration
│   └── package.json
│
├── Backend/                # Server-side application
│   ├── config/            # Configuration files (database setup)
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware functions
│   ├── models/            # Data models
│   ├── routes/            # API route definitions
│   ├── server.js          # Entry point
│   └── package.json
│
└── README.md              # This file
```

## 🎯 Core Features

### 🔐 Authentication & Authorization
- User account creation and registration
- Secure login and session management
- Protected route middleware
- User role management

### 💼 Financial Tracking
- Expense logging and categorization
- Transaction history
- Expense reports and analytics
- Budget organization

### 💰 Treasury Management
- Financial overview dashboard
- Asset tracking
- Financial summaries
- Data visualization

### 📊 Reporting & Analytics
- Record and track payments
- Automated payment reminders
- Payment history and reports
- Financial analytics

### 📋 Customer Management
- Maintain customer database
- Link customers to projects
- Store contact information
- Communication history

### 🔐 Security & Access Control
- Token-based authentication
- Role-based access control (RBAC)
- Permission management
- Secure file uploads
- Password encryption

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Runtime Environment** v14+
- **Package Manager** v6+
- **Relational Database** v5.7+
- **Version Control** (optional)

### Installation Steps

#### 1. Clone or Download the Repository

```bash
cd "Amount Manager"
```

#### 2. Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file:

```env

```

Create database:

```sql
CREATE DATABASE financial_system;
```

Start server:

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

#### 3. Client Setup

Open a new terminal and navigate to the client:

```bash
cd Frontend
npm install
```

Create `.env` file:
PORT=5000
MONGO_URI=mongo_URL/expense_dashboard
CLIENT_URL = http://localhost:3000
JWT_SECRET=your_super_secret_key_123
NODE_ENV=development
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

Start client:

```bash
npm start
```

Client will open at: `http://localhost:3000`

## 🏗️ Architecture

### Client Architecture
- **Framework**: Modern component-based framework
- **State Management**: Centralized store management
- **Routing**: Client-side routing
- **HTTP Client**: HTTP request library
- **UI Framework**: CSS framework
- **Visualization**: Charting library
- **Build Tool**: Module bundler

### Server Architecture
- **Runtime**: Server-side JavaScript environment
- **Framework**: Web application framework
- **ORM**: Object-relational mapper
- **Database**: Relational database system
- **Authentication**: Token-based authentication
- **File Handling**: Multipart form data processor
- **Task Scheduling**: Cron job scheduler
- **Communications**: Email service integration

## 📡 Architecture

```
Client (Web Application)
    ↓ (HTTP/REST)
API Server (Web Framework)
    ↓ (ORM)
Database
    ↓
File Storage
```

## 🔄 Data Flow

1. **User Interaction**: User interacts with client interface
2. **State Management**: State management system captures action
3. **API Call**: HTTP request sent to server
4. **Server Processing**: Server processes the request
5. **Database Operation**: Database is queried or updated
6. **Response**: Server returns data response
7. **State Update**: Client state management updates
8. **UI Render**: Client interface updates with new data

## 📋 API Endpoints

### Authentication (`/api/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Expenses (`/api/expenses`)
- `GET /expenses` - List all expenses
- `POST /expenses` - Create expense
- `GET /expenses/:id` - Get expense details
- `PATCH /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Treasury (`/api/treasury`)
- `GET /treasury` - Financial overview
- `POST /treasury` - Add treasury record
- `GET /treasury/:id` - Get treasury details
- `PATCH /treasury/:id` - Update treasury
- `DELETE /treasury/:id` - Delete treasury

## 🔑 Default User Roles

- **Administrator**: Full system access
- **Manager**: Administrative operations
- **User**: Standard operations
- **Viewer**: Read-only access

## 🗄️ Database Schema

### Key Tables

**User Accounts**
- Authentication and user data
- Credentials and profile information

**Financial Records**
- Transaction data storage
- Amount and category tracking

**Treasury Data**
- Asset information
- Financial summaries

**User Permissions**
- Access control mappings
- Authorization matrix

## 🔐 Security Measures

1. **Authentication**
   - Token-based authorization with expiration
   - Refresh token mechanism
   - Secure password hashing

2. **Authorization**
   - Role-based access control
   - Protected endpoints
   - Permission verification

3. **Data Security**
   - Input validation
   - Injection prevention via ORM
   - Cross-site scripting protection via framework

4. **File Security**
   - Upload validation
   - Size restrictions
   - Type verification

5. **API Security**
   - Cross-origin resource sharing
   - Rate limiting (recommended)
   - HTTPS in production

## 📈 Deployment

### Server Deployment (Production)

```bash
cd Backend
npm run build  # If available
npm start      # Run production server
```

Recommended hosting options:
- Platform as a Service (PaaS)
- Infrastructure as a Service (IaaS)
- Virtual Private Servers (VPS)
- Containerized services

### Client Deployment (Production)

```bash
cd Frontend
npm run build
```

Deploy the `build/` folder to:
- Static hosting services
- Content delivery networks
- Cloud storage with hosting
- Web hosting providers
- Containerized services

## 🛠️ Development Tools

### Recommended Tools
- Code editor/IDE
- Browser developer tools
- HTTP client tools
- Version control client
- Database management tool

### Browser Extensions
- State management tools
- Framework developer tools
- Network inspection tools

### Testing
```bash
# Client
cd Frontend
npm test

# Server
cd Backend
npm test
```

## 📚 Documentation

For detailed information, refer to:

- [Client Documentation](Frontend/README.md) - Client application guide
- [Server Documentation](Backend/README.md) - Server API documentation

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in .env
```

### Database Connection Error
```bash
# Verify database service is running
# Check database credentials in .env
# Ensure database is created
```

### Client Can't Connect to Server
- Check server is running on port 5000
- Verify API_URL in client .env
- Check browser console for errors
- Ensure CORS is enabled on server

### Cross-Origin Errors
- Verify server CORS configuration
- Check client makes requests to correct URL
- Ensure credentials are properly configured

## 📞 Support

For issues or questions:
1. Review documentation
2. Check error logs
3. Review browser console output
4. Check server terminal output
5. Verify environment variables

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit contribution
5. Wait for review

## 📄 License

ISC

---

## 🚦 Quick Reference

### Start Both Services

**Terminal 1 - Server:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Client:**
```bash
cd Frontend
npm start
```

Then open `http://localhost:3000` in your browser.

### Default Credentials

After database seeding, try:
- Email: `admin@example.com`
- Password: `admin123` (change immediately!)

### Stop Services

- Client: Press `Ctrl+C` in terminal
- Server: Press `Ctrl+C` in terminal

### Service Status

```bash
# Server running on 5000?
curl http://localhost:5000

# Client running on 3000?
curl http://localhost:3000
```

---

**Last Updated**: April 2026
**Version**: 1.0.0
