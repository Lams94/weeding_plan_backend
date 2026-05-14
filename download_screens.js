const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = 'C:/Users/SENS/.gemini/antigravity/brain/619bb307-b9c3-4555-b2dd-40f8943ea27c/.system_generated/steps/24/output.txt';
const exportDir = path.join(__dirname, 'stitch_exports');

if (!fs.existsSync(exportDir)){
    fs.mkdirSync(exportDir);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

data.screens.forEach(screen => {
    if (screen.htmlCode && screen.htmlCode.downloadUrl) {
        let ext = screen.htmlCode.mimeType === 'text/markdown' ? '.md' : '.html';
        let filename = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ext;
        let filepath = path.join(exportDir, filename);
        
        https.get(screen.htmlCode.downloadUrl, (res) => {
            let file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Downloaded: ' + filename);
            });
        }).on('error', (err) => {
            console.error('Error downloading ' + filename + ': ', err.message);
        });
    }
});
