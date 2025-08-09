FROM gplane/pnpm AS setup

RUN useradd -m app
USER app
WORKDIR /home/app/app
COPY --chown=app:app . .
RUN pnpm install
RUN pnpm run build
EXPOSE 8000

FROM gplane/pnpm AS production

COPY --from=setup /home/app/app/ /home/app/app
RUN useradd -m app

RUN chmod +x entry-point.sh
RUN chmod +x ./start.sh

ENTRYPOINT ["./entry-point.sh"]
CMD ["./start.sh"]
