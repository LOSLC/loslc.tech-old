FROM gplane/pnpm AS setup

RUN useradd -m app
USER app

WORKDIR /home/app/app
COPY --chown=app:app . .

RUN pnpm install
RUN pnpm run build

RUN mkdir -p /home/app/app/fs/storage
RUN chmod +x ./start.sh

CMD ["./start.sh"]
