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

export const FAMILIAS = ["infografia", "fondos", "personas", "lugares", "ciudades", "nomada", "aprender", "conceptual", "objetos", "ilustracion", "grafico"] as const;
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

// ── Ampliación: fondos, ciudades, aprender, nómada y más técnicas ──
// En forma corta: [id, familia, nombre es, nombre en, desc es, desc en, escena, estilo, ejes].
type Fila = [string, Familia, string, string, string, string, string, string, string];

const MAS: Fila[] = [
  // Fondos: sin sujeto, para que mande el texto
  ["color-liso", "fondos", "Color liso", "Solid colour", "Un solo color de marca con textura sutil.", "One brand colour with a subtle texture.",
    "A completely plain background of a single colour, nothing else in the frame, with a very subtle paper or matte texture.",
    "Minimal flat background, saturated brand violet (#5B4BF5) or warm coral, soft vignette, tactile matte paper grain, perfectly even.", "the colour, the texture (paper, plaster, felt), the vignette"],
  ["degradado", "fondos", "Degradado suave", "Soft gradient", "De violeta a coral, limpio.", "Violet to coral, clean.",
    "A smooth, empty gradient background flowing from one colour to another, no objects.",
    "Silky smooth gradient from deep violet to coral and peach, subtle film grain, premium and calm, no shapes.", "direction of the gradient, the colour stops, the grain"],
  ["degradado-malla", "fondos", "Degradado de malla", "Mesh gradient", "Manchas de color que se funden.", "Colour blobs melting together.",
    "An abstract mesh gradient of soft colour blobs blending into each other, no objects.",
    "Vibrant mesh gradient with violet, magenta, coral and soft blue blobs, blurred and organic, glowing, modern tech-brand background.", "the blob positions, the palette, the softness"],
  ["aurora", "fondos", "Aurora", "Aurora", "Cintas de luz sobre un cielo oscuro.", "Ribbons of light over a dark sky.",
    "Flowing ribbons of light like an aurora across a deep dark sky, no landscape or only a thin dark horizon.",
    "Ethereal aurora light curtains in violet, magenta and teal over near-black, long-exposure glow, dreamy.", "the shape of the ribbons, horizon or none, colours"],
  ["patron-geometrico", "fondos", "Patrón geométrico", "Geometric pattern", "Triángulos y formas repetidas.", "Repeating triangles and shapes.",
    "A seamless repeating pattern of simple geometric shapes, mostly triangles and lines, filling the whole frame.",
    "Bold flat geometric pattern in violet, coral, ink black and off-white, Swiss design precision, crisp edges, no letters.", "the shapes, the density, the palette balance"],
  ["patron-mapa", "fondos", "Mapa de puntos", "Dotted world map", "El mundo dibujado con puntos.", "The world drawn with dots.",
    "A world map made only of evenly spaced dots, with a few glowing dots connected by thin arcs between continents.",
    "Minimal dotted world-map graphic on a dark violet or off-white background, glowing connection arcs in coral, clean tech aesthetic, no labels.", "light or dark base, which continents connect, the glow"],
  ["topografico", "fondos", "Líneas topográficas", "Topographic lines", "Curvas de nivel, como un mapa de montaña.", "Contour lines, like a mountain map.",
    "Abstract topographic contour lines covering the whole frame, like an elevation map, no labels.",
    "Bold, clearly visible contour lines in coral and lilac on a deep violet background, dense and graphic, editorial poster feel.", "line density, background colour, line colour"],
  ["bokeh", "fondos", "Bokeh", "Bokeh", "Luces desenfocadas, ambiente cálido.", "Out-of-focus lights, warm mood.",
    "A background made only of soft out-of-focus circular lights, like city lights or fairy lights seen through a lens.",
    "Dreamy bokeh photography, large creamy circles of light in violet, coral and warm gold on a dark background.", "size of the circles, colour mix, density"],
  ["cristal", "fondos", "Cristal esmerilado", "Frosted glass", "Paneles de cristal con color detrás.", "Glass panels with colour behind.",
    "Overlapping translucent frosted-glass panels floating in front of blurred colour shapes, no objects.",
    "Glassmorphism 3D render, frosted glass with soft reflections and refraction, violet and coral glow behind, premium and minimal.", "number and angle of the panels, the colours behind"],
  ["tinta-agua", "fondos", "Tinta en el agua", "Ink in water", "Nubes de color que se expanden.", "Clouds of colour spreading.",
    "Clouds of coloured ink blooming and swirling in clear water, no objects.",
    "High-speed macro photography of ink in water, violet and coral plumes on white or black, organic and dramatic.", "white or black background, shape of the plumes, colours"],
  ["estelas-luz", "fondos", "Estelas de luz", "Light trails", "Líneas de luz en movimiento sobre negro.", "Moving light lines on black.",
    "Abstract streaks of light curving across a dark frame, suggesting speed and connection.",
    "Long-exposure light painting, smooth neon streaks in violet, magenta and coral on black, dynamic curves.", "direction of the streaks, how many, the colours"],
  ["constelacion", "fondos", "Constelación", "Constellation", "Puntos unidos como una red de estrellas.", "Dots joined like a star network.",
    "A night-sky-like background where small glowing points are joined by thin lines, forming a network like constellations.",
    "Minimal network constellation graphic, glowing nodes and fine lines on deep navy-violet, subtle stars, calm and smart.", "density of the network, background tone, glow"],
  ["memphis", "fondos", "Memphis", "Memphis pattern", "Formas y garabatos de los 80, alegre.", "80s shapes and squiggles, playful.",
    "A playful pattern of squiggles, dots, zigzags, circles and triangles scattered over the frame.",
    "Memphis design pattern, flat shapes in violet, coral, yellow and black on cream, energetic and fun, no letters.", "the shapes, the palette, density"],
  ["semitono", "fondos", "Semitono pop", "Halftone pop", "Puntos de imprenta, aire de cómic.", "Print dots, comic feel.",
    "A bold background made of halftone dot patterns and radiating rays, like a pop-art comic panel, no characters or letters.",
    "Pop-art halftone dots and sunburst rays in coral and violet, high contrast, printed texture.", "rays or plain dots, dot size, colours"],

  // Ciudades
  ["sol-y-luna", "ciudades", "Dos ciudades: sol y luna", "Two cities: sun and moon", "Una ciudad de día y otra de noche en el mismo horizonte.", "One city by day, one by night, on the same horizon.",
    "Two different city skylines side by side on one shared horizon: the left one under a bright sun in daytime, the right one under a big moon at night. In each city one person works comfortably on a laptop on a rooftop or balcony, relaxed.",
    "Cinematic wide composition blending day into night across the frame, warm golden light on the left, deep blue and violet night with city lights on the right, magical but photoreal.", "which cities, where the two people are, the transition between day and night"],
  ["tejados", "ciudades", "Tejados al atardecer", "Rooftops at sunset", "Tejados antiguos y una persona arriba.", "Old rooftops and someone up there.",
    "A sea of old terracotta rooftops at golden hour, and on one terrace a person working on a laptop with a drink.",
    "Warm Mediterranean golden-hour photography, long shadows, terracotta and violet sky, painterly depth.", "the city, where the person sits, the time of light"],
  ["ciudad-lluvia", "ciudades", "Ciudad con lluvia", "Rainy city", "Calles mojadas, reflejos y paraguas.", "Wet streets, reflections and umbrellas.",
    "A rainy city street at dusk with reflections on the wet pavement, seen from inside a cosy café window where someone works.",
    "Moody cinematic rain photography, reflections of violet and coral lights, droplets on glass, warm interior vs cool street.", "inside or outside view, the city, the light colours"],
  ["ciudad-colonial", "ciudades", "Calle colonial", "Colonial street", "Fachadas de colores de Latinoamérica.", "Colourful Latin American facades.",
    "A colourful colonial street in a Latin American city with painted facades, flowers on balconies, and a person with a laptop at a doorway table.",
    "Vibrant travel photography, saturated pastel facades, bright midday sun with soft shadows, joyful.", "the colours of the houses, the person, the time of day"],
  ["callejon-neon", "ciudades", "Callejón de neón", "Neon alley", "Callejón asiático de noche, luces sin letras.", "Asian alley at night, lights without letters.",
    "A narrow city alley at night full of glowing lanterns and light boxes (all blank, no characters), a person with a backpack walking through.",
    "Cinematic night street photography, glowing lanterns in coral and violet, wet ground reflections, atmospheric. All signs are blank with no writing.", "the alley, the person, the lantern colours"],
  ["ventanilla-avion", "ciudades", "Desde el avión", "From the plane", "Luces de una ciudad desde la ventanilla.", "City lights through the plane window.",
    "View through an airplane window at night of a city's glowing grid of lights far below, the wing tip visible.",
    "Atmospheric photography through an aircraft window, oval frame, warm city lights, deep blue night, quiet anticipation.", "night or sunset, the city pattern, the window framing"],
  ["puente-continentes", "ciudades", "Puente entre ciudades", "Bridge between cities", "Un puente que une dos orillas lejanas.", "A bridge joining two distant shores.",
    "A long elegant bridge connecting two different cities on opposite shores over the water, a small figure with a backpack walking across.",
    "Epic wide photograph, symmetrical, soft sunrise light, misty water, metaphor of connection.", "the two cities, the kind of bridge, the light"],
  ["ciudad-nubes", "ciudades", "Ciudad sobre las nubes", "City above the clouds", "Rascacielos que asoman entre nubes.", "Skyscrapers piercing the clouds.",
    "Skyscraper tops rising above a sea of clouds, and on one top terrace a small person working at a desk.",
    "Dreamlike high-altitude photography, sunrise over a cloud sea, warm pink and violet light, serene.", "number of towers, where the person is, sky colour"],
  ["fachada-ventanas", "ciudades", "Fachada de ventanas", "Facade of windows", "Muchas ventanas, cada una con alguien trabajando.", "Many windows, someone working in each.",
    "A building facade seen straight on with a grid of windows; in each lit window a different person works remotely, some by daylight, some at night.",
    "Symmetrical architectural photography, Wes-Anderson-like order, warm and cool windows mixing day and night, storytelling detail.", "the people in the windows, day/night mix, the facade colour"],
  ["mini-planeta", "ciudades", "Pequeño planeta", "Tiny planet", "Una ciudad curvada como un planeta.", "A city curved into a planet.",
    "A city wrapped into a tiny round planet seen from above, buildings radiating outwards, a person with a laptop standing on top.",
    "Stereographic little-planet photography, 360-degree projection, vivid sky circling, playful and surprising.", "the city, the sky colour, where the person stands"],

  // Aprender: universidad, clases y futuro
  ["campus-clasico", "aprender", "Campus clásico", "Classic campus", "Alumnos en el césped de una universidad.", "Students on a university lawn.",
    "Students of different ages sitting on the lawn of a beautiful old university campus with laptops and notebooks, talking and learning together.",
    "Warm editorial campus photography, golden afternoon light, stone buildings softly blurred, lively and inspiring.", "the group, the season, the architecture"],
  ["aula-magna", "aprender", "Clase en directo", "Live class", "Un aula llena atendiendo a quien enseña.", "A full room listening to the teacher.",
    "A modern lecture room during a live class: adult students engaged, one asking a question, the teacher gesturing (no screen content visible).",
    "Documentary photography of a live class, natural light, real engagement, shallow depth of field on one curious student.", "who is in focus, the room style, the moment"],
  ["biblioteca", "aprender", "Gran biblioteca", "Grand library", "Una biblioteca monumental con alumnos.", "A monumental library with students.",
    "A grand historic library with towering shelves and long tables, a few adult students working on laptops under warm lamps.",
    "Majestic interior photography, symmetrical, warm lamplight and cool window light, sense of knowledge and calm. Book spines unreadable.", "the library, the students, the light"],
  ["universidad-futuro", "aprender", "Universidad del futuro", "University of the future", "Campus de cristal, jardines y luz.", "Glass campus, gardens and light.",
    "A futuristic university campus with organic glass architecture, vertical gardens and students walking and studying outside with laptops.",
    "Architectural visualisation, solarpunk optimism, bright daylight, lush greens with violet and coral accents, photoreal.", "the buildings, the students, time of day"],
  ["aula-holograma", "aprender", "Aula con holograma", "Hologram classroom", "Un globo de luz flotando en la clase.", "A globe of light floating in class.",
    "A small group of students around a table looking at a floating holographic globe of light, learning together.",
    "Sci-fi realistic photography, soft blue-violet hologram glow on faces, dark modern room, wonder and focus. The hologram has no text.", "what the hologram shows, the group, the room"],
  ["graduacion", "aprender", "Graduación", "Graduation", "Birretes al aire, celebración.", "Caps in the air, celebration.",
    "A diverse group of graduates throwing their caps into a bright sky, seen from a low angle.",
    "Joyful low-angle photography, caps frozen mid-air, blue sky with sun flare, celebratory.", "the group, the sky, the moment"],
  ["mentor", "aprender", "Mentor y alumno", "Mentor and student", "Dos personas resolviendo algo juntas.", "Two people solving something together.",
    "A mentor and a student side by side at a desk, both looking at a laptop, the mentor pointing and the student having an aha moment.",
    "Warm documentary photography, natural window light, genuine expressions, close framing.", "who they are, the setting, the moment of insight"],
  ["patio-internacional", "aprender", "Alumnos del mundo", "Students from everywhere", "Un grupo internacional charlando al sol.", "An international group chatting in the sun.",
    "A small international group of adult students laughing and talking in a sunny courtyard, laptops and coffees on the table.",
    "Bright lifestyle photography, sunlight through trees, warm tones, candid and friendly.", "the group, the courtyard, the action"],
  ["taller-postits", "aprender", "Taller práctico", "Hands-on workshop", "Notas de colores en la pared, trabajo en equipo.", "Colourful notes on the wall, teamwork.",
    "A hands-on workshop: people arranging blank colourful sticky notes on a glass wall, planning together.",
    "Energetic documentary photography, colourful blank notes (no writing), daylight studio, motion and collaboration.", "the people, the arrangement, the angle"],
  ["ciudad-solarpunk", "aprender", "Ciudad solarpunk", "Solarpunk city", "Terrazas verdes donde se trabaja en remoto.", "Green terraces where people work remotely.",
    "A green future city with plant-covered terraces, solar sails and people working on laptops in the gardens.",
    "Optimistic solarpunk illustration-like photoreal render, lush greenery, soft sunlight, white and violet architecture.", "the terraces, the people, the time of day"],
  ["companero-ia", "aprender", "Compañero IA", "AI companion", "Una persona trabajando junto a un robot amable.", "A person working with a friendly robot.",
    "A person working at a desk alongside a small friendly robot assistant that hands them a coffee or points at a notebook.",
    "Warm cinematic photography with a sleek white robot, soft daylight, friendly and optimistic, not scary.", "the robot's gesture, the setting, the person"],

  // Nómada
  ["furgoneta", "nomada", "Vida en furgoneta", "Van life", "Puerta abierta, portátil y el mar.", "Open door, laptop and the sea.",
    "A camper van with its side door open facing the ocean, a person sitting inside working on a laptop with their feet out.",
    "Sunny van-life photography, warm light, soft film colours, freedom and calm.", "the landscape outside, the van colour, the time of day"],
  ["hamaca", "nomada", "Desde la hamaca", "From the hammock", "Trabajar tumbado entre palmeras.", "Working lying between palm trees.",
    "A person relaxed in a hammock between palm trees, laptop on their lap, the sea in the background.",
    "Tropical lifestyle photography, dappled shade, turquoise and green with coral accents, relaxed.", "the beach or jungle, the person, the light"],
  ["casa-arbol", "nomada", "Casa en el árbol", "Treehouse office", "Una oficina entre las ramas.", "An office among the branches.",
    "A small wooden treehouse office high in a forest canopy, warm light inside where someone works on a laptop.",
    "Magical forest photography at dusk, warm window glow, green canopy, cosy and adventurous.", "the forest, inside or outside view, time"],
  ["velero", "nomada", "En un velero", "On a sailboat", "La cubierta como oficina.", "The deck as an office.",
    "A person working on a laptop on the deck of a sailboat anchored in a calm turquoise bay.",
    "Bright nautical photography, crisp blue water, white sails, sunny and free.", "the bay, the person, angle from the mast or the water"],
  ["coworking-playa", "nomada", "Coworking de playa", "Beach coworking", "Cabaña de bambú con mesas frente al mar.", "Bamboo hut with desks facing the sea.",
    "An open bamboo beach hut with a few desks where several remote workers sit with laptops facing the ocean.",
    "Warm tropical photography, natural wood and thatch, soft ocean light, community feel.", "the people, the hut, morning or sunset"],
  ["desierto-estrellas", "nomada", "Desierto bajo las estrellas", "Desert under the stars", "Campamento, Vía Láctea y la luz del portátil.", "Camp, Milky Way and the laptop glow.",
    "A desert camp at night under the Milky Way, a tent lit from inside and a person with a laptop glowing beside a small fire.",
    "Astro-landscape photography, vivid Milky Way, warm firelight against cool night, wonder.", "the camp, the sky, the person"],
  ["chalet-nieve", "nomada", "Montaña nevada", "Snowy mountains", "Ventanal, nieve y una manta.", "Big window, snow and a blanket.",
    "A cosy chalet interior with a person working under a blanket by a big window showing snowy mountains.",
    "Hygge winter photography, warm interior light, crisp white snow outside, calm and cosy.", "the view, the interior, the person"],
  ["mercado", "nomada", "Mercado de colores", "Colourful market", "Mochila al hombro entre puestos de fruta.", "Backpack on, among fruit stalls.",
    "A person with a backpack walking through a vibrant local market full of fruit, flowers and spices, smiling.",
    "Rich travel photography, saturated colours, dappled light under awnings, lively. No readable signs.", "the market, the person, the angle"],
  ["sala-aeropuerto", "nomada", "Sala del aeropuerto", "Airport lounge", "Aviones al atardecer tras el cristal.", "Planes at sunset through the glass.",
    "A person working on a laptop in an airport lounge, a huge window behind showing planes on the runway at sunset.",
    "Cinematic airport photography, silhouettes, warm sunset flare, sense of departure.", "the person, the planes, the light"],
  ["tren-nocturno", "nomada", "Tren nocturno", "Night train", "Compartimento con luz cálida y paisaje oscuro.", "Warm compartment and dark landscape.",
    "A cosy sleeper-train compartment at night, a person working on a laptop with tea, dark landscape and distant lights outside.",
    "Atmospheric cinematic photography, warm interior lamp, cool blue window, nostalgic.", "the compartment, the view, the person"],
  ["azotea-guirnaldas", "nomada", "Azotea con guirnaldas", "Rooftop string lights", "Coworking en la azotea al anochecer.", "Rooftop coworking at dusk.",
    "A rooftop terrace with string lights at dusk where a few people work and chat with laptops, the city behind.",
    "Warm dusk photography, glowing bulbs, violet sky, social and relaxed.", "the people, the city, the moment"],
  ["globos", "nomada", "Globos al amanecer", "Balloons at dawn", "Globos aerostáticos y alguien trabajando en una terraza.", "Hot air balloons and someone working on a terrace.",
    "Dozens of hot air balloons rising over a valley at dawn, seen from a terrace where a person works with a coffee.",
    "Breathtaking travel photography, soft pastel sunrise, layered valley, dreamy.", "the balloons, the terrace, the person"],
  ["templo-jardin", "nomada", "Jardín zen", "Zen garden", "Calma total: madera, musgo y un portátil.", "Total calm: wood, moss and a laptop.",
    "A wooden pavilion overlooking a raked zen garden with moss and maple trees, a person working peacefully on a laptop.",
    "Serene minimal photography, soft overcast light, greens and wood tones with a touch of violet, meditative.", "the season, the pavilion, the person"],

  // Conceptual (más)
  ["relojes", "conceptual", "Relojes del mundo", "World clocks", "Varios relojes, cada uno a una hora.", "Several clocks, each at a different time.",
    "A wall of round clocks without numbers, each showing a different time, with a person working calmly beneath them.",
    "Graphic conceptual photography, clean wall in violet or cream, symmetrical clocks with plain faces and no numerals, calm.", "the wall colour, number of clocks, the person"],
  ["aviones-papel", "conceptual", "Aviones de papel", "Paper planes", "Salen volando del portátil.", "Flying out of the laptop.",
    "Paper airplanes flying out of an open laptop on a desk and out through an open window towards the sky.",
    "Whimsical conceptual photography, soft daylight, white paper planes against blue sky, light and hopeful.", "how many planes, the window view, the desk"],
  ["brujula", "conceptual", "Brújula", "Compass", "Una brújula en la mano señalando el camino.", "A compass in hand showing the way.",
    "A hand holding an open compass in the foreground, a landscape and a winding path in the background.",
    "Cinematic close-up with shallow depth of field, warm light, sense of direction. The compass dial has no letters.", "the landscape, the hand, the light"],
  ["puzzle-mundo", "conceptual", "Puzle del mundo", "World puzzle", "Piezas de paisajes que forman un mapa.", "Landscape pieces forming a map.",
    "Jigsaw puzzle pieces, each showing a different landscape or city, coming together to form a world map; one piece being placed by a hand.",
    "Conceptual top-down photography, colourful pieces, clean table, satisfying.", "the pieces, the hand, the missing piece"],
  ["cohete-papel", "conceptual", "Despegue", "Lift-off", "Un cohete de papel despega del escritorio.", "A paper rocket lifting off the desk.",
    "A small paper rocket launching from a desk next to a laptop, a trail of paper clouds behind it.",
    "Playful handcrafted still life, soft studio light, pastel violet and coral, optimistic.", "the rocket, the trail, the desk"],
  ["laberinto", "conceptual", "Salida del laberinto", "Out of the maze", "Vista aérea de un laberinto y alguien que sale.", "Aerial maze with someone getting out.",
    "An aerial view of a hedge maze with one person walking out of the exit towards an open field.",
    "Aerial photography, strong geometric patterns, crisp greens and long shadows, clear metaphor.", "the maze shape, where the person is, the light"],
  ["pantalla-ventana", "conceptual", "La pantalla es una ventana", "Screen as a window", "El portátil enseña el mar, no una app.", "The laptop shows the sea, not an app.",
    "An open laptop on a grey office desk whose screen is a real window onto a sunny beach, light and breeze spilling out of it.",
    "Surreal conceptual photography, contrast between dull office and bright beach, seamless composite.", "what the screen opens to, the office, the light"],

  // Ilustración (más)
  ["acuarela", "ilustracion", "Acuarela", "Watercolour", "Pinceladas suaves y manchas de agua.", "Soft brush strokes and water blooms.",
    "A watercolour painting of a person working from a balcony or a café, with a city or landscape behind.",
    "Loose watercolour illustration, soft bleeding washes, white paper showing through, violet and coral palette.", "the scene, the palette, how loose"],
  ["linea-continua", "ilustracion", "Línea continua", "Single line", "Un dibujo hecho con un solo trazo.", "A drawing made with one line.",
    "A single continuous line drawing of a person with a laptop and a globe, with one flat colour shape behind.",
    "Minimal continuous one-line art in black on cream, with one bold violet or coral shape, elegant.", "the subject, the colour shape, the line weight"],
  ["pixel-art", "ilustracion", "Pixel art", "Pixel art", "Escena de videojuego retro.", "Retro video game scene.",
    "A pixel-art scene of a cosy room where a character works on a computer, a window showing the world outside.",
    "Detailed 16-bit pixel art, warm palette with violet and coral, cosy retro game aesthetic, no text or UI.", "the room, the view, day or night"],
  ["anime", "ilustracion", "Fondo anime", "Anime background", "Paisaje pintado a mano, muy luminoso.", "Hand-painted bright landscape.",
    "A hand-painted anime-style scene of a person working on a laptop on a hill or rooftop, big clouds and a city far away.",
    "Hand-painted anime background art, luminous skies, lush detail, nostalgic summer light.", "the place, the sky, the character"],
  ["cartel-vintage", "ilustracion", "Cartel de viaje vintage", "Vintage travel poster", "Estilo cartel de los años 50, sin letras.", "1950s poster style, no letters.",
    "A vintage travel-poster scene of a person working on a terrace overlooking a coastline, with no words at all.",
    "Mid-century travel poster illustration, flat bold shapes, limited palette, aged paper texture, absolutely no lettering.", "the coast, the person, the palette"],
  ["low-poly", "ilustracion", "Low poly", "Low poly", "Paisaje 3D de polígonos.", "3D landscape made of polygons.",
    "A low-poly 3D landscape with mountains, a lake and a tiny cabin where someone works.",
    "Low-poly 3D render, faceted shapes, soft gradient lighting, violet and coral tones.", "the landscape, the camera, the palette"],
  ["vidriera", "ilustracion", "Vidriera", "Stained glass", "Escena en cristales de colores.", "A scene in coloured glass.",
    "A stained-glass window depicting a person with a laptop under a sun and a moon, light passing through.",
    "Stained glass art, bold black leading, glowing jewel colours, backlit.", "the scene, the colours, the light"],
  ["tinta-china", "ilustracion", "Tinta oriental", "Ink wash", "Pincel y tinta, mucho aire.", "Brush and ink, lots of air.",
    "An ink-wash painting of mountains and mist with a tiny figure working in a pavilion.",
    "Traditional sumi-e ink wash style, soft greys, one accent of coral, lots of empty space.", "the landscape, the accent, the figure"],
  ["synthwave", "ilustracion", "Synthwave", "Synthwave", "Sol retro, rejilla y neón.", "Retro sun, grid and neon.",
    "A retro-futuristic landscape with a big striped sun, a neon grid floor and a silhouette working on a laptop.",
    "80s synthwave aesthetic, magenta, violet and orange gradients, glowing grid, chrome highlights, no text.", "the sun, the horizon, the silhouette"],
  ["plano-tecnico", "ilustracion", "Plano técnico", "Blueprint", "Dibujo técnico de una oficina remota.", "Technical drawing of a remote office.",
    "A technical blueprint drawing of a small home office: desk, chair, laptop, window, plant, with dimension lines but no numbers.",
    "Blueprint style, fine white lines on deep blue-violet, precise and clean, no numbers or letters.", "the room, the perspective, the colour"],

  // Personas (más)
  ["celebracion", "personas", "Celebración en grupo", "Group celebration", "Risas alrededor de la mesa tras clase.", "Laughter around the table after class.",
    "A small group of adult students laughing and high-fiving around a table with laptops after finishing a project.",
    "Candid warm photography, golden indoor light, real emotion, slight motion blur.", "the group, the place, the gesture"],
  ["en-movimiento", "personas", "En movimiento", "In motion", "Caminando rápido, la ciudad se desdibuja.", "Walking fast, the city blurs.",
    "A person walking confidently with a laptop bag through a busy city, the crowd blurred around them.",
    "Long-exposure street photography, sharp subject, motion-blurred crowd, energetic.", "the city, the light, the person"],
  ["sombras-persiana", "personas", "Luz de persiana", "Blind shadows", "Rayas de luz sobre alguien concentrado.", "Stripes of light on someone focused.",
    "A person working at a laptop with dramatic stripes of sunlight from window blinds across them and the wall.",
    "Film-noir inspired photography, strong light and shadow stripes, warm tones, graphic.", "the angle of the shadows, the person, the colour"],

  // Gráficos, diagramas, herramientas, infografías y memes. Sin cifras ni
  // texto, y nunca un gráfico de ganancias que sube (normas de Meta).
  ["datos-3d", "infografia", "Datos en 3D", "3D data shapes", "Gráficos abstractos flotando, sin cifras.", "Floating abstract charts, no figures.",
    "Floating abstract data-visualisation objects: a donut chart, a pie with a slice lifted out, connected nodes and a few balanced columns, around a laptop. No numbers, no labels, no upward money trend.",
    "Glossy 3D render, soft studio light, violet, coral and mint pastel materials on a clean light background, friendly and smart.", "which shapes, the arrangement, background colour"],
  ["diagrama-equipo", "infografia", "Diagrama del equipo", "Team diagram", "Avatares de un equipo unidos por líneas sobre el mapa.", "Team avatars linked across the map.",
    "A diagram of a distributed team: round illustrated avatar portraits of different people placed over a simplified world map, connected by dotted lines to a central laptop.",
    "Flat vector infographic style, clean lines, rounded avatars, violet and coral on off-white, no text or labels.", "number of people, the map style, the connections"],
  ["flujo-proceso", "infografia", "Flujo en pasos", "Step flow", "Cuatro pasos unidos por flechas, con iconos.", "Four steps joined by arrows, with icons.",
    "A process flow of four illustrated steps joined by curved arrows: a lightbulb idea, a laptop at work, a video class with a teacher, and a globe; like a journey map.",
    "Playful flat infographic illustration, thick rounded arrows, icon-like objects in circles, violet, coral and yellow on cream, no words or numbers.", "the steps' icons, vertical or zigzag path, palette"],
  ["herramientas-3d", "infografia", "Herramientas en 3D", "3D tool icons", "Iconos genéricos del trabajo remoto, sin marcas.", "Generic remote-work icons, no brands.",
    "A cluster of glossy 3D icons representing remote-work tools: a calendar block, a folder, a cloud, a gear, a lightning bolt, a video camera, a headset and a puzzle piece, floating around a laptop. No logos or brand shapes.",
    "Glossy toy-like 3D icons, soft shadows, pastel violet, coral, mint and yellow, clean gradient background.", "which icons, the composition, the background"],
  ["caja-herramientas", "infografia", "Caja de herramientas", "Toolbox", "Una caja de la que salen herramientas digitales.", "A box spilling out digital tools.",
    "An open toolbox from which digital-work objects pop out: a laptop, a cloud, a gear, a calendar, a headset and a globe.",
    "Whimsical 3D illustration, bouncy and colourful, soft light, violet and coral with mint accents, no text or logos.", "the box, the objects, the angle"],
  ["infografia-divertida", "infografia", "Infografía divertida", "Fun infographic", "Un camino con hitos, personajes y flechas.", "A path with milestones, characters and arrows.",
    "A fun illustrated infographic: a winding road with milestone flags, a cheerful character travelling along it with a backpack and laptop, little icons of a house, a plane, a classroom and a globe at each stop.",
    "Colourful hand-drawn infographic illustration, bold outlines, playful details, violet, coral and yellow, absolutely no text or numbers.", "the path shape, the character, the stops"],
  ["mapa-mental", "infografia", "Mapa mental", "Mind map", "Garabatos en una libreta: ideas conectadas.", "Notebook doodles: connected ideas.",
    "A hand-drawn mind map in an open notebook: a central doodle of a globe and laptop, branches to small doodles (a house, a plane, a clock, a lightbulb, a rocket), a pen beside it.",
    "Top-down photo of a notebook with marker doodles, only drawings and no words, violet and coral markers, desk with coffee.", "the doodles, the notebook, the desk"],
  ["meme-reaccion", "infografia", "Meme de reacción", "Reaction meme", "Una cara muy expresiva, con aire de meme.", "A very expressive face, meme style.",
    "A person reacting with an exaggerated, funny expression (shock, delight or disbelief) while looking at a laptop, framed with empty space at the top for a caption.",
    "Classic internet meme photo look, direct flash, slightly overexposed, candid and funny, everyday room. No text in the image.", "the emotion, the person, the room"],
  ["meme-dos-paneles", "infografia", "Meme de dos viñetas", "Two-panel meme", "No a la oficina gris, sí al portátil en la playa.", "No to the grey office, yes to the beach laptop.",
    "A two-panel vertical image: top panel, a person turning away with a disgusted hand gesture from a grey office cubicle; bottom panel, the same person smiling and pointing approvingly at a laptop on a sunny terrace.",
    "Meme-format photography, two stacked panels with a thin white divider, bright and comedic expressions, no text.", "the two scenes, the gestures, the person"],
  ["mascota-remota", "infografia", "Mascota en la oficina", "Office pet", "El perro o el gato también teletrabaja.", "The dog or cat works remotely too.",
    "A dog wearing tiny headphones sitting very seriously in front of a laptop, or a cat sprawled across the keyboard while its owner is on a call, funny and relatable.",
    "Funny pet photography, warm home light, shallow depth of field, crisp detail, wholesome humour.", "dog or cat, what it is doing, the setting"],
  ["comic-vinetas", "infografia", "Cómic en viñetas", "Comic strip", "Tres viñetas que cuentan un cambio.", "Three panels telling a change.",
    "A three-panel comic strip with no speech balloons: panel one a tired person commuting in grey rain, panel two the same person in a live online class taking notes, panel three the person working happily from a sunny balcony.",
    "Bold comic book illustration, clean ink lines, flat colours in violet, coral and yellow, halftone shading, no text or balloons.", "vertical or horizontal panels, the person, the scenes"],
  ["islas-equipo", "infografia", "Escena isométrica de equipo", "Isometric team scene", "Un equipo trabajando en islas conectadas.", "A team working on connected islands.",
    "Several small isometric floating islands, each with one person working on a laptop in a different setting (beach, city, mountain, home), connected by glowing bridges.",
    "Clean isometric 3D illustration, soft shadows, violet and coral palette with green accents, no text.", "the islands, the connections, camera angle"],
];

LINEAS.push(
  ...MAS.map(([id, familia, nes, nen, des, den, escena, estilo, ejes]) => ({
    id,
    familia,
    nombre: { es: nes, en: nen },
    desc: { es: des, en: den },
    escena,
    estilo,
    ejes,
  })),
);

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
