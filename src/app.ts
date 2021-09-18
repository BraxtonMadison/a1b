import {Drawing, Vector, Point} from "./common"
import {init_tests, draw_tests} from "./projection_test"

/*
Homework A1b
September 18, 2021
Braxton Madison
*/

// a 4x4 matrix data type
interface matrix4x4 {
    values: [
    [number, number, number, number], 
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
    ]
}

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

    //PROPERTIES
    //current transformation matrix is a property of the class.
    ctm: matrix4x4 = {
        values:  [
         [1, 0, 0, 0], 
         [0, 1, 0, 0],
         [0, 0, 1, 0],
         [0, 0, 0, 1]
         ]
     }
    //current projection matrix is a property of the class.
    cpm: matrix4x4 = {
        values:  [
         [1, 0, 0, 0], 
         [0, 1, 0, 0],
         [0, 0, 1, 0],
         [0, 0, 0, 1]
         ]
    }
    //used to say if beginShape has been called.
    drawingBool = false
    //used to keep track for drawing lines
    vertex1: Point = {
        x: 0,
        y: 0,
        z: 0
    }
    //used to say if vertex1 is set
    v1set = false

    //METHODS:
    beginShape() {
        this.drawingBool = true
    }

    endShape() {
        this.resetVertex1()
        this.drawingBool = false
    }

    vertex(x: number, y: number, z: number) {
        //If beginShape() has been called, execute. Else, do nothing.
        if (this.drawingBool) {
            var w = 1
            //apply ctm and cpm to the newly entered vertex
            //ctm first
            this.ctm.values[0][0]
            var x0 = this.ctm.values[0][0] * x + this.ctm.values[0][1] * y + this.ctm.values[0][2] * z + this.ctm.values[0][3] * w
            var y0 = this.ctm.values[1][0] * x + this.ctm.values[1][1] * y + this.ctm.values[1][2] * z + this.ctm.values[1][3] * w
            var z0 = this.ctm.values[2][0] * x + this.ctm.values[2][1] * y + this.ctm.values[2][2] * z + this.ctm.values[2][3] * w
            var w0 = this.ctm.values[3][0] * x + this.ctm.values[3][1] * y + this.ctm.values[3][2] * z + this.ctm.values[3][3] * w
            //cpm next
            x0 = this.cpm.values[0][0] * x0 + this.cpm.values[0][1] * y0 + this.cpm.values[0][2] * z0 + this.cpm.values[0][3] * w0
            y0 = this.cpm.values[1][0] * x0 + this.cpm.values[1][1] * y0 + this.cpm.values[1][2] * z0 + this.cpm.values[1][3] * w0
            z0 = this.cpm.values[2][0] * x0 + this.cpm.values[2][1] * y0 + this.cpm.values[2][2] * z0 + this.cpm.values[2][3] * w0
            w0 = this.cpm.values[3][0] * x0 + this.cpm.values[3][1] * y0 + this.cpm.values[3][2] * z0 + this.cpm.values[3][3] * w0
            // x0 = x0 / w0
            // y0 = y0 / w0
            // z0 = z0 / w0
            // w0 = w0 / w0
            //multiply by vp matrix to get into screenspace
            var mvp: matrix4x4 = {
                values: [
                    [this.canv.width / 2, 0, 0, (this.canv.width - 1) / 2], 
                    [0, this.canv.height / 2, 0, (this.canv.height - 1) / 2],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ]
            }
            x0 = mvp.values[0][0] * x0 + mvp.values[0][1] * y0 + mvp.values[0][2] * z0 + mvp.values[0][3] * w0
            y0 = mvp.values[1][0] * x0 + mvp.values[1][1] * y0 + mvp.values[1][2] * z0 + mvp.values[1][3] * w0
            z0 = mvp.values[2][0] * x0 + mvp.values[2][1] * y0 + mvp.values[2][2] * z0 + mvp.values[2][3] * w0
            w0 = mvp.values[3][0] * x0 + mvp.values[3][1] * y0 + mvp.values[3][2] * z0 + mvp.values[3][3] * w0
            x0 = x0 / w0
            y0 = y0 / w0
            z0 = z0 / w0
            w0 = w0 / w0
            if (this.v1set) {
                //Since v1 is already set, draw a line from v1 to v2 (the current vertex), then reset v1.
                var vertex2: Point = {
                    x: x0,
                    y: y0,
                    z: z0
                }
                this.line(this.vertex1, vertex2)
                this.resetVertex1()
            } else {
                //Set vertex1
                this.vertex1 = {
                    x: x0,
                    y: y0,
                    z: z0
                }
                this.v1set = true
            }
        }
    }

    //helper function to reset the vertex1 back to 0,0,0 and v1.set to false
    resetVertex1() {
        this.vertex1 = {
            x: 0,
            y: 0,
            z: 0
        }
        this.v1set = false
    }

    perspective(fov: number, near: number, far: number) {
        var f = far
        var n = near
        var t = Math.abs(Math.tan(this.toRadians(fov / 2)) * n)
        var b = -t
        var aspectRatio = this.canv.width / this.canv.height
        var r = t * aspectRatio
        var l = b * aspectRatio
        this.cpm = {
            values: [
                [2*n/(r-l), 0, (l+r)/(l-r),0],
                [0, 2*n/(t-b),(b+t)/(b-t), 0],
                [0, 0, (f+n)/(f-n), 2*f*n/(f-n)],
                [0, 0, 1, 0]
            ]
        }
    }
    //I may need to have a helper method called performOrtho(point) as well as a switch that says which type of projection is 
    //currently active - actually have a projection() function that outputs a point and takes in a point, you also may need to hav
    //properties to save the left and right and top and bottom for use in the clipping
    ortho( left: number, right: number, top: number, bottom: number, 
        near: number, far: number ) {
            this.cpm = {
                values: [
                    [2/(right - left), 0, 0, (-1) * (right + left)/(right - left)],
                    [0, 2/(top - bottom), 0, (-1) * (top + bottom)/(top - bottom)],
                    [0, 0, 2/(near - far), (-1) * (near + far)/(near - far)],
                    [0, 0, 0, 1]
                ]
            }
	}

    initMatrix() // was init()
    {
        this.ctm = {
            values:  [
             [1, 0, 0, 0], 
             [0, 1, 0, 0],
             [0, 0, 1, 0],
             [0, 0, 0, 1]
             ]
         }
    }

    // a 4x4 matrix multiplication
    multiplyMatrices4x4(m1: matrix4x4, m2: matrix4x4): matrix4x4 {
        return {
            values: [
            [this.mMHelp(m1, m2, 0, 0), this.mMHelp(m1, m2, 0, 1), this.mMHelp(m1, m2, 0, 2), this.mMHelp(m1, m2, 0, 3)], 
            [this.mMHelp(m1, m2, 1, 0), this.mMHelp(m1, m2, 1, 1), this.mMHelp(m1, m2, 1, 2), this.mMHelp(m1, m2, 1, 3)],
            [this.mMHelp(m1, m2, 2, 0), this.mMHelp(m1, m2, 2, 1), this.mMHelp(m1, m2, 2, 2), this.mMHelp(m1, m2, 2, 3)],
            [this.mMHelp(m1, m2, 3, 0), this.mMHelp(m1, m2, 3, 1), this.mMHelp(m1, m2, 3, 2), this.mMHelp(m1, m2, 3, 3)]
            ]
        }
    }

    // a helper function for multiplyMatrices4x4 that finds the value at an index in the resulting matrix
    // r is the row of the requested value in the resulting matrix
    // c is the column of the requested value in the resulting matrix
    mMHelp(m1: matrix4x4, m2: matrix4x4, r: number, c: number): number {
        return m1.values[r][0]*m2.values[0][c]
        + m1.values[r][1]*m2.values[1][c]
        + m1.values[r][2]*m2.values[2][c]
        + m1.values[r][3]*m2.values[3][c]
    }
    
    // mutiply the current matrix by the translation
    translate(x: number, y: number, z: number)
    {
        var translationMatrix: matrix4x4 = {
            values: [
                [1, 0, 0, x], 
                [0, 1, 0, y],
                [0, 0, 1, z],
                [0, 0, 0, 1]
                ]
        }
        this.ctm = this.multiplyMatrices4x4(this.ctm, translationMatrix)
    }
    
    // mutiply the current matrix by the scale
    scale(x: number, y: number, z: number)
    {
        var scaleMatrix: matrix4x4 = {
            values: [
                [x, 0, 0, 0], 
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]
                ]
        }
        this.ctm = this.multiplyMatrices4x4(this.ctm, scaleMatrix)
    }

    // a helper function to turn degrees to radians
    toRadians(angle: number): number {
        return angle / 180 * Math.PI
    }
    
    // mutiply the current matrix by the rotation
    rotateX(angle: number)
    {
        var c = Math.cos(this.toRadians(angle))
        var s = Math.sin(this.toRadians(angle))
        var rotateXMatrix: matrix4x4 = {
            values: [
                [1, 0, 0, 0], 
                [0, c, (s * -1), 0],
                [0, s, c, 0],
                [0, 0, 0, 1]
            ]
        }
        this.ctm = this.multiplyMatrices4x4(this.ctm, rotateXMatrix)
    }
    
    // mutiply the current matrix by the rotation
    rotateY(angle: number)
    {
        var c = Math.cos(this.toRadians(angle))
        var s = Math.sin(this.toRadians(angle))
        var rotateYMatrix: matrix4x4 = {
        values: [
            [c, 0, s, 0], 
            [0, 1, 0, 0],
            [(s * -1), 0, c, 0],
            [0, 0, 0, 1]
            ]
        }
        this.ctm = this.multiplyMatrices4x4(this.ctm, rotateYMatrix)
    }
    
    // mutiply the current matrix by the rotation
    rotateZ(angle: number)
    {
        var c = Math.cos(this.toRadians(angle))
        var s = Math.sin(this.toRadians(angle))
        var rotateZMatrix: matrix4x4 = {
        values: [
            [c, (s * -1), 0, 0], 
            [s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
            ]
        }
        this.ctm = this.multiplyMatrices4x4(this.ctm, rotateZMatrix)
    }

    printMatrix() // was print
    {
        // use `console.log("something")` to print something to the browser console.
        console.log(this.ctm.values[0][0] + ", " + this.ctm.values[0][1] + ", " + this.ctm.values[0][2] + ", " + this.ctm.values[0][3])
        console.log(this.ctm.values[1][0] + ", " + this.ctm.values[1][1] + ", " + this.ctm.values[1][2] + ", " + this.ctm.values[1][3])
        console.log(this.ctm.values[2][0] + ", " + this.ctm.values[2][1] + ", " + this.ctm.values[2][2] + ", " + this.ctm.values[2][3])
        console.log(this.ctm.values[3][0] + ", " + this.ctm.values[3][1] + ", " + this.ctm.values[3][2] + ", " + this.ctm.values[3][3])
        // end with a blank line!
        console.log("")
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