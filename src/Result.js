// demo
import { createElement, Component, render } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from './Result.css';
import ListView from "rax-listview";
import data from "./api_result";
import CheckBox from "rax-checkbox";
import BoxButton from "../box-ui/common/button/index";
import GpaServices from "../services/Gpas";
// 将 item 定义成组件
 class Result extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      //native获取 start
      Sid: 2016214322,
      Jsessionid:"FCEEB506F3532390F878F3A699FD512B",
      //end
      noMore: false,
      data:data,
      checkArr : data,
      checkAll: true,
      weightAverage: 0
     
    };
  }
  componentWillMount() {
    //this._urlDeal();
    //this._getBook();
    this.checkAll(true);
    
  }
  checkAll(status) {
    let newCheckArr = this.state.checkArr;
     for(let item of newCheckArr) {
       item.checked = status;
     }
    this.setState({checkArr:newCheckArr})
  } 
  checkUp() {
    let symbol = true;
    for(let item of this.state.checkArr) {
      if(!item.checked) {
        symbol = false;
      }
    }
    return symbol;
  }
  handleChecked(info) {
   let checkArr = this.state.checkArr;
   checkArr[info.id].checked = info.checked;
   this.setState({checkArr})
   let checkAll = this.checkUp();
   this.setState({checkAll})
  }
  handleCheckAll(info) {
     this.checkAll(info.checked);
  }
  handleCompute() {
    let checkArr = this.state.checkArr;
    let checkedArr = checkArr.filter((subject)=>{
      return subject.checked === true;
    });
    let sum  =  checkArr.reduce((accumator,subject)=>{
        accumator += Number(subject.grade)*Number(subject.credit); 
        return accumator;
    },0);
    let weight = checkArr.reduce((accumator,subject)=>{
      accumator += Number(subject.credit); 
      return accumator;
     },0);
     let weightAverage = (sum/weight).toFixed(2);
     this.setState({weightAverage});
  }
  //处理url，分解出参数
  _urlDeal() {
    let param = decodeURI(window.location.href).split("&");
    let xnm = param[0].split("xnm=")[1];
    let xqm = param[1].split("xqm=")[1];
    this.setState({
      xnm,
      xqm
    });
  }
  // 路由拉取成绩数据
  _getBook() {
    let option = {};
    option.xnm = this.state.xnm;
    option.xqm = this.state.xqm;
    option.Sid = this.state.Sid;
    option.Jsessionid = this.state.Jsessionid;
    GpaServices.getAllScores(option).then(
     data => {
        this.setState({ data });
      },
      err => {
        throw err;
      }
    );
  }
  listLoading = () => {
    return (
      <View style={styles.loading}>
        {this.state.noMore ? (
          <View>没有更多</View>
        ) : (
          <Text style={styles.text}>加载中...</Text>
        )}
      </View>
    );
  };
  listItem = (item, index) => {
    let categoryArr = item.category.split("");
    let category = categoryArr[0] +  categoryArr[2];
   return (
       <View style = {styles.subject_card}>
        <View style = {styles.intro_containner}>
          <View style  = {styles.subject_category_containner}>
             <Text style = {styles.subject_category}>
             
             {category}
             
             </Text>
            
             <Text style = {styles.subject_type}>{item.type}</Text>
             <Text style = {styles.subject_credit}>学分{item.credit}</Text>
          </View>
             <View style = {styles.checkbox_containner}>
                  <CheckBox 
                      checked = {this.state.checkArr[index].checked}
                      style = {styles.checkbox}
                      checkedImage = {require("../static/checked.png")}
                      uncheckedImage = {require("../static/checkbox.png")}
                      containerStyle={{
                        width:49,
                        height:49,
                      
                      }}
                      onChange={(checked) => {
                        let checkItem  = {
                          checked:checked,
                          id: index
                        }
                        this.handleChecked(checkItem)
                      }} />

             </View>
             
        </View>
        <View style = {styles.subject_detail_containner}>
           
                <Text style  = {styles.subject_name}>
                     {item.course}
                </Text>
                <Text style = {styles.subject_goals}>
                    成绩：
                </Text>
                <Text style = {styles.subject_scroes}>
                  {item.grade}
                </Text>
        </View>
            
        
       </View>
   )
    
  };
  handleLoadMore = () => {
    if (!this.state.noMore) {
      let page = ++this.state.page;
      this.setState({ page });
      let option = {};
      option.page = page;
      option.keywords = this.state.keywords;
      BookService.getBook(option).then((res, err) => {
        if (res) {
          if (res.result.length) {
            let data = this.state.data;
            res.result.forEach(element => {
              data.push(element);
            });

            this.setState({ data });
          } else {
            this.setState({ noMore: true });
          }
        }
        if (err) {
          this.setState({ noMore: true });
        }
      });
    }
  };

  render() {
    return (

      <View style={styles.App}>
        
        <ListView
          style = {styles.list}
          // renderFooter={this.listLoading}
          renderRow={this.listItem}
          dataSource={this.state.data}
          // onEndReached={this.handleLoadMore}
        />
        
      
     <View style = {styles.footer}>
        <CheckBox 
        checked = {this.state.checkAll}
        checkedImage = {require("../static/checked.png")}
        uncheckedImage = {require("../static/checkbox.png")}
        containerStyle={{
          width:49,
          height:49,
          marginLeft:40,
       
          
        }}
        onChange={(checked) => {
          let info  = {
            checked:checked,
          }
          this.handleCheckAll(info)
        }} />
       
        
      <Text style = {styles.checkAllWords}>全选</Text>
       <BoxButton style = {styles.compute_button} width = {196}  height = {77} onPress = {event => this.handleCompute} >计算</BoxButton> 
        </View>
     
      </View>  
      
    );
  }
}



export default Result;
