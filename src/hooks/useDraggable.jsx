import { useState } from 'react'

const DRAGGABLE = 'DRAGGABLE'
const BAR = 'BAR'

function draggable(item, id) {
  return {
    type: DRAGGABLE,
    id,
    data: item
  }
}

function insertBars(list) {
  let i = 0 // ID 

  const newBar = () => {
    return {
      type: BAR,
      id: i++
    }
  }
  // |A|B|C|
  return [newBar()].concat(
    ...list.map(item => {
      return [draggable(item, i++), newBar()]
    })
  )
}

function calcChanging(list, drag, drop) {
  list = list.slice()
  const dragItem = list[drag] // 正在拖动的元素

  // dir > 0 从下往上 < 0 从上往下
  const dir = drag > drop ? -2 : 2

  // drop 的地方是bar
  const end = dir > 0 ? drop - 1 : drop + 1

  for (let i = drag; i !== end; i += dir) {
    list[i] = list[i + dir]
  }
  list[end] = dragItem
  return list
}

export function useDraggable(list) {

  const [dragList, setDragList] = useState(() => {
    return insertBars(list)
  })

  const [dragOver, setDragOver] = useState(null)
  const [dragging, setDragging] = useState(null)


  return {
    dragList,
    dragging,
    dragOver,
    createDropperProps: id => {
      return {
        dragging,
        dragOver,
        eventHandlers: {
          onDragOver: e => {
            e.preventDefault()
            setDragOver(id)
          },
          onDragLeave: e => {
            e.preventDefault()
            setDragOver(null)
          },
          onDrop: (e) => {
            e.preventDefault()
            setDragOver(null)
            setDragList(dragList => {
              return calcChanging(dragList, dragging, id)
            })
          }
        }

      }
    },
    createDraggerProps: (id, key) => {
      return {
        id,
        key: id,
        dragging,
        eventHandlers: {
          onDragStart: () => {
            setDragging(id)
          },
          onDragEnd: () => {
            setDragging(null)
          }
        }
      }
    }
  }
}