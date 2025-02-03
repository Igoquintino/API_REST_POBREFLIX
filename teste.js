import { readFileSync, writeFileSync } from "fs";

const collection = JSON.parse(readFileSync("API_REST_POBREFLIX.postman_collection.json", "utf8"));

let markdown = `# Documentação da API\n\n`;

collection.item.forEach((folder) => {
  markdown += `## ${folder.name}\n\n`;

  folder.item.forEach((route) => {
    markdown += `### ${route.name}\n`;
    markdown += `**Método:** \`${route.request.method}\`\n\n`;
    markdown += `**URL:** \`${route.request.url.raw}\`\n\n`;
    
    if (route.request.body) {
      markdown += `**Body:** \n\`\`\`json\n${JSON.stringify(route.request.body.raw, null, 2)}\n\`\`\`\n\n`;
    }
    
    if (route.response) {
      markdown += `**Exemplo de Resposta:** \n\`\`\`json\n${JSON.stringify(route.response[0]?.body || "{}", null, 2)}\n\`\`\`\n\n`;
    }
  });
});

writeFileSync("API_DOCS.md", markdown);
console.log("✅ Markdown gerado com sucesso!");
