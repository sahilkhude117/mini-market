# Mini-Market - Solana Prediction Markets

A decentralized prediction market platform built on Solana, featuring a modern React/Next.js frontend and an Anchor-based smart contract backend.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- Bun or npm
- Solana CLI
- Anchor CLI
- Phantom Wallet

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 Program Information

**Devnet Program ID**: `2F4mpMnSUMDuhMwFnXAgz7xf7V2zYWPFzU12EAGxk8do`

## 🏗️ Project Structure

```
mini-market/
├── anchor/              # Anchor Solana program
│   ├── programs/       # Smart contract code
│   ├── tests/          # Program tests
│   └── target/idl/     # Program IDL
├── src/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   │   ├── elements/   # UI components
│   │   ├── layouts/    # Layout components
│   │   └── prediction_market_sdk/  # Solana SDK
│   ├── providers/      # React context providers
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── data/           # Static data
└── public/             # Static assets
```

## 🎯 Features

- ✅ Create prediction markets
- ✅ Place bets (yes/no)
- ✅ Add liquidity to markets
- ✅ Dynamic token pricing via bonding curve
- ✅ Oracle integration (Switchboard)
- ✅ Wallet connection (Phantom)
- ✅ Responsive UI
- ✅ Market carousel
- ✅ Recent activity feed
- ✅ User profiles
- ✅ Referral system

## 📚 Documentation

- [Migration Summary](./MIGRATION-SUMMARY.md) - Details about the frontend migration
- [Program Integration Guide](./PROGRAM-INTEGRATION-GUIDE.md) - How the program works
- [Post-Migration Checklist](./POST-MIGRATION-CHECKLIST.md) - Tasks to complete

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.1
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **State Management**: React Context
- **Wallet**: Solana Wallet Adapter

### Backend
- **Blockchain**: Solana (Devnet)
- **Smart Contract**: Anchor 0.29.0
- **Oracle**: Switchboard
- **Database**: MongoDB (for metadata)

## 🎨 UI Features

- Dark theme with modern design
- Collapsible sidebar navigation
- Market carousel with featured markets
- Real-time price updates
- Progress bars for market sentiment
- Responsive design (mobile/tablet/desktop)
- Toast notifications
- Loading states and animations

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
DB_URL=mongodb://127.0.0.1:27017/mini-market
CLUSTER=devnet
PORT=3000
```

### Anchor Commands

```bash
# Build program
npm run anchor-build

# Test program
npm run anchor-test

# Deploy to devnet
cd anchor
anchor deploy --provider.cluster devnet
```

## 🧪 Testing

```bash
# Run anchor tests
npm run anchor-test

# Run frontend tests
npm test
```

## 📖 How It Works

1. **Create Market**: Users propose a prediction market with a question and oracle feed
2. **Add Liquidity**: Market creator adds SOL to activate the market
3. **Place Bets**: Users buy yes/no tokens to bet on outcomes
4. **Price Discovery**: Token prices adjust based on betting activity (bonding curve)
5. **Oracle Resolution**: At market end date, oracle fetches result
6. **Settle Market**: Winners can claim their earnings

## 🔐 Security

- All transactions require wallet signature
- Program uses PDAs for security
- Fee authority validation
- Market status checks
- Amount validations

## 🚧 Known Limitations

- Requires backend API for market metadata
- Oracle integration needs testing
- Some features require MongoDB connection

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Check the documentation files
- Review Solana Explorer transactions
- Check program logs: `solana logs <PROGRAM_ID>`

## 🔗 Links

- [Solana Docs](https://docs.solana.com/)
- [Anchor Docs](https://www.anchor-lang.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

---

Built with ❤️ on Solana