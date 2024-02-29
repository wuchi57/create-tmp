#!/usr/bin/env node
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { fileURLToPath } from 'node:url'
import { validateProjectName, install, validateDir, getOptions } from './utils/tools.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const targetDir = path.resolve(__dirname, './template')
  const { projectName, template, packageManager } = await getOptions(targetDir)
  const projectDir = path.resolve(projectName.startsWith('@') ? projectName.split('/')[1] : projectName)

  // 验证项目名是否正确
  await validateProjectName(projectName)

  // 验证项目目录是否存在
  await validateDir(projectDir)

  // 复制文件夹
  const templateDir = path.resolve(targetDir, template)
  fs.copySync(templateDir, projectDir)

  // 修改 package.json 项目名
  let packageFile = path.resolve(projectDir, 'package.json')
  const json = JSON.parse(fs.readFileSync(packageFile))
  json.name = projectName
  fs.writeFileSync(packageFile, JSON.stringify(json, null, 2) + '\n')

  // 安装依赖
  install(packageManager, projectDir)

  // 输出信息
  console.log(`\n${chalk.green('✔')} Success! Created ${chalk.cyan(projectName)} at ${chalk.cyan(projectDir)}`)
  console.log('\nDone. Now run: \n')
  console.log(`    cd ${projectDir}`)
  console.log(`    ${packageManager} run dev\n`)
}

main().catch(error => console.error(`An error occurred: ${error.message}`))
