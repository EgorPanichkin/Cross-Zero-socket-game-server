let users = []
let idCount = 0

const addUser = ({ name, room }) => {
  const isExist = users.find((obj) => obj.name === name && obj.room === room)

  !isExist && users.push({ id: idCount, name, room }) && idCount++
  const currentUser = isExist || { id: idCount, name, room }

  return { isExist: !!isExist, user: currentUser, userList: users }
}

module.exports = { addUser }
