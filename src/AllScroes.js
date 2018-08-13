import {createElement,Component,PropTypes} from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./AllScroes.css";
import Image from "rax-image";

 export default class AllScroes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category : []
        }
        
    }
    componentWillMount() {
        
       
        let data = this.props.data;
       
        let category = new Set();
        data.forEach(s => {
            // category.add({name:s.kcxzmc,value:0});
            category.add(s.kcxzmc)
        });
        category = [...category];
        // let kindSubject = category.reduce((obj,i)=>{
        //     obj.push({name:i,value:0})
        // },[]);
        let sumScroesArr =  [];
        category.forEach(element => {
            sumScroesArr.push({name:element,value:0})
        });
        console.log(sumScroesArr);
        data.forEach(s => {
           for(let item of sumScroesArr) {
            if(item.name === s.kcxzmc) {
                item.value += Number(s.credit);
                break;
            }
           }
        })
        console.log(category)
        this.setState({category})
    }
    render() {
        let allScroes = this.state.category.reduce((sum , item) => {
            sum += item.value;
            return sum;
        },0)
        return(
            <View style = {styles.scores_containner}>
                <View style = {styles.all_scroes_containner}>
                    <Text style = {styles.all_scroes_value}> {allScroes}</Text>
                    <Text>总学分</Text>
                </View>
                <View style = {styles.single_scroes_out_containner}>
                    {this.state.category.forEach((item)=>{
                        <View style = {styles.single_scores_containner}>
                            <Text style = {styles.single_scores}>{item.value}</Text>
                            <Text style = {styles.single_subject}>{item.name}</Text>
                        </View>
                    })}
                </View>
                <Text style = {styles.warn_words}>提示:该学分情况根据信息门户数据统计</Text>
            </View>
        )
    }

}