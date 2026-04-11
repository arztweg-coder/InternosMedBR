#!/bin/bash

# Corrigir todos os arquivos que usam /logo ou /favicon
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i 's|src="/logo-internosmed\.png"|src="./logo-internosmed.png"|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i 's|src="/favicon-192\.png"|src="./favicon-192.png"|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i 's|src="/favicon-512\.png"|src="./favicon-512.png"|g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i 's|href="/favicon\.ico"|href="./favicon.ico"|g' {} +

echo "Caminhos corrigidos!"
