# ProductivityQuest 🎮

A gamified productivity platform that transforms your daily tasks into an engaging RPG-like experience. Boost your productivity while unlocking anime characters and earning XP!

## 🚀 Live Demo

**URL**: 

## ✨ Features

### 🎯 Core Productivity Features
- **Task Management**: Create, organize, and track your daily tasks
- **Technology Learning**: Add and track technologies you're learning
- **Goal Setting**: Set and monitor your productivity goals
- **Time Tracking**: Track time spent on various activities
- **Progress Analytics**: Visualize your productivity with charts and heatmaps

### 📝 Note-Taking System
- **Rich Text Editor**: Support for headings, bullet lists, checklists, code blocks, and quotes
- **Markdown Support**: Auto-formatting and markdown compatibility
- **Folder Organization**: Organize notes with custom folders, tags, and search
- **Cross-Device Sync**: Notes sync across devices via Supabase
- **Dark/Light Mode**: Fully compatible with theme switching
- **Auto-save**: Never lose your work with automatic saving

### 🎮 Gamification Features
- **XP System**: Earn experience points for completing tasks and activities
- **Character Collection**: Unlock anime characters based on your achievements
- **Tier System**: Characters organized in Bronze, Silver, Gold, and Legendary tiers
- **Equipment System**: Equip your favorite unlocked characters
- **Achievement System**: Complete various achievements for rewards
- **Streak Tracking**: Maintain consistency with streak counters
- **Reward System**: Earn coins and unlock special features

### 💭 Daily Inspiration
- **Quote of the Day**: Motivational quotes displayed on first daily login
- **Interactive Quotes**: Like, save, and earn XP from daily quotes
- **Quote History**: Access previously shown quotes anytime

### 🔐 Authentication
- **Email/Password**: Traditional authentication method
- **Google OAuth**: Quick sign-in with Google account
- **Profile Management**: Customize your user profile and avatar
- **Secure Backend**: Powered by Supabase authentication

### 📊 Analytics & Insights
- **Progress Visualization**: Charts showing your productivity trends
- **Heatmap Calendar**: Visual representation of your daily activity
- **Statistics Dashboard**: Comprehensive overview of your achievements
- **Performance Metrics**: Track improvements over time

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database, Auth, Real-time)
- **Build Tool**: Vite
- **State Management**: React Hooks + Local Storage
- **Rich Text**: TipTap Editor
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── AchievementSystem.tsx
│   ├── AnimeCharacterGallery.tsx
│   ├── DashboardStats.tsx
│   ├── NotesEditor.tsx
│   ├── QuoteOfTheDay.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useCharacters.ts # Character management
│   ├── useNotesData.ts  # Notes data management
│   └── useProductivityData.ts
├── pages/               # Main application pages
│   ├── Index.tsx        # Dashboard/Home page
│   ├── Auth.tsx         # Authentication page
│   ├── Notes.tsx        # Notes management
│   └── Profile.tsx      # User profile
├── types/               # TypeScript type definitions
└── integrations/        # External service integrations
    └── supabase/        # Supabase client configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account (for backend features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The project is pre-configured with Supabase. For local development:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open http://localhost:5173 in your browser

### Configuration

#### Supabase Setup
The project uses Supabase for backend services. The following tables are configured:
- `profiles`: User profile information
- `anime_characters`: Character collection data
- `user_character_unlocks`: User's unlocked characters

#### Google Authentication Setup
To enable Google authentication:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/zpjxfsmopjjwkdodyoyh/auth/providers)
2. Configure Google OAuth provider
3. Add your domain to authorized origins

## 🎮 How to Use

### Getting Started
1. **Sign Up/Login**: Create an account or sign in with Google
2. **Complete Profile**: Set up your username and preferences
3. **Start Productive**: Begin adding tasks and technologies to learn

### Earning XP & Unlocking Characters
- **Complete Tasks**: Each completed task gives you XP
- **Add Technologies**: Learning new technologies earns rewards
- **Maintain Streaks**: Consistency unlocks special bonuses
- **Take Notes**: Regular note-taking contributes to your progress
- **Daily Engagement**: Check daily quotes for bonus XP

### Character System
- **Bronze Tier**: Unlocked early in your journey
- **Silver Tier**: Requires moderate XP and engagement
- **Gold Tier**: For dedicated users with high achievements
- **Legendary Tier**: Elite characters for top performers

### Notes Features
- **Create Folders**: Organize notes by topic or project
- **Rich Formatting**: Use the toolbar for text styling
- **Search**: Find any note quickly with the search function
- **Sync**: All notes automatically sync across devices

## 📱 Responsive Design

ProductivityQuest is fully responsive and works seamlessly on:
- **Desktop**: Full feature experience
- **Tablet**: Optimized touch interface
- **Mobile**: Streamlined mobile experience

## 🎨 Theming

The app supports both light and dark themes:
- **Auto Theme**: Follows system preference
- **Manual Toggle**: Switch themes anytime
- **Consistent Design**: All components adapt to theme changes

## 🔒 Security & Privacy

- **Secure Authentication**: Powered by Supabase Auth
- **Data Encryption**: All data encrypted in transit and at rest
- **Row Level Security**: Database access controlled per user
- **Privacy First**: No unnecessary data collection



## 🤝 Contributing

### Development Workflow
1. **Feature Branches**: Create branches for new features
2. **Code Style**: Follow existing TypeScript and React patterns
3. **Component Design**: Use shadcn/ui components when possible
4. **Responsive First**: Ensure all features work on mobile

### Code Guidelines
- Use TypeScript for type safety
- Follow the existing component structure
- Implement proper error handling
- Add loading states for async operations
- Use semantic HTML and accessibility best practices

## 📊 Database Schema

### Core Tables
- **profiles**: User information and game stats
- **anime_characters**: Character collection database
- **user_character_unlocks**: Tracks unlocked characters per user

### Key Features
- Row Level Security (RLS) enabled
- Real-time subscriptions
- Automatic profile creation on signup
- Character unlock condition checking

## 🔧 Troubleshooting

### Common Issues

**XP Not Syncing**
- Check if you're logged in
- Use the "Sync Local Data" button in Profile
- Ensure internet connection is stable

**Google Auth Not Working**
- Verify Google OAuth is configured in Supabase
- Check if redirect URLs are properly set
- Ensure site URL matches your domain

**Notes Not Saving**
- Check internet connection
- Verify you're authenticated
- Try refreshing the page

**Characters Not Unlocking**
- Ensure you meet the unlock requirements
- Check your XP and level in Profile
- Try the manual sync feature





## 🎯 Roadmap

### Upcoming Features
- **AI Integration**: Smart note summaries and suggestions
- **Team Collaboration**: Share notes and compete with friends
- **Advanced Analytics**: Deeper productivity insights
- **Mobile App**: Native iOS and Android applications
- **API Integration**: Connect with external productivity tools

### Version History
- **v1.0**: Core productivity features and gamification
- **v1.1**: Note-taking system and daily quotes
- **v1.2**: Google authentication and profile sync
- **v1.3**: Enhanced character system and rewards

---
