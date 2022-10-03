import { cloneDeep } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { MODAL_ACTION_CONFIRM } from "../../utilities/constants";
import {
  saveAfterEnter,
  selectAllInlinetext,
} from "../../utilities/ContentEditInput";
import { mapOrder } from "../../utilities/sorts";
import Card from "../Card/Card";
import ConfirmModal from "../common/ConfirmModal";
import "./Column.scss";

function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, "id");
  const [show, setShow] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const [onpenNewCardFrom, setOnpenNewCardFrom] = useState(false);
  const toggleNewCardFrom = () => {
    setOnpenNewCardFrom(!onpenNewCardFrom);
  };

  const cardRef = useRef(null);

  const [newCardTitle, setNewCardtitle] = useState("");
  const handleChangeInput = (e) => {
    setNewCardtitle(e.target.value);
  };

  useEffect(() => {
    setColumnTitle(column.title);
    console.log(column.title);
  }, [column.title]);

  const handleColumnTitleChange = (e) => {
    setColumnTitle(e.target.value);
  };

  useEffect(() => {
    if (cardRef && cardRef.current) {
      cardRef.current.focus();
      cardRef.current.select();
    }
  }, [onpenNewCardFrom]);

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };

  const toggleShowModal = () => setShow(!show);

  const onConfrimModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    toggleShowModal();
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      cardRef.current.focus();
      return;
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };

    let newColumn = cloneDeep(column);
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOrder.push(newCardToAdd.id);

    onUpdateColumn(newColumn);
    setNewCardtitle("");
    toggleNewCardFrom();
  };

  return (
    <div className="column">
      <header className="column-drop-handle">
        <div className="column-tilte">
          <Form.Control
            value={columnTitle}
            spellCheck={false}
            onClick={selectAllInlinetext}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveAfterEnter}
            onMouseDown={(e) => e.preventDefault()}
            className="edit-input"
            size="sm"
            type="text"
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item className="dropdown-title">
                <div></div>
                <span>List Actions</span>
                <i className="fa fa-times" />
              </Dropdown.Item>

              <Dropdown.Divider />
              <Dropdown.Item onClick={toggleNewCardFrom}>Add Crad...</Dropdown.Item>
              <Dropdown.Item>Copy List...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowModal}>
                Remove List...
              </Dropdown.Item>
              <Dropdown.Item>Watch</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Sort By...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Move All Cards in This List...</Dropdown.Item>
              <Dropdown.Item>Archive All Cards in This List...</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Archive This List</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <div className="card-list">
        <Container
          orientation="vertical" // default xếp theo cột
          groupName="ps-col" //Có thể kéo thả các card thông qua các cột có chung groupName
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {onpenNewCardFrom && (
          <div className="add-new-card-area">
            <Form.Control
              ref={cardRef}
              value={newCardTitle}
              onChange={handleChangeInput}
              onKeyDown={(e) => e.key === "Enter" && addNewCard()}
              className="textarea-enter-new-card"
              size="sm"
              as="textarea"
              row="3"
              placeholder="Enter a title for this card"
            />
          </div>
        )}
      </div>
      <footer>
        {onpenNewCardFrom && (
          <div className="add-new-card-action">
            <div className="button">
              <Button size="sm" variant="success" onClick={addNewCard}>
                Add card
              </Button>
              <span className="cancel-icon" onClick={toggleNewCardFrom}>
                <i className="fa fa-times icon" />
              </span>
            </div>
          </div>
        )}
        {!onpenNewCardFrom && (
          <div className="footer-action" onClick={toggleNewCardFrom}>
            <i className="fa fa-plus icon" />
            Add another cart
          </div>
        )}
      </footer>

      <ConfirmModal
        show={show}
        onAction={onConfrimModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>. <br/> All related cards will also be removed!`}
      />
    </div>
  );
}

export default Column;
