'use client';
import { lazy, Suspense, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
const Viewer=lazy(()=>import('./model-viewer'));
export default function ModelLaunch({model}:{model:'benina'|'thing'}){
 const[open,setOpen]=useState(false);const name=model==='benina'?'Benina International Airport':'Thing Flatpack';
 return <><button className="model-launch" onClick={()=>setOpen(true)}><div className="model-launch-image"><img src={model==='benina'?'/images/omar-34-0.webp':'/images/omar-39-3.webp'} alt={model==='benina'?'Exploded drawing of the Benina structural bay':'Thing Flatpack assembly reference'} loading="lazy"/><span className="model-launch-icon" aria-hidden="true">↗</span><span className="model-launch-badge">Explore in 3D</span></div><div className="model-launch-caption"><h3>{name}</h3><span>{model==='benina'?'Structure & light':'Object & assembly'}</span></div><p>Drag to rotate · Optional hand gestures</p></button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="model-dialog"><div className="model-dialog-heading"><DialogTitle>{name}</DialogTitle><DialogDescription>Simplified interactive reconstruction from portfolio drawings. Proportions are approximate.</DialogDescription></div>{open&&<Suspense fallback={<div className="model-loading" role="status">Preparing the spatial study…</div>}><Viewer model={model}/></Suspense>}</DialogContent></Dialog></>
}
