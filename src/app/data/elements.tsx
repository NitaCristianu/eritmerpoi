
export interface point_type {
    x: number,
    y: number,
    tag: string
}
export interface line_type {
    a: point_type,
    b: point_type
}
export const points: point_type[] = [
    {
        x: 350,
        y: 350,
        tag: "A",
    },
    {
        x: 700,
        y: 500,
        tag: "B"
    },

];

export const lines: line_type[] = [
    {a : points[0], b : points[1]}
]