import {createElement, Component,PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from './App.css';
import Image from "rax-image";
import Button from "rax-button";
import Link from "rax-link";
import Touchable from "rax-touchable";
import ScrollView from "rax-scrollview";
import Animated from "rax-animated";
const id = "2016214322";
var year = parseInt(id.substr(0, 4));

const { View: AnimatedView } = Animated;

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.fadeAnim = new Animated.Value(0);
  }

  static propTypes = {
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    visible: PropTypes.bool
  };

  static defaultProps = {
    visible: false
  };

  state = {
    visible: false
  };

  animated(state, callback) {
    const { visible, value } = state;
    Animated.timing(this.fadeAnim, { toValue: visible === true ? 1 : 0 }).start(
      callback
    );
  }

  show() {
    const currentState = { visible: true };
    this.setState(currentState, () =>
      this.animated(
        currentState,
        () => this.props.onShow && this.props.onShow(currentState)
      )
    );
  }

  hide() {
    const currentState = { visible: false };
    this.animated(currentState, () =>
      this.setState(
        currentState,
        () => this.props.onHide && this.props.onHide(currentState)
      )
    );
  }

  toggle(visible) {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.visible != this.props.visible &&
      nextProps.visible != this.state.visible
    ) {
      this.toggle(nextProps.visible);
    }
  }

  componentWillMount() {
    this.setState({
      visible: this.props.visible
    });
  }

  componentDidMount() {
    this.animated(this.state);
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      visible && (
        <AnimatedView
          onClick={() => {
            this.hide();
          }}
          style={styles.center}
        >
          <Touchable>{children}</Touchable>
        </AnimatedView>
      )
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.nextYear = year + 1;
    this.TermOptions = [
      {
        value: 3,
        text: "第一学期"
      },
      {
        value: 12,
        text: "第二学期"
      },
      {
        value: 16,
        text: "第三学期"
      }
    ];
    this.state = {
      value: year,
      showsVerticalScrollIndicator: false,
      chooseTerm: { value: 3, text: "第一学期" },
      termOnblur: false,
      YearOptions: []
    };
  }

  showTermModal = () => {
    this.refs.termModal.show();
    this.setState({
      termOnblur: true
    })
  };

  hideTermModal = index => {
    this.setState({
      chooseTerm: {
        value: this.TermOptions[index].value,
        text: this.TermOptions[index].text
      },
      termOnblur: false
    });
    this.refs.termModal.hide();
  };

  showYearModal = () => {
    if (!this.state.termOnblur) {
      this.refs.yearModal.show();
    }
  };

  hideYearModal = year => {
    this.setState({
      value: year
    });
    this.refs.yearModal.hide();
  };

  componentWillMount() {
    let date1 = new Date();
    let tYear = parseInt(date1.getFullYear());
    let arr = [];
    for (let i = year; i <= tYear; i++) {
      arr.push(i);
    }
    this.setState({
      YearOptions: arr
    });
  };

  render() {
    return (
      <View style={styles.app}>
       <Image 
        style = {styles.top_picture}
        source = {require("../static/gpa-search-center-picture.png")}
        resizeMode="contain"
      
        />
        <View>
          <Touchable
            onPress={this.showTermModal}
            style={[styles.choose_box, styles.middle_box]}
          >
            <Text>{this.state.chooseTerm.text}</Text>
            <Image
              style={styles.down}
              source={require("../static/triangle_down.png")}
              resizeMode="cover"
            />
          </Touchable>
          <View style={styles.term_list}>
            <Dropdown ref="termModal">
              <Image
                style={styles.second_triangle_up}
                source={require("../static/triangle_up.png")}
                resizeMode="cover"
              />
              <View style={styles.dropdown_list}>
                 {this.TermOptions.map((i) => {
                   return (
                    <View
                    style={styles.select_item}
                    onClick={() => {
                      this.hideTermModal(this.TermOptions.indexOf(i));
                    }}
                  >
                    <Text style={styles.item_text}>
                      {i.text}
                    </Text>
                  </View>
                   )
                 })}
              </View>
            </Dropdown>
           
          </View>
        </View>
        <View>
          <Touchable
            onPress={this.showYearModal}
            style={[styles.choose_box, styles.top_box]}
          >
            <Text>
              {this.state.value}-{this.state.value + 1} 学年
            </Text>
            <Image
              style={styles.down}
              source={require("../static/triangle_down.png")}
              resizeMode="cover"
            />
          </Touchable>
          <View style={styles.dropdown_container}>
            <Dropdown ref="yearModal">
              <Image
                style={styles.first_triangle_up}
                source={require("../static/triangle_up.png")}
                resizeMode="cover"
              />
              <ScrollView
                ref={scrollView => {
                  this.scrollView = scrollView;
                }}
                style={styles.dropdown_list}
              >
              {this.state.YearOptions.map((i) => {
                return(
                  <View
                  style={styles.select_item}
                  onClick={() => {
                    this.hideYearModal(i);
                  }}
                >
                  <Text style={styles.item_text}>
                    {i}-{i + 1} 学年
                  </Text>
                </View>
                )
              })
            }
              </ScrollView>
            </Dropdown>
           
          </View>
        </View>
        <Button style={[styles.choose_box, styles.bottom_box]}>
          <Link
            href= {
              encodeURI(`./second.bundel.js/?xnm=${this.state.value}&xqm=${this.state.chooseTerm.value}`)
            }
            style={styles.white_text}
          >
            计算
          </Link>
        </Button>
      </View>
    );
  }
}

export default App;
