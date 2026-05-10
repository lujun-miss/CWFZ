const fs = require('fs');
const path = require('path');

// 从 template 文件读取导航内容
const navigationTemplate = fs.readFileSync('navigation-template.txt', 'utf-8');

// 获取当前目录下所有的 html 文件
const cwd = process.cwd();
const filesToFix = fs.readdirSync(cwd).filter(f => f.endsWith('.html'));

filesToFix.forEach(fileName => {
    // 排除 caliber-rules.html 自身，因为它通过脚本动态加载
    if (fileName === 'caliber-rules.html') return;
    
    const filePath = path.join(cwd, fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        const navStart = content.indexOf('<!-- 导航菜单 -->');
        if (navStart !== -1) {
            const navEnd = content.indexOf('</nav>', navStart);
            if (navEnd !== -1) {
                const endTagEnd = navEnd + '</nav>'.length;
                const newContent = content.substring(0, navStart) + navigationTemplate + content.substring(endTagEnd);
                fs.writeFileSync(filePath, newContent, 'utf-8');
                console.log(`Fixed: ${fileName}`);
            } else {
                console.log(`Warning: Could not find </nav> in ${fileName}`);
            }
        } else {
            // console.log(`Warning: Could not find <!-- 导航菜单 --> in ${fileName}`);
        }
    } else {
        console.log(`Warning: File not found: ${fileName}`);
    }
});

console.log('Done!');
