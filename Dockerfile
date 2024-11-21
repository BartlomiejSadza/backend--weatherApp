# Użyj oficjalnego obrazu Node.js jako bazowego
FROM node:14

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj plik package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę plików aplikacji do katalogu roboczego
COPY . .

# Zainstaluj TypeScript globalnie
RUN npm install -g typescript

# Zainstaluj node-fetch globalnie
RUN npm install -g node-fetch

# Skompiluj TypeScript do JavaScript
RUN npm run build

# Otwórz port 3000
EXPOSE 3000

# Uruchom aplikację
CMD ["node", "dist/index.js"]