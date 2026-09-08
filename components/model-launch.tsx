'use client';
import { lazy,Suspense,useState } from 'react';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { modelCatalog,type ModelId } from '@/lib/model-catalog';
const Viewer=lazy(()=>import('./model-viewer'));
export default function ModelLaunch({model,compact=false}:{model:ModelId;compact?:boolean}){
 const[open,setOpen]=useState(false);const c=modelCatalog[model];
 return <div className={'model-entry '+(compact?'compact-model':'')}><button className="model-launch" onClick={()=>setOpen(true)}><div className="model-launch-image"><img src={c.image} alt={c.title+' source reference'} loading="lazy"/><span className="model-launch-icon" aria-hidden="true">↗</span><span className="model-launch-badge">Open 3D study</span></div><div className="model-launch-caption"><h3>{c.title}</h3><span>{c.subtitle}</span></div></button><p className="model-entry-description">{c.description}</p><a className="model-project-link" href={'/work/'+c.project}>Photographs & project details ↗</a><Dialog open={open} onOpenChange={setOpen}><DialogContent className="model-dialog"><div className="model-dialog-heading"><DialogTitle>{c.title}</DialogTitle><DialogDescription>{c.subtitle} · Interpretive reconstruction from portfolio drawings.</DialogDescription></div>{open&&<Suspense fallback={<div className="model-loading" role="status">Preparing the spatial study…</div>}><Viewer model={model}/></Suspense>}</DialogContent></Dialog></div>
}
