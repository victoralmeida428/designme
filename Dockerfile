# Usa uma imagem leve do Node (LTS)
FROM node:20-alpine

# Instala dependências do sistema necessárias para algumas libs (opcional, mas recomendado)
RUN apk add --no-cache libc6-compat

# Define o diretório de trabalho
WORKDIR /opt/designme

# Copia apenas os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package.json package-lock.json* ./



# Copia o restante do código
COPY . .

# Expõe a porta do Next.js
EXPOSE 3000

# Comando padrão de desenvolvimento
CMD ["npm", "run", "dev"]