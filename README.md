# Amanah - Family Crowdfunding Platform

**Amanah** (Arabic: أمانة, meaning "trust") is a family-focused crowdfunding platform that enables families to support each other through collective contributions and democratic campaign approval.

## 🌟 Features

### Core Functionality
- **Family Groups**: Create private circles to pool resources
- **Campaign Management**: Start fundraising campaigns for family members in need
- **Democratic Voting**: Campaigns require 3 votes to become active
- **Contribution Tracking**: Track contributions with privacy options
- **Multi-language Support**: English, Swedish (Svenska), and Arabic (العربية)
- **RTL Support**: Full right-to-left layout for Arabic

### Campaign Features
- Campaign status: Pending → Active → Completed
- Vote-based approval system (3 votes required)
- Target amount tracking with progress bars
- Due date management with countdown
- Private/anonymous contributions
- Campaign categories and beneficiary tracking

### Group Management
- Create and manage family groups
- Invite members via email or phone
- Admin controls for group settings
- Member status tracking (Active/Invited)
- Group-specific campaigns
- Remove members with confirmation

### Multi-Currency Support
- **English**: USD ($)
- **Swedish**: SEK (kr)
- **Arabic**: SAR (ر.س)
- Automatic currency conversion based on language

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/amanah.git
cd amanah

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Technology Stack

- **Framework**: Next.js 16 (React 18)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks + localStorage (temporary)
- **Authentication**: Mock auth (to be replaced)
- **Database**: Prisma (configured, not yet connected)
- **ORM**: Prisma with SQLite (development)

## 🌍 Internationalization

The app supports three languages with full translations:

- **English** (en) - USD currency
- **Swedish** (sv) - SEK currency
- **Arabic** (ar) - SAR currency with RTL support

Language can be switched from any page using the language selector in the header.

## 📂 Project Structure

```
amanah/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── campaigns/      # Campaign management
│   │   │   │   ├── new/        # Create campaign
│   │   │   │   └── [id]/       # Campaign details
│   │   │   ├── contribute/     # Contribution page
│   │   │   └── groups/         # Group management
│   │   │       ├── new/        # Create group
│   │   │       └── [id]/       # Group details
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable components
│   │   └── LanguageSwitcher.tsx
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Authentication (mock)
│   │   ├── i18n.ts             # Internationalization
│   │   ├── mockData.ts         # Data management (localStorage)
│   │   └── prisma.ts           # Prisma client
│   └── types/                  # TypeScript types
│       └── index.ts
├── prisma/                     # Database schema
│   └── schema.prisma
├── public/                     # Static assets
│   ├── logo.svg
│   └── logo-simple.svg
├── amanah-mobile/              # React Native mobile app (WIP)
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── MOBILE_APP_GUIDE.md         # Mobile app guide
└── vercel.json                 # Vercel configuration
```

## 🔐 Current Limitations

### Data Storage
- Currently uses **localStorage** for data persistence
- Data is browser-specific and not shared between users
- Data is lost if browser cache is cleared
- Not suitable for production use

### Authentication
- Mock authentication system
- No password encryption
- No real session management
- Sessions stored in localStorage

### Recommended for Production
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Database migration (Supabase/PlanetScale/MongoDB)
- Real authentication (NextAuth.js)
- Production deployment (Vercel/Netlify/Railway)
- Security best practices

## 🚀 Deployment

### Quick Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your app will be live in 2-3 minutes!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions and other hosting options.

## 📱 Mobile App

A React Native mobile app is in development at `amanah-mobile/`. 

Current status:
- ✅ Basic project structure
- ✅ Landing screen
- ⏳ Authentication screens
- ⏳ Dashboard and features

See [MOBILE_APP_GUIDE.md](./MOBILE_APP_GUIDE.md) for setup and development instructions.

## 🎯 Roadmap

### Completed ✅
- [x] Authentication system (login/register)
- [x] Dashboard with stats and activity feed
- [x] Campaign creation and management
- [x] Group creation and member management
- [x] Contribution flow with privacy options
- [x] Voting system for campaigns (3 votes required)
- [x] Campaign approval workflow (pending → active)
- [x] Multi-language support (EN/AR/SV)
- [x] Currency conversion by language
- [x] Due dates and countdown tracking
- [x] Landing page with active campaigns
- [x] Admin functions (delete groups, campaigns, members)
- [x] Full translation of all UI elements and error messages

### Next Steps 🚀
- [ ] Replace localStorage with real database
- [ ] Implement real authentication (NextAuth.js)
- [ ] Add payment integration (Stripe/PayPal)
- [ ] Email notifications for invites and updates
- [ ] Receipt generation for contributions
- [ ] Complete mobile app (React Native)
- [ ] Add analytics and monitoring
- [ ] Implement rate limiting and security headers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add translations for all new UI text
- Test in all three languages
- Ensure RTL support for Arabic

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS
- Icons from Heroicons (SVG)
- Inspired by the concept of family mutual support (Amanah)

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Made with ❤️ for families supporting each other**
