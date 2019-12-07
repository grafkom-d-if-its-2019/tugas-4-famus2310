(function() {

  glUtils.SL.init({ callback: function() { main(); }});
  function main() {
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Mendefinisikan verteks-verteks
    var vNormal;
    var vTexCoord;
    var vColor;
    var nCube = 0;
    var nLetter = 0;
    var vertices = [];
    var fVertices = [];
    var fPoints = [
    /*
    -0.1, -0,5
-0.1, 0.5
0.1, 0.5
0.1, -0.5

0.1, 0.3
0.1, 0.5
0.5, 0.5
0.5, 0.3

0.1, -0.1
0.1, 0.1
0.5, 0.1
0.5, -0.1
    */
      [-0.1, -0.5, -0.1], //1
      [-0.1, 0.5, -0.1], //2
      [0.1, 0.5, -0.1], //3
      [0.1, -0.5, -0.1], //4

      [0.1, 0.3, -0.1], //5
      [0.1, 0.5, -0.1], //6
      [0.5, 0.5, -0.1], //7
      [0.5, 0.3, -0.1], //8

      [0.1, -0.1, -0.1], //9
      [0.1, 0.1, -0.1], //10
      [0.5, 0.1, -0.1], //11
      [0.5, -0.1, -0.1], // 12

      [-0.1, -0.5, 0.1], //13
      [-0.1, 0.5, 0.1], //14
      [0.1, 0.5, 0.1], //15 
      [0.1, -0.5, 0.1], //16

      [0.1, 0.3, 0.1], //17
      [0.1, 0.5, 0.1], //18
      [0.5, 0.5, 0.1], //19
      [0.5, 0.3, 0.1], //20

      [0.1, -0.1, 0.1], //21
      [0.1, 0.1, 0.1], //22
      [0.5, 0.1, 0.1], //23
      [0.5, -0.1, 0.1] //24
    ];
    var cubePoints = [
      [ -0.5, -0.5,  0.5 ],
      [ -0.5,  0.5,  0.5 ],
      [  0.5,  0.5,  0.5 ],
      [  0.5, -0.5,  0.5 ],
      [ -0.5, -0.5, -0.5 ],
      [ -0.5,  0.5, -0.5 ],
      [  0.5,  0.5, -0.5 ],
      [  0.5, -0.5, -0.5 ]
    ];
    var fColor = [
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],

      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]

    var cubeNormals = [
      [],
      [  0.0,  0.0,  1.0 ], // depan
      [  1.0,  0.0,  0.0 ], // kanan
      [  0.0, -1.0,  0.0 ], // bawah
      [  0.0,  0.0, -1.0 ], // belakang
      [ -1.0,  0.0,  0.0 ], // kiri
      [  0.0,  1.0,  0.0 ], // atas
      []
    ];

    var moveFX = 0,
        moveFY = 0,
        moveFZ = 0;

    var dirFX = 1,
        dirFY = 1,
        dirFZ = 1;

    var scaleF = 0.1; 

    var eps = 0.05;

    var cube = {
      top : null,
      bottom : null,
      left : null, 
      right : null,
      front : null,
      back : null,
    }

    var rotFY = 0;
    function quad(a, b, c, d) {
      var indices = [a, b, c, a, c, d];
      for (var i=0; i < indices.length; i++) {
        for (var j=0; j < 3; j++) {
          vertices.push(cubePoints[indices[i]][j]);
        }
        for (var j=0; j < 3; j++) {
          vertices.push(1);
        }
        for (var j=0; j < 3; j++) {
          vertices.push(-cubeNormals[a][j]);
        }
        switch (indices[i]) {
          case a:
            vertices.push((a-2)*0.125);
            vertices.push(0.0);
            break;
          case b:
            vertices.push((a-2)*0.125);
            vertices.push(1.0);
            break;
          case c:
            vertices.push((a-1)*0.125);
            vertices.push(1.0);
            break;
          case d:
            vertices.push((a-1)*0.125);
            vertices.push(0.0);
            break;
        
          default:
            break;
        }
      }
    }

    function push_rect(a, b, c, d) {
      var indices = [a, b, c, a, c, d];
      for (var i=0; i < indices.length; i++) {
        for (var j=0; j < 3; j++) {
          fVertices.push(fPoints[indices[i]][j]);
        }
        for (var j=0; j < 3; j++) {
          fVertices.push(fColor[indices[i]][j]);
        }
      }
    }

    /*

       5----- 6
      /|     /|
    1-----2   |
    |  |  |   |
    |  4--|---7
    | /   |  /
    0-----3
    */
    // quad(0, 1, 3, 2);
    // quad(1, 0, 3, 2);
    // quad(2, 3, 7, 6);
    // quad(3, 0, 4, 7);
    // quad(4, 5, 6, 7);
    // quad(5, 4, 0, 1);
    // quad(6, 5, 1, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);
    nCube = 30;
    // quad(2, 6, 7, 3);
    // quad(0, 4, 7, 3);
    // quad(0, 4, 5, 1);
    push_rect(0, 1, 2, 3);
    push_rect(4, 5, 6, 7);
    push_rect(8, 9, 10, 11);
    push_rect(12, 13, 14, 15);
    push_rect(16, 17, 18, 19);
    push_rect(20, 21, 22, 23);
    push_rect(12, 13, 1, 0);
    push_rect(13, 18, 6, 1);
    push_rect(18, 19, 7, 6);
    push_rect(19, 16, 4, 7);
    push_rect(16, 21, 9, 4);
    push_rect(21, 22, 10, 9);
    push_rect(22, 23, 11, 10);
    push_rect(23, 20, 8, 11);
    push_rect(20, 15, 3, 8);
    push_rect(15, 12, 0, 3);
    nLetter = 96;
    initTexture();

    // Membuat sambungan untuk attribute

    // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
    function doCube(vPosition, vNormal, vTexCoord) {
      var vertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      
      gl.vertexAttribPointer(
        vPosition,    // variabel yang memegang posisi attribute di shader
        3,            // jumlah elemen per atribut
        gl.FLOAT,     // tipe data atribut
        gl.FALSE, 
        11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
        0                                   // offset dari posisi elemen di array
      );
      // gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
      //   6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(
        vNormal,
        3,
        gl.FLOAT,
        gl.FALSE,
        11 * Float32Array.BYTES_PER_ELEMENT,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.vertexAttribPointer(
        vTexCoord,
        2,
        gl.FLOAT,
        gl.FALSE,
        11 * Float32Array.BYTES_PER_ELEMENT,
        9 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vTexCoord);
      gl.enableVertexAttribArray(vNormal);
    }

    function doF(vPosition, vColor) {
      var vertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fVertices), gl.STATIC_DRAW);


      // Membuat sambungan untuk attribute
      
      gl.vertexAttribPointer(
        vPosition,    // variabel yang memegang posisi attribute di shader
        3,            // jumlah elemen per atribut
        gl.FLOAT,     // tipe data atribut
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
        0                                   // offset dari posisi elemen di array
      );
      gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vColor);
    }

    // Membuat sambungan untuk uniform
    var thetaUniformLocation = gl.getUniformLocation(program, 'theta');
    var theta = 0;
    var thetaSpeed = 0.0;
    var axis = [true, true, true];
    var x = 0;
    var y = 1;
    var z = 2;

    // Definisi untuk matriks model
    var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    var mm = glMatrix.mat4.create();
    
    glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

    // Definisi untuk matrix view dan projection
    var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    var vm = glMatrix.mat4.create();
    var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
    var pm = glMatrix.mat4.create();
    var camera = {x: 0.0, y: 0.0, z:0.0};
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(90), // fovy dalam radian
      canvas.width/canvas.height,     // aspect ratio
      0.5,  // near
      10.0, // far  
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    var dcLoc = gl.getUniformLocation(program, "diffuseColor");
    var dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0); // rgb
    gl.uniform3fv(dcLoc, dc);
    var ddLoc = gl.getUniformLocation(program, "diffusePosition");

    var acLoc = gl.getUniformLocation(program, "ambientColor");
    var ac = glMatrix.vec3.fromValues(0.17, 0.41, 0.14);
    gl.uniform3fv(acLoc, ac);

    // Uniform untuk modelMatrix vektor normal
    var nmLoc = gl.getUniformLocation(program, "normalMatrix");

    flagUniformLocation = gl.getUniformLocation(program, 'flag');
    gl.uniform1i(flagUniformLocation, 0);

    fFlagUniformLocation = gl.getUniformLocation(program, 'fFlag');
    gl.uniform1i(fFlagUniformLocation, 0);

    var AMORTIZATION = 0.56;
    var drag = false;
    var old_x, old_y;
    var dX = 0, dY = 0;
    theta = 0;
    phi = 0;

    var mouseDown = function(e) {
      console.log("down");
      drag = true;
      old_x = e.pageX, old_y = e.pageY;
      e.preventDefault();
      return false;
    };

    var mouseUp = function(e){
      drag = false;
    };

    var mouseMove = function(e) {
      if (!drag) return false;
      dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
      dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
      theta+= dX;
      phi+=dY;
      old_x = e.pageX, old_y = e.pageY;
      e.preventDefault();
    };

    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mouseout", mouseUp, false);
    document.addEventListener("mousemove", mouseMove, false);

    function initTexture() {
      // Uniform untuk tekstur
      var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
      gl.uniform1i(sampler0Loc, 0);
  
      // Create a texture.
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
  
      // Fill the texture with a 1x1 blue pixel.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));
  
      // Asynchronously load an image
      var image = new Image();
      image.src = "images/img.jpg";
      image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
      });
    }

    function matrix_multiplication(a, b) {
      var c1,c2,c3,c4;
      c1 = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3]
      c2 = a[1]*b[0] + a[5]*b[1] + a[9]*b[2] + a[13]*b[3]
      c3 = a[2]*b[0] + a[6]*b[1] + a[10]*b[2] + a[14]*b[3]
      c4 = a[3]*b[0] + a[7]*b[1] + a[11]*b[2] + a[15]*b[3]
      return [c1,c2,c3,c4]
    }

    function rotateX(m, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv1 = m[1], mv5 = m[5], mv9 = m[9];
  
      m[1] = m[1]*c-m[2]*s;
      m[5] = m[5]*c-m[6]*s;
      m[9] = m[9]*c-m[10]*s;
  
      m[2] = m[2]*c+mv1*s;
      m[6] = m[6]*c+mv5*s;
      m[10] = m[10]*c+mv9*s;
    }
  
    function rotateY(m, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv0 = m[0], mv4 = m[4], mv8 = m[8];
  
      m[0] = c*m[0]+s*m[2];
      m[4] = c*m[4]+s*m[6];
      m[8] = c*m[8]+s*m[10];
  
      m[2] = c*m[2]-s*mv0;
      m[6] = c*m[6]-s*mv4;
      m[10] = c*m[10]-s*mv8;
    }

    function calcDistance(point, plane) {
      var v = glMatrix.vec3.create();
      var a = glMatrix.vec3.create();
      var b = glMatrix.vec3.create();
      var c = glMatrix.vec3.create();
      glMatrix.vec3.subtract(v, point, plane[0]);
      glMatrix.vec3.subtract(a, plane[1], plane[0]);
      glMatrix.vec3.subtract(b, plane[2], plane[1]);
      glMatrix.vec3.cross(c, a, b);
      return Math.abs(glMatrix.vec3.dot(v, c));
    }

    function detect(curF) {
      var changeX = 0;
      var changeY = 0;
      var changeZ = 0;
      /*
       5----- 6
      /|     /|
    1-----2   |
    |  |  |   |
    |  4--|---7
    | /   |  /
    0-----3
    */
      for (i = 0; i < curF.length; i++) {
        if (calcDistance(curF[i], cube.top) < eps) {
          changeY = 1;
        }
        if (calcDistance(curF[i], cube.bottom) < eps) {
          changeY = 1;
        }
        if (calcDistance(curF[i], cube.left) < eps) {
          changeX = 1;
        }
        if (calcDistance(curF[i], cube.right) < eps) {
          changeX = 1;
        }
        if (calcDistance(curF[i], cube.front) < eps) {
          changeZ = 1;
        }
        if (calcDistance(curF[i], cube.back) < eps) {
          changeZ = 1;
        }
        // alert(calcDistance(curF[i], cube.top));
        //   console.log(calcDistance(curF[i], cube.bottom));
        //     console.log(calcDistance(curF[i], cube.right));
        //       console.log(calcDistance(curF[i], cube.left));
        //         console.log(calcDistance(curF[i], cube.front));
        //           console.log(calcDistance(curF[i], cube.back));
      }
      if (changeX > 0) {
        dirFX *= -1;
      }
      if (changeY > 0) {
        dirFY *= -1;
      }
      if (changeZ > 0) {
        dirFZ *= -1;
      }
    }

    function render() {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // thetaSpeed = 0.01;
      theta += thetaSpeed;
      // Perhitungan modelMatrix untuk vektor normal
      var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);
      if (axis[z]) glMatrix.mat4.rotateZ(mm, mm, thetaSpeed);
      if (axis[y]) glMatrix.mat4.rotateY(mm, mm, thetaSpeed);
      if (axis[x]) glMatrix.mat4.rotateX(mm, mm, thetaSpeed);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      glMatrix.mat4.lookAt(vm,
        [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
        [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
        [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
      );
      gl.uniformMatrix4fv(vmLoc, false, vm);
      if (!drag) {
        dX *= AMORTIZATION, dY*=AMORTIZATION;
        theta+=dX, phi+=dY;
      }
  
      mm[0] = 1, mm[1] = 0, mm[2] = 0,
      mm[3] = 0,
  
      mm[4] = 0, mm[5] = 1, mm[6] = 0,
      mm[7] = 0,
  
      mm[8] = 0, mm[9] = 0, mm[10] = 1,
      mm[11] = 0,
  
      mm[12] = 0, mm[13] = 0, mm[14] = 0,
      mm[15] = 1;
  
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
  
      rotateY(mm, theta);
      rotateX(mm, phi);

      var vPosition = gl.getAttribLocation(program, 'vPosition');
      var vNormal = gl.getAttribLocation(program, 'vNormal');
      var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
      doCube(vPosition, vNormal, vTexCoord);
      gl.uniform1i(flagUniformLocation, 0);
      gl.uniform1i(fFlagUniformLocation, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 30);
      gl.disableVertexAttribArray(vPosition);
      gl.disableVertexAttribArray(vNormal);
      gl.disableVertexAttribArray(vTexCoord);

      var mmf = glMatrix.mat4.create();
      glMatrix.mat4.copy(mmf, mm);
      glMatrix.mat4.translate(mmf, mmf, [moveFX, moveFY, moveFZ])
      glMatrix.mat4.rotate(mmf, mmf, rotFY, [0.0, 1.0, 0.0])
      glMatrix.mat4.scale(mmf, mmf, [0.25, 0.25, 0.25])
      var curPositionF = [];
      var curPositionCube = [];
      for(v = 0; v < fPoints.length; v++){
        var temp = matrix_multiplication(mmf,[...fPoints[v], 1.0]);
        curPositionF.push(temp);
      }

      for(v = 0; v < cubePoints.length; v++){
        var temp = matrix_multiplication(mm,[...cubePoints[v], 1.0]);
        curPositionCube.push(temp);
      }
      /*
       5----- 6
      /|     /|
    1-----2   |
    |  |  |   |
    |  4--|---7
    | /   |  /
    0-----3
    */
      cube.top = [curPositionCube[1], curPositionCube[2], curPositionCube[6]];
      cube.bottom = [curPositionCube[0], curPositionCube[4], curPositionCube[7]];
      cube.right = [curPositionCube[2], curPositionCube[6], curPositionCube[7]];
      cube.left = [curPositionCube[0], curPositionCube[1], curPositionCube[5]];
      cube.front = [curPositionCube[0], curPositionCube[1], curPositionCube[2]];
      cube.back = [curPositionCube[4], curPositionCube[5], curPositionCube[6]];
      detect(curPositionF);
      var topFX = -10;
      var botFX = 10;
      var topFY = -10;
      var botFY = 10;
      var topFZ = -10;
      var botFZ = 10;
      for (var i = 0; i < curPositionF.length; i++) {
        topFX = Math.max(curPositionF[i][0], topFX);
        topFY = Math.max(curPositionF[i][1], topFY);
        topFZ = Math.max(curPositionF[i][2], topFZ);
        botFX = Math.min(curPositionF[i][0], botFX);
        botFY = Math.min(curPositionF[i][1], botFY);
        botFZ = Math.min(curPositionF[i][2], botFZ);
      }
      var dd = glMatrix.vec3.fromValues((botFX + topFX) / 2, (botFY + topFY) / 2, (botFZ + topFZ) / 2);  // xyz
      gl.uniform3fv(ddLoc, dd);

      rotFY += 0.01;
      moveFX += dirFX * 0.01 ;
      moveFY += dirFY * 0.01;
      moveFZ += dirFZ * 0.01;
      gl.uniformMatrix4fv(mmLoc, false, mmf);
      vPosition = gl.getAttribLocation(program, 'vPosition');
      var vColor = gl.getAttribLocation(program, 'vColor');
      doF(vPosition, vColor);
      gl.uniform1i(flagUniformLocation, 1);
      gl.uniform1i(fFlagUniformLocation, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 96);
      gl.disableVertexAttribArray(vColor);
      requestAnimationFrame(render);
    }
    gl.clearColor(10/255, 50/255, 50/255, 1.0);
    gl.enable(gl.DEPTH_TEST);
    render();
  }
})();