// demo
import { createElement, Component, render } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from './Result.css';
import ListView from "rax-listview";
import data from "./api_result";

// 将 item 定义成组件
class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: "",
      page: 1,
      noMore: false,
      data:data
    };
  }
  componentWillMount() {
    //this._urlDeal();
    //this._getBook();
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
   return (
       <View style = {styles.subject_card}>
        <View style = {styles.intro_containner}>
            <View style  = {styles.subject_category_containner}>
             <View style = {styles.subject_category}></View>
            </View>
             <View style = {styles.subject_type}></View>
             <View style = {styles.subject_scroes}></View>
             <View style = {styles.checkbox}></View>
        </View>
        <View style = {styles.subject_detail_containner}>
            <View style = {styles.subject_name}></View>
            <View style = {styles.subject_scroes}></View>
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
      </View>
    );
  }
}

const styles = {
  App: {
    backgroundColor: "rgb(239,239,244)",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  book_content_containner: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    paddingTop: 41,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
    height: 161
  },
  icon_containner: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center"
  },
  book_icon: {
    width: 60,
    height: 44
  },
  book_info_containner: {
    flex: 3.5,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "nowrap",
    overflow: "hidden"
  },

  book_title: {
    fontSize: 30,
    flex: 1,
    fontWeight: 800,
    flexWrap: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  book_owner_containner: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden"
  },

  book_author: {
    fontSize: 26,
    flex: 1,
    color: "rgb(174,174,178)",
    flexWrap: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  book_publisher_containner: {
    flex: 1,
    fontSize: 26,
    color: "rgb(174,174,178)",
    flexWrap: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};
export default ListViewDemo;
