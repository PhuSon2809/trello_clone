import React from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { mapOrder } from "../../utilities/sorts";
import Card from "../Card/Card";
import "./Column.scss";

function Column({ column, onCardDrop }) {
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  return (
    <div className="column">
      <header className="column-drop-handle">{column.title}</header>
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
      </div>
      <footer>
        <div className="footer-action">
          <i className="fa fa-plus icon" />
          Add another cart
        </div>
      </footer>
    </div>
  );
}

export default Column;
