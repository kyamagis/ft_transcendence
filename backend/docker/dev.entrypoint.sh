#!/bin/sh

export PATH="./node_modules/.bin:$PATH"

# migration
prisma migrate reset 
prisma migrate dev --preview-feature
prisma db seed

# backend start
npx nest start --watch
