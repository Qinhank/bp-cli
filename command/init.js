'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const inquirer = require('inquirer')
const config = require('../template')
const chalk = require('chalk')

module.exports = () => {
 co(function *() {
    // 处理用户输入
    const { tpl } = yield inquirer.prompt({ message: '请选择项目模板：', type: 'list', name: 'tpl', choices: ['移动端','PC端'] })
    const { autoInstall } = yield inquirer.prompt({ message: '是否自动安装node_modules：', type: 'list', name: 'autoInstall', choices: ['是','否'] })
    let projectName = yield prompt('输入项目名称: ')
    let newGitUrl = yield prompt('输入项目地址: ')
    let gitUrl
    let branch

    let tplName = tpl=='移动端'?'app':'pc'
    if (!config.tpl[tplName]) {
        console.log(chalk.red('\n × Template does not exit!'))
        process.exit()
    }
    gitUrl = config.tpl[tplName].url
    branch = config.tpl[tplName].branch

    // git命令，远程拉取项目并自定义项目名
    let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && git remote set-url origin ${newGitUrl}`
    if(autoInstall==='是') {
      cmdStr += ' && npm i'
    }
    console.log(chalk.white('\n 开始构建项目...'))

    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        process.exit()
      }
      console.log(chalk.green('\n √ 项目构建完成!'))
      console.log(`\n cd ${projectName} && npm install \n`)
      process.exit()
    })
  })
}