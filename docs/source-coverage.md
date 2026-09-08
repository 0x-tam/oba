# Portfolio source coverage

Reviewed the supplied root Drive folder and all seven descendant folders:
- Artists Home: 7 images and the reference document. This folder contains two distinct projects, Artist’s Residence (apartment plan) and Artist’s Studio Balcony (grid, terrace images and axonometrics).
- Interiors Under construction: 3 site photographs, grouped as Omar’s Home.
- Unbuilt: all four subfolders below.
- Atlas Hotel: 8 images. White/black background versions of the same axonometric are treated as one gallery view.
- Benina Airport: 4 images and its studio reference document.
- Doorway: 4 images and its studio reference document.
- Residence Du Parc - Luxury Apartment unbuilt: 2 images.

Both root PDFs were inspected in full: Omar Bacho (64 pages) and Amara (30 pages). Source project pages are preserved as expandable sheets on each project. Complete original PDFs are linked in Portfolio Editions. Cover, services, team and contact pages remain available there.

Duplicate project records across PDFs and loose files are merged. Thing and Thing Flatpack are one project with dated iterations. Return Journeys and Shifting Lights each combine their exhibition and publication material. Lumident Peds and Lumident Ortho remain distinct commissions. Pixel/perceptual checks remove near-identical image versions within each project, preferring larger images. Source sheets deliberately remain intact as archival documentation.

Final coverage: 31 personal project entries and 5 separate Amara studio archive entries. The latter have no verified individual Omar credit and retain the source's named project teams.

3D: No native model files were supplied. Benina and Thing Flatpack are approximate, simplified interactive reconstructions grounded in the source drawings. They are not scans or fabrication models. Camera gesture controls are optional, processed locally with MediaPipe; video is not uploaded or recorded. Camera hardware/gesture performance requires a user trial on their device.

Validation: TypeScript check; production build; finite geometry/bounds checks for single-bay, roof-field and furniture models; unique-route and local asset/source-sheet coverage checks; HTTP checks of every project route. No browser interaction or camera hardware testing performed.

## Navigation and 3D revision

The homepage now presents four direct project collections. Dedicated Projects, 3D Collection and Profile routes replace the long mixed homepage. The project index provides search, stage filtering, a 3D-only filter, sorting and nine-item pages. Detail pages link back to their discipline and offer section navigation; initial galleries show six images, with all remaining images and archival sheets retained on request.

Six interactive reconstructions: Benina, Thing Flatpack, Landship, Artist’s Studio Balcony, Twig kit/Lebanese Concept House, and Résidence du Parc. RDP is explicitly a portal/sliding-screen detail study, not a complete apartment reconstruction. New models are grounded in the original portfolio drawings and source research; proportions and unrecoverable construction details remain interpretive.

Each model offers selectable components, an explanatory part list, focus controls, perspective/top/front views, layer visibility, separated assembly and local optional hand gestures. Landship provides the source-supported 0–15 degree glazing adjustment. Twig includes paired bolted rails, concrete ballast and platform locating blocks. Studio uses a carved lattice and curved canopy ribs. RDP includes real arch openings and a sliding timber screen.

Validation: TypeScript compilation, production build, finite geometry/bounds checks for all six studies, selectable-part integrity, all image references, preserved project count, and HTTP/title/navigation checks for the homepage, all collection pages, 3D, profile and four new 3D-linked detail routes. No camera hardware testing or browser interaction testing performed.

## Source fidelity revision

The interactive Landship, Studio Balcony, Twig kit and Résidence du Parc reconstructions were removed after user review. Original project images, axonometrics and PDF sheets remain available. Only the Benina roof-module study and the rebuilt Thing Flatpack remain interactive.

Both complete PDFs were audited for /3D and /RichMedia annotations, U3D/PRC streams and embedded attachments: none were present (see pdf-3d-audit.json). The spatial drawings are raster/vector illustrations, not reusable 3D meshes. Flatpack geometry follows PDF pages 38–39: individual mixed-timber strips, mitered diagonal rails, folding triangular panels, thin triangular shelf and corner rod. Hidden hardware and exact dimensions remain approximate. A reference comparison is available inside the viewer. The background grid and floor were removed.

Zoom now uses one closed fist and apparent palm scale; opening the hand pauses it. The palm width/height ratio rejects abrupt wrist turns. This uses a webcam depth cue, not measured depth from a 3D sensor. Synthetic checks cover both zoom directions, sideways motion, release, scale jumps, tracking loss and gesture transitions. Live camera performance still requires device testing.
