import { projects, type Project } from './projects';
export const collections=[
 {id:'buildings',label:'Buildings',category:'Architecture',description:'Houses, hospitality and public architecture.',image:'/images/villa-kali.webp'},
 {id:'interiors',label:'Interiors',category:'Interiors',description:'Homes, workplaces and spaces for making.',image:'/images/amara-10-0.webp'},
 {id:'objects',label:'Objects',category:'Objects',description:'Furniture, modular systems and small-scale design.',image:'/images/amara-28-0.webp'},
 {id:'unbuilt',label:'Unbuilt',category:'Unbuilt',description:'Proposals, competitions and spatial possibilities.',image:'/images/1-0f4d3ybiPvH8Rxyf2YFXhanrIMhTk5o.webp'},
 {id:'culture',label:'Exhibitions & graphics',category:'Culture',description:'Exhibitions, publications and visual communication.',image:'/images/omar-27-0.webp'},
 {id:'research',label:'Research',category:'Research',description:'Academic studies and architectural experiments.',image:'/images/omar-60-0.webp'},
 {id:'archive',label:'Amara archive',category:'Studio archive',description:'Studio projects with their original design credits.',image:'/images/amara-14-0.webp'},
];
export function inCollection(p:Project,id:string){if(id==='all')return p.category!=='Studio archive';if(id==='unbuilt')return p.status==='Unbuilt';return p.category===collections.find(c=>c.id===id)?.category}
export function collectionCount(id:string){return projects.filter(p=>inCollection(p,id)).length}
export function collectionFor(p:Project){return collections.find(c=>c.category===p.category)?.id||'all'}
