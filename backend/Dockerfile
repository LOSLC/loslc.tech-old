FROM gplane/pnpm

RUN useradd -m app
WORKDIR /home/app/app
USER app
COPY --chown=app:app . .
RUN pnpm install
RUN pnpm run build
EXPOSE 8000
RUN chmod +x entry-point.sh
ENTRYPOINT ["./entry-point.sh"]
CMD ["pnpm", "run", "start"]
