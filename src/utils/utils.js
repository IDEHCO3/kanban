
export const idFromUrl = (url) => {
  if (url) {
    return url.endsWith('/') ? parseInt(url.split('/').reverse()[1]) : parseInt(url.split('/').reverse()[0])
  }
  return false
}
