# 🚀 COMECE AQUI - Ludi

## ⚡ Início Rápido (5 minutos)

### Passo 1: Inicie o Docker Desktop
**IMPORTANTE**: Abra o Docker Desktop e aguarde estar totalmente iniciado antes de continuar.

### Passo 2: Execute o script de instalação

```bash
cd /Users/arnon/Public/GitHub/Ludi
./setup.sh
```

### Passo 3: Inicie o app mobile

```bash
cd mobile
npm start
```

Pronto! 🎉

---

## 📋 O que foi instalado?

### ✅ Backend (Laravel + MySQL + Redis)
- API rodando em: **http://localhost:8000**
- Banco de dados: **MySQL** (porta 3306)
- Cache: **Redis** (porta 6379)
- Todos os containers Docker configurados

### ✅ Mobile (React Native + Expo)
- Todas as dependências npm instaladas
- Configuração pronta para iOS/Android
- Pronto para `npm start`

---

## 🎯 Como usar agora

### Backend já está rodando!

Teste a API:
```bash
curl http://localhost:8000/api/health
```

Deve retornar:
```json
{"success":true,"data":{"status":"healthy"}}
```

### Inicie o Mobile

```bash
cd mobile
npm start
```

Você verá opções:
- Pressione `i` para iOS Simulator (Mac)
- Pressione `a` para Android Emulator
- Escaneie o QR code com Expo Go no seu celular

---

## 📱 Testando o App

### 1. Criar uma conta
- Abra o app mobile
- Clique em "Criar Conta"
- Digite email e senha
- Faça login

### 2. Criar perfil da criança
- Digite o nome da criança
- Escolha a faixa etária (1-2, 3-4, 5-6)
- Selecione um avatar
- Escolha interesses

### 3. Explorar jogos
- Veja os jogos disponíveis
- Clique em um jogo para jogar
- Ganhe estrelas completando atividades

---

## 🛠️ Comandos Úteis

### Backend

```bash
# Ver o que está rodando
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Reiniciar
docker-compose restart

# Acessar MySQL
docker-compose exec mysql mysql -u ludi -psecret ludi
```

### Mobile

```bash
cd mobile

# Iniciar
npm start

# Limpar cache (se tiver problemas)
npm start -- --clear

# iOS
npm run ios

# Android
npm run android
```

---

## 🔧 Resolução de Problemas

### Backend não responde?

```bash
# Reinicie os containers
docker-compose restart

# Veja os logs
docker-compose logs app
```

### Mobile não conecta na API?

Edite `mobile/.env`:

```bash
# Para Android Emulator
API_URL=http://10.0.2.2:8000/api

# Para dispositivo físico (use o IP da sua máquina)
API_URL=http://192.168.1.100:8000/api
```

Descubra seu IP:
```bash
# Mac/Linux
ifconfig | grep inet

# Windows
ipconfig
```

### Erro de porta já em uso?

Algo já está usando a porta 8000. Você pode:

1. Parar o que está usando: `lsof -ti:8000 | xargs kill`
2. Ou mudar a porta no `docker-compose.yml`

---

## 📚 Próximos Passos

### 1. Entenda o Projeto
- Leia `PROJECT_SUMMARY.md` - Status atual
- Leia `IMPLEMENTATION.md` - Especificação completa

### 2. Complete as Features
- Veja `BACKEND_COMPLETION.md` - O que falta no backend
- Veja `MOBILE_COMPLETION.md` - O que falta no mobile

### 3. Desenvolva
- Backend: Adicione controllers, services, seeders
- Mobile: Crie telas, componentes, jogos

---

## 📊 Status do Projeto

### O que funciona ✅
- Infraestrutura Docker completa
- Backend com autenticação
- API de perfis e progresso
- Mobile com navegação
- Login funcionando
- Internacionalização (pt-BR, en, es)
- Storage seguro

### O que falta implementar ⏳
- 4 controllers backend (Worksheet, Subscription, etc)
- Telas do mobile (home, jogos, worksheets, etc)
- 10+ componentes de jogos
- Painel dos pais
- Sistema de assinatura
- Testes

---

## 🎮 Arquitetura

```
Backend (Laravel)
├── MySQL - Banco de dados
├── Redis - Cache e filas
├── Nginx - Web server
└── PHP-FPM - Processa PHP

Mobile (React Native)
├── Expo - Framework
├── expo-router - Navegação
├── Zustand - State management
└── Axios - HTTP client
```

---

## 💡 Dicas de Desenvolvimento

### Backend
```bash
# Criar um controller
docker-compose exec app php artisan make:controller Api/WorksheetController

# Criar uma migration
docker-compose exec app php artisan make:migration create_worksheets_table

# Executar migrations
docker-compose exec app php artisan migrate

# Criar seeder
docker-compose exec app php artisan make:seeder ModuleSeeder

# Limpar cache
docker-compose exec app php artisan cache:clear
```

### Mobile
```bash
# Criar componente
mkdir -p mobile/components/games
touch mobile/components/games/ABCTracing.tsx

# Instalar pacote adicional
cd mobile
npm install nome-do-pacote

# Verificar tipos TypeScript
npm run type-check
```

---

## 🎨 Estrutura de Pastas

```
Ludi/
├── backend/           # Laravel API
│   ├── app/          # Models, Controllers, Services
│   ├── database/     # Migrations, Seeds
│   └── routes/       # Rotas da API
│
├── mobile/           # React Native App
│   ├── app/          # Telas (expo-router)
│   ├── components/   # Componentes reutilizáveis
│   ├── lib/          # API, stores, utils
│   └── constants/    # Cores, Config
│
├── infra/            # Docker
└── docs/             # Documentação
```

---

## 📖 Documentação Completa

1. **INSTALL.md** - Guia de instalação detalhado
2. **GETTING_STARTED.md** - Tutorial passo a passo
3. **IMPLEMENTATION.md** - Especificação de features
4. **BACKEND_COMPLETION.md** - Tarefas backend
5. **MOBILE_COMPLETION.md** - Tarefas mobile
6. **PROJECT_SUMMARY.md** - Visão geral completa

---

## ✨ Features Principais

- 🎮 10+ jogos educativos
- 📝 Sistema de worksheets imprimíveis
- 👶 Múltiplos perfis de crianças
- 📊 Painel dos pais com relatórios
- 💎 Sistema de assinatura Premium
- 🌐 Multilíngue (Português, Inglês, Espanhol)
- 📴 Modo offline
- 🔒 Controle parental
- ♿ Recursos de acessibilidade

---

## 🆘 Precisa de Ajuda?

### Logs

```bash
# Ver tudo
docker-compose logs -f

# Apenas do app
docker-compose logs -f app

# Apenas MySQL
docker-compose logs -f mysql
```

### Reiniciar do Zero

```bash
# Parar tudo
docker-compose down -v

# Executar setup novamente
./setup.sh
```

### Verificar Saúde dos Serviços

```bash
# Status dos containers
docker-compose ps

# Verificar API
curl http://localhost:8000/api/health

# Verificar MySQL
docker-compose exec mysql mysqladmin ping
```

---

## 🚀 Está tudo pronto!

A aplicação está **instalada e rodando**!

**Backend**: http://localhost:8000
**Mobile**: `cd mobile && npm start`

Boa codificação! 💻✨

---

**Dúvidas?** Leia os documentos na pasta raiz ou verifique os logs.
