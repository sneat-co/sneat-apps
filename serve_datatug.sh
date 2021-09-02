cd src || exit
alias pnx="pnpm run nx --"
pnx serve datatug --optimization=false --sourceMap=true
