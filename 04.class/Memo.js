import sqlite3 from 'sqlite3'

const DB_NAME = 'db_memos'
const TABLE_NAME = 'memos'

/** Memo モデル */
export class Memo {
  static DB = new sqlite3.Database(DB_NAME)

  static async getAllMemos () {
    return await new Promise((resolve, reject) => {
      this.DB.all(`select * from ${TABLE_NAME}`, (err, rows) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(rows)
      })
    })
  }

  /**
   * id INTEGER PRIMARY KEY
   * title TEXT NOT NULL
   * body TEXT
   */
  constructor (id, title, body) {
    this.id = id
    this.title = title
    this.body = body
  }

  save () {
    Memo.DB.serialize(() => {
      Memo.DB.run(`create table if not exists ${TABLE_NAME}(id INTEGER PRIMARY KEY,title TEXT NOT NULL, body TEXT)`)
      Memo.DB.run(`insert into ${TABLE_NAME}(title, body) values(?,?)`, this.title, this.body, function (err) {
        if (err) {
          console.log(err)
          return
        }
        console.log(`メモが作成されました（id: ${this.lastID}）`)
      })
    })
  }

  delete () {
    Memo.DB.run(`delete from ${TABLE_NAME} where id = ?`, this.id, function (err) {
      if (err) {
        console.log(err)
        return
      }
      console.log('削除しました')
    })
  }
}
