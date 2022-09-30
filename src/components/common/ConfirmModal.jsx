import React from "react";
import HTMLReactParser from "html-react-parser";
import { Button, Modal } from "react-bootstrap";
import {
  MODAL_ACTION_CLOSE,
  MODAL_ACTION_CONFIRM,
} from "../../utilities/constants";

function ConfirmModal(props) {
  const { title, content, show, onAction } = props;
  return (
    <>
      <Modal
        keyboard={false} //bấm nút Esc Modal ko tắt
        backdrop="static" //bấm ra ngoài màn hình Modal ko tắt
        // animation={false}
        show={show}
        onHide={() => onAction(MODAL_ACTION_CLOSE)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onAction(MODAL_ACTION_CLOSE)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => onAction(MODAL_ACTION_CONFIRM)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModal;
