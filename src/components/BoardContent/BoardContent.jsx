import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container as BootstrapContainer,
  Form,
  Row,
} from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { initialData } from "../../actions/initialData";
import { applyDrag } from "../../utilities/dragDrop";
import { mapOrder } from "../../utilities/sorts";
import Column from "../Column/Column";
import "./BoardContent.scss";

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [onpenNewColumnFrom, setOnpenNewColumnFrom] = useState(false);
  const [newColumnTitle, setNewColumntitle] = useState("");

  const inputTitleColumnRef = useRef(null);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);

      //Sort column
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    if (inputTitleColumnRef && inputTitleColumnRef.current) {
      inputTitleColumnRef.current.focus();
      inputTitleColumnRef.current.select();
    }
  }, [onpenNewColumnFrom]);

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: "10px", color: "white" }}>
        Board not found!
      </div>
    );
  }

  //Caadn sắp xếp lại cái payload..
  const onColumnDrop = (dropResult) => {
    //Muốn cho state cũ ko bị thay đổi data --> clone state
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;
    console.log(newBoard);

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find((column) => column.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((card) => card.id);
      setColumns(newColumns);
    }
  };

  const toggleNewColumnFrom = () => {
    setOnpenNewColumnFrom(!onpenNewColumnFrom);
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      inputTitleColumnRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    let newColumn = [...columns];
    newColumn.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumn.map((column) => column.id);
    newBoard.columns = newColumn;

    setColumns(newColumn);
    setBoard(newBoard);

    setNewColumntitle("");
    toggleNewColumnFrom();
  };

  const handleChangeInput = (e) => {
    setNewColumntitle(e.target.value);
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drop-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>

      <BootstrapContainer className="trello-container">
        {!onpenNewColumnFrom ? (
          <Row>
            <Col className="add-new-column" onClick={toggleNewColumnFrom}>
              <i className="fa fa-plus icon" />
              Add another column
            </Col>
          </Row>
        ) : (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                ref={inputTitleColumnRef}
                value={newColumnTitle}
                onChange={handleChangeInput}
                onKeyDown={(e) => e.key === "Enter" && addNewColumn()}
                className="input-enter-new-column"
                size="sm"
                type="text"
                placeholder="Enter column title"
              />
              <div className="button">
                <Button size="sm" variant="success" onClick={addNewColumn}>
                  Add column
                </Button>
                <span
                  className="cancel-new-column"
                  onClick={toggleNewColumnFrom}
                >
                  <i className="fa fa-times icon" />
                </span>
              </div>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
}

export default BoardContent;
