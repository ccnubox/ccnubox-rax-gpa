import {createElement, Component,PropTypes} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from './App.css';
import Image from "rax-image";
import Button from "rax-button";
import Link from "rax-link";
import Touchable from "rax-touchable";
import ScrollView from "rax-scrollview";
import DropDown from "./DropDown";

const id = "2016214322";
let startYear = parseInt(id.substr(0, 4));

class App extends Component {
    constructor(props) {
        super(props);
        this.choise = ["已修学分","平时学分绩"]
        this.state = {
            value:startYear,
            showsVerticalScrollIndicator: false,
            chooseItem:"已修学分",
            termOnblur:false,
            YearOptions: []
        }
    }
    showTermModal = () => {
        this.refs.termModal.show();
        this.setState({
          termOnblur: true
        })
      };
    hideTermModal = index => {
        console.log('index:'+index)
        console.log(this.choise[index])
        this.setState({
         chooseItem: this.choise[index],
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
        for (let i = startYear; i <= tYear; i=i+2) {
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
                <Text>{this.state.chooseItem}</Text>
                <Image
                  style={styles.down}
                  source={require("../static/triangle_down.png")}
                  resizeMode="cover"
                />
              </Touchable>
              <View style={styles.term_list}>
                <DropDown ref="termModal">
                  <Image
                    style={styles.second_triangle_up}
                    source={require("../static/triangle_up.png")}
                    resizeMode="cover"
                  />
                  <View style={styles.dropdown_list}>
                     {this.choise.map((text) => {
                       return (
                        <View
                        style={styles.select_item}
                        onClick={() => {
                          this.hideTermModal(this.choise.indexOf(text));
                        }}
                      >
                        <Text style={styles.item_text}>
                          {text}
                        </Text>
                      </View>
                       )
                     })}
                  </View>
                </DropDown>
               
              </View>
            </View>



{/* sss */}
            <View>
              <Touchable
                onPress={this.showYearModal}
                style={[styles.choose_box, styles.top_box]}
              >
                <Text>
                  {this.state.value}-{this.state.value + 2} 学年
                </Text>
                <Image
                  style={styles.down}
                  source={require("../static/triangle_down.png")}
                  resizeMode="cover"
                />
              </Touchable>
              <View style={styles.dropdown_container}>
                <DropDown ref="yearModal">
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
                        {i}-{i + 2} 学年
                      </Text>
                    </View>
                    )
                  })
                }
                  </ScrollView>
                </DropDown>
               
              </View>

     

            </View>
            <Button style={[styles.choose_box, styles.bottom_box]}>
              <Link
                href= {
                  encodeURI(`./second.bundel.js/?xnm=${this.state.value}&choise=${this.state.chooseItem}`)
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