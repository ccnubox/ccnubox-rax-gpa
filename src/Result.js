import { createElement, Component, render } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./Result.css";
import ListView from "rax-listview";
import data from "./api_result";
import CheckBox from "rax-checkbox";
const native = require("@weex-module/test");

import { parseSearchString } from "../box-ui/util";
import BoxButton from "../box-ui/common/button/index";
import GpaServices from "../services/Gpas";
import GpaModal from "./Modal";

let qd;
if (window.location.search) {
  qd = parseSearchString(window.location.search);
}

if (!qd) {
  alert("参数缺失错误");
}

const startYear = qd.startYear[0];
const endYear = qd.endYear[0];
const sid = qd.sid[0];
const pwd = qd.pwd[0];

class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noMore: false,
      data: [],
      checkArr: [],
      checkAll: true,
      weightAverage: 0,
      modalVisble: false
    };
  }
  componentWillMount() {
    //从服务端拉取成绩列表
    this._getGrade();
  }
  hideModel() {
    this.setState({ modalVisble: false });
  }
  checkAll(status) {
    let newCheckArr = this.state.checkArr;
    for (let item of newCheckArr) {
      item.checked = status;
    }
    this.setState({ checkArr: newCheckArr });
  }
  checkUp() {
    let symbol = true;
    for (let item of this.state.checkArr) {
      if (!item.checked) {
        symbol = false;
      }
    }
    return symbol;
  }
  handleChecked(info) {
    let checkArr = this.state.checkArr;
    checkArr[info.id].checked = info.checked;
    this.setState({ checkArr });
    let checkAll = this.checkUp();
    this.setState({ checkAll });
  }
  handleCheckAll(info) {
    this.checkAll(info.checked);
  }
  handleCompute(e) {
    this.setState({ modalVisble: true });
    let checkArr = this.state.checkArr;
    let checkedArr = checkArr.filter(subject => {
      return subject.checked === true;
    });
    let sum = checkedArr.reduce((accumator, subject) => {
      accumator += Number(subject.grade) * Number(subject.credit);
      return accumator;
    }, 0);
    let weight = checkedArr.reduce((accumator, subject) => {
      accumator += Number(subject.credit);
      return accumator;
    }, 0);
    if (sum === 0 || weightAverage === 0) {
      this.setState({ weightAverage: 0 });
      return;
    }
    let weightAverage = (sum / weight).toFixed(2);
    this.setState({ weightAverage });
  }

  // 拉取成绩数据
  _getGrade() {
    GpaServices.getGradeList({
      sid,
      pwd
    })
      .then(res => {
        if (res.code === 0) {
          // 筛选出startYear - endYear 之间的成绩数据
          const filteredData = res.data.filter(course => {
            return (
              Number(course.xnm) >= Number(startYear) &&
              Number(course.xnm) <= Number(endYear)
            );
          });

          this.setState({
            data: filteredData,
            checkArr: filteredData.map(item => {
              return {
                checked: true,
                ...item
              };
            })
          });
          native.changeLoadingStatus(true);
          native.reportInsightApiEvent("getGpaGradeList", "success", "");
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
  listItem = (item, index) => {
    let categoryArr = item.category.split("");
    let category = categoryArr[0] + categoryArr[2];
    return (
      <View style={styles.subject_card}>
        <View style={styles.intro_containner}>
          <View style={styles.subject_category_containner}>
            <Text style={[styles.subject_category, styles.info_box]}>
              {category}
            </Text>

            <Text style={[styles.subject_type, styles.info_box]}>
              {item.type || "无数据"}
            </Text>
            <Text style={[styles.subject_credit, styles.info_box]}>
              学分{item.credit}
            </Text>
          </View>
          <View style={styles.checkbox_containner}>
            <CheckBox
              checked={this.state.checkArr[index].checked}
              style={styles.checkbox}
              checkedImage={require("../static/checked.png")}
              uncheckedImage={require("../static/checkbox.png")}
              containerStyle={{
                width: 49,
                height: 49
              }}
              onChange={checked => {
                let checkItem = {
                  checked: checked,
                  id: index
                };
                this.handleChecked(checkItem);
              }}
            />
          </View>
        </View>
        <View style={styles.subject_detail_containner}>
          <Text numberOfLines={1} style={styles.subject_name}>
            {item.course}
          </Text>
          <Text style={styles.subject_goals}>成绩：</Text>
          <Text style={styles.subject_scroes}>{item.grade}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.App}>
        <ListView
          style={styles.list}
          renderRow={this.listItem}
          dataSource={this.state.data}
        />
        <View style={styles.footer}>
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={this.state.checkAll}
              checkedImage={require("../static/checked.png")}
              uncheckedImage={require("../static/checkbox.png")}
              containerStyle={{
                width: 49,
                height: 49,
                marginLeft: 40
              }}
              onChange={checked => {
                let info = {
                  checked: checked
                };
                this.handleCheckAll(info);
              }}
            />

            <Text style={styles.checkAllWords}>全选</Text>
          </View>

          <BoxButton
            style={styles.compute_button}
            width={196}
            height={77}
            onPress={event => this.handleCompute(event)}
            text="计算"
          />
        </View>
        <GpaModal
          weightAverage={this.state.weightAverage}
          visible={this.state.modalVisble}
          hideModel={this.hideModel.bind(this)}
        />
      </View>
    );
  }
}

export default Result;
