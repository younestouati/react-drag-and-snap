/*
- Must be possible to set a background image
- Should be possible to interact with parts of the board/map
- Should be possible to zoom and pan ((two)-finger gestures)
- Should be possible to set zoom level and focus point
- Should be possible to rotate
- Should be able to have children
- Should be able to handle snap targets


Suggestion:
1. Board is a container for the board content. Adds panability, scalability, rotatability
2. Inside it can have for example a map and some snap targets
3. The board can have a background image, but does not have to.
4. Think about how to specify the zoom level and focus point

Start by doing a board that does NOT use a svg.

*/