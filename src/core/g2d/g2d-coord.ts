import { Point2D } from '../../_type';

export function getDistance(p1: Point2D, p2: Point2D = { x: 0, y: 0 }): number {
  let deltaX = p2.x - p1.x;
  let deltaY = p2.y - p1.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
