# Prompt para Gerar Letras SVG com Strokes Separados

Use este prompt em Claude ou ChatGPT para gerar as letras. Cole o prompt abaixo em uma nova conversa:

---

Preciso que você gere letras do alfabeto (A-Z maiúsculas e a-z minúsculas) em formato SVG com strokes separados para um aplicativo educacional de traçar letras para crianças.

**Requisitos importantes:**

1. **Canvas**: 400x400 pixels com padding de 40px em todos os lados (área útil: 320x320)

2. **Formato de saída**: JSON com a seguinte estrutura:
```json
{
  "A": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M x1 y1 L x2 y2",
        "description": "Left diagonal"
      },
      {
        "path": "M x1 y1 L x2 y2",
        "description": "Right diagonal"
      }
    ]
  }
}
```

3. **Ordem dos strokes**: Deve seguir a ordem educacional correta que crianças aprendem. Por exemplo:
   - **A maiúscula**: 3 strokes (diagonal esquerda de cima para baixo, diagonal direita de cima para baixo, barra horizontal da esquerda para direita)
   - **B maiúscula**: 3 strokes (linha vertical de cima para baixo, semicírculo superior, semicírculo inferior)
   - **a minúscula**: 2 strokes (círculo no sentido anti-horário começando do topo direito, linha vertical para baixo)

4. **Estilo visual**:
   - Maiúsculas: Letra bastão simples, geométrica, com linhas claras
   - Minúsculas: **MUITO IMPORTANTE** - Estilo de caligrafia que crianças aprendem na escola, com formas arredondadas e naturais. NÃO usar curvas artificiais ou geométricas. As letras devem parecer escritas à mão de forma clara e legível.
   - Proporções balanceadas e profissionais
   - Para minúsculas, usar curvas suaves e naturais que imitam a escrita manual
   - Evitar formas muito circulares ou perfeitas demais - prefira formas orgânicas

5. **Comandos SVG permitidos**:
   - M (moveTo)
   - L (lineTo)
   - Q (quadratic Bezier) - para curvas suaves
   - C (cubic Bezier) - apenas quando absolutamente necessário
   - Evitar arcos (A) - são complexos demais

6. **Qualidade**:
   - Letras devem ser bonitas e profissionais
   - Proporções adequadas para crianças aprenderem
   - Espaçamento consistente
   - Curvas suaves e naturais

**Comece gerando apenas as letras A-J (maiúsculas e minúsculas) primeiro. Para cada letra:**
- Indique quantos strokes ela tem
- Descreva brevemente cada stroke
- Forneça o SVG path completo

**Exemplo de saída esperada para a letra A:**

```json
{
  "A": {
    "type": "uppercase",
    "strokes": [
      {
        "path": "M 200 40 L 40 360",
        "description": "Left diagonal stroke from top to bottom-left"
      },
      {
        "path": "M 200 40 L 360 360",
        "description": "Right diagonal stroke from top to bottom-right"
      },
      {
        "path": "M 110 216 L 290 216",
        "description": "Horizontal crossbar from left to right"
      }
    ]
  }
}
```

**IMPORTANTE para letras minúsculas:**
- O "a" deve ser um círculo/oval natural com uma linha reta à direita (não usar curvas artificiais)
- O "c" deve ser uma curva em C natural, como se escrito à mão
- O "e" deve ter uma linha horizontal que vira uma curva suave
- Todas as curvas devem parecer escritas à mão, não geométricas

**Exemplo de "c" minúscula CORRETO:**
```json
{
  "c": {
    "type": "lowercase",
    "strokes": [
      {
        "path": "M 280 220 Q 280 180 240 180 Q 180 180 160 220 Q 160 280 180 300 Q 220 320 260 300",
        "description": "Curved stroke like handwritten C"
      }
    ]
  }
}
```

Por favor, gere as letras A, B, C, D, E, F, G, H, I, J em versão maiúscula e minúscula seguindo exatamente este formato.

**LEMBRE-SE**: As minúsculas devem parecer letras de caligrafia escolar, escritas à mão de forma clara, NÃO formas geométricas perfeitas!

---

## Instruções de uso:

1. Copie TODO o texto acima (do "Preciso que você gere..." até "...maiúscula e minúscula seguindo exatamente este formato.")
2. Cole em uma nova conversa com Claude (https://claude.ai) ou ChatGPT (https://chat.openai.com)
3. A IA vai gerar o JSON completo
4. Copie o JSON gerado
5. Salve em: `/Users/arnon/Public/GitHub/Ludi/mobile/app/data/letter-strokes.json`
6. Teste no navegador em http://localhost:19006
