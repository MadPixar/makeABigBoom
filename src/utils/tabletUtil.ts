import Cookies from 'js-cookie'
const TOKEN_NAME = 'token'
const PREFIX_TOKEN = 'Bearer '

export const getToken = () => {
  let basicTokenStr = Cookies.get(TOKEN_NAME)
  return (basicTokenStr && (basicTokenStr = basicTokenStr.replace(PREFIX_TOKEN))) || ''
}
const tabletUtil = { getToken }
export default tabletUtil
