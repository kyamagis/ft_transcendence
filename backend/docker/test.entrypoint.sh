#!/bin/sh

# いずれかのコマンドが失敗すると、非0のステータスで終了する
set -e

export PATH="./node_modules/.bin:$PATH"

# migration
npx prisma migrate deploy

# generate Prisma Client
npx prisma generate

# seeding
npx prisma db seed

# build
npm run build

# unit test
env-cmd -f ./.env/.env.test jest
