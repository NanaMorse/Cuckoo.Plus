npm run build
git add .
git commit -m "build"
scp -i "light-sail-cuckoo-plus.pem" -r public ubuntu@52.76.67.104:projects/Cuckoo.Plus/