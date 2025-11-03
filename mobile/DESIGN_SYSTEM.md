# 🎨 Ludi - Sistema de Design

## Paleta de Cores Moderna e Funcional

### 🎯 Princípios de Design

1. **Estimular curiosidade** sem sobrecarga sensorial
2. **Transmitir confiança** aos pais e responsáveis
3. **Manter legibilidade** e contraste adequado para telas pequenas
4. **Criar zonas de calma visual** para não cansar

---

## 🌈 Cores Principais

### 🔵 Azul Vibrante (Marca Principal)
**Uso**: Cor primária da marca, navegação, elementos principais

```
primary:       #4CA6FF  ████████  Botões principais, links, ícones ativos
primaryDark:   #3B8EE6  ████████  Estados hover/pressed
primaryLight:  #6FB8FF  ████████  Estados desabilitados suaves
primaryPastel: #B3D9FF  ████████  Fundos sutis, badges
```

**Significado**: Confiança, tecnologia, calma intelectual

---

### 🟠 Laranja Quente (CTA e Destaque)
**Uso**: Botões de ação, elementos que precisam chamar atenção

```
cta:        #FFA928  ████████  Botões de ação principal (Jogar, Começar)
ctaDark:    #E69420  ████████  Hover states
ctaLight:   #FFB84D  ████████  Light states
ctaPastel:  #FFD699  ████████  Hover sutis em cards
```

**Significado**: Energia, entusiasmo, diversão, motivação

---

### 🟣 Roxo Suave (Criatividade)
**Uso**: Elementos criativos, seções artísticas, atividades de desenho

```
secondary:       #A974FF  ████████  Zonas criativas, arte
secondaryDark:   #9460E6  ████████  Hover states
secondaryLight:  #BB8FFF  ████████  Light states
secondaryPastel: #D9BFFF  ████████  Fundos de zonas criativas
```

**Significado**: Imaginação, criatividade, curiosidade

---

### 🟢 Verde Menta (Sucesso e Progresso)
**Uso**: Feedback positivo, conquistas, progresso

```
success:      #7EDDA2  ████████  Mensagens de sucesso, checkmarks
successDark:  #6BC990  ████████  Hover/Active
successLight: #9FE6B8  ████████  Fundos suaves de sucesso
```

**Significado**: Crescimento, aprendizado, conquista

---

## 🎨 Cores Neutras e de Fundo

### Fundos
```
background:       #FFF8F1  ████████  Fundo geral (bege claro quente)
surface:          #FFFFFF  ████████  Cards e superfícies
surfaceElevated:  #FFFBF6  ████████  Superfícies elevadas
```

### Textos
```
text:          #3C3C3C  ████████  Texto principal (cinza escuro suave)
textSecondary: #6B6B6B  ████████  Texto secundário
textLight:     #9B9B9B  ████████  Texto desabilitado/hints
textInverse:   #FFFFFF  ████████  Texto em fundos escuros
```

### Bordas
```
border:       #E8E0D8  ████████  Bordas padrão (quente)
borderLight:  #F2EBE3  ████████  Bordas sutis
borderStrong: #D0C5B8  ████████  Bordas com mais destaque
```

---

## 🎪 Cores por Categoria de Jogo

```
abc (Alfabetização):  #FFB366  ████████  Laranja suave
numbers (Matemática): #7EDDA2  ████████  Verde menta
colorsCategory:       #FF9BB5  ████████  Rosa suave
shapes (Formas):      #8FA8FF  ████████  Azul suave
puzzles:              #B899FF  ████████  Roxo suave
drawing (Desenho):    #FFB366  ████████  Laranja suave
```

---

## 🔔 Cores de Feedback

```
success: #7EDDA2  ████████  Ações bem-sucedidas
error:   #FF7B7B  ████████  Erros suaves (não agressivos)
warning: #FFBB55  ████████  Avisos amigáveis
info:    #4CA6FF  ████████  Informações neutras
```

---

## 🌟 Gradientes Recomendados

### Gradiente Principal (Headers)
```css
linear-gradient(90deg, #4CA6FF 0%, #A974FF 100%)
/* Azul → Roxo: Tecnologia + Criatividade */
```

### Gradiente Quente (CTAs)
```css
linear-gradient(90deg, #FFA928 0%, #FF9BB5 100%)
/* Laranja → Rosa: Energia + Afetividade */
```

### Gradiente de Sucesso
```css
linear-gradient(90deg, #7EDDA2 0%, #4CA6FF 100%)
/* Verde → Azul: Crescimento + Confiança */
```

### Gradiente Criativo
```css
linear-gradient(90deg, #A974FF 0%, #FF9BB5 100%)
/* Roxo → Rosa: Imaginação + Afeto */
```

---

## 📐 Aplicações Práticas

### Botões

#### Botão Primário (Ação Principal)
```tsx
{
  backgroundColor: Colors.cta,        // #FFA928
  color: Colors.textInverse,          // #FFFFFF
  borderRadius: 12,
  padding: '12px 24px',
  // Hover:
  backgroundColor: Colors.ctaDark,    // #E69420
}
```

#### Botão Secundário
```tsx
{
  backgroundColor: Colors.surface,    // #FFFFFF
  color: Colors.primary,              // #4CA6FF
  border: `2px solid ${Colors.primary}`,
  borderRadius: 12,
  // Hover:
  backgroundColor: Colors.primaryPastel, // #B3D9FF
}
```

### Cards de Jogos
```tsx
{
  backgroundColor: Colors.surface,    // #FFFFFF
  borderRadius: 16,
  border: `2px solid ${Colors.borderLight}`, // #F2EBE3
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  // Hover:
  borderColor: Colors.primary,        // #4CA6FF
  boxShadow: '0 4px 12px rgba(76, 166, 255, 0.2)',
}
```

### Headers com Gradiente
```tsx
<LinearGradient
  colors={[Colors.primary, Colors.secondary]}  // #4CA6FF → #A974FF
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  {/* Content */}
</LinearGradient>
```

---

## ♿ Acessibilidade

### Contraste Mínimo (WCAG AA)
- **Texto normal**: 4.5:1
- **Texto grande**: 3:1
- **Elementos interativos**: 3:1

### Modo Alto Contraste
```
text:       #000000  ████████  Preto puro
background: #FFFFFF  ████████  Branco puro
primary:    #0066CC  ████████  Azul mais escuro
secondary:  #009900  ████████  Verde mais escuro
```

---

## 🎯 Zonas Visuais

### Zona de Ação (Chamar Atenção)
- Usar **laranja (CTA)** + gradientes quentes
- Cards com bordas coloridas
- Botões grandes com sombras

### Zona de Calma (Descanso Visual)
- Usar **bege claro (background)** + tons pastéis
- Menos contraste
- Espaçamento generoso

### Zona Criativa (Exploração)
- Usar **roxo + rosa** (gradiente criativo)
- Elementos divertidos e educativos
- Animações suaves

---

## 📱 Recomendações de Fonte

### Família Primária
**Nunito** ou **Poppins**
- Geométrica e amigável
- Boa legibilidade em pequenas telas
- Transmite modernidade e acolhimento

### Pesos Recomendados
- Regular (400): Corpo de texto
- SemiBold (600): Subtítulos
- Bold (700): Títulos e CTAs

### Tamanhos
```
Título principal:  28-32px
Subtítulo:         18-20px
Corpo:             14-16px
Caption:           12-14px
```

---

## 🚀 Próximos Passos

1. ✅ Paleta de cores definida
2. ⏳ Aplicar nos componentes principais
3. ⏳ Atualizar telas de onboarding
4. ⏳ Redesenhar cards de jogos
5. ⏳ Implementar gradientes em headers
6. ⏳ Testar contraste e acessibilidade
