import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from './App.css';
import ListView from 'rax-listview';
import Image from "rax-image";
class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <View style = {styles.center_picture}>
          <Image />
        
        </View>
        
      </View>
    );
  }
}

export default App;
