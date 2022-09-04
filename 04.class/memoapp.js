import * as readline from 'node:readline'
import sqlite3 from 'sqlite3'
import { Command } from 'commander'
import inquirer from 'inquirer'
// import { resolve } from 'node:path'

class Memo {
  constructor (id, title, body) {
    this.id = id
    this.title = title
    this.body = body
  }
}

const db = new sqlite3.Database('db_memos')

const option = getOption()

switch (option) {
  case 'l':
    showMemosList()
    break

  case 'r':
    showMemoDetail()
    break

  case 'd':
    deleteMemo()
    break

  case null:
    writeNewMemo()
}

function getOption () {
  const program = new Command()

  program
    .option('-l')
    .option('-r')
    .option('-d')

  program.parse()

  const count = Object.values(program.opts()).reduce(
    (count, currentValue) =>
      count + (currentValue === true ? 1 : 0)
    , 0
  )

  if (count > 1) {
    console.log('オプションが不正です')
    return
  }

  let option = null
  if (program.opts().l === true) { option = 'l' }
  if (program.opts().r === true) { option = 'r' }
  if (program.opts().d === true) { option = 'd' }
  return option
}

function showMemosList () {
  db.all('select rowid, * from memos', (err, rows) => {
    if (err) { return console.log(err) }
    rows.forEach(currentValue => {
      console.log(currentValue.title)
    })
  })
}

async function showMemoDetail () {
  const memos = await getAllMemos()
  const questions = [
    {
      type: 'list',
      name: 'targetMemoID',
      message: 'Choose a note you want to see:',
      choices: memos.map(memo => {
        return { name: memo.title, value: memo.id }
      })
    }
  ]
  inquirer.prompt(questions).then((answer) => {
    const targetMemo = memos.find(memo => memo.id === answer.targetMemoID)
    console.log(targetMemo.title)
    console.log(targetMemo.body)
  })
}

function deleteMemo () {
  // TODO:
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
    console.log(lines)
    db.serialize(() => {
      db.run('create table if not exists memos(id INTEGER PRIMARY KEY,title TEXT NOT NULL, body TEXT)')
      db.run('insert into memos(title, body) values(?,?)', memo.title, memo.body, function (err) {
        if (err) { return console.log(err) }
        console.log(`メモが作成されました: id ${this.lastID}`)
      })
    })
  })
}

async function getAllMemos () {
  const memos = await new Promise(resolve => {
    db.all('select rowid, * from memos', (err, rows) => {
      if (err) { return console.log(err) }
      resolve(rows)
    })
  })
  return memos
}
