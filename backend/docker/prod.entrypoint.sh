#!/bin/sh

# いずれかのコマンドが失敗すると、非0のステータスで終了する
set -e

# migration
npx prisma migrate deploy

# generate Prisma Client
npx prisma generate

# build
npm run build

# server start
node dist/src/main
