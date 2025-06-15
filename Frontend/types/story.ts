export interface StorySection {
  heading: string;
  content: string;
}

export interface StoryData {
  [key: string]: {
    [key: string]: any;
  };
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  thesis: string;
  tags: string[];
  readTime: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lastUpdated: string;
  domainId: string; // Added based on usage in page.tsx
  data?: StoryData; // This might be from the domain now
  sections: StorySection[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name as string
  color: string; // Tailwind color name e.g. "blue"
  gradient: string; // Tailwind gradient classes e.g. "from-blue-500 to-cyan-500"
  totalStories: number;
  totalReadTime: number;
  stories: Story[];
  data?: any; // Centralized data for the domain's visualizations
}

export interface DashboardData {
  domains: Domain[];
  featuredStory?: Story;
  recentlyAdded: Story[];
}
