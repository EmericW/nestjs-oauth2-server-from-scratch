# Setup
**Use correct node environment**
```sh
nvm use
```
**Install dependencies**
```sh
yarn
```
**Prepare environment file**
```sh
cp .env.example .env
```
**Start database container**
```sh
docker-compose up -d
```
**run migrations**
```sh
npx prisma migrate dev
```

# Client registration
A client can be created via the cli.
```sh
yarn cli client:register -t confidential -r http://localhost:3001/oauth/code
```

Multiple redirect urls can be provided in a comma separated fashion.
```sh
yarn cli client:register -t test -r http://localhost:3001/oauth/code,http://localhost:3001/oauth/authorize
```

If successful, the command will output the client credentials.
The client identifier is a cuid and will always be 25 characters long.
```sh
{
  clientId: 'clctjqfmc00001zu99jkl2maa',
  clientSecret: '31e159f0f4a8869a0bf5807db31bd7cd5ad81d60'
}

```

#Start server
```sh
yarn start:dev
```