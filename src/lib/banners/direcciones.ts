// ══════════════════════════════════════════════════════════
//  Líneas visuales: la biblioteca de ideas de imagen
//
//  Sin esto, todas las fotos salían de la misma receta (foto editorial, luz
//  natural, alguien con un portátil) y las variantes de una campaña se
//  parecían entre sí. Cada línea es una manera distinta de contar lo mismo:
//  quién o qué sale, cómo se encuadra y con qué técnica (foto de estudio,
//  dron, 3D, papel recortado, risografía…).
//
//  Una línea es una REFERENCIA, no una plantilla: el ejemplo de la
//  biblioteca (public/banners/lineas/<id>.webp) enseña el tipo de imagen; la
//  IA escribe una escena nueva dentro de esa línea para cada variante, con su
//  ángulo y lo que haya pedido quien crea la campaña, y la varía con los
//  `ejes` para que dos variantes de la misma línea no salgan iguales.
//
//  `escena` y `estilo` van en inglés: los modelos de imagen lo siguen mejor.
//  Las normas duras de la imagen (sin texto, sin dinero…) no están aquí: van
//  siempre detrás, desde marca.ts → REGLAS_IMAGEN.
// ══════════════════════════════════════════════════════════

export const FAMILIAS = ["personas", "lugares", "conceptual", "objetos", "ilustracion", "grafico"] as const;
export type Familia = (typeof FAMILIAS)[number];

export type Linea = {
  id: string;
  familia: Familia;
  nombre: { es: string; en: string };
  desc: { es: string; en: string };
  /** La idea: qué se ve. */
  escena: string;
  /** El acabado: técnica, luz, encuadre, color. Sustituye al estilo por defecto. */
  estilo: string;
  /** Qué cambiar entre dos variantes de la misma línea. */
  ejes: string;
};

/** Una referencia elegida para una variante: una línea y, si sale de «Ideas con IA», la idea concreta. */
export type Ref = { dir: string; titulo?: string; idea?: string };

export const LINEAS: Linea[] = [
  // ── Personas y momentos ──
  {
    id: "retrato-estudio",
    familia: "personas",
    nombre: { es: "Retrato de estudio", en: "Studio portrait" },
    desc: { es: "Una persona, fondo de color liso, mirada a cámara.", en: "One person, solid colour backdrop, looking at camera." },
    escena: "A confident remote professional portrayed alone, waist-up, holding a laptop or headphones, looking straight at the camera.",
    estilo: "High-end studio portrait photography on a seamless paper backdrop in saturated brand violet (#5B4BF5) or warm coral, crisp flash lighting with a soft shadow, fashion-magazine polish, bold and graphic.",
    ejes: "backdrop colour, pose, age and background of the person, prop they hold, camera height",
  },
  {
    id: "documental-bn",
    familia: "personas",
    nombre: { es: "Documental en blanco y negro", en: "Black & white documentary" },
    desc: { es: "Instante real, grano, sin posar.", en: "A real moment, grain, unposed." },
    escena: "A candid, unposed moment of someone deep in focused remote work or a real conversation on a call, captured as it happens.",
    estilo: "Black and white documentary photography, visible film grain, high contrast, available light, reportage framing as in a photo essay. No colour at all.",
    ejes: "place, time of day, single person or small group, distance from the subject",
  },
  {
    id: "pov",
    familia: "personas",
    nombre: { es: "En primera persona", en: "First-person POV" },
    desc: { es: "Lo que ve quien trabaja: manos, mesa y lo que hay detrás.", en: "What the worker sees: hands, desk and what lies beyond." },
    escena: "First-person point of view: the viewer's own hands on a laptop or notebook, and beyond the screen an inspiring view that tells where they are working from.",
    estilo: "Immersive POV photograph, wide 24mm lens, natural light, the hands sharp and the background softly out of focus, warm and aspirational but realistic.",
    ejes: "the view beyond (sea, mountains, city, train window, garden), time of day, the object in the hands",
  },
  {
    id: "manos-detalle",
    familia: "personas",
    nombre: { es: "Detalle de manos", en: "Hands close-up" },
    desc: { es: "Plano muy cerrado de un gesto que cuenta la historia.", en: "Tight close-up of a gesture that tells the story." },
    escena: "An extreme close-up of hands doing one meaningful gesture of remote work: typing, writing a plan, packing a laptop into a backpack, holding a passport and a coffee.",
    estilo: "Macro detail photography, very shallow depth of field, tactile textures, soft window light, calm muted palette with one accent of brand violet.",
    ejes: "the gesture, the objects, skin tones, surface (wood, linen, stone)",
  },
  {
    id: "contraluz",
    familia: "personas",
    nombre: { es: "Silueta a contraluz", en: "Backlit silhouette" },
    desc: { es: "Hora dorada, figura recortada, mucho cielo.", en: "Golden hour, cut-out figure, lots of sky." },
    escena: "A person seen as a silhouette against a glowing sky, working on a laptop or stretching after work, with a strong horizon.",
    estilo: "Cinematic backlit photograph at golden hour or dusk, deep silhouettes, lens flare, gradient sky from coral to violet, lots of negative space.",
    ejes: "place of the horizon (rooftop, beach, balcony, hill), pose, sky colour",
  },
  {
    id: "equipo-distribuido",
    familia: "personas",
    nombre: { es: "Equipo repartido por el mundo", en: "Distributed team" },
    desc: { es: "Varias personas, cada una en su sitio, en una sola imagen.", en: "Several people, each in their own place, in one image." },
    escena: "A grid or mosaic of three or four different people, each in their own home or city, all working on the same project at the same time.",
    estilo: "Editorial photo mosaic with clean thin white gutters, each tile a different natural setting and light, consistent warm colour grading so it reads as one image.",
    ejes: "number of tiles, the places and times of day, diversity of the people",
  },

  // ── Lugares y viaje ──
  {
    id: "aerea",
    familia: "lugares",
    nombre: { es: "Vista aérea", en: "Aerial view" },
    desc: { es: "Desde arriba, la persona pequeña, el lugar enorme.", en: "From above, a tiny person in a huge place." },
    escena: "A top-down drone view of a single tiny person working on a laptop in a vast striking place: a rooftop, a pier, a beach, a terrace among trees.",
    estilo: "Aerial drone photography straight down, graphic composition, the person very small, strong shapes and shadows, clean colours, huge negative space.",
    ejes: "the place and its texture (sand, water, tiles, grass), time of day and shadow length",
  },
  {
    id: "ventana-noche",
    familia: "lugares",
    nombre: { es: "Ciudad de noche", en: "City at night" },
    desc: { es: "Ventanal, luces de ciudad, reflejos.", en: "Big window, city lights, reflections." },
    escena: "A person working late by a large window overlooking a city at night, the glow of the screen on their face, city lights and reflections in the glass.",
    estilo: "Cinematic night photography, moody teal and magenta tones, bokeh city lights, reflections in glass, film still from a modern drama.",
    ejes: "the city, the angle (inside looking out, outside looking in), the reflection",
  },
  {
    id: "en-transito",
    familia: "lugares",
    nombre: { es: "En tránsito", en: "In transit" },
    desc: { es: "Tren, aeropuerto, ferry: trabajar entre dos sitios.", en: "Train, airport, ferry: working between places." },
    escena: "Someone working on a laptop while travelling: by a train window with landscape rushing past, at an airport gate at dawn, on a ferry deck.",
    estilo: "Travel photography with a sense of motion: slight motion blur outside, sharp subject, soft daylight, natural colours, journal-like.",
    ejes: "the vehicle, the landscape outside, time of day",
  },
  {
    id: "naturaleza",
    familia: "lugares",
    nombre: { es: "Lejos de todo", en: "Far from it all" },
    desc: { es: "Cabaña, montaña, bosque: paisaje épico.", en: "Cabin, mountains, forest: epic landscape." },
    escena: "A small figure working from a cabin porch, a tent or a stone house in a dramatic natural landscape, laptop open, the landscape dominating.",
    estilo: "Epic landscape photography, misty atmosphere, small human scale, cool greens and blues with a warm light from the cabin.",
    ejes: "the landscape (mountains, fjord, forest, desert), weather, season",
  },
  {
    id: "cafe-calle",
    familia: "lugares",
    nombre: { es: "Café de ciudad", en: "City café" },
    desc: { es: "Terraza de calle, ambiente de viaje.", en: "Street terrace, a travel feel." },
    escena: "A remote worker at a small table of a street café in a recognisable-feeling but unnamed city (Lisbon-like, Mexico City-like, Buenos Aires-like), life passing by.",
    estilo: "Street photography with warm analogue colours, layered foreground and background, natural daylight, lively but uncluttered.",
    ejes: "the city mood, the season, the angle (across the street, at the table)",
  },
  {
    id: "casa-luz",
    familia: "lugares",
    nombre: { es: "Casa con luz de mañana", en: "Home, morning light" },
    desc: { es: "La foto natural de siempre: cálida y cercana.", en: "The classic natural photo: warm and close." },
    escena: "A remote professional at home in the morning: a bright room with plants, a coffee, a laptop on a wooden table.",
    estilo: "Photorealistic editorial photograph, natural window light, shallow depth of field, modern and warm, 35mm lens, authentic candid moment with subtle accents of brand violet and coral.",
    ejes: "the room, the person, the action (on a call, writing, thinking), the light",
  },

  // ── Conceptual ──
  {
    id: "surreal",
    familia: "conceptual",
    nombre: { es: "Escritorio imposible", en: "Impossible desk" },
    desc: { es: "La mesa de trabajo en un sitio que no puede ser.", en: "The desk in a place it can't be." },
    escena: "A complete desk and chair placed somewhere impossible: on top of a sand dune, floating on a calm sea, on a cloud, in the middle of a salt flat; someone working there calmly.",
    estilo: "Surreal conceptual photography, hyper-real and clean, like a high-end advertising campaign, soft natural light, minimal and striking.",
    ejes: "the impossible place, whether the person is there or the desk is empty, colour of the furniture",
  },
  {
    id: "puerta",
    familia: "conceptual",
    nombre: { es: "La puerta", en: "The door" },
    desc: { es: "Una puerta abierta que da a otro lugar del mundo.", en: "An open door onto another place in the world." },
    escena: "A door or window standing alone that opens onto a completely different place: from a grey office corridor onto a bright coastline, or from a bedroom onto a vibrant city.",
    estilo: "Surreal metaphor photography, seamless composite, cinematic light spilling through the door, strong colour contrast between the two worlds.",
    ejes: "the two worlds, whether someone is walking through, the kind of opening",
  },
  {
    id: "doble-exposicion",
    familia: "conceptual",
    nombre: { es: "Doble exposición", en: "Double exposure" },
    desc: { es: "Silueta que contiene una ciudad o un paisaje.", en: "A silhouette containing a city or landscape." },
    escena: "A profile silhouette of a person blended with a city skyline, a coastline or a map-like landscape inside it.",
    estilo: "Artistic double exposure photography on a clean light background, elegant blending, limited palette of violet and coral.",
    ejes: "what fills the silhouette, the person's pose, the background tone",
  },
  {
    id: "husos-horarios",
    familia: "conceptual",
    nombre: { es: "Dos husos horarios", en: "Two time zones" },
    desc: { es: "Pantalla partida: de día aquí, de noche allí.", en: "Split frame: day here, night there." },
    escena: "A split frame showing two people of the same team at the same moment in two different cities: one in bright morning light, the other at night, working together.",
    estilo: "Symmetrical split-screen photography with a clean vertical divide, contrasting warm daylight and cool night tones, cinematic.",
    ejes: "the two places, the two people, horizontal or vertical split",
  },
  {
    id: "miniatura",
    familia: "conceptual",
    nombre: { es: "Mundo en miniatura", en: "Miniature world" },
    desc: { es: "Figuritas trabajando sobre un globo o un mapa.", en: "Tiny figures working on a globe or a map." },
    escena: "Tiny model figurines of people working on miniature laptops, standing on a giant globe, an open atlas or a desk landscape.",
    estilo: "Tilt-shift macro photography of miniatures, toy-like scale, shallow depth of field, playful but premium, soft studio light.",
    ejes: "the base (globe, map, keyboard, suitcase), number of figures, what they are doing",
  },
  {
    id: "camino",
    familia: "conceptual",
    nombre: { es: "El camino", en: "The path" },
    desc: { es: "Un camino o escalera hacia el horizonte.", en: "A road or stairway towards the horizon." },
    escena: "A person with a backpack seen from behind at the start of a path, stairway or bridge that leads towards a bright horizon.",
    estilo: "Minimal cinematic photograph, strong leading lines, centred composition, atmospheric light, sense of beginning a journey.",
    ejes: "the kind of path (stairs, road, pier, bridge), landscape, light",
  },

  // ── Objetos y bodegón ──
  {
    id: "flatlay",
    familia: "objetos",
    nombre: { es: "Bodegón desde arriba", en: "Flat lay" },
    desc: { es: "El kit del trabajo remoto ordenado sobre color.", en: "The remote-work kit arranged on colour." },
    escena: "A top-down flat lay of a remote worker's kit neatly arranged: laptop, passport, headphones, a notebook, a plant, a coffee, a travel adapter.",
    estilo: "Overhead flat lay product photography on a solid brand-violet or warm coral surface, hard light with crisp shadows, perfectly organised, graphic.",
    ejes: "background colour, objects chosen, arrangement (grid, scattered, diagonal)",
  },
  {
    id: "objeto-heroe",
    familia: "objetos",
    nombre: { es: "Un solo objeto", en: "Single hero object" },
    desc: { es: "Un objeto protagonista, como un anuncio de producto.", en: "One hero object, like a product ad." },
    escena: "One symbolic object as the hero: a laptop with a small plant growing from the keyboard, a passport on a pedestal, an open suitcase with a desk lamp inside.",
    estilo: "Premium studio product photography, single object centred, colourful seamless backdrop, dramatic soft light, reflections, very clean.",
    ejes: "the object and its twist, backdrop colour, camera angle",
  },
  {
    id: "maleta-oficina",
    familia: "objetos",
    nombre: { es: "Oficina en una maleta", en: "Office in a suitcase" },
    desc: { es: "La maleta abierta convertida en escritorio.", en: "An open suitcase turned into a desk." },
    escena: "An open suitcase that has become a complete tiny office: a laptop, a lamp, a plant and a notebook inside, placed somewhere with a view.",
    estilo: "Conceptual still life photography, warm natural light, playful and clever, realistic materials, shallow depth of field.",
    ejes: "where the suitcase stands, its colour, what is inside",
  },
  {
    id: "papel",
    familia: "objetos",
    nombre: { es: "Papel recortado", en: "Paper cut" },
    desc: { es: "Diorama de papel por capas, hecho a mano.", en: "Layered handmade paper diorama." },
    escena: "A layered paper-cut diorama of a remote work world: a small home office in front of hills, a city and the sea, a tiny paper figure at a desk.",
    estilo: "Handcrafted layered paper art photographed with soft side light and real shadows between layers, pastel violet, coral and cream palette.",
    ejes: "the scene in the layers, palette, depth of layers",
  },

  // ── Ilustración y 3D ──
  {
    id: "3d-plastilina",
    familia: "ilustracion",
    nombre: { es: "3D suave", en: "Soft 3D" },
    desc: { es: "Personajes 3D redondeados, amables, de colores.", en: "Rounded friendly 3D characters, colourful." },
    escena: "A friendly rounded 3D character working on a laptop in a cosy remote setting, with simple props around.",
    estilo: "Soft 3D render in a clay-like style, rounded shapes, pastel violet, lilac and coral, soft global illumination, playful and modern.",
    ejes: "the character, the setting, the props, camera angle",
  },
  {
    id: "isometrico",
    familia: "ilustracion",
    nombre: { es: "Isométrico", en: "Isometric" },
    desc: { es: "Una habitación o un mundo en isométrico.", en: "A room or a world in isometric view." },
    escena: "An isometric cut-away of a tiny remote workspace or a small floating island containing a desk, a plant, a window to the world and a person working.",
    estilo: "Clean isometric 3D illustration, crisp edges, soft shadows, limited palette of violet, coral and off-white, floating on a plain background.",
    ejes: "what is in the room or island, the palette balance, single or several connected rooms",
  },
  {
    id: "ilustracion-plana",
    familia: "ilustracion",
    nombre: { es: "Ilustración editorial", en: "Editorial illustration" },
    desc: { es: "Formas planas y atrevidas, como de revista.", en: "Bold flat shapes, magazine style." },
    escena: "An editorial illustration showing the idea of the ad with one clear visual metaphor and one person.",
    estilo: "Flat vector editorial illustration, bold geometric shapes, limited palette of brand violet, coral and ink black on off-white, modern magazine style, no outlines.",
    ejes: "the metaphor, the composition, the dominant colour",
  },
  {
    id: "risografia",
    familia: "ilustracion",
    nombre: { es: "Risografía", en: "Risograph" },
    desc: { es: "Impresión a dos tintas con grano.", en: "Two-ink print with grain." },
    escena: "A print-style image of a person working remotely in a meaningful setting, with simple bold shapes.",
    estilo: "Risograph print look with two inks only (violet and coral), visible grain and slight misregistration, halftone textures, indie poster feel.",
    ejes: "the subject, the ink balance, close-up or wide",
  },
  {
    id: "collage",
    familia: "ilustracion",
    nombre: { es: "Collage", en: "Collage" },
    desc: { es: "Recortes de foto, papel y formas.", en: "Photo cut-outs, paper and shapes." },
    escena: "A mixed-media collage combining a cut-out photo of a person with fragments of landscapes, a laptop, paper shapes and arrows suggesting movement between places.",
    estilo: "Contemporary mixed-media collage, torn paper edges, halftone photo cut-outs, flat colour shapes in violet and coral, tactile and editorial. No letters or numbers anywhere, no stamps with text.",
    ejes: "the fragments chosen, the central figure, the background colour",
  },

  // ── Gráfico ──
  {
    id: "duotono",
    familia: "grafico",
    nombre: { es: "Duotono", en: "Duotone" },
    desc: { es: "Foto en dos colores de marca, alto contraste.", en: "Photo in two brand colours, high contrast." },
    escena: "A strong, simple photo of a person in a meaningful remote-work moment, cropped boldly.",
    estilo: "Graphic duotone treatment in deep violet and bright coral, high contrast, poster-like, bold crop, very clean.",
    ejes: "the subject, the crop, which colour dominates",
  },
  {
    id: "neon",
    familia: "grafico",
    nombre: { es: "Neón nocturno", en: "Neon night" },
    desc: { es: "Luz de neón violeta y coral, ambiente nocturno.", en: "Violet and coral neon, night mood." },
    escena: "A remote worker in a night-time workspace lit only by violet and coral neon light and the glow of the laptop.",
    estilo: "Moody neon-lit photography, saturated violet and coral light, deep shadows, slight haze, cinematic and modern.",
    ejes: "the space, the neon shapes (no letters), the pose",
  },
  {
    id: "analogico",
    familia: "grafico",
    nombre: { es: "Foto analógica", en: "Analogue film" },
    desc: { es: "Instantánea de carrete con flash, años 90.", en: "Point-and-shoot film snapshot with flash." },
    escena: "A spontaneous snapshot of a remote worker in an everyday moment: on a balcony, on a sofa with a laptop, at a market with a backpack.",
    estilo: "Analogue point-and-shoot film photo with direct flash, warm Portra-like colours, light grain, slightly imperfect framing, nostalgic and authentic.",
    ejes: "the moment, the place, day or night",
  },
  {
    id: "minimal",
    familia: "grafico",
    nombre: { es: "Minimalista", en: "Minimalist" },
    desc: { es: "Un elemento pequeño y muchísimo espacio vacío.", en: "One small element and lots of empty space." },
    escena: "A single small subject (a person at a tiny desk, a chair, a laptop) in a vast clean space of one colour.",
    estilo: "Minimalist fine-art photography, enormous negative space, pastel or brand-colour solid tones, perfect symmetry, calm and premium.",
    ejes: "the subject, where it sits in the frame, the colour of the space",
  },
  {
    id: "abstracto",
    familia: "grafico",
    nombre: { es: "Abstracto de luz", en: "Abstract light" },
    desc: { es: "Sin personas: luz, cristal y degradados.", en: "No people: light, glass and gradients." },
    escena: "An abstract composition with no people: glass shapes, light trails and soft gradients suggesting connection and movement across the world.",
    estilo: "Abstract 3D render of frosted glass and light, smooth gradients from violet to coral, soft glow, premium tech aesthetic.",
    ejes: "the shapes, the direction of movement, the colour balance",
  },
];

const POR_ID = new Map(LINEAS.map((l) => [l.id, l]));

export const lineaDe = (id: string | null | undefined): Linea | undefined => (id ? POR_ID.get(id) : undefined);

/** El ejemplo de la biblioteca. */
export const muestraDe = (id: string) => `/banners/lineas/${id}.webp`;

/** Lo que se guarda en la base de datos, limpio: sólo líneas que existen y textos acotados. */
export function leerRefs(v: unknown, max = 6): Ref[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((r) => (r && typeof r === "object" ? (r as Record<string, unknown>) : null))
    .filter((r): r is Record<string, unknown> => Boolean(r && typeof r.dir === "string" && POR_ID.has(r.dir as string)))
    .slice(0, max)
    .map((r) => ({
      dir: r.dir as string,
      ...(typeof r.titulo === "string" && r.titulo.trim() ? { titulo: r.titulo.trim().slice(0, 120) } : {}),
      ...(typeof r.idea === "string" && r.idea.trim() ? { idea: r.idea.trim().slice(0, 600) } : {}),
    }));
}

/**
 * Sin nada elegido, una mezcla: líneas al azar de familias distintas, para que
 * cada variante salga con otra técnica. `evitar`: las ya usadas en la campaña.
 */
export function mezcla(n: number, evitar: string[] = []): Ref[] {
  const libres = LINEAS.filter((l) => !evitar.includes(l.id));
  const pool = (libres.length >= n ? libres : LINEAS).slice().sort(() => Math.random() - 0.5);
  const elegidas: Linea[] = [];
  for (const l of pool) {
    if (elegidas.length >= n) break;
    // Primero una por familia; si hacen falta más, se repiten familias.
    if (elegidas.length < FAMILIAS.length && elegidas.some((e) => e.familia === l.familia)) continue;
    elegidas.push(l);
  }
  for (const l of pool) if (elegidas.length < n && !elegidas.includes(l)) elegidas.push(l);
  return elegidas.map((l) => ({ dir: l.id }));
}
