const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let html = source;

function replaceOne(pattern, replacement, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`${label}: expected one match, found ${matches.length}`);
  html = html.replace(pattern, replacement);
}

replaceOne(/<html lang="es">/, '<html lang="en">', 'document language');
replaceOne(/<meta content="[^"]*" name="description"\/>/, '<meta content="Wood fence installation and repair, bee and wasp removal, wildlife control, and security cameras in Houston, Texas. Request an estimate." name="description"/>', 'description');
replaceOne(/<title>[^<]*<\/title>/, '<title>Kingsland Services | Fences, Bees & Wildlife in Houston, TX</title>', 'title');
replaceOne(/<link rel="canonical" href="[^"]+"\/>/, '<link rel="canonical" href="https://kingslandservicestx.com/en/"/>', 'canonical');
replaceOne(/<meta property="og:locale" content="[^"]+"\/>/, '<meta property="og:locale" content="en_US"/>', 'Open Graph locale');
replaceOne(/<meta property="og:title" content="[^"]+"\/>/, '<meta property="og:title" content="Kingsland Services | Property Services in Houston, TX"/>', 'Open Graph title');
replaceOne(/<meta property="og:description" content="[^"]+"\/>/, '<meta property="og:description" content="Wood fences, bee and wasp removal, wildlife control, and security cameras in Houston, Texas and surrounding areas."/>', 'Open Graph description');
replaceOne(/<meta property="og:url" content="[^"]+"\/>/, '<meta property="og:url" content="https://kingslandservicestx.com/en/"/>', 'Open Graph URL');
replaceOne(/<meta property="og:image:alt" content="[^"]+"\/>/, '<meta property="og:image:alt" content="Kingsland Services: property services in Houston, Texas"/>', 'Open Graph image alt');
replaceOne(/<meta name="twitter:title" content="[^"]+"\/>/, '<meta name="twitter:title" content="Kingsland Services · Houston, Texas"/>', 'Twitter title');
replaceOne(/<meta name="twitter:description" content="[^"]+"\/>/, '<meta name="twitter:description" content="Wood fences, bee and wasp removal, wildlife control, and security camera installation."/>', 'Twitter description');

const languageControl = '<div aria-label="Seleccionar idioma" class="language"><a aria-current="page" class="active" href="/" lang="es">ES</a><a href="/en/" lang="en">EN</a></div>';
if (!html.includes(languageControl)) throw new Error('Language navigation not found');
html = html.replace(languageControl, '<div aria-label="Select language" class="language"><a href="/" lang="es">ES</a><a aria-current="page" class="active" href="/en/" lang="en">EN</a></div>');

// The source keeps both translations in attributes so this checked-in static
// page can be regenerated without a browser or a build dependency.
const translatable = /<([a-z][\w-]*)\b([^>]*\bdata-en="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/gi;
let translated = 0;
html = html.replace(translatable, (whole, tag, attrs, english) => {
  translated += 1;
  return `<${tag}${attrs}>${english.replaceAll('&lt;br&gt;', '<br/>')}</${tag}>`;
});
if (translated < 150) throw new Error(`Only ${translated} elements translated`);

const imageAlts = {
  'Panal de abejas en una estructura de madera': 'Beehive in a wooden structure',
  'Técnico de Kingsland Services sosteniendo con cuidado una zarigüeya bebé': 'Kingsland Services technician carefully holding a baby opossum',
  'Cerca nueva de madera': 'New wood fence',
  'Panal de abejas en una estructura': 'Beehive in a structure',
  'Trabajo de manejo de animales; mapache en una intervención': 'Wildlife control project involving a raccoon',
  'Instalación de cámara de seguridad en estructura exterior': 'Security camera installed on an exterior structure',
  'Vista de una cerca de madera recién instalada junto a una casa.': 'Newly installed wood fence beside a house.',
  'Técnico sosteniendo un panal retirado del interior de una vivienda': 'Technician holding a hive removed from inside a home',
  'Persona sosteniendo un mapache en el exterior.': 'Person holding a raccoon outdoors.',
  'Tramo de cerca de madera en un patio abierto.': 'Section of wood fence in an open yard.',
  'Colonia de abejas agrupada en panal de una construcción.': 'Bee colony clustered around a hive in a building.',
  'Instalación de cámara de seguridad tipo bullet.': 'Bullet security camera installation.',
  'Persona sosteniendo cuidadosamente una zarigüeya pequeña.': 'Person carefully holding a small opossum.',
  'Bastidor de portón de madera durante su construcción.': 'Wooden gate frame under construction.',
  'Panal de abejas adherido a vigas de madera.': 'Beehive attached to wooden beams.',
  'Cerca de madera vista desde un pasillo de vivienda.': 'Wood fence along a residential walkway.',
  'Cerca de madera junto a una puerta exterior.': 'Wood fence beside an exterior door.',
  'Persona vistiendo traje protector para trabajo con abejas.': 'Person wearing a protective suit for bee work.',
  'Cerca larga de madera entre dos edificaciones.': 'Long wood fence between two buildings.',
  'Detalle de mapache sostenido con cuidado.': 'Close view of a raccoon being held carefully.',
  'Cerca de madera doblando esquina junto a pared de ladrillo.': 'Wood fence turning a corner beside a brick wall.',
  'Primer plano de protección facial para apicultura.': 'Close view of protective beekeeping headwear.',
  'Primer plano de cerca de madera en el patio.': 'Close view of a wood fence in a yard.',
  'Persona junto a cerca nueva de madera con herramientas.': 'Person with tools beside a new wood fence.',
  'Construcción de cerca de madera junto a una casa.': 'Wood fence under construction beside a house.',
  'Cámara domo instalada en interior.': 'Dome camera installed indoors.',
  'Cámara de seguridad montada sobre puerta de garaje.': 'Security camera mounted above a garage door.',
  'Douglas usando traje protector para trabajo con abejas': 'Douglas wearing a protective suit for bee work',
};

const labels = {
  'Navegación principal': 'Main navigation',
  'Kingsland Services, inicio': 'Kingsland Services, home',
  'Abrir menú': 'Open menu',
  'Filtrar galería': 'Filter gallery',
  'Galería de trabajos': 'Project gallery',
  'Fotografías anteriores': 'Previous photos',
  'Siguientes fotografías': 'Next photos',
  'Seleccionar grupo de fotografías': 'Select photo group',
  'Fotografía ampliada': 'Enlarged photo',
  'Cerrar': 'Close',
  'Escribir a Kingsland Services por WhatsApp': 'Message Kingsland Services on WhatsApp',
};

const galleryLabels = {
  'Cerca de madera en patio lateral': 'Wood fence in a side yard',
  'Retiro de panal en interior': 'Indoor hive removal',
  'Trabajo con fauna silvestre': 'Wildlife project',
  'Cerca en patio abierto': 'Fence in an open yard',
  'Colonia de abejas en estructura': 'Bee colony in a structure',
  'cámara tipo bullet': 'bullet camera',
  'Atención de fauna pequeña': 'Small wildlife project',
  'Estructura de portón': 'Gate frame',
  'Panales entre vigas': 'Hives between beams',
  'Proyecto de cerca en vivienda': 'Residential fence project',
  'Acceso lateral con portón': 'Side access with gate',
  'Equipo de protección apícola': 'Protective beekeeping gear',
  'Cerramiento de tramo largo': 'Long fence section',
  'Manejo de mapache': 'Raccoon project',
  'Esquina y acabado de cerca': 'Fence corner and finish',
  'Protección para trabajo con abejas': 'Protective gear for bee work',
  'Detalle de cerca residencial': 'Residential fence detail',
  'Trabajo de cercado en patio': 'Yard fencing project',
  'Cerca junto a la vivienda': 'Fence beside a home',
  'cámara domo': 'dome camera',
  'cámara sobre garaje': 'camera above a garage',
};

html = html.replace(/\balt="([^"]*)"/g, (whole, value) => `alt="${imageAlts[value] ?? value}"`);
html = html.replace(/\baria-label="([^"]*)"/g, (whole, value) => {
  const gallery = value.startsWith('Ampliar: ');
  return `aria-label="${gallery ? `Enlarge: ${galleryLabels[value.slice(9)] ?? value.slice(9)}` : labels[value] ?? value}"`;
});
html = html.replace('title="Escríbenos por WhatsApp"', 'title="Message us on WhatsApp"');
html = html.replace('aria-roledescription="carrusel"', 'aria-roledescription="carousel"');
html = html.replace('Mostrando 6 de 22 fotografías', 'Showing 6 of 22 photos');
html = html.replaceAll('src="assets/', 'src="/assets/');
html = html.replace(/\sdata-(?:en|es)="[^"]*"/g, '');

const output = path.join(root, 'en', 'index.html');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(`Generated ${path.relative(root, output)} with ${translated} translated elements`);
