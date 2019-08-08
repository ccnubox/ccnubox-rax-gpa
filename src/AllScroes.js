import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";

import data from "./api_result";
import styles from "./AllScroes.css";
import Image from "rax-image";

// let classArr = ["专业必修课","专业选修学分","专业主干"]
export default class AllScroes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: []
    };
  }
  componentWillMount() {
    let category = new Set();
    data.forEach(s => {
      // category.add({name:s.kcxzmc,value:0});
      category.add(s.kcxzmc);
    });
    category = [...category];
    // let kindSubject = category.reduce((obj,i)=>{
    //     obj.push({name:i,value:0})
    // },[]);
    let sumScroesArr = [];
    category.forEach(element => {
      sumScroesArr.push({ name: element, value: 0 });
    });

    data.forEach(s => {
      for (let item of sumScroesArr) {
        if (item.name === s.kcxzmc) {
          item.value += Number(s.credit);
          break;
        }
      }
    });
    // console.log(sumScroesArr)
    this.setState({ category: sumScroesArr });
  }
  render() {
    let allScroes = this.state.category.reduce((sum, item) => {
      sum += item.value;
      return sum;
    }, 0);
    console.log(this.state.category);
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
