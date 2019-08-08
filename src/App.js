import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
import Image from "rax-image";
import Button from "rax-button";
import Touchable from "rax-touchable";
import ScrollView from "rax-scrollview";
const native = require("@weex-module/test");

import { parseSearchString } from "../box-ui/util";
import DropDown from "../box-ui/common/dropdown-list";

import styles from "./App.css";

let qd;
if (window.location.search) {
  qd = parseSearchString(window.location.search);
}

if (!qd) {
  alert("参数缺失错误");
}

const sid = qd.sid[0];

class App extends Component {
  constructor(props) {
    super(props);
    this.choise = {
      gpa: "平均学分绩",
      totalCredits: "已修学分"
    };
    this.state = {
      chooseItem: "gpa",
      startYearOptions: [],
      endYearOptions: [],
      startYear: "",
      endYear: ""
    };
  }
  showTermModal = () => {
    this.refs.termModal.show();
  };
  hideTermModal = val => {
    this.setState({
      chooseItem: val
    });
    this.refs.termModal.hide();
  };
  showYearModal = () => {
    native.log("showYearModal");
    this.refs.yearModal.show();
  };
  hideYearModal = (year, key) => {
    if (key === "startYear") {
      if (year >= this.state.endYear) {
        alert("起始学年必须早于结束学年！");
        return;
      }
    } else {
      if (this.state.startYear >= year) {
        alert("结束学年必须晚于起始学年！");
        return;
      }
    }
    alert();
    this.setState({
      [key]: year
    });
    this.refs.yearModal.hide();
  };
  componentWillMount() {
    let startYear = parseInt(sid.substr(0, 4));

    let date = new Date();
    let currentYear = parseInt(date.getFullYear());
    let arr = [];
    for (let i = startYear; i <= currentYear; i++) {
      arr.push(i);
    }

    this.setState({
      startYear: arr[0],
      endYear: arr[arr.length - 1],
      startYearOptions: arr,
      endYearOptions: Array.from(arr).reverse()
    });
  }
  render() {
    return (
      <View style={styles.app}>
        <Image
          style={styles.top_picture}
          source={require("../static/gpa-search-center-picture.png")}
          resizeMode="contain"
        />

        <Touchable
          onPress={this.showYearModal}
          style={[styles.choose_box, styles.select]}
        >
          <Text>
            {this.state.startYear}-{this.state.endYear} 学年
          </Text>
          <Image
            style={styles.down}
            source={require("../static/triangle_down.png")}
            resizeMode="cover"
          />
        </Touchable>
        <DropDown ref="yearModal" top={535}>
          <Image
            style={styles.first_triangle_up}
            source={require("../static/triangle_up.png")}
            resizeMode="cover"
          />
          <View style={styles.selectContainer}>
            <ScrollView
              ref={scrollView => {
                this.scrollView = scrollView;
              }}
              style={styles.dropdown_list}
            >
              {this.state.startYearOptions.map(i => {
                return (
                  <View
                    style={[
                      styles.select_item,
                      this.state.startYear === i ? styles.selectedItem : {}
                    ]}
                    onClick={() => {
                      this.hideYearModal(i, "startYear");
                    }}
                  >
                    <Text style={styles.item_text}>{i}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <ScrollView
              ref={scrollView => {
                this.scrollView = scrollView;
              }}
              style={styles.dropdown_list}
            >
              {this.state.endYearOptions.map(i => {
                return (
                  <View
                    style={[
                      styles.select_item,
                      this.state.endYear === i ? styles.selectedItem : {}
                    ]}
                    onClick={() => {
                      this.hideYearModal(i, "endYear");
                    }}
                  >
                    <Text style={styles.item_text}>{i}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </DropDown>

        <Touchable
          onPress={this.showTermModal}
          style={[styles.choose_box, styles.select]}
        >
          <Text>{this.choise[this.state.chooseItem]}</Text>
          <Image
            style={styles.down}
            source={require("../static/triangle_down.png")}
            resizeMode="cover"
          />
        </Touchable>
        <DropDown ref="termModal" top={670}>
          <Image
            style={styles.second_triangle_up}
            source={require("../static/triangle_up.png")}
            resizeMode="cover"
          />
          <View style={styles.termSelect}>
            {Object.keys(this.choise).map(key => {
              return (
                <View
                  style={styles.select_item}
                  onClick={() => {
                    this.hideTermModal(key);
                  }}
                >
                  <Text style={styles.item_text}>{this.choise[key]}</Text>
                </View>
              );
            })}
          </View>
        </DropDown>

        <Button
          style={[styles.choose_box, styles.btn]}
          onPress={() => {
            if (this.state.chooseItem === "gpa") {
              native.push(
                `ccnubox://gpa.result?type=${this.state.chooseItem}&startYear=${
                  this.state.startYear
                }&endYear=${this.state.endYear}&sid=${sid}`
              );
            } else {
              native.push(
                `ccnubox://gpa.total?type=${this.state.chooseItem}&startYear=${
                  this.state.startYear
                }&endYear=${this.state.endYear}&sid=${sid}`
              );
            }
          }}
        >
          <Text style={{ color: "#fff" }}>计算</Text>
        </Button>
      </View>
    );
  }
}
export default App;
