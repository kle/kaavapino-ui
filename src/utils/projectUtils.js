const addZeroPrefixIfNecessary = (value) => value < 10 ? `0${value}` : value

const formatDate = (value) => {
  const date = new Date(value)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${addZeroPrefixIfNecessary(day)}.${addZeroPrefixIfNecessary(month)}.${year}`
}

const formatTime = (value) => {
  const date = new Date(value)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${addZeroPrefixIfNecessary(hours)}:${addZeroPrefixIfNecessary(minutes)}`
}

const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`
}

const formatUsersName = (user) => {
  if (user) {
    return (user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : user.email
  }
  return ''
}

const formatDeadlines = ({ name, deadlines }) => {
  return ({
    title: name,
    deadlines: deadlines.map(d => ({
      title: d.phase_name,
      start: new Date(d.start),
      end: new Date(d.deadline)
    }))
  })
}

const isFieldMissing = (fieldName, isFieldRequired, attributeData) => {
  return (isFieldRequired && (!attributeData.hasOwnProperty(fieldName) || attributeData[fieldName] === null || attributeData[fieldName] === ''))
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatUsersName,
  formatDeadlines,
  isFieldMissing
}