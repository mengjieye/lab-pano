const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// 读取模板文件
const templatePath = path.join(__dirname, '../templates/lab-intro.html');
const template = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));

// 读取实验室数据
const labsDataPath = path.join(__dirname, '../data/labs.json');
const labsData = JSON.parse(fs.readFileSync(labsDataPath, 'utf8'));

// 生成简介页面的函数
function generateIntroPages() {
    // 遍历每个分类
    for (const [category, categoryData] of Object.entries(labsData)) {
        if (!categoryData.labs) continue;
        
        // 遍历分类下的每个实验室
        for (const lab of categoryData.labs) {
            if (!lab.id || !lab.path) {
                console.error('实验室数据缺少必要字段:', lab);
                continue;
            }

            // 计算返回路径
            const pathParts = lab.path.split('/');
            const backPath = '../'.repeat(pathParts.length);

            // 准备模板数据
            const templateData = {
                labName: lab.name,
                previewImage: 'preview.jpg',
                overview: lab.overview || lab.description || '该实验室配备有专业的实验设备，可进行相关实验研究。',
                features: lab.features || '提供专业的实验环境和设备支持，满足教学和科研需求。',
                equipment: lab.equipment || '该实验室配备有专业的实验设备，可进行相关实验研究。',
                safetyNotes: lab.safetyNotes || '请遵守实验室安全规范，确保实验安全。',
                backPath: backPath
            };

            // 生成HTML内容
            const introHtml = template(templateData);

            // 确保输出目录存在
            const outputDir = path.join(__dirname, '..', lab.path);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // 写入文件
            fs.writeFileSync(path.join(outputDir, 'intro.html'), introHtml);
        }
    }
    console.log('实验室简介页面生成完成！');
}

// 执行生成
generateIntroPages(); 