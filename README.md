### 1. Поднять базу данных через Docker

````bash
docker-compose up -d
````
### 2. Установить зависимости

```bash
npm install
```
### 3. Применить миграции или включить синхронизацию в app.module.ts
```bash
npm run migration:run
```
```typescript
synchronize: true
```
### 4. Запустить проект
```bash
npm run start:dev
````
