import fs from 'fs';

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix SvgToPng & VideoToGif
    content = content.replace('{/* eslint-disable-next-line @next/next/no-img-element */}', '<>{/* eslint-disable-next-line @next/next/no-img-element */}');
    content = content.replace('className="max-w-full max-h-full object-contain p-4" />', 'className="max-w-full max-h-full object-contain p-4" /></>');
    content = content.replace('className="max-w-full max-h-full object-contain" />', 'className="max-w-full max-h-full object-contain" /></>');

    fs.writeFileSync(filePath, content);
}

fixFile('src/app/tools/svg-to-png/SvgToPngClient.tsx');
fixFile('src/app/tools/video-to-gif/VideoToGifClient.tsx');
console.log('Fixed');
