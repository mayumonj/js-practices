import { eachDayOfInterval, endOfMonth } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz/esm'
import { Command } from 'commander'

const DAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesay: 3,
  Thusrsday: 4,
  Friday: 5,
  Saturday: 6
}

const [year, month] = getYearAndMonth()
validateYearAndMonth(year, month)

console.log(`      ${month}月 ${year}`)
console.log('日 月 火 水 木 金 土')

const startDate = utcToZonedTime(new Date(year, month - 1, 1), 'Asia/Tokyo')
const endDate = endOfMonth(startDate)

for (let i = 0; i < startDate.getDay(); i++) {
  process.stdout.write('   ')
}

eachDayOfInterval({ start: startDate, end: endDate }).forEach(date => {
  process.stdout.write(date.getDate().toString().padStart(2))
  date.getDay() === DAYS.Saturday ? process.stdout.write('\n') : process.stdout.write(' ')
})

function getYearAndMonth () {
  const program = new Command()

  program
    .option('-y <int>')
    .option('-m <int>')

  program.parse()

  const options = program.opts()

  const today = new Date()
  const year = options.y ? parseFloat(options.y) : today.getFullYear()
  const month = options.m ? parseFloat(options.m) : (today.getMonth() + 1)
  return [year, month]
}

function validateYearAndMonth (year, month) {
  try {
    if (isInvalidYear(year)) {
      throw new Error(`year ${year} not in range 1..9999`)
    }
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
  try {
    if (isInValidMonth(month)) {
      throw new Error(`${month} is neither a month number (1..12) nor a name`)
    }
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

function isInvalidYear (year) {
  if ((year < 1 || year > 9999) || !Number.isInteger(year)) {
    return true
  }
}

function isInValidMonth (month) {
  if ((month < 1 || month > 12) || !Number.isInteger(month)) {
    return true
  }
}
