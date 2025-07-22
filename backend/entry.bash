#!/bin/bash

echo $DATABASE_URL

bun run db:migrate
bun run start
