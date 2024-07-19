"use client";

import { useEffect, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

const texts = [
    {
        text: "a",
        x: 50,
        y: 50
        }
]

export default function Text() {

    const [textValue, setTextValue] = useState(texts[0].text);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: texts[0].x, y: texts[0].y });

    useEffect(() => {
        window.addEventListener("mousemove", (event) => {
            if (dragging) {
                // setPosition({
                //     x : event.offsetX,
                //     y : event.offsetY
                // })
            }
        })
    }, [dragging])

    function onChange(event: any) {
        setTextValue(event.target.value);
    }

    return <TextareaAutosize
        style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            background: 'red',
            fontSize: 50
        }}
        value={textValue}
        onChange={onChange}
        onMouseDown={() => {
            setDragging(true);
        }}
        onMouseUp={() => {
            setDragging(false);
        }}
    />
}