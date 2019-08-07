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
      <View>
        {/* <Touchable onPress={this.showModal}>
          <Text>
            Open
          </Text>
        </Touchable> */}
        <Modal
          ref="modal"
          contentStyle={{
            borderRadius: "5%",
            height: 340,
            width: 540
          }}
        >
          <View style={styles.modal_containner}>
            <View style={styles.modal_warn_words}>平均学分绩为:</View>
            <View style={styles.modal_scroes}>{this.props.weightAverage}</View>
            <View style={styles.modal_ok}>
              <Touchable onPress={this.hideModal.bind(this)}>确认</Touchable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
