# LFS Course Directory

Project displays the current year courses along with their syllabus from the previous year (If available)

## Project Structure
Project contains the client and the server code. The client code gets served by the server code. For the server to get access to changes in the client code, inside the client directory run.

* `npm run dev` so that the endpoints get updated to hit localhost of the service running "lfs-canvas-syllabus"
* `npm run prod` so that the endpoints get updated to hit the production endpoint running "lfs-canvas-syllabus"
