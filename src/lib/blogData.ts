export type BlogArticle = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  content: string;
  date: string;
};

export const blogData: BlogArticle[] = [
  {
    id: "how-interior-design-shapes-the-way-we-live",
    category: "Interior Design",
    title: "How Interior Design Shapes the Way We Live",
    subtitle: "Function, Form & Emotion",
    summary:
      "Interior design is often perceived as an aesthetic decision — colours, furniture, and décor. The true impact, however, goes far beyond visual appeal.",
    image:
      "/Mayaakars/interior-residencial/panorama-house/living-room.webp",
    content: `
      <p>Interior design is often perceived as an aesthetic decision — colours, furniture, and décor. However, the true impact of interior design goes far beyond visual appeal. Thoughtful design directly influences how people experience and interact with their living spaces on a daily basis.</p>
      <p>A well-designed interior creates harmony between functionality, comfort, and aesthetics. Every element — from spatial planning to lighting and materials — plays a role in shaping the atmosphere of a home. When these elements are carefully considered, the result is a space that feels intuitive, comfortable, and timeless.</p>
      <h3>Space Planning</h3>
      <p>One of the most important aspects of interior design is space planning. The arrangement of rooms, circulation paths, and furniture layouts determines how easily people move through the home. Efficient layouts eliminate wasted space and ensure that each area serves a clear purpose.</p>
      <h3>Light &amp; Material</h3>
      <p>Lighting is another essential component. Natural light enhances well-being, improves mood, and creates a sense of openness within the home. Artificial lighting, when designed thoughtfully, can highlight architectural features, add warmth to interiors, and create different moods throughout the day.</p>
      <p>Material selection also plays a crucial role. Textures such as wood, stone, and natural fabrics bring warmth and authenticity to interiors. These materials not only contribute to aesthetics but also influence durability, maintenance, and long-term comfort.</p>
      <div style="margin: 40px 0; border-left: 2px solid var(--gold); padding-left: 24px; font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; line-height: 1.6;">
        "Interior design ultimately shapes how a home supports daily life — transforming a house into an environment that reflects the lifestyle and personality of its occupants."
      </div>
      <p>At Mayaakars, interior design is approached as a holistic process — balancing function, form, and emotion to create spaces that enhance everyday living.</p>
    `,
    date: "March 2026",
  },
  {
    id: "thoughtful-architecture-in-modern-homes",
    category: "Architecture",
    title: "The Importance of Thoughtful Architecture in Modern Homes",
    subtitle: "Site, Structure & Identity",
    summary:
      "Architecture is the foundation upon which every home is built. While interiors define the character of a space, architecture determines how the structure interacts with its environment.",
    image:
      "/Mayaakars/architect-residence/panorama-house/title-photo.webp",
    content: `
      <p>Architecture is the foundation upon which every home is built. While interiors define the character of a space, architecture determines how the structure interacts with its environment, how spaces are organised, and how people experience the building as a whole.</p>
      <h3>Understanding the Site</h3>
      <p>Thoughtful architecture begins with understanding the site. Factors such as orientation, climate, surrounding landscape, and natural light all influence how a building should be designed. By responding to these elements, architects can create homes that feel naturally integrated with their surroundings.</p>
      <h3>Spatial Planning &amp; Identity</h3>
      <p>Spatial planning is another critical component. The arrangement of rooms, circulation paths, and structural elements determines how efficiently the home functions. Well-planned architecture ensures smooth movement between spaces while maintaining privacy and comfort.</p>
      <p>Architecture also shapes the identity of a home. Proportions, materials, and structural forms work together to create a visual language that reflects the lifestyle and aspirations of the occupants. Modern residential architecture often seeks to balance openness with functionality — open-plan living areas encourage interaction and flexibility, while carefully designed private spaces provide areas for rest and retreat.</p>
      <h3>Sustainability</h3>
      <p>Sustainability is increasingly becoming a key consideration in architectural design. Passive cooling strategies, natural ventilation, and efficient use of materials help create homes that are both environmentally responsible and comfortable to live in.</p>
      <div style="margin: 40px 0; border-left: 2px solid var(--gold); padding-left: 24px; font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; line-height: 1.6;">
        "Architecture is not just about constructing buildings — it is about designing environments that support human life, respond to the environment, and stand the test of time."
      </div>
      <p>At Mayaakars, architecture is approached as a thoughtful dialogue between space, structure, and the people who inhabit it.</p>
    `,
    date: "March 2026",
  },
  {
    id: "the-role-of-lighting-in-interior-design",
    category: "Lighting",
    title: "The Role of Lighting in Interior Design",
    subtitle: "Layers of Light",
    summary:
      "Lighting is one of the most powerful yet often underestimated elements in interior design. While furniture and materials define the physical character of a space, lighting determines how that space is perceived.",
    image:
      "/Mayaakars/interior-commercial/shizuka-nook/chandelier.webp",
    content: `
      <p>Lighting is one of the most powerful yet often underestimated elements in interior design. While furniture and materials define the physical character of a space, lighting determines how that space is perceived and experienced.</p>
      <p>Effective lighting design involves more than simply illuminating a room. It is about creating layers of light that support both functionality and atmosphere.</p>
      <h3>The Three Layers</h3>
      <p>Interior lighting is typically divided into three main categories: <strong>ambient lighting</strong>, <strong>task lighting</strong>, and <strong>accent lighting</strong>.</p>
      <p>Ambient lighting provides the general illumination of a room. It establishes the overall brightness and ensures that the space is comfortable to navigate — achieved through ceiling lights, recessed lighting, or indirect lighting systems.</p>
      <p>Task lighting focuses on specific activities such as reading, cooking, or working. Desk lamps, kitchen counter lights, and bedside lamps are examples of lighting designed to support particular tasks without causing strain or discomfort.</p>
      <p>Accent lighting is used to highlight architectural features, artwork, textures, or design details. It adds depth and dimension to interiors, making spaces feel layered and visually engaging.</p>
      <h3>Natural Light</h3>
      <p>Natural light is equally important. Large windows, skylights, and well-planned openings allow daylight to enter the home, reducing reliance on artificial lighting and enhancing the connection between indoor and outdoor spaces.</p>
      <div style="margin: 40px 0; border-left: 2px solid var(--gold); padding-left: 24px; font-style: italic; font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; line-height: 1.6;">
        "Warm lighting creates a cosy and intimate atmosphere, while cooler tones work better in functional spaces like kitchens or workrooms."
      </div>
      <p>A carefully planned lighting strategy can transform the experience of a space, bringing balance, comfort, and visual clarity to the interior environment.</p>
    `,
    date: "March 2026",
  },
];

export function getArticleById(id: string | null | undefined) {
  if (!id) return undefined;
  return blogData.find((article) => article.id === id);
}
