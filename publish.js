const path = require('path')
const fs = require('fs-extra-promise')
const pkg = fs.readJsonSync(path.join(__dirname, './package.json'))

const proc = require('child_process')

const tag = pkg['tag']

// add tag for snowbrush
proc.execSync(`
  npm run build;
  git add .;
  git commit -m "Update Tag @${tag}";
  git push origin $(current_branch);
  git tag -a ${tag} -m "publish Tag @${tag}";
  git push origin ${tag};
`)