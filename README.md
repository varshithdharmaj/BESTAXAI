# BESTTAXAI 🚀

Professional AI-powered tax filing website built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Professional Logo Integration**: Custom SVG logo throughout the application
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **TypeScript**: Full type safety and better development experience
- **Fast Performance**: Optimized with Vite build system

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3001 (or the port shown in terminal)
```

### 🐳 Docker Deployment

#### Option 1: Docker Commands
```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run

# Access at http://localhost:3000
```

#### Option 2: Docker Compose (Recommended)
```bash
# Production deployment
npm run docker:prod

# Development with hot reload
npm run docker:dev
```

## 🌐 Deployment Options

### 1. GitHub Pages (Current)
```bash
# Deploy to GitHub Pages
npm run deploy:github

# Access at: https://varshithdharmaj.github.io/BETTERTAXAI/
```

### 2. Cloud Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### Railway
1. Connect your GitHub repository to Railway
2. Railway will auto-detect the Dockerfile
3. Deploy automatically on push

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container
- `npm run docker:dev` - Run development with Docker
- `npm run docker:prod` - Run production with Docker

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific settings:

```env
VITE_API_URL=your_api_url
VITE_APP_NAME=BETTERTAXAI
```

### Docker Environment
The Docker setup includes both development and production configurations:
- **Development**: Hot reload, source maps, dev dependencies
- **Production**: Optimized build, minimal image size, production server

## 🚀 Deployment Recommendations

1. **For Development/Testing**: Use Docker locally
2. **For Production**: 
   - **Best**: Vercel or Netlify (automatic deployments)
   - **Alternative**: Railway with Docker
   - **Current**: GitHub Pages (static hosting)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Live Website**: https://varshithdharmaj.github.io/BETTERTAXAI/
**Repository**: https://github.com/varshithdharmaj/BETTERTAXAI
