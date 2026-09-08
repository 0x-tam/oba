export const modelCatalog={
 benina:{title:'Benina International Airport',project:'benina-international-airport',subtitle:'Modular roof & daylight',image:'/images/omar-34-0.webp',description:'Follow the structural bay from slender columns to arch supports and roof openings.',layer:'Roof slabs',action:'',max:100,unit:'',source:'Omar Bacho portfolio, pp. 34–35',explore:'Select an arch or roof slab to see how the bay comes together.'},
 thing:{title:'Thing Flatpack',project:'thing',subtitle:'Furniture & assembly',image:'/images/omar-39-0.webp',description:'Explore the slatted solid-wood panels, folding connections, removable black shelf and corner support.',layer:'Top panel',action:'Unfold panels',max:90,unit:'°',source:'Omar Bacho portfolio, PDF pp. 38–39',explore:'Inspect the timber strips and connections. Unfold the two triangular panels to reveal the flat-pack arrangement.'},

};
export type ModelId=keyof typeof modelCatalog;
export const modelIds=Object.keys(modelCatalog) as ModelId[];
