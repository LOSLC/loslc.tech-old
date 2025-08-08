chown -R app:app /home/app

su - app -c "pnpm run db:migrate"

exec "$@"
