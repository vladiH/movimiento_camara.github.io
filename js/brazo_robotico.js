import * as THREE from "../lib/three.module.js";
class BrazoRobotico{

    constructor(wireframe){
        this.wireframe = wireframe;
    }

    model(){
        const root =  this.base();
        const brazo = this.brazo();
        const anteBrazo = this.anteBrazo();
        const pinzaIzq = this.pinza();
        pinzaIzq.position.z = 10
        const pinzaDer = this.pinza();
        pinzaDer.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
        pinzaDer.position.z = -10
        root.add(brazo);
        brazo.add(anteBrazo);
        anteBrazo.add(pinzaIzq);
        anteBrazo.add(pinzaDer);
        return root;
    }

    base(){
        const baseMaterial = new THREE.MeshNormalMaterial({wireframe:this.wireframe});
        return (new THREE.Mesh( new THREE.CylinderGeometry(50,50,15,100), baseMaterial ));
    }

    brazo(){
        const baseMaterial = new THREE.MeshNormalMaterial({wireframe:this.wireframe});
        const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(20,20,18,20), baseMaterial );
        cylinder.rotation.z = 90*Math.PI/180;
        const rectangle = new THREE.Mesh( new THREE.BoxGeometry(18,120,18,2), baseMaterial );
        rectangle.rotation.z = 90*Math.PI/180;
        rectangle.position.x = 60;
        cylinder.add(rectangle);
        const sphere = new THREE.Mesh( new THREE.SphereGeometry(20,20,10), baseMaterial );
        sphere.position.y = -60;
        rectangle.add(sphere);
        return cylinder;
    }

    anteBrazo(){
        const baseMaterial = new THREE.MeshNormalMaterial({wireframe:this.wireframe});
        const cylinder = new THREE.Mesh( new THREE.CylinderGeometry(22,22,6,20), baseMaterial );
        cylinder.rotation.z = 90*Math.PI/180;
        const rectangle1 = new THREE.Mesh( new THREE.BoxGeometry(4,80,4,2), baseMaterial );
        const rectangle2 = rectangle1.clone();
        const rectangle3 = rectangle1.clone();
        const rectangle4 = rectangle1.clone();
        //rectangle.rotation.z = Math.PI/180;
        rectangle1.position.y = -40;
        rectangle1.position.x = 7;
        rectangle1.position.z = 10;
    
        rectangle2.position.y = -40;
        rectangle2.position.x = -7;
        rectangle2.position.z = 10;
    
        rectangle3.position.y = -40;
        rectangle3.position.x = -7;
        rectangle3.position.z = -10;
        //rectangle3.position.x = -10;
        rectangle4.position.y = -40;
        rectangle4.position.x = 7;
        rectangle4.position.z = -10;
        //rectangle4.position.x = 10;
        cylinder.add(rectangle1);
        cylinder.add(rectangle2);
        cylinder.add(rectangle3);
        cylinder.add(rectangle4);
        const cylinder1 = new THREE.Mesh( new THREE.CylinderGeometry(15,15,40,20), baseMaterial );
        cylinder1.position.y = -80;
        cylinder1.rotation.x = 90*Math.PI/180;
        cylinder.add(cylinder1);
        cylinder.position.x = 120;
        return cylinder;
    }

    pinza(){
        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        var vertices = new Float32Array( [      
            //Left
            1.0, 0.7, 0.0,
            1.0, 0.3, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 0.7, 0.0,
    
            //rigth horario
            0.0, 0.0, 1.0,
            1.0, 0.3, 0.5,
            1.0, 0.7, 0.5,
            1.0, 0.7, 0.5,
            0.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            
            //top
            0.0, 1.0, 1.0,
            1.0, 0.7, 0.5,
            1.0, 0.7, 0.0,
            1.0, 0.7, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 1.0,
            
            //botton hora
            1.0, 0.3, 0.0,
            1.0, 0.3, 0.5,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 0.0,
            1.0, 0.3, 0.0,
            
            //back
            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
    
            //front anti
            1.0, 0.7, 0.0,
            1.0, 0.7, 0.5,
            1.0, 0.3, 0.5,
            1.0, 0.3, 0.5,
            1.0, 0.3, 0.0,
            1.0, 0.7, 0.0,
        ] );
        var dim = new Array(36).fill([19, 20, 4]).flat();
        vertices = vertices.map((value,index)=>{
            return value*dim[index];
        });

        const normales = [];
        for (let i =0; i< vertices.length; i += 9) {
            const verx = Array.from(vertices.slice(i,i+9).values());
            for(var j = 0; j<(verx.length); j +=3 ){
                const v1 =  new THREE.Vector3(verx.at(j-3)-verx.at(j), verx.at(j-2)-verx.at(j+1), verx.at(j-1)-verx.at(j+2));
                let v2;
                if(j==6){
                    v2 =  new THREE.Vector3(verx.at(j-6)-verx.at(j), verx.at(j-5)-verx.at(j+1), verx.at(j-4)-verx.at(j+2));
                }else{
                    v2 =  new THREE.Vector3(verx.at(j+3)-verx.at(j), verx.at(j+4)-verx.at(j+1), verx.at(j+5)-verx.at(j+2));
                }
                const c = new THREE.Vector3().crossVectors(v2,v1).normalize();
                normales.push(c.x)
                normales.push(c.y)
                normales.push(c.z)
            }
        }
        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        //geometry.computeVertexNormals()
        geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,3));
        const pinzaMaterial = new THREE.MeshNormalMaterial( { wireframe:this.wireframe} );
        const mesh = new THREE.Mesh( geometry, pinzaMaterial );
        mesh.position.x = 9.5;
        mesh.position.y = -10;
        mesh.position.z = -2;
        const boxGeometry = new THREE.Mesh( new THREE.BoxGeometry(19,20,4), pinzaMaterial);
        boxGeometry.add(mesh);
        // boxGeometry.rotation.y =90*Math.PI/180;
        // boxGeometry.position.y =20;
        //boxGeometry.add(new THREE.AxesHelper(60))
        boxGeometry.position.y = -80
        boxGeometry.position.x = 10
        //boxGeometry.rotation.x =90*Math.PI/180;
        return boxGeometry;
    }
}

export {BrazoRobotico};