import portfolio from './portfolio.json';
import work from './work.json';

export interface ProjectImage {
  url?: string;
  videoUrl?: string; // Support for video (file or external URL)
  caption?: string;
  width?: 'full' | 'half' | '75%';
  type?: 'image' | 'video';
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  secondSubtitle: string;
  mainCopy: string;
  thumbnail: string;
  images: ProjectImage[][];
  tags?: string[]; // Added tags for filtering
}

export interface HomeRow {
  items: {
    projectId?: string;
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    flex?: number;
  }[];
}

export const projects = portfolio.projects as Project[];
export const homeRows = portfolio.homeRows as HomeRow[];

export const workProjects = work.projects as Project[];
export const workRows = work.homeRows as HomeRow[];
