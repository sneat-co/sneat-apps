if [ -n "$1" ]
then
	pnpm run nx serve "$1" --host local-app.sneat.ws #--disable-host-check --host local-app.sneat.ws --port 80 --optimization=false --sourceMap=true
else
	printf "Please provide a project name as first argument\n"
fi
