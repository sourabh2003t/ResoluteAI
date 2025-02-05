import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';

// Install these dependencies if you haven't already
// npm install --save-dev @iconify/tools @iconify/utils @iconify/json @iconify/iconify

import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from '@iconify/tools';
import { getIcons, getIconsCSS, stringToIcon } from '@iconify/utils';

const sources = {
  json: [
    // Dynamically importing the iconify JSON file
    import('@iconify/json/json/ri.json').then(module => module.default),

    // Custom file with only a few icons
    {
      filename: import('@iconify/json/json/line-md.json').then(module => module.default),
      icons: ['home-twotone-alt', 'github', 'document-list', 'document-code', 'image-twotone'],
    },
  ],
  icons: [
    'bx-basket',
    'bi-airplane-engines',
    'tabler-anchor',
    'uit-adobe-alt',
    'twemoji-auto-rickshaw',
  ],
  svg: [],
};

const target = join(__dirname, 'generated-icons.css');

(async function () {
  // Create directory for output if missing
  const dir = dirname(target);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error('Directory creation failed', err);
  }

  const allIcons = [];

  /**
   * Convert sources.icons to sources.json
   */
  if (sources.icons) {
    const sourcesJSON = sources.json ? sources.json : (sources.json = []);
    const organizedList = organizeIconsList(sources.icons);

    for (const prefix in organizedList) {
      const filename = await import(`@iconify/json/json/${prefix}.json`).then(module => module.default);

      sourcesJSON.push({
        filename,
        icons: organizedList[prefix],
      });
    }
  }

  /**
   * Bundle JSON files and collect icons
   */
  if (sources.json) {
    for (let i = 0; i < sources.json.length; i++) {
      const item = sources.json[i];
      const filename = typeof item === 'string' ? item : await item.filename;
      const content = JSON.parse(await fs.readFile(filename, 'utf8'));

      // Filter icons
      if (typeof item !== 'string' && item.icons?.length) {
        const filteredContent = getIcons(content, item.icons);
        if (!filteredContent) throw new Error(`Cannot find required icons in ${filename}`);
        allIcons.push(filteredContent);
      } else {
        allIcons.push(content);
      }
    }
  }

  /**
   * Bundle custom SVG icons and collect icons
   */
  if (sources.svg) {
    for (let i = 0; i < sources.svg.length; i++) {
      const source = sources.svg[i];

      // Import icons
      const iconSet = await importDirectory(source.dir, { prefix: source.prefix });

      // Validate, clean up, fix palette, etc.
      await iconSet.forEach(async (name, type) => {
        if (type !== 'icon') return;

        // Get SVG instance for parsing
        const svg = iconSet.toSVG(name);
        if (!svg) {
          iconSet.remove(name);
          return;
        }

        // Clean up and optimise icons
        try {
          await cleanupSVG(svg);

          if (source.monotone) {
            await parseColors(svg, {
              defaultColor: 'currentColor',
              callback: (attr, colorStr, color) => {
                return !color || isEmptyColor(color) ? colorStr : 'currentColor';
              },
            });
          }

          // Optimise
          await runSVGO(svg);
        } catch (err) {
          console.error(`Error parsing ${name} from ${source.dir}:`, err);
          iconSet.remove(name);
          return;
        }

        iconSet.fromSVG(name, svg);
      });

      allIcons.push(iconSet.export());
    }
  }

  // Generate CSS from collected icons
  const cssContent = allIcons
    .map((iconSet) => getIconsCSS(iconSet, Object.keys(iconSet.icons), { iconSelector: '.{prefix}-{name}' }))
    .join('\n');

  // Save the CSS to a file
  await fs.writeFile(target, cssContent, 'utf8');
  console.log(`Saved CSS to ${target}!`);
})().catch((err) => {
  console.error(err);
});

/**
 * Sort icon names by prefix
 */
function organizeIconsList(icons) {
  const sorted = Object.create(null);

  icons.forEach((icon) => {
    const item = stringToIcon(icon);
    if (!item) return;
    const prefix = item.prefix;
    const prefixList = sorted[prefix] ? sorted[prefix] : (sorted[prefix] = []);
    const name = item.name;
    if (!prefixList.includes(name)) prefixList.push(name);
  });

  return sorted;
}
