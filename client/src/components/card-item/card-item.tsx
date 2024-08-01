import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { taskService } from "../../services/task.service";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  cardID: string,
  listId: string
};

export const CardItem = ({ card, cardID, isDragging, provided, listId }: Props) => {
  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title onChange={(newTitle: string) => taskService.changeTitle(newTitle, listId, cardID)} title={card.name} fontSize="large" isBold />
        <Text text={card.description} onChange={(newDescription: string) => taskService.changeDescription(newDescription, listId, cardID)} />
        <Footer>
          <DeleteButton onClick={() => taskService.delete(listId, cardID)} />
          <Splitter />
          <CopyButton onClick={() => taskService.copyCard({name: card.name, description: card.description}, listId)} />
        </Footer>
      </Content>
    </Container>
  );
};
