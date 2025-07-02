export interface Visualization {
  section: string;
  type: string;
  title: string;
  data_ref: string;
  purpose: string;
}

export interface Reference {
  code: string;
  description: string;
}

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
  domainId: string;
  data?: StoryData;
  sections: StorySection[];
  visualizations?: Visualization[]; // New optional property
  references?: Reference[]; // New optional property
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  totalStories: number;
  totalReadTime: number;
  stories: Story[];
  data?: any;
}

export interface DashboardData {
  domains: Domain[];
  featuredStory?: Story;
  recentlyAdded: Story[];
}
