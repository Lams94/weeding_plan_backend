const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'stitch_exports');
const outputDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(inputDir, file), 'utf8');
        
        // Extract body content
        let bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        let bodyContent = bodyMatch ? bodyMatch[1] : content;
        
        // Basic HTML to JSX conversions
        let jsxContent = bodyContent
            .replace(/class=/g, 'className=')
            .replace(/for=/g, 'htmlFor=')
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/<img([^>]*[^/])>/g, '<img$1 />')
            .replace(/<input([^>]*[^/])>/g, '<input$1 />')
            .replace(/<br([^>]*[^/])>/g, '<br$1 />')
            .replace(/<hr([^>]*[^/])>/g, '<hr$1 />')
            .replace(/style="([^"]*)"/g, (match, p1) => {
                // VERY basic style to object conversion, handles font-variation-settings
                let styleObj = {};
                p1.split(';').forEach(rule => {
                    let parts = rule.split(':');
                    if(parts.length === 2) {
                        let key = parts[0].trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                        styleObj[key] = parts[1].trim().replace(/'/g, '"');
                    }
                });
                return `style={{ ${Object.keys(styleObj).map(k => `${k}: '${styleObj[k]}'`).join(', ')} }}`;
            });

        let componentName = file.replace('.html', '').split('_')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
            
        // clean component name
        componentName = componentName.replace(/[^a-zA-Z0-9]/g, '');

        let finalJsx = `import React from 'react';

export default function ${componentName}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
        fs.writeFileSync(path.join(outputDir, `${componentName}.jsx`), finalJsx);
        console.log(`Converted ${file} to ${componentName}.jsx`);
    }
});
