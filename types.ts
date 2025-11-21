export interface GeneratedContent {
  titles: string[];
  content: string;
  tags: string[];
}

export interface CoverConfig {
  title: string;
  subtitle: string;
  highlight: string;
  image: string | null; // Base64 or URL
}
