(function(exports) {
    //utils
    class MathPhysics {

        constructor() {

        }
        round10(n) {
            var round = Math.round(n * 100) / 100;
            if (round <= 0.1 && round >= -0.1) {
                return 0;
            } else {
                return round;
            }
        }
        round100(n) {
            var round = Math.round(n * 1000) / 1000;
            if (round <= 0.01 && round >= -0.01) {
                return 0;
            } else {
                return round;
            }
        }
        round1000(n) {
            var round = Math.round(n * 10000) / 10000;
            if (round <= 0.01 && round >= -0.01) {
                return 0;
            } else {
                return round;
            }
        }
    }
    //Point
    class Point extends MathPhysics {

        constructor(x, y) {
            super();
            this.type = "Point";
            this.color = "black";
            this.x = x || 0;
            this.y = y || 0;
        }
        update() {

        }
        translate(vector) {
            if (vector.type == "Vector") {
                this.x = this.x + vector.x;
                this.y = this.y + vector.y;
                return this;
            } else {
                return false;
            }
        }
        angleTo(point) {
            if (point.type == "Point") {
                return Math.atan2(point.y - this.y, point.x - this.x);
            } else {
                return false;
            }
        }

        distanceTo(point) {
            if (point.type == "Point") {
                var dx = point.x - this.x,
                    dy = point.y - this.y;
                return Math.sqrt(dx * dx + dy * dy);

            } else {
                return false;
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
            ctx.fill();
        }
    }
    //Segment
    class Segment extends MathPhysics {
        constructor(p1, p2) {
            super();
            this.type = "Segment";
            if (p1 && p1.type && p1.type == "Point") {

                this.p1 = p1;
            } else {
                this.p1 = new Point();
            }
            if (p2 && p2.type && p2.type == "Point") {

                this.p2 = p2;
            } else {
                this.p2 = new Point();
            }
        }
        getLength() {
            return this.p1.distanceTo(this.p2);
        }
        getAngleToP1() {
            return this.p1.angleTo(this.p2);
        }
        getAngleToP2() {
            return this.p2.angleTo(this.p1);
        }
        intersectTo(segment) {
            if (segment && segment.type == "Segment") {
                var A1 = this.p2.y - this.p1.y,
                    B1 = this.p1.x - this.p2.x,
                    C1 = A1 * this.p1.x + B1 * this.p1.y,
                    A2 = segment.p2.y - segment.p1.y,
                    B2 = segment.p1.x - segment.p2.x,
                    C2 = A2 * segment.p1.x + B2 * segment.p1.y,
                    denominator = A1 * B2 - A2 * B1;

                if (denominator != 0) {
                    var x = (B2 * C1 - B1 * C2) / denominator,
                        y = (A1 * C2 - A2 * C1) / denominator,
                        rx0 = (x - this.p1.x) / (this.p2.x - this.p1.x),
                        ry0 = (y - this.p1.y) / (this.p2.y - this.p1.y),
                        rx1 = (x - segment.p1.x) / (segment.p2.x - segment.p1.x),
                        ry1 = (y - segment.p1.y) / (segment.p2.y - segment.p1.y);
                    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
                        ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
                        return new Point(x, y);
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }
            }
        }
        intersectLineTo(segment) {
            if (segment && segment.type == "Segment") {
                var A1 = this.p2.y - this.p1.y,
                    B1 = this.p1.x - this.p2.x,
                    C1 = A1 * this.p1.x + B1 * this.p1.y,
                    A2 = segment.p2.y - segment.p1.y,
                    B2 = segment.p1.x - segment.p2.x,
                    C2 = A2 * segment.p1.x + B2 * segment.p1.y,
                    denominator = A1 * B2 - A2 * B1;
                if (denominator != 0) {
                    var x = (B2 * C1 - B1 * C2) / denominator;
                    var y = (A1 * C2 - A2 * C1) / denominator;
                    return new Point(x, y);
                } else {
                    return false;
                }

            } else {
                return false;
            }
        }
        draw(ctx) {
            this.p1.update();
            this.p2.update();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.lineTo(this.p2.x, this.p2.y);
            ctx.stroke();
        }
    }
    class Vector extends MathPhysics {

        constructor(x, y) {
            super();
            this.type = "Vector";
            this.x = x || 0;
            this.y = y || 0;
            //initialize angle and length
            this.length = 0;
            this.angle = 0;
            //update angle and length
            this.update();
        }
        update() {
            this.getLength();
            this.getAngle();
        }
        setLength(length) {
            this.x = Math.cos(this.angle) * length;
            this.y = Math.sin(this.angle) * length;
            this.update()
        }
        getLength() {
            this.length = Math.sqrt(this.x * this.x + this.y * this.y);
            return this.length;
        }
        setAngle(angle) {
            this.x = Math.cos(angle) * this.length;
            this.y = Math.sin(angle) * this.length;
            this.update();
        }
        getAngle() {
            this.angle = Math.atan2(this.y, this.x);
            return this.angle;
        }
        getSegment() {
            var p1 = new Point();
            var p2 = new Point(this.x, this.y);
            return new Segment(p1, p2);
        }
        add(vector) {
            if (vector.type == "Vector") {
                this.x = this.x + vector.x;
                this.y = this.y + vector.y;
                this.update();
                return this;
            } else {
                return false;
            }
        }

        subtract(vector) {
            if (vector.type == "Vector") {
                this.x = this.x - vector.x;
                this.y = this.y - vector.y;
                this.update();
                return this;
            } else {
                return false;
            }
        }

        multiply(vector) {
            if (vector.type == "Vector") {
                this.x = this.x * vector.x;
                this.y = this.y * vector.y;
                this.update();
                return this;
            } else {
                return false;
            }
        }

        divide(vector) {
            if (vector.type == "Vector") {
                this.x = this.x / vector.x;
                this.y = this.y / vector.y;
                this.update();
                return this;
            } else {
                return false;
            }
        }
    }
    class CircleVector extends MathPhysics {
        constructor(angle, radius) {
            super();
            this.angle = angle || 0;
            this.radius = radius || 1;
            this.speed = 0;
            this.center = new Point(0, 0);
            this.tanPoint = new Point(
                Math.cos(this.angle) * this.radius,
                Math.sin(this.angle) * this.radius
            );
        }
        update() {
            if (this.speed > 0.10) {
                var tan = new Vector();
                tan.setLength(this.speed);
                if (this.speed >= 0) {
                    tan.setAngle(this.angle + Math.PI * 0.5);
                } else {
                    tan.setAngle(this.angle - Math.PI * 0.5);
                }
                var constraint = new Vector();
                constraint.setLength(this.speed * this.speed / this.radius);
                constraint.setAngle(this.angle + Math.PI);
                var direction = tan.add(constraint);
                this.tanPoint = this.tanPoint.translate(direction);
                this.angle = this.center.angleTo(this.tanPoint);

            }
        }
        add(n) {
            this.speed += n;
            this.update();
            return this;
        }
        subtract(n) {
            this.speed -= n;
            this.update();
            return this;
        }
        divide(n) {
            this.speed /= n;
            this.update();
            return this;
        }
        multiply(n) {
            this.speed *= n;
            this.update();
            return this;
        }
    }
    class PhysicPoint extends Point {

        constructor(x, y) {
            super(x, y);
            this.velocity = new Vector(0, 0);
            this.friction = new Vector(1, 1);
            this.bounce = 1;
            this.mass = 1;
            this.radius = 1;
            this.rotation = 0;
            this.color = "black";
            this.circleMovement = new CircleVector(this.rotation, this.radius);
            //this.circleMovement.speed = 0.2;
            this.rotateFriction = 1;
        }
        update() {
            this.circleMovement.multiply(this.rotateFriction);
            this.rotation = this.circleMovement.angle;

            this.velocity.multiply(this.friction);
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
        gravitateTo(p2) {
            //todo
            var grav = new Vector(0, 0),
                dist = this.distanceTo(p2);

            grav.setLength(p2.mass / (dist * dist));
            grav.setAngle(this.angleTo(p2));
            this.velocity.add(grav);
        }
        draw(ctx) {
            this.update();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.fill();
        }

    }
    class Polygone {
        constructor(...points) {
            this.type = "Polygone";
            this.points = points;
        }
        add(point) {
            this.points.push(point);
        }
        update() {
            this.segments = [];
            segmentArray.push(new Segment(this.points[0], this.points[1]));
            for (var i = 1; i < this.points.length; i++) {
                this.points[i].update();
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.fillStyle = "black";
            this.points[0].update();
            ctx.moveTo(this.points[0].x, this.points[0].y);

            for (var i = 1; i < this.points.length; i++) {
                this.points[i].update();
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.fill();
        }
    }
    class Particle extends Point{
        constructor(x,y,z){
            super(x,y);
            this.z = z || 1;
            this.velocity = new Vector(0,0);
            this.wind = new Vector(0.0,0.0);
            this.speed = 1;
            this.growth = 0;
        }
         getRadius(){
            return this.z;
        }
    }
    class LightFlare extends Particle{
        constructor(x,y,z){
            super(x,y,z);
        }
    }
    class SnowFlake extends Particle{
        constructor(x,y,z){
            super(x,y,z);
            this.color = "white";
        }
        update(){
            let randx = (Math.random() * 2) - 1;
            let randy = (Math.random() * 2) - 1;
            let randz = (Math.random() * 2) - 1;
            this.growth += randz*(this.speed / 6);
            this.velocity.add(new Vector(randx*0.3,randy*0.3));
            this.velocity.add(this.wind);
            this.x = this.x + this.velocity.x * this.speed;
            this.y = this.y + this.velocity.y * this.speed;
            this.z += this.growth;
        }

        getColor(){
            let alpha = 1/(this.z);
            alpha = alpha > 1 ? 1 : alpha;
            alpha = this.round100(alpha);
            return "rgba(255,255,255,"+ alpha +")";
        }
        /**
         * 
         * @param ctx {CanvasRenderingContext2D} 
         */
        draw(ctx) {
            this.update();
            this.z = this.z < 1 ? 1 : this.z;
            ctx.beginPath();
            var gradient = ctx.createRadialGradient(this.x,this.y,this.getRadius()*0.2,this.x,this.y,this.getRadius()*2);
            gradient.addColorStop(0,this.getColor());
            gradient.addColorStop(1,"transparent");
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.getRadius(), 0, Math.PI * 2)
            ctx.fill();
            if(this.x > ctx.canvas.width || this.y > ctx.canvas.height || this.x < 0 || this.y < 0 || this.z > 50){
                this.x = Math.random() * ctx.canvas.width;
                this.y = Math.random() * ctx.canvas.height;
                this.z =1;
                this.velocity = new Vector(0,0);
                this.growth = 0;
            }
        }
    }
    class World {
        constructor(...items) {
            this.items = items || [];
            this.wind = new Vector(0,0);
            this.speed = 1;
        }
        add(item) {
            this.items.push(item);
        }
        draw(ctx) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].wind = this.wind;
                this.items[i].speed = this.speed;
                this.items[i].draw(ctx);
            }
        }
    }
    exports.LightFlare = LightFlare;
    exports.Segment = Segment;
    exports.Point = Point;
    exports.Vector = Vector;
    exports.Particle = Particle;
    exports.SnowFlake = SnowFlake;
    exports.PhysicPoint = PhysicPoint;
    exports.Polygone = Polygone;
    exports.World = World;
})(window.jc_physics = window.jc_physics || {})