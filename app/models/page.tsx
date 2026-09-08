import { SiteHeader,SiteFooter } from '@/components/site-header';
import ModelLaunch from '@/components/model-launch';
import {modelIds} from '@/lib/model-catalog';
export const metadata={title:'3D Collection — Omar Bacho'};
export default function Models(){return <main id="top"><SiteHeader/><section id="main-content" className="collection-page-title"><p className="eyebrow">{modelIds.length} interactive studies</p><h1>In three dimensions.</h1><p>Select a project, then explore its components, assembly and spatial details. Every model includes touch, mouse and optional hand-gesture controls.</p><p className="models-qualification">Reconstructed from portfolio drawings. Approximate geometry, with original references on each project page.</p></section><section className="model-library">{modelIds.map(id=><ModelLaunch key={id} model={id}/>)}</section><SiteFooter/></main>}
