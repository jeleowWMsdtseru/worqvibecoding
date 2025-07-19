# LifeBet - Gambling Recovery Website

A compassionate and professional website designed to help individuals struggling with gambling addiction find support and book consultations. Built with Express.js backend and a responsive frontend.

## Features

- **Consultation Booking System**: Secure form processing with email notifications
- **Real-time Form Validation**: Client-side validation with user-friendly error messages
- **Email Integration**: Automated confirmation emails to users and notifications to admins
- **Rate Limiting**: Protection against spam and abuse
- **Security**: Helmet.js, CORS, and input sanitization
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Email**: Nodemailer
- **Validation**: Zod for runtime type checking
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Security**: Helmet.js, Express Rate Limit, CORS

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Email service credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd lifebet-gambling-recovery
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Email Service Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   
   # Notification Settings
   ADMIN_EMAIL=admin@yourdomain.com
   SUPPORT_EMAIL=support@yourdomain.com
   
   # Client URL (for CORS)
   CLIENT_URL=https://yourdomain.com
   ```

3. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

4. **Access the website**
   - Open `http://localhost:3000` in your browser
   - The website will be served as a static site with API endpoints

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in your `.env` file

### Other Email Providers

The system supports any SMTP provider. Update these variables in `.env`:
- `EMAIL_HOST`: SMTP server hostname
- `EMAIL_PORT`: SMTP port (usually 587 for TLS, 465 for SSL)
- `EMAIL_USER`: Your email username
- `EMAIL_PASS`: Your email password or app password

## API Endpoints

### POST `/api/booking`
Submit a consultation booking request.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I need help with gambling addiction" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking request received successfully. We will contact you within 24 hours."
}
```

**Rate Limiting:** 5 requests per 15 minutes per IP

### GET `/api/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "environment": "development"
}
```

## Form Validation

The system includes comprehensive validation:

### Client-Side Validation
- Real-time field validation
- Character count for message field
- Visual error indicators
- Custom error messages

### Server-Side Validation (Zod)
- Name: 2-100 characters, letters/spaces/hyphens/apostrophes only
- Email: Valid email format, max 254 characters
- Message: Optional, max 1000 characters
- Input sanitization and trimming

## Security Features

- **Helmet.js**: Security headers and CSP
- **Rate Limiting**: Prevents spam submissions
- **CORS**: Configured for your domain
- **Input Validation**: Prevents injection attacks
- **Error Handling**: Secure error messages

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
CLIENT_URL=https://yourdomain.com
EMAIL_HOST=your-smtp-host
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-secure-password
ADMIN_EMAIL=admin@yourdomain.com
```

### Static File Hosting

The application serves the HTML file and assets directly. For production:

1. Consider using a CDN for static assets
2. Enable gzip compression
3. Set up proper SSL/TLS certificates
4. Configure your domain's DNS

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Customization

### Email Templates

Email templates are in `services/emailService.js`:
- `sendBookingConfirmation()`: User confirmation email
- `sendAdminNotification()`: Admin notification email

### Styling

The website uses Tailwind CSS. Key styling files:
- `index.html`: Contains custom CSS variables and classes
- Responsive design with mobile-first approach

### Form Fields

To add new form fields:
1. Update the HTML form in `index.html`
2. Add validation rules in `validators/bookingValidator.js`
3. Update the email templates in `services/emailService.js`

## Monitoring and Logs

- Form submissions are logged to console
- Email send status is tracked
- Health check endpoint for uptime monitoring
- Consider adding proper logging service for production

## Support Resources

The website includes links to:
- National Problem Gambling Helpline: 1-800-522-4700
- Spiritual guidance from major religions
- Success stories and testimonials

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all forms validate properly
5. Test email functionality

## License

MIT License - See LICENSE file for details

---

## Emergency Contacts

If you or someone you know needs immediate help:
- **National Problem Gambling Helpline**: 1-800-522-4700
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988 