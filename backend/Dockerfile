FROM oven/bun:debian

RUN useradd -m app
USER app
WORKDIR /home/app/app

COPY --chown=app:app . .

RUN bun install
EXPOSE 3000
CMD ["bash", "./entry.bash"]
