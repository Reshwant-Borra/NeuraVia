# Neuro Lens

A professional neurological assessment and monitoring PWA built with Next.js, TypeScript, and modern web technologies.

## Features

- 🧠 **Neurological Assessments**: Four core assessment types (Tremor, Finger Tap, Hand Open/Close, Sway)
- 📱 **Progressive Web App**: Installable with offline support and service worker caching
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 🔄 **State Management**: Zustand for efficient state management with persistence
- 📊 **Data Visualization**: Recharts for assessment result visualization
- 🗄️ **Local Storage**: IndexedDB with idb-keyval for secure data storage
- ✅ **Type Safety**: Full TypeScript support with Zod validation
- 🧪 **Testing**: Vitest + Testing Library for comprehensive testing
- 🔧 **Developer Experience**: ESLint, Prettier, and Husky for code quality

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Data Storage**: idb-keyval (IndexedDB)
- **Charts**: Recharts
- **Validation**: Zod
- **PWA**: next-pwa
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neuro-lens
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI

## Project Structure

```
neuro-lens/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── assessments/     # Assessments page
│   │   ├── legal/          # Legal & privacy page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Header.tsx     # Application header
│   │   ├── Footer.tsx     # Application footer
│   │   └── AssessmentCard.tsx # Assessment card component
│   ├── lib/               # Utility functions and hooks
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils.ts       # Utility functions
│   ├── store/             # Zustand store
│   │   └── useAppStore.ts # Main application store
│   ├── styles/            # Additional styles
│   └── tests/             # Test files
├── public/                # Static assets
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── .husky/               # Git hooks
├── next.config.ts        # Next.js configuration
├── vitest.config.ts      # Vitest configuration
└── package.json          # Dependencies and scripts
```

## PWA Features

### Installation
The app is installable as a PWA. Users can:
- Install from browser menu
- Add to home screen on mobile devices
- Use offline with cached resources

### Offline Support
- Service worker caches static assets
- WASM and model files are cached for offline use
- Assessment data is stored locally using IndexedDB

### Caching Strategy
- **Static Assets**: Cache-first with long expiration
- **API Responses**: Network-first with fallback to cache
- **WASM/Models**: Cache-first with 1-year expiration

## Assessment Types

### 1. Tremor Assessment
- Measures involuntary rhythmic movements
- Assesses motor control and stability
- Uses device sensors for motion detection

### 2. Finger Tap Test
- Evaluates fine motor coordination
- Measures tapping speed and rhythm
- Tracks finger movement patterns

### 3. Hand Open/Close
- Assesses hand coordination
- Evaluates motor planning
- Measures movement precision

### 4. Sway Analysis
- Measures postural stability
- Analyzes balance and coordination
- Uses device accelerometer/gyroscope

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Husky pre-commit hooks for quality control

### Testing
- Vitest for unit testing
- Testing Library for component testing
- Jest DOM for DOM testing utilities

### State Management
- Zustand for global state
- Persistence with localStorage
- Type-safe state updates

## Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```env
NEXT_PUBLIC_APP_NAME=Neuro Lens
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is for educational and research purposes. See the [Legal page](/legal) for more information.

## Medical Disclaimer

This application is for educational and research purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Always consult with qualified healthcare professionals for medical advice.

## Support

For technical support or questions, please refer to the [Legal page](/legal) for contact information.
