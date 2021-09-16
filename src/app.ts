import {Drawing, Vector, Point} from "./common"
import {init_tests, draw_tests} from "./projection_test"

// A class for our application state and functionality
class MyDrawing extends Drawing {
    
    constructor (div: HTMLElement) {
        super(div)
 
        init_tests(this)
    }

    drawScene() {
        draw_tests(this)
    }

    // Matrix and Drawing Library implemented as part of this object

    // Begin by using the matrix transformation routines from part A of this project.
    // Make your current transformation matrix a property of this object.
    // You should modify the new routines listed below to complete the assignment.
    // Feel free to define any additional classes, class variables and helper methods
    // that you need.


    beginShape() {
    }

    endShape() {
    }

    vertex(x: number, y: number, z: number) {
    }

    perspective(fov: number, near: number, far: number) {
    }

    ortho( left: number, right: number, top: number, bottom: number, 
        near: number, far: number ) {
	}

    initMatrix() // was init()
    {
    }
    
    // mutiply the current matrix by the translation
    translate(x: number, y: number, z: number)
    {
    }
    
    // mutiply the current matrix by the scale
    scale(x: number, y: number, z: number)
    {
    }
    
    // mutiply the current matrix by the rotation
    rotateX(angle: number)
    {
    }
    
    // mutiply the current matrix by the rotation
    rotateY(angle: number)
    {
    }
    
    // mutiply the current matrix by the rotation
    rotateZ(angle: number)
    {
    }

    printMatrix() // was print
    {
    }
}

// a global variable for our state
var myDrawing: MyDrawing

// main function, to keep things together and keep the variables created self contained
function exec() {
    // find our container
    var div = document.getElementById("drawing");

    if (!div) {
        console.warn("Your HTML page needs a DIV with id='drawing'")
        return;
    }

    // create a Drawing object
    myDrawing = new MyDrawing(div);
    myDrawing.render()
}

exec()