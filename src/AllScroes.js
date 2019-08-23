import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
const native = require("@weex-module/test");

import data from "./api_result";
import styles from "./AllScroes.css";

import { parseSearchString } from "../box-ui/util";
import GpaServices from "../services/Gpas";

let qd;
if (window.location.search) {
  qd = parseSearchString(window.location.search);
}

if (!qd) {
  alert("参数缺失错误");
}

const sid = qd.sid[0];
const pwd = qd.pwd[0];

export default class AllScroes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      data: data
    };
  }
  componentWillMount() {
    this._getGrade();
  }

  _getGrade() {
    GpaServices.getGradeList({
      sid,
      pwd,
    })
      .then(res => {
        if (res.code === 0) {
          this.setState({
            data: res.data
          });

          let category = new Set();
          res.data.forEach(s => {
            category.add(s.kcxzmc);
          });
          category = [...category];

          let sumScroesArr = [];
          category.forEach(element => {
            sumScroesArr.push({ name: element, value: 0 });
          });

          res.data.forEach(s => {
            for (let item of sumScroesArr) {
              if (item.name === s.kcxzmc) {
                item.value += Number(s.credit);
                break;
              }
            }
          });
          this.setState({ category: sumScroesArr });
          native.changeLoadingStatus(true);
        } else if (res.code === 20101) {
          alert(
            "学号或密码错误，请检查是否更新了 one.ccnu.edu.cn 的密码，并重新登录"
          );
          native.reportInsightApiEvent(
            "getGpaGradeList",
            "error",
            res.code + ",Sid: " + sid
          );
          native.logout("");
          native.backToRoot();
        } else {
          alert(`服务端错误：${res.code}`);
          native.reportInsightApiEvent(
            "getGpaGradeList",
            "error",
            res.code + ",Sid: " + sid
          );
          native.back();
        }
      })
      .catch(e => {
        alert(`服务端错误：${JSON.stringify(e)}`);
        native.reportInsightApiEvent(
          "getGpaGradeList",
          "error",
          JSON.stringify(e)
        );
        native.back();
      });
  }

  render() {
    let allScroes = this.state.category.reduce((sum, item) => {
      sum += item.value;
      return sum;
    }, 0);
    console.log(this.state.category); //
    return (
      <View style={styles.root}>
        <View style={styles.all_scroes_containner}>
          <Text style={styles.all_scroes_value}> {allScroes}</Text>
          <Text style={styles.all_name}>总学分</Text>
        </View>
        <View style={styles.single_scroes_out_containner}>
          {this.state.category.map(item => {
            return (
              <View style={styles.single_scores_containner}>
                <Text style={styles.single_scores}>{item.value}</Text>
                <Text style={styles.single_subject}>{item.name}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.warn_words}>
          提示:该学分情况根据教务系统数据统计
        </Text>
      </View>
    );
  }
}
