import validate from 'validate-npm-package-name'
import chalk from 'chalk'
import { execSync } from 'child_process'
import prompts from 'prompts'
import fs from 'fs-extra'
import path from 'path'

export function validatePkgName (name) {
  const validateResult = validate(name)
  if (!validateResult.validForNewPackages) {
    console.error(
        `Could not create a project called ${chalk.red(`"${name}"`)} because of npm naming restrictions `
    )
    printValidateResult(validateResult.errors)
    printValidateResult(validateResult.warnings)
    process.exit(1)
  }
}
function printValidateResult (results) {
  if (typeof results !== "undefined") {
    results.forEach(err => {
      console.error(chalk.red(` * ${err}`))
    })
  }
}

export function install (manager, cwd) {
  let cmd = manager === 'yarn' ? 'yarn' : manager + ' i'
  execSync(cmd, {
    stdio: 'inherit',
    cwd
  })
}

// 校验目录是否存在
export async function validateDir(dir) {
  if (fs.pathExistsSync(dir)) {
    console.log(chalk.bold(`目录 ${dir} 已存在`))
    const { yes } = await prompts({
      name: 'yes',
      type: 'confirm',
      message: chalk.bold('您是否需要覆盖已存在的目录？'),
      initial: true,
    })
    if (!yes) process.exit(1)
    await fs.remove(dir)
  }
  fs.mkdirpSync(dir, {})
}

// 获取信息
export async function getOptions(targetDir) {
  // will skip if type is falsy
  const questions = [
    {
      message: '项目名称',
      name: 'projectName',
      type: process.argv[2] === undefined ? 'text' : null,
      initial: 'project-name',
    },
    {
      name: 'template',
      type: 'select',
      choices: (await fs.readdir(targetDir)).filter((file) =>
          (fs.statSync(path.join(targetDir, file)).isDirectory()),
      ).map((i) => ({ title: i, value: i })),
      message: '请选择要使用的模版',
    },
  ]
  let opt = await prompts(questions)
  const { template } = opt
  opt.packageManager = template.split('-')[0]
  opt.projectName = process.argv[2] || opt.projectName
  return opt
}
