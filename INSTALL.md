# Instalação do Ludi

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Docker Desktop** (obrigatório)
   - Download: https://www.docker.com/products/docker-desktop
   - Inicie o Docker Desktop antes de prosseguir

2. **Node.js 18+** (para o mobile)
   - Download: https://nodejs.org
   - Verifique: `node --version`

3. **Git** (opcional, mas recomendado)
   - Download: https://git-scm.com

## Instalação Rápida

### Opção 1: Script Automático (Recomendado)

Execute o script de instalação que configura tudo automaticamente:

```bash
cd /Users/arnon/Public/GitHub/Ludi
./setup.sh
```

Este script irá:
- ✅ Verificar se o Docker está rodando
- ✅ Instalar dependências do backend (Composer)
- ✅ Gerar chave de aplicação Laravel
- ✅ Iniciar containers Docker (MySQL, Redis, PHP-FPM, Nginx)
- ✅ Executar migrações do banco de dados
- ✅ Instalar dependências do mobile (npm)
- ✅ Configurar arquivos de ambiente

### Opção 2: Instalação Manual

Se preferir fazer passo a passo:

#### 1. Backend

```bash
cd backend

# Instalar dependências PHP com Docker
docker run --rm -v $(pwd):/app composer:latest install --ignore-platform-reqs

# Gerar chave da aplicação
# Edite o arquivo .env e substitua APP_KEY=base64:GENERATE_THIS_KEY
# por uma chave aleatória base64

# Voltar para raiz do projeto
cd ..

# Iniciar serviços Docker
docker-compose up -d

# Aguardar serviços ficarem prontos (~30 segundos)
sleep 30

# Executar migrações
docker-compose exec app php artisan migrate
```

#### 2. Mobile

```bash
cd mobile

# Instalar dependências
npm install

# Já está configurado! O arquivo .env foi criado
```

## Verificar Instalação

### Backend está funcionando?

```bash
# Verificar status dos containers
docker-compose ps

# Testar API
curl http://localhost:8000/api/health

# Deve retornar: {"success":true,"data":{"status":"healthy",...}}
```

### Mobile está pronto?

```bash
cd mobile

# Iniciar desenvolvimento
npm start

# Você verá um QR code e opções para abrir no iOS/Android
```

## Estrutura dos Serviços

Após a instalação, você terá:

| Serviço | Porta | URL | Credenciais |
|---------|-------|-----|-------------|
| API Backend | 8000 | http://localhost:8000 | - |
| MySQL | 3306 | localhost:3306 | user: ludi, password: secret |
| Redis | 6379 | localhost:6379 | - |

## Comandos Úteis

### Backend

```bash
# Iniciar serviços
make dev
# ou
docker-compose up -d

# Parar serviços
make stop
# ou
docker-compose down

# Ver logs
make logs
# ou
docker-compose logs -f

# Executar migrações
make migrate
# ou
docker-compose exec app php artisan migrate

# Seed do banco (dados de exemplo)
make seed
# ou
docker-compose exec app php artisan db:seed

# Acessar MySQL
make mysql
# ou
docker-compose exec mysql mysql -u ludi -psecret ludi

# Limpar cache
make clear-cache
# ou
docker-compose exec app php artisan cache:clear

# Rodar testes
make test
# ou
docker-compose exec app php artisan test
```

### Mobile

```bash
cd mobile

# Iniciar servidor de desenvolvimento
npm start

# Abrir no iOS Simulator (Mac)
npm run ios

# Abrir no Android Emulator
npm run android

# Rodar testes
npm test

# Verificar TypeScript
npm run type-check

# Limpar cache
npm start -- --clear
```

## Problemas Comuns

### 1. Docker não está rodando

**Erro**: `Cannot connect to the Docker daemon`

**Solução**: Inicie o Docker Desktop e aguarde estar completamente carregado.

### 2. Porta já em uso

**Erro**: `Port 8000 is already in use`

**Solução**: Pare o serviço que está usando a porta ou altere no `docker-compose.yml`:
```yaml
nginx:
  ports:
    - "8080:80"  # Muda de 8000 para 8080
```

### 3. Erro de permissão no backend

**Erro**: `Permission denied` em storage/

**Solução**:
```bash
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### 4. Erro de conexão MySQL

**Erro**: `Connection refused` ao conectar no MySQL

**Solução**: Aguarde mais tempo para o MySQL inicializar:
```bash
docker-compose restart mysql
sleep 20
docker-compose exec app php artisan migrate
```

### 5. Mobile não conecta na API

**Problema**: App mobile não consegue acessar http://localhost:8000

**Solução**:
- **iOS Simulator**: Use `http://localhost:8000/api`
- **Android Emulator**: Use `http://10.0.2.2:8000/api`
- **Dispositivo físico**: Use o IP da sua máquina, ex: `http://192.168.1.100:8000/api`

Edite `mobile/.env`:
```bash
API_URL=http://10.0.2.2:8000/api  # Para Android
# ou
API_URL=http://192.168.1.100:8000/api  # Para dispositivo físico (use seu IP)
```

### 6. Erro ao instalar dependências do mobile

**Erro**: `npm ERR!` durante `npm install`

**Solução**:
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### 7. Metro bundler cache issues

**Erro**: Erros estranhos no Metro bundler

**Solução**:
```bash
cd mobile
npm start -- --clear
# ou
rm -rf node_modules/.cache
```

## Populando com Dados de Exemplo

Após a instalação, você pode popular o banco com dados de exemplo:

```bash
# Criar seeders (você precisará implementar)
make seed

# Ou manualmente via artisan
docker-compose exec app php artisan db:seed
```

## Próximos Passos

1. ✅ Instalação completa
2. 📖 Leia `GETTING_STARTED.md` para entender o projeto
3. 🎮 Teste a API: http://localhost:8000/api/health
4. 📱 Inicie o mobile: `cd mobile && npm start`
5. 👨‍💻 Comece a desenvolver!

## Desenvolvimento

### Fluxo de Trabalho Recomendado

1. **Backend**: Trabalhe nas APIs primeiro
   - Crie/edite controllers em `backend/app/Http/Controllers/Api/`
   - Adicione rotas em `backend/routes/api.php`
   - Teste com Postman ou curl

2. **Mobile**: Depois integre no app
   - Crie telas em `mobile/app/`
   - Use os hooks e stores em `mobile/lib/`
   - Teste no simulador

### Hot Reload

- **Backend**: Mudanças em PHP são refletidas automaticamente
- **Mobile**: Metro bundler recarrega automaticamente ao salvar arquivos

### Debugging

**Backend**:
```bash
# Ver logs em tempo real
docker-compose logs -f app

# Acessar container
docker-compose exec app bash

# Executar comandos artisan
docker-compose exec app php artisan tinker
```

**Mobile**:
- Use React DevTools
- Veja console logs no terminal onde rodou `npm start`
- Use `console.log()` liberalmente

## Documentação Adicional

- `README.md` - Visão geral do projeto
- `GETTING_STARTED.md` - Guia passo a passo
- `IMPLEMENTATION.md` - Especificação completa de features
- `BACKEND_COMPLETION.md` - Tarefas pendentes backend
- `MOBILE_COMPLETION.md` - Tarefas pendentes mobile
- `PROJECT_SUMMARY.md` - Status do projeto

## Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs`
2. Leia a documentação acima
3. Verifique os issues conhecidos
4. Reinicie os serviços: `docker-compose restart`

---

**Boa sorte com o desenvolvimento! 🚀**
