"use client";

import { useEffect, useRef, useState } from "react";
import { points, point_type, lines } from "../data/elements";
import { v4 } from 'uuid';

const draw = (ctx: CanvasRenderingContext2D, dragging: any) => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.moveTo(line.a.x, line.a.y);
        ctx.lineTo(line.b.x, line.b.y);
        ctx.stroke();
    });

    points.forEach(point => {
        ctx.beginPath();
        ctx.fillStyle = dragging == point.tag ? "red" : "white";
        ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
        ctx.fill();
    });
};

export default function Grid() {
    const [selected, setSelected] = useState(false);
    const [dragging, setDragging] = useState<string | null>(null);
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    const [placing, setPlacing] = useState<string | null>(null);
    const [placing1, setPalcing1] = useState<point_type | null>(null);
    const [text, setText] = useState("");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: any) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            setMousepos({ x: mouseX, y: mouseY });

            points.forEach(point => {
                if (dragging == point.tag) {
                    point.x = mouseX;
                    point.y = mouseY;
                }
            })
        };

        const handleMouseDown = (event: any) => {
            points.forEach(point => {
                const dist = Math.hypot(event.clientX - point.x, event.clientY - point.y);
                if (dist < 20 && event.button === 0) {
                    setDragging(point.tag);
                    setSelected(true);
                }
            });
            if (placing == "point") {
                points.push({
                    x: event.offsetX,
                    y: event.offsetY,
                    tag: v4()
                })
                setPlacing(null);
            } else if (placing == "line") {
                var closest = null;
                var dist = 9999999;
                points.forEach(point => {
                    if (dist > Math.hypot(point.x - event.offsetX, point.y - event.offsetY)) {
                        dist = Math.hypot(point.x - event.offsetX, point.y - event.offsetY);
                        closest = point;
                    }
                })
                if (placing1 && closest) {
                    console.log("a");
                    lines.push({
                        a: placing1,
                        b: closest
                    })
                    setPlacing(null);
                } else if (closest) {
                    setPalcing1(closest);
                }
            }
        };

        const handleMouseUp = (event: any) => {
            if (event.button === 0 && dragging) {
                setDragging(null);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, placing, placing1]);

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        draw(ctx, dragging);
    }, [mousepos, dragging]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: '100%'
                }}
            />
            <button
                style={{
                    position: 'fixed',
                    left: 50,
                    top: 50,
                    fontSize: 30,

                }}
                onClick={() => {
                    setPlacing("point");
                }}
            >Add Point</button>
            <button
                style={{
                    position: 'fixed',
                    left: 50,
                    top: 100,
                    fontSize: 30,

                }}
                onClick={() => {
                    setPlacing('line');
                }}
            >Add Line</button>
            <textarea
                style={{
                    position: 'fixed',
                    left: 50,
                    top: 150,
                    fontSize: 30,
                    width: 450,
                    height: 200,
                    background: 'none',
                    outline: 'none',
                    resize: 'none',

                }}
                contentEditable={editable}
                placeholder="Write a note"
                value={text}
                onChange={(ev) => editable ? setText(ev.target.value) : null}
                onDoubleClick={() => {
                    setEditable(prev => !prev);
                }}
            />
        </>
    );
}
