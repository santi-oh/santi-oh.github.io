import portfolio from './portfolio.json';

export interface ProjectImage {
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  secondSubtitle: string;
  mainCopy: string;
  thumbnail: string;
  images: ProjectImage[][];
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
