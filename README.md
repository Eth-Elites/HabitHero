# 🦸‍♂️ HabitHero

A decentralized habit tracking application built on the Flow blockchain. HabitHero helps users build and maintain positive habits through blockchain-based accountability and rewards.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Blockchain**: Flow blockchain with Cadence smart contracts
- **Wallet Integration**: Flow wallet connection via `@onflow/react-sdk`

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Flow CLI](https://developers.flow.com/tools/flow-cli)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HabitHero
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Start the Flow Emulator

In your terminal, navigate to the backend directory and start the Flow emulator:

```bash
cd backend
flow emulator
```

Keep this terminal running.

### 4. Start the Development Wallet

In a new terminal, navigate to the backend directory and start the development wallet:

```bash
cd backend
flow dev-wallet
```

Keep this terminal running.

### 5. Start the Frontend Development Server

In a new terminal, navigate to the frontend directory and start the development server:

```bash
cd frontend
npm run dev
```

### 6. Access the Application

Open your browser and navigate to `http://localhost:5173`

### 7. Connect Your Wallet

Click the "Connect" button to connect your Flow wallet and start using the app.

## 🛠️ Development

### Frontend Development

The frontend is built with:

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **@onflow/react-sdk** for Flow blockchain integration
- **@tanstack/react-query** for data fetching

### Smart Contract Development

The smart contracts are written in Cadence and located in `backend/cadence/`:

- `contracts/` - Smart contracts
- `scripts/` - Read-only operations
- `transactions/` - State-changing operations
- `tests/` - Contract tests

### Available Scripts

#### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend

```bash
flow emulator                    # Start Flow emulator
flow dev-wallet                  # Start development wallet
flow test                        # Run contract tests
flow scripts execute <script>    # Execute a script
flow transactions send <tx>      # Send a transaction
```

## 📁 Project Structure

```
HabitHero/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Flow blockchain backend
│   ├── cadence/           # Cadence smart contracts
│   │   ├── contracts/     # Smart contracts
│   │   ├── scripts/       # Read-only operations
│   │   ├── transactions/  # State-changing operations
│   │   └── tests/         # Contract tests
│   └── flow.json          # Flow project configuration
└── README.md              # This file
```

## 🔧 Configuration

### Flow Configuration

The Flow blockchain configuration is managed in `backend/flow.json`. This file defines:

- Contract deployments
- Network configurations
- Account settings

### Frontend Configuration

The frontend configuration is managed in `frontend/vite.config.ts` and `frontend/tsconfig.json`.

## 🧪 Testing

### Smart Contract Tests

Run the smart contract tests:

```bash
cd backend
flow test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Deploying Smart Contracts

To deploy contracts to the Flow emulator:

```bash
cd backend
flow project deploy --network=emulator
```

To deploy to Flow testnet:

```bash
cd backend
flow project deploy --network=testnet
```

### Building Frontend for Production

```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Resources

- [Flow Documentation](https://developers.flow.com/)
- [Cadence Documentation](https://cadence-lang.org/docs/language)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/HabitHero/issues) page
2. Create a new issue if your problem isn't already reported
3. Join the [Flow Discord](https://discord.gg/flow) for community support

---

Built with ❤️ on the Flow blockchain
