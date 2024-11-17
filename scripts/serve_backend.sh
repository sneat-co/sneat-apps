#!/bin/sh

./../../sneat-firebase/scripts/serve_fb_emulators_ssl.sh &
./../../sneat-go-server/serve_gae.sh &

wait
