git fetch
git checkout deploy
git pull
npm install
npm run build
git add .
git commit -m "build"
git push origin deploy
ssh -i "light-sail-cuckoo-plus.pem" ubuntu@52.76.67.104 "cd projects/Cuckoo.Plus; git fetch; git checkout deploy; git pull"
