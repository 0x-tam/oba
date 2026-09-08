import data from './projects.json';
export type Project = (typeof data)[number];
export const projects = data;
export const personalProjects = data.filter(p => p.category !== 'Studio archive');
export const archiveProjects = data.filter(p => p.category === 'Studio archive');
