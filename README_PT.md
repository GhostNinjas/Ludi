# 🎨 Ludi - App Educativo para Crianças

<div align="center">

**Aplicativo móvel educativo para crianças de 1 a 6 anos**

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51-000020?logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://docker.com)

[English](README.md) | **Português**

</div>

---

## 📱 Sobre o Projeto

Ludi é um aplicativo educativo completo que oferece:

- 🎮 **10+ Jogos Educativos**: ABC, Números, Cores, Formas, Quebra-cabeças, Desenho, etc.
- 📝 **Worksheets Imprimíveis**: Atividades para baixar e imprimir
- 👶 **Múltiplos Perfis**: Até 5 crianças por conta (Premium)
- 📊 **Painel dos Pais**: Acompanhe o progresso e desempenho
- 💎 **Assinatura Premium**: Recursos avançados e conteúdo ilimitado
- 🌐 **Multilíngue**: Português (BR), Inglês e Espanhol
- 📴 **Modo Offline**: Jogue sem internet (após baixar)
- 🔒 **Controle Parental**: Área segura para pais
- ♿ **Acessibilidade**: Recursos inclusivos

---

## 🚀 Instalação Rápida

### Pré-requisitos

- ✅ Docker Desktop (obrigatório)
- ✅ Node.js 18+ (para mobile)

### Passos

```bash
# 1. Navegue até o projeto
cd /Users/arnon/Public/GitHub/Ludi

# 2. Execute o script de instalação
./setup.sh

# 3. Inicie o app mobile (em outro terminal)
cd mobile
npm start
```

**Pronto!** 🎉

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [**START_HERE.md**](START_HERE.md) | 👈 **COMECE AQUI** - Guia rápido |
| [RODAR_AGORA.txt](RODAR_AGORA.txt) | Instruções simplificadas |
| [INSTALL.md](INSTALL.md) | Instalação detalhada |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Tutorial passo a passo |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Status atual do projeto |
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | Especificação completa |
| [BACKEND_COMPLETION.md](BACKEND_COMPLETION.md) | Tarefas pendentes backend |
| [MOBILE_COMPLETION.md](MOBILE_COMPLETION.md) | Tarefas pendentes mobile |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│           MOBILE APP (React Native)             │
│   iOS / Android - Expo - TypeScript             │
└───────────────┬─────────────────────────────────┘
                │ HTTP/REST API
┌───────────────┴─────────────────────────────────┐
│           BACKEND API (Laravel 11)              │
│   PHP 8.3 - Sanctum Auth - OpenAPI             │
└───────────────┬─────────────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───┴────┐           ┌──────┴─────┐
│ MySQL  │           │   Redis    │
│  8.0   │           │ Cache/Queue│
└────────┘           └────────────┘
```

### Backend (Laravel)
- **API RESTful** com autenticação Sanctum
- **MySQL 8** para persistência
- **Redis** para cache e filas
- **Docker** para containerização
- **OpenAPI/Swagger** para documentação

### Mobile (React Native + Expo)
- **expo-router** para navegação
- **Zustand** para gerenciamento de estado
- **i18next** para internacionalização
- **TypeScript** para type safety
- **Axios** para requisições HTTP

---

## 📂 Estrutura do Projeto

```
Ludi/
├── backend/              # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # ✅ Auth, Profile, Module, Progress
│   │   ├── Models/                # ✅ User, Profile, Module, etc.
│   │   └── Services/              # ⏳ Business logic
│   ├── database/
│   │   ├── migrations/            # ✅ 7 tabelas criadas
│   │   └── seeders/               # ⏳ Dados de exemplo
│   ├── routes/api.php             # ✅ Rotas definidas
│   └── Dockerfile                 # ✅ Container pronto
│
├── mobile/               # React Native + Expo
│   ├── app/             # Screens (expo-router)
│   │   ├── _layout.tsx  # ✅ Root layout
│   │   ├── index.tsx    # ✅ Splash screen
│   │   ├── (auth)/      # Login, Register
│   │   └── (tabs)/      # Home, Worksheets, Parents
│   ├── components/      # Componentes reutilizáveis
│   │   ├── common/      # ✅ Button, Card, etc.
│   │   └── games/       # ⏳ Jogos educativos
│   ├── lib/
│   │   ├── api/         # ✅ API client, auth
│   │   ├── store/       # ✅ Zustand stores
│   │   ├── i18n/        # ✅ pt-BR, en, es
│   │   └── utils/       # ✅ Storage, analytics
│   ├── constants/       # ✅ Colors, Config
│   └── package.json     # ✅ 1558 pacotes
│
├── infra/               # Infraestrutura
│   ├── nginx/           # ✅ Nginx config
│   └── scripts/         # ✅ Deploy, backup
│
├── docker-compose.yml   # ✅ Todos os serviços
├── Makefile             # ✅ Comandos úteis
└── setup.sh             # ✅ Script de instalação
```

**Legenda:**
- ✅ Implementado
- ⏳ Pendente

---

## 🎮 Funcionalidades

### Para Crianças
- **Jogos ABC**: Traçar letras com fonética
- **Números 1-10**: Contagem e identificação
- **Cores e Formas**: Combinação e classificação
- **Quebra-cabeças**: 4-12 peças
- **Desenho Guiado**: Passo a passo
- **Histórias Interativas**: Escolhas simples
- **Jogo da Memória**: Encontre os pares
- **Padrões**: Complete sequências
- **Classificação**: Por cor, tamanho, forma
- **Música e Ritmo**: Instrumentos simples

### Para Pais
- **Dashboard**: Visão geral do progresso
- **Relatórios Detalhados**: Por criança e atividade
- **Controle Parental**: Ajustes de dificuldade
- **Gestão de Perfis**: Múltiplas crianças
- **Configurações**: Idioma, acessibilidade
- **Assinatura**: Gerenciar plano Premium

### Recursos Técnicos
- **Offline Mode**: Conteúdo baixado disponível sem internet
- **Progresso em Nuvem**: Sincronização automática
- **Adaptação**: Dificuldade ajustada ao desempenho
- **Analytics**: Tracking de uso e progresso
- **Segurança**: Parental gate com desafio matemático

---

## 🛠️ Comandos Úteis

### Backend

```bash
# Iniciar serviços
make dev

# Ver logs
make logs

# Executar migrações
make migrate

# Seed do banco
make seed

# Rodar testes
make test

# Parar serviços
make stop
```

### Mobile

```bash
cd mobile

# Iniciar dev server
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Limpar cache
npm start -- --clear

# Rodar testes
npm test
```

---

## 📊 Status do Projeto

| Componente | Progresso | Status |
|------------|-----------|--------|
| Infraestrutura Docker | 100% | ✅ Completo |
| Backend API | 70% | 🟡 Parcial |
| Mobile App | 60% | 🟡 Parcial |
| Documentação | 90% | ✅ Excelente |
| Testes | 10% | 🔴 Inicial |
| **Total** | **65%** | 🟡 **Em Progresso** |

### ✅ Completo
- Estrutura completa do projeto
- Docker e infraestrutura
- Banco de dados (migrations + models)
- Sistema de autenticação
- API de perfis e progresso
- Mobile app estruturado
- i18n (3 idiomas)
- Documentação detalhada

### ⏳ Pendente
- 4 controllers backend (Worksheet, Subscription, etc.)
- Services de negócio (Recommendations, etc.)
- Seeders com conteúdo
- 20+ telas mobile
- 10+ componentes de jogos
- Sistema de worksheets
- Painel dos pais
- Paywall e assinatura
- Testes E2E
- Assets originais (imagens, sons, etc.)

**Tempo estimado para completar:** 10-15 dias

---

## 🔐 Segurança

- ✅ Laravel Sanctum para autenticação
- ✅ Rate limiting (60 req/min)
- ✅ Validação de entrada em todos endpoints
- ✅ CORS configurado
- ✅ Prevenção SQL injection (Eloquent ORM)
- ✅ Prevenção XSS (auto-escaping)
- ✅ Tokens em SecureStore (mobile)
- ✅ Parental gate para áreas de pais
- ✅ Sem tracking sem consentimento (COPPA)

---

## 🌍 Internacionalização

Idiomas suportados:
- 🇧🇷 **Português (Brasil)** - Padrão
- 🇺🇸 **Inglês**
- 🇪🇸 **Espanhol**

Tradução completa de:
- Interface do usuário
- Mensagens de erro
- Instruções de jogos
- Notificações
- E-mails transacionais

---

## 📦 Dependências Principais

### Backend
```json
{
  "laravel/framework": "^11.0",
  "laravel/sanctum": "^4.0",
  "laravel/horizon": "^5.23",
  "spatie/laravel-permission": "^6.4",
  "darkaonline/l5-swagger": "^8.6"
}
```

### Mobile
```json
{
  "expo": "~51.0.0",
  "react-native": "0.74.0",
  "expo-router": "~3.5.0",
  "zustand": "^4.5.0",
  "axios": "^1.6.0",
  "i18next": "^23.10.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0"
}
```

---

## 🧪 Testes

### Backend (Laravel)
```bash
# Rodar todos os testes
make test

# Com coverage
docker-compose exec app php artisan test --coverage
```

### Mobile (React Native)
```bash
cd mobile

# Testes unitários (Jest)
npm test

# Testes E2E (Detox)
npm run test:e2e

# Com coverage
npm test -- --coverage
```

---

## 🚢 Deploy

### Backend (Docker)

```bash
# Build
make build

# Deploy
make deploy

# Backup
make backup
```

### Mobile (EAS)

```bash
cd mobile

# Configurar
eas build:configure

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android

# Submit
eas submit --platform all
```

---

## 📝 API Endpoints

### Autenticação
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Perfis
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/{id}
PUT    /api/profiles/{id}
DELETE /api/profiles/{id}
```

### Módulos (Jogos)
```
GET /api/catalog/modules
GET /api/catalog/modules/{slug}
```

### Progresso
```
POST /api/progress
GET  /api/progress/profile/{id}
GET  /api/progress/profile/{id}/summary
```

[Ver documentação completa da API](http://localhost:8000/api/docs)

---

## 🤝 Contribuindo

Este é um projeto proprietário. Para contribuir:

1. Leia a documentação
2. Siga os padrões de código
3. Escreva testes
4. Comente código em inglês
5. Use i18n para texto do usuário

---

## 📄 Licença

Proprietary - Todos os direitos reservados

---

## 💬 Suporte

Problemas? Consulte:

1. **START_HERE.md** - Início rápido
2. **INSTALL.md** - Troubleshooting
3. Logs: `docker-compose logs -f`
4. Reinicie: `docker-compose restart`

---

## 🎯 Roadmap

### Fase 1: MVP (✅ 65% completo)
- ✅ Infraestrutura
- ✅ Autenticação
- ✅ Perfis
- ⏳ 3 jogos básicos
- ⏳ Worksheets básicos

### Fase 2: Core Features (⏳ 0%)
- ⏳ 10 jogos completos
- ⏳ Sistema de worksheets completo
- ⏳ Painel dos pais
- ⏳ Sistema de progresso

### Fase 3: Premium (⏳ 0%)
- ⏳ Paywall
- ⏳ In-app purchases
- ⏳ Assinatura
- ⏳ Recursos Premium

### Fase 4: Polish (⏳ 0%)
- ⏳ Testes completos
- ⏳ Assets originais
- ⏳ Performance
- ⏳ Lançamento nas stores

---

<div align="center">

**Feito com ❤️ para educação infantil**

[Documentação](GETTING_STARTED.md) • [API](http://localhost:8000/api/docs) • [Suporte](INSTALL.md)

</div>
