import * as readline from 'node:readline'
import sqlite3 from 'sqlite3'
import { Command } from 'commander'

const db = new sqlite3.Database('db_memos')
process.stdin.setEncoding('utf8')

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

class Memo {
  constructor (id, title, body) {
    this.id = id
    this.title = title
    this.body = body
  }
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

function writeNewMemo () {
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

function showMemosList () {
  db.all('select rowid, * from memos', (err, rows) => {
    if (err) { return console.log(err) }
    rows.forEach(currentValue => {
      console.log(currentValue.title)
    })
  })
}

function showMemoDetail () {
  // TODO:
}

function deleteMemo () {
  // TODO:
}
