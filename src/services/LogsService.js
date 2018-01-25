import Api from '@/services/Api'

export default {
  index () {
    return Api().post('getLogs')
  },
  show (logId, skip) {
    let offset = skip || 0;
      return Api().post(`show/${logId}`, {
        offset: offset
      })
  },
  info(logId) {
    return Api().post(`/getInfo/${logId}`)
  },
  delete (logId) {
    return Api().post(`/delete/${logId}`)
  }
  // post (song) {
  //   return Api().post('songs', song)
  // },
  // put (song) {
  //   return Api().put(`songs/${song.id}`, song)
  // }
}