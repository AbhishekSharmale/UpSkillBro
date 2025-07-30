# UpskillBro - Your AI Career Co-Pilot

A comprehensive Angular application for personalized developer learning that competes with roadmap.sh by offering AI-powered customization and additional features.

## 🚀 Features

### Core Features Implemented

1. **Landing Page & Branding**
   - Modern, tech-focused design with hero section
   - Feature showcase and testimonials
   - Clear call-to-action for skills assessment

2. **Skills Assessment System**
   - Multi-step assessment form (7 questions)
   - Multiple question types: multiple choice, sliders, checkboxes
   - Progress tracking and save functionality

3. **AI-Powered Personalized Roadmaps**
   - Visual roadmap display with interactive timeline
   - Progress tracking with completion status
   - Skill gap visualization
   - Resource recommendations for each milestone

4. **User Dashboard**
   - Comprehensive progress overview
   - Learning streak tracking
   - Quick action buttons
   - Recent activity feed
   - Upcoming sessions and achievements

5. **Mentorship Platform**
   - Mentor discovery with filtering
   - Mentor profiles with ratings and skills
   - Booking system interface

6. **AI Mock Interview System**
   - Multiple interview types (Technical, Behavioral, System Design)
   - Practice session history
   - Performance tracking

7. **Tech News & Blog Aggregator**
   - Curated tech news feed
   - Category filtering
   - Featured and regular articles

8. **Community Features**
   - Discussion forums
   - Study groups
   - Coding challenges
   - Community statistics

## 🛠 Technology Stack

- **Framework**: Angular 20+ with standalone components
- **Styling**: SCSS with custom design system
- **UI Components**: Angular Material
- **State Management**: Services with RxJS
- **Routing**: Angular Router with lazy loading
- **Animations**: Angular Animations

## 📁 Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── landing/          # Landing page
│   │   ├── assessment/       # Skills assessment
│   │   ├── dashboard/        # User dashboard
│   │   ├── roadmap/          # Learning roadmap
│   │   ├── mentorship/       # Mentor platform
│   │   ├── interview/        # Mock interviews
│   │   ├── news/             # Tech news
│   │   └── community/        # Community features
│   ├── shared/
│   │   ├── components/       # Shared components
│   │   └── services/         # Shared services
│   ├── app.routes.ts         # Route configuration
│   ├── app.component.ts      # Root component
│   └── app.config.ts         # App configuration
└── styles.scss               # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with responsive grid system
- **Modern UI**: Clean, tech-focused aesthetics with smooth animations
- **Dark Theme Ready**: Prepared for dark/light theme toggle
- **Accessibility**: Following WCAG guidelines
- **Performance**: Lazy loading and optimized components

## 🔧 Development

### Available Scripts

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests

### Code Structure

- **Standalone Components**: Using Angular's standalone components
- **Lazy Loading**: All feature modules are lazy loaded
- **Service-based State**: Using services with RxJS for state management
- **Type Safety**: Full TypeScript implementation

## 🚀 Future Enhancements

- Integration with external APIs
- Real-time features with WebSockets
- PWA capabilities
- Advanced state management with NgRx
- Authentication system
- Video call integration
- AI-powered features
- Multi-language support

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Key Differentiators from roadmap.sh

1. **AI Personalization**: Custom roadmaps based on skills assessment
2. **Interactive Features**: Mock interviews, mentorship, community
3. **Progress Tracking**: Detailed analytics and achievement system
4. **Real-time Updates**: Live news feed and community interactions
5. **Comprehensive Platform**: All-in-one solution for developer growth

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📞 Support

For support and questions, please contact the development team.