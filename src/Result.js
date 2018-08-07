// demo
import { createElement, Component, render } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from './Result.css';
import ListView from "rax-listview";
import data from "./api_result";
import CheckBox from "rax-checkbox";
import BoxButton from "../box-ui/common/button/index"
// 将 item 定义成组件
 class Result extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
     
      keywords: "",
      page: 1,
      noMore: false,
      data:data,
      checkArr : data
     
    };
  }
  componentWillMount() {
    //this._urlDeal();
    //this._getBook();
  }
  checkAll(status) {
     for(let item of this.state.checkArr) {
       item.checked = status;
     }
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
   let checkIndex = this.state.checkArr.findIndex((item)=>{
    return item.id === info.id;
   })
   let checkArr = this.state.checkArr;
   checkArr[checkIndex].checked = info.checked;
   this.setState({checkArr})
   this.checkAllBoxDom.target.checked = (this.checkUp())
  }
  handleCheckAll(info) {
    this.checkAll(info.checked);
  }
  //处理url，分解出参数
  _urlDeal() {
    let param = decodeURI(window.location.href).split("&");
    let keywords = param[0].split("keywords=")[1];
    let page = param[1].split("page=")[1];
    this.setState({
      keywords,
      page
    });
  }
  // 路由拉取书籍数据
  _getBook() {
    let option = {};
    option.page = this.state.page;
    option.keywords = this.state.keywords;
    BookService.getBook(option).then(
      res => {
        let data = res.result;
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
                      ref = {(checkall)=>{}}
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
                          id: index,
                          name:item.course

                        }
                        this.handleChecked.bind(this,checkItem)
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
          renderFooter={this.listLoading}
          renderRow={this.listItem}
          dataSource={this.state.data}
          onEndReached={this.handleLoadMore}
        />
     <View style = {styles.footer}>
        <CheckBox 
        ref = {(checkBox) => {this.checkAllBoxDom =  this.checkBox}}
        style = {styles.checkAll}
        checkedImage = {require("../static/checked.png")}
        uncheckedImage = {require("../static/checkbox.png")}
        containerStyle={{
          width:49,
          height:49,
        
        }}
        onChange={(checked) => {
          let info  = {
            checked:checked,
            id: index
          }
          this.handleCheckAll.bind(this,info)
        }} />
      
       <BoxButton style = {styles.compute_button}>计算
        </BoxButton> 
        </View>
     
      </View>  
      
    );
  }
}



export default Result;
