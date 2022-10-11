import { readdirSync, statSync, writeFileSync, watch } from "fs";
import path from "path";
const exclude = ["node_modules", ".git"];
watch(__dirname, {}, (eventType, filename) => {
  if(eventType === 'rename'){
    checkDirChange()
  }
});

function checkDirChange() {
  const res = readdirSync(path.resolve("."));
  res.forEach((f) => {
    const p = path.resolve(__dirname, f);
    const stat = statSync(p);
    if (stat.isDirectory() && !exclude.includes(f) && checkDirEmpty(p)) {
        writeFileSync(`${p}/${f}.ts`, "");
        writeFileSync(`${p}/${f}.md`, "");
    }
  });
}

function checkDirEmpty(path: string) {
  return readdirSync(path).length === 0;
}
