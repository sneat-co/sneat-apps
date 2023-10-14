if [ -n "$1" ]
then
	sudo pnpm run nx serve "$1" --disable-host-check --host local.host --port 80 #--optimization=false --sourceMap=true
else
	printf "Please provide a project name as first argument\n"
fi
