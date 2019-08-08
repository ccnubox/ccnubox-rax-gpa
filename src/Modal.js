import { Component, createElement, render } from "rax";
import Text from "rax-text";
import View from "rax-view";
import Touchable from "rax-touchable";
import Modal from "rax-modal";
import styles from "./Modal.css";
export default class GpaModal extends Component {
  componentWillReceiveProps(props) {
    if (props.visible) {
      this.showModal();
    }
  }
  showModal = () => {
    this.refs.modal.show();
  };

  hideModal = () => {
    this.refs.modal.hide();
    this.props.hideModel();
  };

  render() {
    return (
      <Modal
        ref="modal"
        contentStyle={{
          borderRadius: 26,
          height: 340,
          width: 540
        }}
      >
        <View style={styles.modal_containner}>
          <View style={styles.modal_warn_words}>
            <Text style={styles.modal_title_text}>平均学分绩为:</Text>
          </View>
          <View style={styles.modal_scroes}>
            <Text style={styles.modal_score_num}>
              {this.props.weightAverage}
            </Text>
          </View>
          <Touchable onPress={this.hideModal.bind(this)}>
            <View style={styles.modal_ok}>
              <Text style={styles.modal_btn_text}>确认</Text>
            </View>
          </Touchable>
        </View>
      </Modal>
    );
  }
}
