import * as readline from 'node:readline'
import { Command } from 'commander'
import inquirer from 'inquirer'
import { Memo } from './Memo.js'

main()

function main () {
  const option = getOption()

  switch (option) {
    case 'l':
      showMemoList()
      return
    case 'r':
      showMemoDetail()
      return
    case 'd':
      deleteMemo()
      return
    case 'no-option':
      writeNewMemo()
  }
}

function getOption () {
  const program = new Command()

  program
    .option('-l', 'メモのリストを表示します')
    .option('-r', 'メモを選択して内容を表示します')
    .option('-d', 'メモを選択して削除します')

  program.parse()

  const numberOfOptions = Object.keys(program.opts()).length
  if (numberOfOptions > 1) {
    console.log('オプションは1つだけ指定してください')
    return
  }
  return Object.keys(program.opts())[0] || 'no-option'
}

async function showMemoList () {
  const memos = await Memo.getAllMemos()
  memos.forEach(currentValue => {
    console.log(currentValue.title)
  })
}

async function showMemoDetail () {
  const memos = await Memo.getAllMemos()
  const questions = [
    {
      type: 'list',
      name: 'targetMemoID',
      message: '表示したいメモを選んでください:',
      choices: memos.map(memo => {
        return { name: memo.title, value: memo.id }
      })
    }
  ]
  const answer = await inquirer.prompt(questions)
  const targetMemo = memos.find(memo => memo.id === answer.targetMemoID)
  console.log(targetMemo.title)
  console.log(targetMemo.body)
}

async function deleteMemo () {
  const memos = await Memo.getAllMemos()
  const questions = [
    {
      type: 'list',
      name: 'targetMemoID',
      message: '削除したいメモを選んでください:',
      choices: memos.map(memo => {
        return { name: memo.title, value: memo.id }
      })
    }
  ]
  const answer = await inquirer.prompt(questions)
  const targetMemo = memos.find(memo => memo.id === answer.targetMemoID)
  const memo = new Memo(...Object.values(targetMemo))
  memo.delete()
}

function writeNewMemo () {
  process.stdin.setEncoding('utf8')
  const lines = []
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  reader.on('line', (line) => {
    lines.push(line)
  })

  reader.on('close', () => {
    const memo = new Memo(null, lines[0], lines.slice(1).join('\n'))
    memo.save()
  })
}
