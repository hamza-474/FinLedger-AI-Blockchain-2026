const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'finledger-frontend', 'src');

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && filepath.endsWith('.jsx')) {
      callback(filepath);
    }
  });
}

walkSync(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  
  // Replace JSX literal $ before {
  content = content.replace(/(>|\s)([+-]?)\$\{/g, '$1$2PKR ${');
  
  // EditTransactionModal.jsx specific
  content = content.replace(/value=\{`\$\$\{/g, 'value={`PKR ${');
  
  // StatCard.jsx specific
  content = content.replace(/isCurrency \? '\$' : ''/g, "isCurrency ? 'PKR ' : ''");
  
  // Labels
  content = content.replace(/Amount \(\$\)/g, 'Amount (PKR)');
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated', filepath);
  }
});
