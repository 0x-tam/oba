import { SiteHeader,SiteFooter } from '@/components/site-header';
import ProjectIndex from '@/components/project-index';
export const metadata={title:'Projects — Omar Bacho',description:'Browse architecture, interiors, objects, unbuilt proposals and research by Omar Bacho.'};
export default async function Work({searchParams}:{searchParams:Promise<{category?:string;q?:string;status?:string;models?:string}>}){const params=await searchParams;return <main id="top"><SiteHeader/><div id="main-content"><ProjectIndex initialCategory={params.category||'all'} initialQuery={params.q||''}/></div><SiteFooter/></main>}
