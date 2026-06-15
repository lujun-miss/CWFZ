const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const filesToFix = fs.readdirSync(cwd).filter(f => f.endsWith('.html'));

const oldUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80';
const newPlaceholder = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff';

filesToFix.forEach(fileName => {
    const filePath = path.join(cwd, fileName);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes(oldUrl)) {
            const newContent = content.split(oldUrl).join(newPlaceholder);
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log(`Fixed image in: ${fileName}`);
        }
    }
});

console.log('Image fix complete!');
