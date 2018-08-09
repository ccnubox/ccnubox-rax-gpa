import request from '../box-ui/util/request';
const GpaService = {
    getAllScores(option) {
        let headers =  {
            Sid  : option.Sid,
            Bigipserverpool : '89172160.20480.0000',
            Jsessionid:option.Jsessionid,
        }

        return request({
            headers: header,
            method:"GET",
            url:
            `https://ccnubox.muxixyz.com/api/grade/?xnm=${option.xnm}&xqm=${optino.xqm}`
        })

    }
}
export default GpaService