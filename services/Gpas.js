import { Base64 } from "js-base64";
import request from "../box-ui/util/request";

const GpaService = {
  getGradeList(option) {
    const headers = {
      Authorization: `Basic ${Base64.encode(`${option.sid}:${option.pwd}`)}`
    };

    return request({
      headers,
      method: "GET",
      url: "https://ccnubox.muxixyz.com/api/grade/v2"
    });
  }
};
export default GpaService;
