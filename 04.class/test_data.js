import sqlite3 from 'sqlite3'

class Memo {
  constructor (id, title, body) {
    this.id = id
    this.title = title
    this.body = body
  }
}

const db = new sqlite3.Database('db_memos')

const memo1 = new Memo(null, 'title1', 'メモ1のbody')
const memo2 = new Memo(null, 'title2', 'メモ2のline1\nline2\nline3')
const memo3 = new Memo(null, 'title3', 'メモ3のline1\nline2\nline3\n')
const memo4 = new Memo(null, 'title4(bodyは空)', '')

db.serialize(() => {
  db.run('drop table if exists memos')
  db.run('create table if not exists memos(id INTEGER PRIMARY KEY,title TEXT NOT NULL, body TEXT)')
  db.run('insert into memos(title, body) values(?,?)', memo1.title, memo1.body)
  db.run('insert into memos(title, body) values(?,?)', memo2.title, memo2.body)
  db.run('insert into memos(title, body) values(?,?)', memo3.title, memo3.body)
  db.run('insert into memos(title, body) values(?,?)', memo4.title, memo4.body)
  db.all('select * from memos', (err, rows) => {
    console.log(rows)
    if (err) { console.log(err) }
  })
})

db.close()
