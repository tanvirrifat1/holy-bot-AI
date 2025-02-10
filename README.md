# Holy-Bot-AI

## Overview

This is a Node.js-based chat bot AI application built with TypeScript. It provides a robust backend for handling chat functionalities, user authentication, file uploads, and more. The application uses Express.js as the web framework, MongoDB for database management, and various other libraries for additional functionalities like logging, email sending, and payment processing.

## Features

- **User Authentication**: Secure authentication using JSON Web Tokens (JWT) and bcrypt for password hashing.
- **File Uploads**: Handle file uploads using Multer.
- **Logging**: Comprehensive logging using Winston with daily log rotation.
- **Email Notifications**: Send emails using Nodemailer.
- **Payment Processing**: Integrate with Stripe for payment processing.
- **Real-time Communication**: Real-time communication using Socket.IO.
- **Validation**: Data validation using Zod.
- **Environment Variables**: Manage environment variables using dotenv.
- **CORS**: Enable Cross-Origin Resource Sharing (CORS) for secure API access.
- **HTTP Status Codes**: Use http-status-codes for consistent HTTP status code usage.

## Installation

### Clone the Repository:

```bash
git clone https://github.com/your-username/chat-bot-ai.git
cd chat-bot-ai
```

### Install Dependencies:

```bash
npm install
```

### Set Up Environment Variables:

Create a `.env` file in the root directory and add the necessary environment variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/chat-bot-ai
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Usage

### Start Development Server:

```bash
npm run dev
```

This will start the server using `ts-node-dev` with hot-reloading enabled.

### Linting:

Check for linting errors:

```bash
npm run lint:check
```

Fix linting errors:

```bash
npm run lint:fix
```

### Prettier:

Check for formatting issues:

```bash
npm run prettier:check
```

Fix formatting issues:

```bash
npm run prettier:fix
```

## Testing

Currently, there are no tests specified. To add tests, update the test script in `package.json`.

## Dependencies

### Dev Dependencies:

- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **ESLint**: A pluggable and configurable linter tool for JavaScript.
- **Prettier**: An opinionated code formatter.
- **ts-node-dev**: A development tool that restarts the node process when a file is changed.

### Dependencies:

- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool designed for async environments.
- **Socket.IO**: Enables real-time, bidirectional, and event-based communication.
- **Stripe**: A suite of payment APIs for online businesses.
- **Winston**: A multi-transport async logging library for Node.js.
- **Zod**: TypeScript-first schema validation with static type inference.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a pull request.

## License

This project is licensed under the **ISC License**. See the `LICENSE` file for details.

## Acknowledgments

Thanks to all the open-source contributors whose libraries are used in this project.
Special thanks to the **Node.js** and **TypeScript** communities for their continuous support and contributions.

## Contact

For any questions or suggestions, please open an issue on the [GitHub repository](https://github.com/tanvirrifat1/holy-bot-AI/tree/main/src/app/modules) or contact the maintainer directly.
