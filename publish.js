const { execSync } = require("child_process");
const chalk = require("chalk").default;
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

// 获取需要发布的包名称列表在 .publish文件夹中的pkgs.json文件
function getPackageNames() {
  const publishConfigPath = path.resolve(__dirname, ".publish", "pkgs.json");

  // 检查配置文件是否存在
  if (!fs.existsSync(publishConfigPath)) {
    console.log(
      chalk.yellow("未找到 .publish/pkgs.json 配置文件，将不进行发布")
    );
    return []; // 返回 [] 表示发布不发布包
  }

  try {
    const publishConfig = JSON.parse(
      fs.readFileSync(publishConfigPath, "utf-8")
    );

    // 支持两种格式：
    // 1. { "packages": ["cli", "scripts"] }
    // 2. ["cli", "scripts"]
    const packageNames = Array.isArray(publishConfig)
      ? publishConfig
      : publishConfig.packages;

    if (!Array.isArray(packageNames)) {
      console.error(
        chalk.red("pkgs.json 配置文件格式错误，应为数组或包含 packages 数组的对象")
      );
    }

    console.log(chalk.blue(`将发布以下包: ${packageNames.join(", ")}`));
    return packageNames;
  } catch (error) {
    console.error(chalk.red(`读取 .publish/pkgs.json 失败: ${error.message}`));
    throw error;
  }
}

// 重置 .publish 
function resetPublishConfig() {
  const publishConfigPath = path.resolve(__dirname, ".publish", "pkgs.json");
  const defaultConfig = { packages: [] };
  
  fs.mkdirSync(path.dirname(publishConfigPath), { recursive: true });
  fs.writeFileSync(publishConfigPath, JSON.stringify(defaultConfig, null, 2) + "\n");
  console.log(chalk.green("已重置 .publish/pkgs.json 配置文件"));
}

function main() {
  const newRootVersion = updateRootVersion();
  const packagesDir = path.resolve(__dirname, "packages");
  const publishPackages = getPackageNames();
  const packageNames = fs.readdirSync(packagesDir).filter((name) => {
    const pkgDir = path.join(packagesDir, name);
    return (
      fs.statSync(pkgDir).isDirectory() &&
      fs.existsSync(path.join(pkgDir, "package.json")) &&
      (publishPackages[0] == 'all' ? true : publishPackages.includes(name))
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
  
  resetPublishConfig();
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
