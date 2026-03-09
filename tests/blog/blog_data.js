const blogData = [
    {
        id: "spatial-harmony",
        category: "Design Theory",
        title: "The Art of Spatial Harmony",
        subtitle: "Balance in Every Corner",
        summary: "True harmony in a space is not about symmetry — it is about balance. The way furniture anchors a room, how negative space breathes, and how every element earns its place.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Space is not simply the absence of objects; it is the medium through which we experience architecture. True harmony in a space is not about symmetry — it is about balance. The way furniture anchors a room, how negative space breathes, and how every element earns its place.</p>
            <p>When designing an interior, we must consider the invisible lines of energy that flow through a room. A perfectly centered table might look pleasing on a floor plan, but if it disrupts the natural path from the doorway to the window, the space will feel subtly irritating.</p>
            <h3>The Weight of Objects</h3>
            <p>Every object carries visual weight. A dark velvet sofa feels heavier than a light linen one of the exact same dimensions. Balancing these weights across a room prevents it from feeling 'tilted' or claustrophobic on one side.</p>
            <div style="margin: 40px 0; border-left: 2px solid var(--gold); padding-left: 20px; font-style: italic;">
                "Architecture is the learned game, correct and magnificent, of forms assembled in the light." - Le Corbusier
            </div>
            <p>Ultimately, spatial harmony is achieved when you stop noticing the individual parts and instead feel the quiet coherence of the whole. It is the design getting out of the way of the living.</p>
        `,
        date: "October 12, 2026"
    },
    {
        id: "natural-light",
        category: "Lighting",
        title: "Natural Light as Material",
        subtitle: "Sculpting with Shadow",
        summary: "A room without considered lighting is simply a container. When light is treated as a material — layered, directed, softened — it transforms architecture into lived experience.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>We often think of materials as things we can touch: wood, stone, glass, concrete. But the most important material in any architectural vocabulary is entirely intangible: light.</p>
            <p>A room without considered lighting is simply a container. When light is treated as a material — layered, directed, softened — it transforms architecture into lived experience. The sharp, cool morning light slipping through eastern louvers asks for a different kind of quiet than the warm, low evening sun pooling on a timber floor.</p>
            <h3>Choreographing the Sun</h3>
            <p>Designing with natural light means accepting that a space will look different at 8:00 AM than it does at 4:00 PM. We design specifically for these transitions. A deep overhang might block harsh midday rays but allow the soft winter sun to reach deep into a living area to warm the thermal mass of a concrete floor.</p>
            <p>And where there is light, there must be shadow. We do not try to eliminate shadows; we curate them to create depth and mystery within a home.</p>
        `,
        date: "September 28, 2026"
    },
    {
        id: "texture-language",
        category: "Materials",
        title: "Texture & Material Language",
        subtitle: "Touch Before You See",
        summary: "Stone, timber, linen, plaster — each material carries memory and weight. How the tactile quality of a surface shapes the emotional character of an entire room.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Our eyes are often the first to interpret a space, but our hands and bodies confirm it. The cold resistance of a marble countertop, the slight give of a cork floor, the rough warmth of an exposed brick wall—these tactile encounters anchor us in reality.</p>
            <p>Stone, timber, linen, plaster — each material carries memory and weight. The tactile quality of a surface shapes the emotional character of an entire room. A minimalist room wrapped in stark, flawless drywall feels clinical; the exact same geometry rendered in subtly textured lime plaster feels warm and deeply human.</p>
            <h3>The Patina of Time</h3>
            <p>We prefer materials that tell the truth about their origin and gracefully accept the passage of time. A leather chair that scuffs with use, unlacquered brass hardware that darkens where it is repeatedly touched, or oak floors that dent slightly over the decades. These aren't flaws; they are chapters in the story of the home.</p>
        `,
        date: "September 15, 2026"
    },
    {
        id: "modern-indian-home",
        category: "Cultural Design",
        title: "The Modern Indian Home",
        subtitle: "Roots Meet the Contemporary",
        summary: "Designing a modern Indian home means navigating between inherited aesthetics and contemporary sensibilities — finding the precise point where tradition and the present speak the same language.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop",
        content: `
            <p>Designing a modern Indian home is an exercise in translation. It means navigating between inherited aesthetics, climatic necessities, and contemporary global sensibilities—finding the precise point where tradition and the present speak the same language smoothly.</p>
            <p>We are moving past the era where 'Indian design' simply meant adding traditional motifs or heavy carved furniture to an otherwise generic modern box. True cultural design is rooted in adaptation to climate, lifestyle, and local craft.</p>
            <h3>Courtyards and Cross-Ventilation</h3>
            <p>The traditional central courtyard (the *aangan*) is seeing a brilliant resurgence, reinterpreted for smaller, urban footprints. It serves the ancient purpose of passive cooling and providing a private slice of sky, but executed with clean, modern lines.</p>
            <p>Similarly, the use of local stones like Kota, Jaisalmer yellow, or Kadappa black, laid out in large, seamless formats, roots a space in its geography while providing a cool surface beneath the feet. It is about distilling the essence of the past, not mimicking its appearance.</p>
        `,
        date: "August 30, 2026"
    }
];

function getArticleById(id) {
    return blogData.find(article => article.id === id);
}
