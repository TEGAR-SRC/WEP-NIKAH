#!/bin/sh
npx prisma generate
npx tsx prisma/seed.ts
node server.js
