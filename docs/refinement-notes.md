# September 8 portfolio refinements

- Replaced platform-dependent arrow glyphs with shared inline SVGs.
- Trackball pointer/touch rotation and view-axis quaternion gesture rotation allow pole crossings. Added arrow controls and regression tests.
- Camera video remains an offscreen local tracking input. The visible canvas draws hand landmarks only, with detected-gesture text. Existing worker isolation, one-frame-in-flight and stale-frame rejection remain active. Shadows and component layouts update only when their inputs change.
- Related projects show up to three distinct entries in the same category, each with a portrait and title.
- Profile additions draw on the 2024 portfolio biographies and project credits, recorded in source-notes.md. Teaching is dated to the source biography.
- Omar's Home photographs were edited with the built-in image editor at the user's request. Original image files are retained. New web assets: omar-home-bathroom.webp, omar-home-shower.webp, omar-home-kitchen.webp. They are presentation retouches, not evidence of construction completion; the project status remains Under construction.

Editing brief: same room identity, original framing and materials; clean unfinished plaster, ceiling surfaces, dust and grout haze; finish exposed construction fittings discreetly; preserve green tile, terrazzo, oak cabinetry, blue fronts, red handles and checkerboard floor. Natural photographic texture and restrained lighting, no new graphics or text. Kitchen adjustment focused on exposure, wall finishes and material clarity. Generated originals remain in the session's generated_images directory.

Validation: TypeScript, production Vercel build, route/asset tests, gesture regression tests, rotation regression tests, and desktop/mobile browser navigation and controls. No live human camera session was used, so hardware-specific hand-tracking latency is not certified.
