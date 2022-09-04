import sqlite3 from 'sqlite3'

class Memo {
  constructor (id, title, body) {
    this.id = id
    this.title = title
    this.body = body
  }
}

const db = new sqlite3.Database('db_memos')

const memo1 = new Memo('title1', 'test1-body')
const memo2 = new Memo('title2', 'line1\nline2\nline3')
const memo3 = new Memo('title3', 'line1\nline2\nline3\n')

db.serialize(() => {
  db.run('drop table if exists memos')
  db.run('create table if not exists memos(id INTEGER PRIMARY KEY,title TEXT NOT NULL, body TEXT NOT NULL)')
  db.run('insert into memos(title, body) values(?,?)', memo1.title, memo1.body)
  db.run('insert into memos(title, body) values(?,?)', memo2.title, memo2.body)
  db.run('insert into memos(title, body) values(?,?)', memo3.title, memo3.body)
  db.all('select rowid, * from memos', (rows) => {
    console.log(rows)
  })
})

db.close()
