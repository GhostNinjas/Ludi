# 🎨 Desenhos para Colorir

Esta pasta contém os desenhos SVG para o jogo de coloração do Ludi.

## 📁 Arquivos

Cada desenho tem 2 arquivos:
- `*.svg` - Arquivo SVG original
- `*.json` - Paths processados prontos para usar

## ➕ Como adicionar novos desenhos

### 1. Baixe o SVG
De sites como:
- Freepik (procure "coloring pages svg")
- Vecteezy
- SVG Repo
- Flaticon

### 2. Salve nesta pasta
```bash
# Exemplo: assets/coloring/elephant.svg
```

### 3. Processe o SVG
```bash
node scripts/process-svg-transforms.js assets/coloring/elephant.svg 2>/dev/null > assets/coloring/elephant.json
```

**Nota:** Use `process-svg-transforms.js` que aplica corretamente as transformações do Freepik (Y-flip e translates)!

### 4. Adicione ao código

Edite `app/games/coloring.tsx`:

```typescript
// No topo do arquivo, adicione:
const elephantDrawing = require('@/assets/coloring/elephant.json');
elephantDrawing.name = '🐘 Elefante';

// No array DRAWINGS, adicione no início:
const DRAWINGS = [
  elephantDrawing,  // <-- adicione aqui
  owlDrawing,
  dogDrawing,
  // ... resto
];
```

### 5. Pronto! 🎉
Recarregue o app e o novo desenho estará disponível.

## 🎨 Desenhos Disponíveis

| Arquivo | Emoji | Nome | Partes |
|---------|-------|------|--------|
| panda.svg | 🐼 | Panda | 123 |
| owl.svg | 🦉 | Coruja | 10 |
| dog.svg | 🐶 | Cachorro | 9 |

## 💡 Dicas

### ✅ Bons desenhos para crianças:
- Linhas grossas e claras
- Formas definidas
- 5-15 partes coloríveis
- Estilo cartoon/desenho animado
- Animais, veículos, objetos simples

### ❌ Evite:
- Detalhes minúsculos demais
- Centenas de paths pequenos
- Gradientes ou sombras complexas
- Texturas ou padrões muito detalhados

## 🔧 Formato dos arquivos JSON

Cada JSON tem esta estrutura:

```json
{
  "id": "owl",
  "name": "🦉 Owl",
  "viewBox": "0 0 500 500",
  "parts": [
    {
      "id": "part-1",
      "path": "M 0 0 C ...",
      "name": "Parte 1"
    }
  ]
}
```

Você pode editar manualmente os nomes das partes em português antes de adicionar ao código!
