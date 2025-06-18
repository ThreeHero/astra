const { execSync } = require("child_process");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function bumpPatchVersion(version) {
  const parts = version.split(".");
  const patch = parseInt(parts[2] || "0", 10) + 1;
  parts[2] = patch.toString();
  return parts.join(".");
}

function updatePackageVersion(pkgDir) {
  const pkgPath = path.resolve(pkgDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  const oldVersion = pkg.version;
  const newVersion = bumpPatchVersion(oldVersion);

  console.log(`[${pkg.name}] 版本：${oldVersion} -> ${newVersion}`);

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  return newVersion;
}

function updateRootVersion() {
  const rootPkgPath = path.resolve(__dirname, "package.json");
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, "utf-8"));
  const oldVersion = rootPkg.version;
  const newVersion = bumpPatchVersion(oldVersion);
  console.log(`[root] 版本：${oldVersion} -> ${newVersion}`);
  rootPkg.version = newVersion;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
  return newVersion;
}

function main() {
  const newRootVersion = updateRootVersion();
  const packagesDir = path.resolve(__dirname, "packages");
  const packageNames = fs.readdirSync(packagesDir).filter((name) => {
    const pkgDir = path.join(packagesDir, name);
    return (
      fs.statSync(pkgDir).isDirectory() &&
      fs.existsSync(path.join(pkgDir, "package.json"))
    );
  });

  // 先更新所有子包版本
  packageNames.forEach((pkgName) => {
    const pkgDir = path.join(packagesDir, pkgName);
    updatePackageVersion(pkgDir);
  });


  const rootPkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "package.json"))
  );
  const version = rootPkg.version;
  
  run("git add .")
  run(`git commit -m "chore(release): bump version to ${newRootVersion}"`);
  run("git push");
  run("npx changeset publish");

  console.log("所有包发布完成 🎉");
}


try {
  main();
} catch (err) {
  console.error("发布失败:", err);
  process.exit(1);
}
