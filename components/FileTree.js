import React from "react";
import { ListGroup } from "react-bootstrap";

export default function FileTree({ tree, onSelect }) {
  if (!tree) return null;

  return (
    <ListGroup>
      {tree.map((node) => (
        <ListGroup.Item
          key={node.path}
          action
          onClick={() => onSelect(node)}
        >
          {node.type === "directory" ? `📁 ${node.name}` : `📄 ${node.name}`}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}