import p1 from "./1.jpg";
import p2 from "./2.jpg";
import p3 from "./3.jpg";
import "./App.css";
import { useDraggable } from "./hooks/useDraggable.jsx";

const list = [
  { src: p1, title: "11111" },
  { src: p2, title: "22222" },
  { src: p3, title: "33333" },
];

function cls(def, ...conditions) {
  const list = [def];
  conditions.forEach((cond) => {
    if (cond[0]) {
      list.push(cond[1]);
    }
  });
  return list.join(" ");
}

function App() {
  return (
    <div className="App">
      <DraggableList list={list} />
    </div>
  );
}

function Card({ src, title }) {
  return (
    <div className="card">
      <img src={src} alt={title} />
      <span>{title}</span>
    </div>
  );
}

function DraggableList({ list }) {
  const {
    dragging,
    dragOver,
    dragList,
    createDraggerProps,
    createDropperProps,
  } = useDraggable(list);
  return dragList.map((item, i) => {
    if (item.type === "BAR") {
      return <Bar id={i} {...createDropperProps(i)} key={item.id} />;
    } else {
      return (
        <>
          <Draggable {...createDraggerProps(i, item.id)}>
            <Card {...item.data}></Card>
          </Draggable>
          dragOver: {dragOver} |||||| dragging: {dragging}
        </>
      );
    }
  });
}

function Bar({ id, dragging, dragOver, eventHandlers }) {
  if (id === dragging + 1) {
    return null;
  }

  return (
    <div
      {...eventHandlers}
      className={cls("draggable-bar", [dragOver === id, "dragover"])}
    >
      <div
        className="inner"
        style={{
          height: id === dragOver ? "80px" : "0px",
        }}
      />
    </div>
  );
}

function Draggable({ children, eventHandlers, dragging, id }) {
  return (
    <div
      {...eventHandlers}
      draggable={true}
      className={cls("draggable", [dragging === id, "dragging"])}
    >
      {children}
    </div>
  );
}

export default App;
