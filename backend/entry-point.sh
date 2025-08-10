#!/bin/bash

chown -R app:app /home/app

exec su -s /bin/bash app -c "$*"
