export default function authHeader(type = null) {
  let user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    if (type === 'multipart') {
      return { 
        Authorization: 'Bearer ' + user.token, 
        'Content-Type': 'multipart/form-data' }
    }
    return { 
      Authorization: 'Bearer ' + user.token 
    }
  } else {
    return {}
  }
}
