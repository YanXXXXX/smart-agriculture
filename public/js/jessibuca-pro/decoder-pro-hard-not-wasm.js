(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
   * @module mat4
   */

  /**
   * Creates a new identity mat4
   *
   * @returns {mat4} a new 4x4 matrix
   */

  function create$1() {
    var out = new ARRAY_TYPE(16);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  /**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Alias for {@link mat4.orthoNO}
   * @function
   */

  var ortho = orthoNO;
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {ReadonlyVec3} eye Position of the viewer
   * @param {ReadonlyVec3} center Point the viewer is looking at
   * @param {ReadonlyVec3} up vec3 pointing up
   * @returns {mat4} out
   */

  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  (function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  })();

  var createWebGL = ((gl, openWebglAlignment) => {
    const vertexShaderScript = `
            attribute vec4 aVertexPosition;
            attribute vec2 aTexturePosition;
            uniform mat4 uModelMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uProjectionMatrix;
            varying lowp vec2 vTexturePosition;
            void main(void) {
              gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
              vTexturePosition = aTexturePosition;
            }
        `;
    const fragmentShaderScript = `
            precision highp float;
            varying highp vec2 vTexturePosition;
            uniform int isyuv;
            uniform sampler2D rgbaTexture;
            uniform sampler2D yTexture;
            uniform sampler2D uTexture;
            uniform sampler2D vTexture;

            const mat4 YUV2RGB = mat4( 1.1643828125, 0, 1.59602734375, -.87078515625,
                                       1.1643828125, -.39176171875, -.81296875, .52959375,
                                       1.1643828125, 2.017234375, 0, -1.081390625,
                                       0, 0, 0, 1);


            void main(void) {

                if (isyuv>0) {

                    highp float y = texture2D(yTexture,  vTexturePosition).r;
                    highp float u = texture2D(uTexture,  vTexturePosition).r;
                    highp float v = texture2D(vTexture,  vTexturePosition).r;
                    gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;

                } else {
                    gl_FragColor =  texture2D(rgbaTexture, vTexturePosition);
                }
            }
        `;
    if (openWebglAlignment) {
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }
    const shaderProgram = _initShaderProgram();
    let _programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        texturePosition: gl.getAttribLocation(shaderProgram, 'aTexturePosition')
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
        viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
        rgbatexture: gl.getUniformLocation(shaderProgram, 'rgbaTexture'),
        ytexture: gl.getUniformLocation(shaderProgram, 'yTexture'),
        utexture: gl.getUniformLocation(shaderProgram, 'uTexture'),
        vtexture: gl.getUniformLocation(shaderProgram, 'vTexture'),
        isyuv: gl.getUniformLocation(shaderProgram, 'isyuv')
      }
    };
    let _buffers = _initBuffers();
    let _rgbatexture = _createTexture();
    let _ytexture = _createTexture();
    let _utexture = _createTexture();
    let _vtexture = _createTexture();
    function _initBuffers() {
      // Create a buffer for the cube's vertex positions.
      const positionBuffer = gl.createBuffer();

      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Now create an array of positions for the cube.

      const positions = [
      // Front face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      // Now set up the colors for the faces. We'll use solid colors
      // for each face.

      //   const facePos = [
      //     [0.0,  0.0],
      //     [1.0,  0.0],
      //     [1.0,  1.0],
      //     [0.0,  1.0]
      //   ];

      const facePos = [[0.0, 1.0], [1.0, 1.0], [1.0, 0.0], [0.0, 0.0]];

      // Convert the array of colors into a table for all the vertices.

      var texturePos = [];
      texturePos = texturePos.concat(...facePos);
      const texpositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, texpositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePos), gl.STATIC_DRAW);

      // Build the element array buffer; this specifies the indices
      // into the vertex arrays for each face's vertices.

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // This array defines each face as two triangles, using the
      // indices into the vertex array to specify each triangle's
      // position.

      const indices = [0, 1, 2, 0, 2, 3];

      // Now send the element array to GL

      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
      return {
        position: positionBuffer,
        texPosition: texpositionBuffer,
        indices: indexBuffer
      };
    }
    function _createTexture() {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    }
    function _loadShader(type, source) {
      const shader = gl.createShader(type);

      // Send the source to the shader object

      gl.shaderSource(shader, source);

      // Compile the shader program

      gl.compileShader(shader);

      // See if it compiled successfully

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    function _initShaderProgram() {
      const vertexShader = _loadShader(gl.VERTEX_SHADER, vertexShaderScript);
      const fragmentShader = _loadShader(gl.FRAGMENT_SHADER, fragmentShaderScript);

      // Create the shader program

      const shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      // If creating the shader program failed, alert

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
      return shaderProgram;
    }
    function _drawScene(w, h) {
      gl.viewport(0, 0, w, h);
      gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
      gl.clearDepth(1.0); // Clear everything
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.depthFunc(gl.LEQUAL); // Near things obscure far things

      // Clear the canvas before we start drawing on it.

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = create$1();
      ortho(projectionMatrix, -1, 1, -1, 1, zNear, zFar);

      // Set the drawing position to the "identity" point, which is
      // the center of the scene.
      const modelMatrix = create$1();
      identity(modelMatrix);
      const viewMatrix = create$1();
      lookAt(viewMatrix, fromValues(0, 0, 0), fromValues(0, 0, -1), fromValues(0, 1, 0));

      // Tell WebGL how to pull out the positions from the position
      // buffer into the vertexPosition attribute
      {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, _buffers.position);
        gl.vertexAttribPointer(_programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(_programInfo.attribLocations.vertexPosition);
      }

      // Tell WebGL how to pull out the colors from the color buffer
      // into the vertexColor attribute.
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, _buffers.texPosition);
        gl.vertexAttribPointer(_programInfo.attribLocations.texturePosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(_programInfo.attribLocations.texturePosition);
      }
      let rgbatextunit = 2;
      let ytextunit = rgbatextunit + 1;
      let utextunit = rgbatextunit + 2;
      let vtextunit = rgbatextunit + 3;
      gl.activeTexture(gl.TEXTURE0 + ytextunit);
      gl.bindTexture(gl.TEXTURE_2D, _ytexture);
      gl.activeTexture(gl.TEXTURE0 + utextunit);
      gl.bindTexture(gl.TEXTURE_2D, _utexture);
      gl.activeTexture(gl.TEXTURE0 + vtextunit);
      gl.bindTexture(gl.TEXTURE_2D, _vtexture);

      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _buffers.indices);

      // Tell WebGL to use our program when drawing

      gl.useProgram(_programInfo.program);

      // Set the shader uniforms

      gl.uniformMatrix4fv(_programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(_programInfo.uniformLocations.modelMatrix, false, modelMatrix);
      gl.uniformMatrix4fv(_programInfo.uniformLocations.viewMatrix, false, viewMatrix);
      gl.uniform1i(_programInfo.uniformLocations.rgbatexture, rgbatextunit);
      gl.uniform1i(_programInfo.uniformLocations.ytexture, ytextunit);
      gl.uniform1i(_programInfo.uniformLocations.utexture, utextunit);
      gl.uniform1i(_programInfo.uniformLocations.vtexture, vtextunit);
      gl.uniform1i(_programInfo.uniformLocations.isyuv, 1);
      {
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }

      // Update the rotation for the next draw
    }

    return {
      render: function (width, height, y, u, v) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, _ytexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, y);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, _utexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width / 2, height / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, u);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, _vtexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width / 2, height / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, v);
        _drawScene(width, height);
      },
      renderYUV: function (width, height, data) {
        let y = data.slice(0, width * height);
        let u = data.slice(width * height, width * height * 5 / 4);
        let v = data.slice(width * height * 5 / 4, width * height * 3 / 2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, _ytexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, y);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, _utexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width / 2, height / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, u);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, _vtexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width / 2, height / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, v);
        _drawScene(width, height);
      },
      destroy: function () {
        gl.deleteProgram(_programInfo.program);
        gl.deleteBuffer(_buffers.position);
        gl.deleteBuffer(_buffers.texPosition);
        gl.deleteBuffer(_buffers.indices);
        gl.deleteTexture(_rgbatexture);
        gl.deleteTexture(_ytexture);
        gl.deleteTexture(_utexture);
        gl.deleteTexture(_vtexture);
        _programInfo = null;
        _buffers = null;
        _rgbatexture = null;
        _ytexture = null;
        _utexture = null;
        _vtexture = null;
      }
    };
  });

  // 播放协议
  const PLAYER_PLAY_PROTOCOL = {
    websocket: 1,
    fetch: 2,
    hls: 3,
    webrtc: 4,
    webTransport: 5,
    aliyunRtc: 6,
    ts: 7
  };
  const PLAYER_STREAM_TYPE = {
    fetch: 'fetch',
    hls: 'hls',
    websocket: 'websocket',
    webrtc: 'webrtc',
    webTransport: 'webTransport',
    worker: 'worker',
    aliyunRtc: 'aliyunRtc'
  };

  // 播放
  const PLAY_TYPE = {
    player: "player",
    playerAudio: 'playerAudio',
    playbackTF: 'playbackTF'
  };
  const FILE_SUFFIX = {
    mp4: 'mp4',
    webm: 'webm',
    flv: 'flv',
    mov: 'mov'
  };
  const DEMUX_TYPE = {
    flv: 'flv',
    m7s: 'm7s',
    hls: 'hls',
    webrtc: 'webrtc',
    webTransport: 'webTransport',
    nakedFlow: 'nakedFlow',
    fmp4: 'fmp4',
    mpeg4: 'mpeg4',
    aliyunRtc: 'aliyunRtc',
    ts: 'ts'
  };
  const DECODE_TYPE = {
    mse: 'mse',
    wcs: 'wcs',
    offscreen: 'offscreen',
    wasm: 'wasm',
    simd: 'simd',
    mt: 'mt',
    webrtc: 'webrtc',
    hls: 'hls',
    aliyunRtc: 'aliyunRtc'
  };
  const RENDER_TYPE = {
    canvas: 'canvas',
    video: 'video'
  };
  const DEBUG_LEVEL = {
    debug: 'debug',
    warn: 'warn'
  };
  const PTZ_ACTIVE_EVENT_TYPE = {
    click: 'click',
    mouseDownAndUp: 'mouseDownAndUp'
  };
  const PLAYBACK_CONTROL_TYPE = {
    normal: 'normal',
    // default normal 24H
    simple: 'simple'
  };
  const DEFAULT_PLAYBACK_FORWARD_MAX_RATE_DECODE_IFRAME = 4; // default playback forward max rate decode iframe

  const FRAME_TS_MAX_DIFF = 1000 * 60 * 60; // 1 hour

  const SIMD_H264_DECODE_MAX_WIDTH = 4080;
  const VIDEO_PAYLOAD_MIN_SIZE = 12; // video payload min size: 12 byte

  const DEMUX_LOOP_INTERVAL_TIMES = 20; // 20ms

  const ERROR_MESSAGE_TIPS = {
    webglAlignmentError: 'Webgl 渲染失败',
    webglContextLostError: 'webgl 上下文丢失',
    mediaSourceH265NotSupport: '不支持硬解码H265',
    mediaSourceFull: '缓冲区已满',
    mediaSourceAppendBufferError: '初始化解码器失败',
    mseSourceBufferError: '解码失败',
    mseAddSourceBufferError: '初始化解码器失败',
    mediaSourceDecoderConfigurationError: '初始化解码器失败',
    mediaSourceTsIsMaxDiff: '流异常',
    mseWidthOrHeightChange: '流异常',
    mediaSourceAudioG711NotSupport: '硬解码不支持G711a/u音频格式',
    mediaSourceUseCanvasRenderPlayFailed: 'MediaSource解码使用canvas渲染失败',
    webcodecsH265NotSupport: '不支持硬解码H265',
    webcodecsUnsupportedConfigurationError: '初始化解码器失败',
    webcodecsDecodeConfigureError: '初始化解码器失败',
    webcodecsDecodeError: '解码失败',
    wcsWidthOrHeightChange: '解码失败',
    wasmDecodeError: '解码失败',
    simdDecodeError: '解码失败',
    wasmWidthOrHeightChange: '流异常',
    wasmUseVideoRenderError: 'video自动渲染失败',
    videoElementPlayingFailed: 'video自动渲染失败',
    simdH264DecodeVideoWidthIsTooLarge: '不支持该分辨率的视频',
    networkDelayTimeout: '网络超时重播失败',
    fetchError: '请求失败',
    streamEnd: '请求结束',
    websocketError: '请求失败',
    webrtcError: '请求失败',
    hlsError: '请求失败',
    decoderWorkerInitError: '初始化worker失败',
    videoElementPlayingFailedForWebrtc: 'video自动渲染失败',
    videoInfoError: '解析视频分辨率失败',
    webrtcStreamH265: 'webrtc不支持H265',
    delayTimeout: '播放超时重播失败',
    loadingTimeout: '加载超时重播失败',
    loadingTimeoutRetryEnd: '加载超时重播失败',
    delayTimeoutRetryEnd: '播放超时重播失败'
  };

  // default player options
  const DEFAULT_PLAYER_OPTIONS = {
    playType: PLAY_TYPE.player,
    // inner
    container: '',
    //
    videoBuffer: 1 * 1000,
    // 1* 1000ms == 1 second
    videoBufferDelay: 1 * 1000,
    // 1 * 1000ms
    networkDelay: 10 * 1000,
    //  10 * 1000ms
    isResize: true,
    //
    isFullResize: false,
    // full resize
    isFlv: false,
    // flv
    isHls: false,
    // hls（inner）
    isFmp4: false,
    // fmp4,
    isFmp4Private: false,
    // 是否是fmp4私有协议
    isWebrtc: false,
    // webrtc (inner)
    isWebrtcForZLM: false,
    // webrtc for ZLM
    isWebrtcForSRS: false,
    // webrtc for SRS
    isWebrtcForOthers: false,
    // webrtc for others
    isNakedFlow: false,
    // 是否是裸流（264、265）
    isMpeg4: false,
    // 是否是mpeg4
    isAliyunRtc: false,
    // 是否是阿里云rtc
    isTs: false,
    // 是否是ts流
    debug: false,
    // debug log
    debugLevel: DEBUG_LEVEL.warn,
    // log level
    debugUuid: '',
    // debug uuid (inner)
    isMulti: true,
    // 是否多实例播放(配置log用的)
    multiIndex: -1,
    // 多实例播放的index
    hotKey: false,
    // 快捷键
    loadingTimeout: 10,
    // loading timeout 单位秒
    heartTimeout: 10,
    // heart timeout 单位秒
    timeout: 10,
    // timeout 单位秒
    pageVisibilityHiddenTimeout: 5 * 60,
    //   5 * 60  = 5 minute
    loadingTimeoutReplay: true,
    // loading timeout replay
    heartTimeoutReplay: true,
    // heart timeout replay。
    loadingTimeoutReplayTimes: 3,
    // loading timeout replay fail times
    heartTimeoutReplayTimes: 3,
    // heart timeout replay fail times
    heartTimeoutReplayUseLastFrameShow: true,
    // heart timeout replay use last frame
    replayUseLastFrameShow: true,
    // replay use last frame
    replayShowLoadingIcon: false,
    // replay show loading icon
    supportDblclickFullscreen: false,
    showBandwidth: false,
    //
    showPerformance: false,
    // 是否显示性能面板
    mseCorrectTimeDuration: 20,
    // mse correct time duration 20ms
    mseCorrectAudioTimeDuration: 20,
    // mse correct audio time duration 20ms
    keepScreenOn: true,
    // keep screen on
    isNotMute: false,
    hasAudio: true,
    hasVideo: true,
    operateBtns: {
      fullscreen: false,
      screenshot: false,
      play: false,
      audio: false,
      record: false,
      ptz: false,
      quality: false,
      zoom: false,
      close: false,
      scale: false,
      performance: false,
      logSave: false,
      aiFace: false,
      aiObject: false,
      aiOcclusion: false,
      fullscreenFn: null,
      fullscreenExitFn: null,
      screenshotFn: null,
      playFn: null,
      pauseFn: null,
      recordFn: null,
      recordStopFn: null
    },
    extendOperateBtns: [],
    contextmenuBtns: [],
    watermarkConfig: {},
    // 局部水印设置
    controlAutoHide: false,
    hasControl: false,
    // inner params
    loadingIcon: true,
    // is show loading icon
    loadingIconStyle: {},
    // loading icon style
    loadingText: '',
    background: '',
    backgroundLoadingShow: true,
    // 加载过程中是否显示背景
    loadingBackground: '',
    // 内部参数 重新播放过程中，显示播放失败前的最后一帧数据。
    loadingBackgroundWidth: 0,
    // 内部参数 重新播放过程中，显示播放失败前的最后一帧数据 width。
    loadingBackgroundHeight: 0,
    // 内部参数 重新播放过程中，显示播放失败前的最后一帧数据 height。
    decoder: 'decoder-pro.js',
    decoderAudio: 'decoder-pro-audio.js',
    decoderHard: 'decoder-pro-hard.js',
    // 硬解码
    decoderHardNotWasm: 'decoder-pro-hard-not-wasm.js',
    // 硬解码
    wasmMp4RecorderDecoder: 'jessibuca-pro-mp4-recorder-decoder.js',
    // wasm mp4 recorder decoder
    decoderWASM: '',
    isDecoderUseCDN: false,
    url: '',
    // inner
    rotate: 0,
    mirrorRotate: 'none',
    // 镜像xx
    aspectRatio: 'default',
    // 比例支持 4:3, 16:9,
    playbackConfig: {
      playList: [],
      // {start:xx,end:xx,more:xx}
      fps: '',
      // fps值
      showControl: true,
      controlType: PLAYBACK_CONTROL_TYPE.normal,
      //
      duration: 0,
      // duration 持续时间。
      startTime: '',
      // 开始时间
      showRateBtn: false,
      rateConfig: [],
      // 播放倍率切换，支持[{label:'正常',value:1},{label:'2倍',value:2}]
      showPrecision: '',
      // 初始化显示精度 'oneHour', 'halfHour', 'tenMin', 'fiveMin'。
      showPrecisionBtn: true,
      // 是否显示精度切换按钮
      isCacheBeforeDecodeForFpsRender: false,
      // rfs渲染时，是否在解码前缓存数据
      uiUsePlaybackPause: false,
      // ui上面是否使用 playbackPause 方法
      isPlaybackPauseClearCache: true,
      // playbackPause是否清除缓存数据
      isUseFpsRender: false,
      // 是否使用固定的fps渲染，播放器会动态计算流的fps
      isUseLocalCalculateTime: false,
      // 是否使用本地时间来计算playback时间
      localOneFrameTimestamp: 40,
      // 一帧 40ms, isUseLocalCalculateTime 为 true 生效。
      supportWheel: false,
      // 是否支持滚动轴切换精度。
      useWCS: false,
      // 是否使用wcs解码
      useMSE: false // 是否使用mse解码
    },

    qualityConfig: [],
    // 支持 ['高清','超清','4K']
    defaultStreamQuality: '',
    scaleConfig: ['拉伸', '缩放', '正常'],
    // text: '',
    forceNoOffscreen: true,
    // 默认是不采用
    hiddenAutoPause: false,
    protocol: PLAYER_PLAY_PROTOCOL.fetch,
    // 内部参数
    demuxType: DEMUX_TYPE.flv,
    // 内部参数
    useWasm: false,
    //wasm 解码 （inner）默认
    useMSE: false,
    // mse 解码
    useWCS: false,
    // wcs 解码
    useSIMD: true,
    // pro 默认优先使用wasm simd解码，不支持则使用wasm解码
    useMThreading: false,
    // 是否使用多线程解码
    wcsUseVideoRender: true,
    // wcs 是否使用 video 渲染
    wcsUseWebgl2Render: true,
    // canvas 模式下 wcs 是否使用webgl2渲染
    wasmUseVideoRender: true,
    // wasm 用video标签渲染
    mseUseCanvasRender: false,
    //mse 用canvas标签渲染
    hlsUseCanvasRender: false,
    // hls 用canvas标签渲染
    webrtcUseCanvasRender: false,
    // webrtc 用canvas标签渲染 待定

    useOffscreen: false,
    //  内部参数（废弃）
    useWebGPU: false,
    //  是否使用webgpu引擎
    mseDecodeErrorReplay: true,
    // mse 解码失败重新播放
    wcsDecodeErrorReplay: true,
    // wcs 解码失败重新播放
    wasmDecodeErrorReplay: true,
    // 解码失败重新播放。
    simdDecodeErrorReplay: true,
    // simd 解码失败重新播放。
    simdDecodeErrorReplayType: DECODE_TYPE.wasm,
    // simd 解码失败重新播放类型: wasm 或者 simd
    autoWasm: true,
    // 自动降级到 wasm 模式
    decoderErrorAutoWasm: true,
    // 解码失败自动降级到 wasm 模式
    hardDecodingNotSupportAutoWasm: true,
    // 硬解码不支持自动降级到 wasm 模式
    webglAlignmentErrorReplay: true,
    // webgl对齐失败重新播放。
    webglContextLostErrorReplay: true,
    // webgl context lost 重新播放。
    openWebglAlignment: false,
    //  https://github.com/langhuihui/jessibuca/issues/152
    syncAudioAndVideo: false,
    // 音视频同步
    syncAudioAndVideoDiff: 500,
    // ms
    // playback config
    playbackDelayTime: 1000,
    // TF卡流播放延迟时间  Inner
    playbackFps: 25,
    // Inner
    playbackForwardMaxRateDecodeIFrame: DEFAULT_PLAYBACK_FORWARD_MAX_RATE_DECODE_IFRAME,
    // max rate render i frame , Inner
    playbackCurrentTimeMove: true,
    // Inner 录像流数据的当前时间是否跟着播放时长移动

    useVideoRender: true,
    // 使用video标签渲染
    useCanvasRender: false,
    // 使用canvas渲染
    networkDelayTimeoutReplay: false,
    // 网络延迟重连
    recordType: FILE_SUFFIX.mp4,
    checkFirstIFrame: true,
    // 检查第一帧是否是I帧
    nakedFlowFps: 25,
    // 裸流fps
    audioEngine: null,
    // 音频引擎
    isShowRecordingUI: true,
    // 是否显示录制中UI
    isShowZoomingUI: true,
    // 是否显示缩放中
    useFaceDetector: false,
    // 使用人脸检测
    useObjectDetector: false,
    // 使用物体检测
    useImageDetector: false,
    // 使用图片检测
    useOcclusionDetector: false,
    // 使用遮挡检测
    ptzPositionConfig: {},
    // position config
    ptzShowType: 'vertical',
    // vertical 垂直,level 水平
    ptzClickType: PTZ_ACTIVE_EVENT_TYPE.click,
    // PTZ 点击类型
    ptzStopEmitDelay: 0.3,
    // ptz停止后，停止发送指令的延迟时间(秒)
    ptzZoomShow: false,
    // ptz操作是否显示放大缩小操作
    ptzApertureShow: false,
    // ptz操作是否显示光圈操作
    ptzFocusShow: false,
    // ptz操作是否显示聚焦操作
    ptzMoreArrowShow: false,
    // ptz操作是否显示更多箭头
    ptzCruiseShow: false,
    // ptz操作是否显示巡航操作
    ptzFogShow: false,
    // ptz操作是否显示透雾操作
    ptzWiperShow: false,
    // ptz操作是否显示雨刷操作
    ptzSupportDraggable: false,
    // ptz是否支持拖拽
    // 微信安卓音频播放块大小
    // 计算规则 48000 * ms / 1000 = size,
    // 48000 * 200 /1000 = 9600  播放时长200ms
    // 48000 * 175 /1000 = 8400  播放时长175ms
    // 48000 * 150 /1000 = 7200  播放时长150ms
    // 48000 * 125 /1000 = 6000  播放时长125ms
    // 48000 * 100 /1000 = 4800  播放时长100ms default
    // 48000 * 50 /1000 = 2400  播放时长50ms
    // 48000 * 25 /1000 = 1200  播放时长25ms
    // 48000 * 10 /1000 = 480  播放时长10ms
    weiXinInAndroidAudioBufferSize: 4800,
    isM7sCrypto: false,
    // 是否是m7s加密,
    m7sCryptoAudio: false,
    // m7s音频是否加密
    isSm4Crypto: false,
    // 是否是sm4加密
    isXorCrypto: false,
    // 是否是xor加密
    sm4CryptoKey: '',
    // sm4加密key
    m7sCryptoKey: '',
    xorCryptoKey: '',
    // xor加密key
    cryptoKey: '',
    // 加密key
    cryptoIV: '',
    // 加密iv
    cryptoKeyUrl: '',
    // 加密key获取域名(for m7s)
    autoResize: false,
    // 自动调整大小 inner
    useWebFullScreen: false,
    // 使用web全屏(旋转播放器90度)(只会在移动端生效)
    ptsMaxDiff: 60 * 60,
    //单位(秒)，默认值是1H
    aiFaceDetectLevel: 2,
    // 人脸检测等级(1-5)
    aiFaceDetectWidth: 240,
    // 人脸检测宽度（inner）
    aiFaceDetectShowRect: true,
    // 人脸检测显示框子
    aiFaceDetectInterval: 1000,
    // 人脸检测时间间隔 ms
    aiFaceDetectRectConfig: {},
    // 人脸检测框子配置
    aiObjectDetectLevel: 2,
    // 物体检测等级(1-5)
    aiObjectDetectWidth: 240,
    // 物体检测宽度（inner）
    aiObjectDetectShowRect: true,
    // 物体检测显示框子
    aiObjectDetectInterval: 1000,
    // 物品检测时间间隔 ms
    aiObjectDetectRectConfig: {},
    // 物体检测框子配置
    aiOcclusionDetectInterval: 1000,
    // 遮挡检测时间间隔 ms
    aiImageDetectDrop: false,
    // 图片检测是否丢弃不渲染
    aiImageDetectActive: false,
    // 图片检测是否激活
    videoRenderSupportScale: true,
    // video渲染支持Scale
    mediaSourceTsIsMaxDiffReplay: true,
    // 当ts间隔超过最大值之后，重新播放
    controlHtml: '',
    // 自定义控制栏Html
    isH265: false,
    // 是否是h265,
    isWebrtcH265: false,
    // 是否是webrtc h265
    supportLockScreenPlayAudio: true,
    // 是否支持锁屏播放音频（mobile,ipad 端）
    supportHls265: false,
    // 是否支持hls265
    isEmitSEI: false,
    // 是否发送sei
    pauseAndNextPlayUseLastFrameShow: false,
    // pause->play 使用最后一帧显示
    demuxUseWorker: true,
    // demux 使用worker 解析 其中，
    playFailedAndReplay: true,
    // 播放失败(异常原因)后，重新播放。(统一配置参数)
    showMessageConfig: ERROR_MESSAGE_TIPS,
    // 播放失败提示信息配置
    videoElementPlayingFailedReplay: true,
    // video 播放失败，主要是自动播放的时候，video不允许播放的情况下，降级会canvas。
    mp4RecordUseWasm: true,
    // mp4 record 使用 wasm
    //  for mse
    mseAutoCleanupSourceBuffer: true,
    // 是否自动清理sourceBuffer（inner）
    mseAutoCleanupMaxBackwardDuration: 30,
    // 30s （inner）
    mseAutoCleanupMinBackwardDuration: 10,
    // 10s（inner）

    // replay
    widthOrHeightChangeReplay: true,
    // 宽高变化重新播放
    simdH264DecodeVideoWidthIsTooLargeReplay: true,
    // simd h264 解码视频宽度过大重新播放
    mediaSourceAudioG711NotSupportReplay: true,
    // mediaSource audio g711 not support replay (inner)
    mediaSourceAudioInitTimeoutReplay: true,
    // mediaSource audio init timeout replay  (inner)
    mediaSourceUseCanvasRenderPlayFailedReplay: true,
    // mediaSource 解码使用canvas渲染失败重新播放
    mediaSourceUseCanvasRenderPlayFailedReplayType: RENDER_TYPE.video,
    // mediaSource 解码使用canvas渲染失败重新播放类型:mse+video,或者wasm+canvas
    widthOrHeightChangeReplayDelayTime: 0,
    // 单位秒，宽高变化重新播放延迟时间
    // 幽灵水印设置
    ghostWatermarkConfig: {
      on: 5,
      // 幽灵模式开启时间
      off: 5,
      // 幽灵模式关闭时间
      content: '',
      // 幽灵水印内容
      fontSize: 12,
      // 幽灵水印字体大小
      color: 'white',
      // 幽灵水印颜色
      opacity: 0.15,
      // 幽灵水印透明度
      speed: 0.2 // 幽灵水印速度
    },

    //  动态水印设置
    dynamicWatermarkConfig: {
      content: '',
      // 动态水印内容
      speed: 0.2,
      // 动态水印速度
      fontSize: 12,
      // 动态水印字体大小
      color: 'white',
      // 动态水印颜色
      opacity: 0.15 // 动态水印透明度
    },

    // 遇上时间戳相同的流，直接扔掉整个gop数据。
    isDropSameTimestampGop: false,
    mseDecodeAudio: false,
    //  mse 解码音频数据(支持aac/mp3)

    nakedFlowH265DemuxUseNew: true,
    // 裸流h265解封装用new的

    //自定义扩展dom
    extendDomConfig: {
      html: '',
      showBeforePlay: false,
      //是否在播放前显示
      showAfterLoading: true //是否在加载后显示
    },

    disableContextmenu: false,
    // 是否禁用右键菜单
    websocket1006ErrorReplay: false,
    // ws1006错误重播

    websocket1006ErrorReplayDelayTime: 0,
    //ws1006错误延迟重播时间
    mseDecoderUseWorker: false,
    openMemoryLog: false,
    // 是否打开内存日志
    mainThreadFetchUseWorker: true,
    // 主线程解码的时候fetch 是否通过单独的 worker fetch
    playFailedAndPausedShowPlayBtn: true,
    // 播放失败并暂停，是否显示播放按钮
    mseCorrectionTimestamp: true // mse解码是否纠正时间戳。
  };

  const WORKER_CMD_TYPE = {
    init: 'init',
    initVideo: 'initVideo',
    render: 'render',
    playAudio: 'playAudio',
    initAudio: 'initAudio',
    kBps: 'kBps',
    decode: 'decode',
    audioCode: 'audioCode',
    audioNalu: 'audioNalu',
    audioAACSequenceHeader: 'audioAACSequenceHeader',
    videoCode: 'videoCode',
    videoCodec: 'videoCodec',
    videoNalu: 'videoNalu',
    videoPayload: 'videoPayload',
    audioPayload: 'audioPayload',
    wasmError: 'wasmError',
    workerFetch: 'workerFetch',
    iframeIntervalTs: 'iframeIntervalTs',
    isDropping: 'isDropping',
    workerEnd: 'workerEnd',
    networkDelay: 'networkDelay',
    playbackStreamVideoFps: 'playbackStreamVideoFps',
    wasmDecodeVideoNoResponseError: 'wasmDecodeVideoNoResponseError',
    wasmWidthOrHeightChange: 'wasmWidthOrHeightChange',
    simdDecodeError: 'simdDecodeError',
    simdH264DecodeVideoWidthIsTooLarge: 'simdH264DecodeVideoWidthIsTooLarge',
    websocketOpen: 'websocketOpen',
    closeEnd: 'closeEnd',
    tempStream: 'tempStream',
    videoSEI: 'videoSEI',
    //  for flv recorder
    flvScriptData: 'flvScriptData',
    aacSequenceHeader: 'aacSequenceHeader',
    videoSequenceHeader: 'videoSequenceHeader',
    flvBufferData: 'flvBufferData',
    checkFirstIFrame: 'checkFirstIFrame',
    // for mse worker
    mseHandle: 'mseHandle',
    mseFirstRenderTime: 'mseFirstRenderTime',
    mseError: 'mseError'
  };

  const MEDIA_TYPE = {
    audio: 1,
    video: 2
  };
  const FLV_MEDIA_TYPE = {
    audio: 8,
    video: 9,
    scriptData: 18
  };
  const WORKER_SEND_TYPE = {
    init: 'init',
    decode: 'decode',
    audioDecode: 'audioDecode',
    videoDecode: 'videoDecode',
    initAudioCodec: 'initAudioCodec',
    initVideoCodec: 'initVideoCodec',
    close: 'close',
    updateConfig: 'updateConfig',
    resetDecode: 'resetDecode',
    clearBuffer: 'clearBuffer',
    resetAudioDecode: 'resetAudioDecode',
    resetVideoDecode: 'resetVideoDecode',
    fetchStream: 'fetchStream',
    sendWsMessage: 'sendWsMessage',
    // for mse worker
    mseUpdateVideoTimestamp: 'mseUpdateVideoTimestamp'
  };

  // inner events
  const EVENTS = {
    fullscreen: 'fullscreen$2',
    webFullscreen: 'webFullscreen',
    decoderWorkerInit: 'decoderWorkerInit',
    play: 'play',
    playing: 'playing',
    pause: 'pause',
    mute: 'mute',
    load: 'load',
    loading: 'loading',
    zooming: 'zooming',
    videoInfo: 'videoInfo',
    timeUpdate: 'timeUpdate',
    audioInfo: "audioInfo",
    log: 'log',
    error: "error",
    kBps: 'kBps',
    timeout: 'timeout',
    delayTimeout: 'delayTimeout',
    delayTimeoutRetryEnd: 'delayTimeoutRetryEnd',
    loadingTimeout: 'loadingTimeout',
    loadingTimeoutRetryEnd: 'loadingTimeoutRetryEnd',
    stats: 'stats',
    performance: "performance",
    videoSmooth: 'videoSmooth',
    faceDetectActive: 'faceDetectActive',
    objectDetectActive: 'objectDetectActive',
    occlusionDetectActive: 'occlusionDetectActive',
    imageDetectActive: 'imageDetectActive',
    // record
    record: 'record',
    recording: 'recording',
    recordingTimestamp: 'recordingTimestamp',
    recordStart: 'recordStart',
    recordEnd: 'recordEnd',
    recordCreateError: 'recordCreateError',
    recordBlob: 'recordBlob',
    buffer: 'buffer',
    videoFrame: 'videoFrame',
    videoSEI: 'videoSEI',
    start: 'start',
    metadata: 'metadata',
    resize: 'resize',
    volumechange: 'volumechange',
    destroy: 'destroy',
    beforeDestroy: 'beforeDestroy',
    // stream
    streamEnd: 'streamEnd',
    streamRate: 'streamRate',
    streamAbps: 'streamAbps',
    streamVbps: 'streamVbps',
    streamDts: 'streamDts',
    streamSuccess: 'streamSuccess',
    streamMessage: 'streamMessage',
    streamError: 'streamError',
    streamStats: 'streamStats',
    // MSE
    mseSourceOpen: 'mseSourceOpen',
    mseSourceClose: 'mseSourceClose',
    mseSourceended: 'mseSourceended',
    mseSourceStartStreaming: 'mseSourceStartStreaming',
    mseSourceEndStreaming: 'mseSourceEndStreaming',
    mseSourceBufferError: 'mseSourceBufferError',
    mseAddSourceBufferError: 'mseAddSourceBufferError',
    mseSourceBufferBusy: 'mseSourceBufferBusy',
    mseSourceBufferFull: 'mseSourceBufferFull',
    // VIDEO
    videoWaiting: 'videoWaiting',
    videoTimeUpdate: 'videoTimeUpdate',
    videoSyncAudio: 'videoSyncAudio',
    //
    playToRenderTimes: 'playToRenderTimes',
    playbackTime: 'playbackTime',
    playbackTimestamp: 'playbackTimestamp',
    playbackTimeScroll: 'playbackTimeScroll',
    playbackPrecision: 'playbackPrecision',
    // inner
    playbackShowPrecisionChange: 'playbackShowPrecisionChange',
    playbackJustTime: 'playbackJustTime',
    playbackStats: 'playbackStats',
    playbackSeek: 'playbackSeek',
    playbackPause: 'playbackPause',
    playbackPauseOrResume: 'playbackPauseOrResume',
    playbackRateChange: 'playbackRateChange',
    playbackPreRateChange: 'playbackPreRateChange',
    ptz: 'ptz',
    streamQualityChange: 'streamQualityChange',
    visibilityChange: "visibilityChange",
    netBuf: 'netBuf',
    close: 'close',
    networkDelayTimeout: 'networkDelayTimeout',
    togglePerformancePanel: 'togglePerformancePanel',
    viewResizeChange: 'viewResizeChange',
    flvDemuxBufferSizeTooLarge: 'flvDemuxBufferSizeTooLarge',
    // talk
    talkGetUserMediaSuccess: 'talkGetUserMediaSuccess',
    talkGetUserMediaFail: 'talkGetUserMediaFail',
    talkGetUserMediaTimeout: 'talkGetUserMediaTimeout',
    talkStreamStart: 'talkStreamStart',
    talkStreamOpen: 'talkStreamOpen',
    talkStreamClose: 'talkStreamClose',
    talkStreamError: 'talkStreamError',
    talkStreamInactive: 'talkStreamInactive',
    webrtcDisconnect: 'webrtcDisconnect',
    webrtcFailed: 'webrtcFailed',
    webrtcClosed: 'webrtcClosed',
    webrtcOnConnectionStateChange: 'webrtcOnConnectionStateChange',
    webrtcOnIceConnectionStateChange: 'webrtcOnIceConnectionStateChange',
    // crash
    crashLog: 'crashLog',
    // dom
    focus: 'focus',
    blur: 'blur',
    visibilityHiddenTimeout: 'visibilityHiddenTimeout',
    // websocket
    websocketOpen: 'websocketOpen',
    websocketClose: 'websocketClose',
    websocketError: 'websocketError',
    websocketMessage: 'websocketMessage',
    // ai
    aiObjectDetectorInfo: 'aiObjectDetectorInfo',
    aiFaceDetectorInfo: 'aiFaceDetectorInfo',
    aiOcclusionDetectResult: 'aiOcclusionDetectResult',
    aiImageDetectResult: 'aiImageDetectResult',
    // 异常暂停
    playFailedAndPaused: 'playFailedAndPaused',
    // audio
    audioResumeState: 'audioResumeState',
    // webrtc
    webrtcStreamH265: 'webrtcStreamH265',
    // flv
    flvMetaData: 'flvMetaData',
    // talk
    talkFailedAndStop: 'talkFailedAndStop',
    removeLoadingBgImage: 'removeLoadingBgImage',
    memoryLog: 'memoryLog',
    downloadMemoryLog: 'downloadMemoryLog',
    pressureObserverCpu: 'pressureObserverCpu',
    currentPts: 'currentPts'
  };
  const TALK_EVENTS_ERROR = {
    talkStreamError: EVENTS.talkStreamError,
    talkStreamClose: EVENTS.talkStreamClose
  };
  const EVENTS_ERROR = {
    playError: 'playIsNotPauseOrUrlIsNull',
    fetchError: "fetchError",
    websocketError: 'websocketError',
    webcodecsH265NotSupport: 'webcodecsH265NotSupport',
    webcodecsDecodeError: 'webcodecsDecodeError',
    webcodecsUnsupportedConfigurationError: 'webcodecsUnsupportedConfigurationError',
    webcodecsDecodeConfigureError: 'webcodecsDecodeConfigureError',
    mediaSourceH265NotSupport: 'mediaSourceH265NotSupport',
    mediaSourceAudioG711NotSupport: 'mediaSourceAudioG711NotSupport',
    mediaSourceAudioInitTimeout: 'mediaSourceAudioInitTimeout',
    mediaSourceAudioNoDataTimeout: 'mediaSourceAudioNoDataTimeout',
    mediaSourceDecoderConfigurationError: 'mediaSourceDecoderConfigurationError',
    mediaSourceFull: EVENTS.mseSourceBufferFull,
    mseSourceBufferError: EVENTS.mseSourceBufferError,
    mseAddSourceBufferError: EVENTS.mseAddSourceBufferError,
    mediaSourceAppendBufferError: 'mediaSourceAppendBufferError',
    mediaSourceTsIsMaxDiff: 'mediaSourceTsIsMaxDiff',
    mediaSourceUseCanvasRenderPlayFailed: 'mediaSourceUseCanvasRenderPlayFailed',
    mediaSourceBufferedIsZeroError: 'mediaSourceBufferedIsZeroError',
    wasmDecodeError: 'wasmDecodeError',
    wasmUseVideoRenderError: 'wasmUseVideoRenderError',
    hlsError: 'hlsError',
    webrtcError: 'webrtcError',
    webrtcClosed: EVENTS.webrtcClosed,
    webrtcIceCandidateError: 'webrtcIceCandidateError',
    webglAlignmentError: 'webglAlignmentError',
    wasmWidthOrHeightChange: 'wasmWidthOrHeightChange',
    mseWidthOrHeightChange: 'mseWidthOrHeightChange',
    wcsWidthOrHeightChange: 'wcsWidthOrHeightChange',
    widthOrHeightChange: 'widthOrHeightChange',
    tallWebsocketClosedByError: 'tallWebsocketClosedByError',
    flvDemuxBufferSizeTooLarge: EVENTS.flvDemuxBufferSizeTooLarge,
    wasmDecodeVideoNoResponseError: 'wasmDecodeVideoNoResponseError',
    audioChannelError: 'audioChannelError',
    simdH264DecodeVideoWidthIsTooLarge: 'simdH264DecodeVideoWidthIsTooLarge',
    simdDecodeError: 'simdDecodeError',
    webglContextLostError: 'webglContextLostError',
    videoElementPlayingFailed: 'videoElementPlayingFailed',
    videoElementPlayingFailedForWebrtc: 'videoElementPlayingFailedForWebrtc',
    decoderWorkerInitError: 'decoderWorkerInitError',
    videoInfoError: 'videoInfoError',
    videoCodecIdError: 'videoCodecIdError',
    streamEnd: EVENTS.streamEnd,
    delayTimeout: EVENTS.delayTimeout,
    loadingTimeout: EVENTS.loadingTimeout,
    networkDelayTimeout: EVENTS.networkDelayTimeout,
    aliyunRtcError: 'aliyunRtcError',
    ...TALK_EVENTS_ERROR
  };
  const WEBSOCKET_STATUS_CODE = {
    connecting: 0,
    open: 1,
    closing: 2,
    closed: 3
  };
  const VIDEO_ENC_CODE = {
    h264: 7,
    h265: 12,
    mpeg4: 99
  };
  const VIDEO_ENC_TYPE_SHOW = {
    h264: 'H264(AVC)',
    h265: 'H265(HEVC)'
  };
  const AUDIO_ENC_CODE = {
    AAC: 10,
    ALAW: 7,
    MULAW: 8,
    MP3: 2
  };
  const H264_NAL_TYPE = {
    sps: 7,
    pps: 8,
    iFrame: 5,
    //
    kUnspecified: 0,
    kSliceNonIDR: 1,
    kSliceDPA: 2,
    kSliceDPB: 3,
    kSliceDPC: 4,
    kSliceIDR: 5,
    //  iFrame
    kSliceSEI: 6,
    // sei 辅助增强信息
    kSliceSPS: 7,
    // sps
    kSlicePPS: 8,
    // pps
    kSliceAUD: 9,
    kEndOfSequence: 10,
    kEndOfStream: 11,
    kFiller: 12,
    kSPSExt: 13,
    kReserved0: 14
  };

  /**
   * NAL_TRAIL_N = 0,
   * NAL_TRAIL_R = 1,
   * NAL_TSA_N = 2,
   * NAL_TSA_R = 3,
   * NAL_STSA_N = 4,
   * NAL_STSA_R = 5,
   * NAL_RADL_N = 6,
   * NAL_RADL_R = 7,
   * NAL_RASL_N = 8,
   * NAL_RASL_R = 9,
   * NAL_BLA_W_LP = 16,
   * NAL_BLA_W_RADL = 17,
   * NAL_BLA_N_LP = 18,
   * NAL_IDR_W_RADL = 19,
   * NAL_IDR_N_LP = 20,
   * NAL_CRA_NUT = 21,
   * NAL_VPS = 32,
   * NAL_SPS = 33,
   * NAL_PPS = 34,
   * NAL_AUD = 35,
   * NAL_EOS_NUT = 36,
   * NAL_EOB_NUT = 37,
   * NAL_FD_NUT = 38,
   * NAL_SEI_PREFIX = 39,
   * NAL_SEI_SUFFIX = 40,
   */
  const H265_NAL_TYPE = {
    pFrame: 1,
    //  语义为被参考的后置图像，且非TSA、非STSA的SS编码数据
    iFrame: 19,
    // IDR_W_RADL 语义为可能有RADL图像的IDR图像的SS编码数据 IDR
    kSliceIDR_W_RADL: 19,
    nLp: 20,
    // kSliceIDR_N_LP
    kSliceIDR_N_LP: 20,
    craNut: 21,
    //NAL_CRA_NUT
    kSliceCRA_NUT: 21,
    vps: 32,
    // 语义为视频参数集
    kSliceVPS: 32,
    sps: 33,
    // 语义为序列参数集
    kSliceSPS: 33,
    pps: 34,
    // 语义为图像参数集
    kSlicePPS: 34,
    kSliceAUD: 35,
    sei: 39,
    //SEI 语义为补充增强信息
    prefixSei: 39,
    //
    suffixSei: 40 //
  };
  const ENCODED_VIDEO_TYPE = {
    key: 'key',
    delta: 'delta'
  };
  const MP4_CODECS = {
    avc: 'video/mp4; codecs="avc1.64002A"',
    hev: 'video/mp4; codecs="hev1.1.6.L123.b0"',
    // others hev
    hev2: 'video/mp4;codecs="hev1.1.6.L120.90"',
    hev3: 'video/mp4;codecs="hev1.2.4.L120.90"',
    hev4: 'video/mp4;codecs="hev1.3.E.L120.90"',
    hev5: 'video/mp4;codecs="hev1.4.10.L120.90"'
  };
  const MEDIA_SOURCE_STATE = {
    ended: 'ended',
    open: 'open',
    closed: 'closed'
  };
  const MEDIA_SOURCE_EVENTS = {
    sourceClose: 'sourceclose',
    sourceOpen: 'sourceopen',
    sourceended: 'sourceended',
    startstreaming: 'startstreaming',
    endstreaming: 'endstreaming',
    qualitychange: 'qualitychange'
  };
  const VIDEO_ENCODE_TYPE = {
    h264: 'avc',
    h265: 'hevc'
  };
  const FETCH_ERROR = {
    abortError: 'The user aborted a request',
    abortError2: 'AbortError',
    abort: 'AbortError'
  };
  const AVC_PACKET_TYPE = {
    sequenceHeader: 0,
    nalu: 1
  };
  const FRAME_TYPE = {
    keyFrame: 1,
    interFrame: 2
  };
  const VIDEO_FRAME_TYPE = {
    keyFrame: 1,
    //
    interFrame: 2 //
  };
  const LOADER_STATUS = {
    idle: 'idle',
    //
    connecting: 'connecting',
    //
    buffering: 'buffering',
    //
    error: 'error',
    //
    complete: 'complete' //
  };
  const AV_TRACK_ID = {
    video: 1,
    audio: 2
  };

  //  rtmp 2023 spec
  const FRAME_HEADER_EX = 0x80;
  const PACKET_TYPE_EX = {
    PACKET_TYPE_SEQ_START: 0,
    PACKET_TYPE_FRAMES: 1,
    PACKET_TYPE_SEQ_END: 2,
    PACKET_TYPE_FRAMESX: 3,
    // PACKETTYPE_FRAMESX is an optimization to avoid sending composition time offsets of 0. See Enhanced RTMP spec.
    PACKET_TYPE_METADATA: 4
  };
  const FRAME_TYPE_EX = {
    FT_KEY: 0x10,
    FT_INTER: 0x20
  };

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var screenfull = createCommonjsModule(function (module) {
  /*!
  * screenfull
  * v5.1.0 - 2020-12-24
  * (c) Sindre Sorhus; MIT License
  */
  (function () {

  	var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
  	var isCommonjs = module.exports;

  	var fn = (function () {
  		var val;

  		var fnMap = [
  			[
  				'requestFullscreen',
  				'exitFullscreen',
  				'fullscreenElement',
  				'fullscreenEnabled',
  				'fullscreenchange',
  				'fullscreenerror'
  			],
  			// New WebKit
  			[
  				'webkitRequestFullscreen',
  				'webkitExitFullscreen',
  				'webkitFullscreenElement',
  				'webkitFullscreenEnabled',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			// Old WebKit
  			[
  				'webkitRequestFullScreen',
  				'webkitCancelFullScreen',
  				'webkitCurrentFullScreenElement',
  				'webkitCancelFullScreen',
  				'webkitfullscreenchange',
  				'webkitfullscreenerror'

  			],
  			[
  				'mozRequestFullScreen',
  				'mozCancelFullScreen',
  				'mozFullScreenElement',
  				'mozFullScreenEnabled',
  				'mozfullscreenchange',
  				'mozfullscreenerror'
  			],
  			[
  				'msRequestFullscreen',
  				'msExitFullscreen',
  				'msFullscreenElement',
  				'msFullscreenEnabled',
  				'MSFullscreenChange',
  				'MSFullscreenError'
  			]
  		];

  		var i = 0;
  		var l = fnMap.length;
  		var ret = {};

  		for (; i < l; i++) {
  			val = fnMap[i];
  			if (val && val[1] in document) {
  				for (i = 0; i < val.length; i++) {
  					ret[fnMap[0][i]] = val[i];
  				}
  				return ret;
  			}
  		}

  		return false;
  	})();

  	var eventNameMap = {
  		change: fn.fullscreenchange,
  		error: fn.fullscreenerror
  	};

  	var screenfull = {
  		request: function (element, options) {
  			return new Promise(function (resolve, reject) {
  				var onFullScreenEntered = function () {
  					this.off('change', onFullScreenEntered);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenEntered);

  				element = element || document.documentElement;

  				var returnPromise = element[fn.requestFullscreen](options);

  				if (returnPromise instanceof Promise) {
  					returnPromise.then(onFullScreenEntered).catch(reject);
  				}
  			}.bind(this));
  		},
  		exit: function () {
  			return new Promise(function (resolve, reject) {
  				if (!this.isFullscreen) {
  					resolve();
  					return;
  				}

  				var onFullScreenExit = function () {
  					this.off('change', onFullScreenExit);
  					resolve();
  				}.bind(this);

  				this.on('change', onFullScreenExit);

  				var returnPromise = document[fn.exitFullscreen]();

  				if (returnPromise instanceof Promise) {
  					returnPromise.then(onFullScreenExit).catch(reject);
  				}
  			}.bind(this));
  		},
  		toggle: function (element, options) {
  			return this.isFullscreen ? this.exit() : this.request(element, options);
  		},
  		onchange: function (callback) {
  			this.on('change', callback);
  		},
  		onerror: function (callback) {
  			this.on('error', callback);
  		},
  		on: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.addEventListener(eventName, callback, false);
  			}
  		},
  		off: function (event, callback) {
  			var eventName = eventNameMap[event];
  			if (eventName) {
  				document.removeEventListener(eventName, callback, false);
  			}
  		},
  		raw: fn
  	};

  	if (!fn) {
  		if (isCommonjs) {
  			module.exports = {isEnabled: false};
  		} else {
  			window.screenfull = {isEnabled: false};
  		}

  		return;
  	}

  	Object.defineProperties(screenfull, {
  		isFullscreen: {
  			get: function () {
  				return Boolean(document[fn.fullscreenElement]);
  			}
  		},
  		element: {
  			enumerable: true,
  			get: function () {
  				return document[fn.fullscreenElement];
  			}
  		},
  		isEnabled: {
  			enumerable: true,
  			get: function () {
  				// Coerce to boolean in case of old WebKit
  				return Boolean(document[fn.fullscreenEnabled]);
  			}
  		}
  	});

  	if (isCommonjs) {
  		module.exports = screenfull;
  	} else {
  		window.screenfull = screenfull;
  	}
  })();
  });
  screenfull.isEnabled;

  // Exponential-Golomb buffer decoder
  class ExpGolomb {
    constructor(uint8array) {
      this._buffer = uint8array;
      this._buffer_index = 0;
      this._total_bytes = uint8array.byteLength;
      this._total_bits = uint8array.byteLength * 8;
      this._current_word = 0;
      this._current_word_bits_left = 0;
    }
    destroy() {
      this._buffer = null;
    }
    _fillCurrentWord() {
      let buffer_bytes_left = this._total_bytes - this._buffer_index;
      if (buffer_bytes_left <= 0) {
        console.error('ExpGolomb: _fillCurrentWord() but no bytes available', this._total_bytes, this._buffer_index);
        return;
      }
      let bytes_read = Math.min(4, buffer_bytes_left);
      let word = new Uint8Array(4);
      word.set(this._buffer.subarray(this._buffer_index, this._buffer_index + bytes_read));
      this._current_word = new DataView(word.buffer).getUint32(0, false);
      this._buffer_index += bytes_read;
      this._current_word_bits_left = bytes_read * 8;
    }
    readBits(bits) {
      if (bits > 32) {
        console.error('ExpGolomb: readBits() bits exceeded max 32bits!');
      }
      if (bits <= this._current_word_bits_left) {
        let result = this._current_word >>> 32 - bits;
        this._current_word <<= bits;
        this._current_word_bits_left -= bits;
        return result;
      }
      let result = this._current_word_bits_left ? this._current_word : 0;
      result = result >>> 32 - this._current_word_bits_left;
      let bits_need_left = bits - this._current_word_bits_left;
      this._fillCurrentWord();
      let bits_read_next = Math.min(bits_need_left, this._current_word_bits_left);
      let result2 = this._current_word >>> 32 - bits_read_next;
      this._current_word <<= bits_read_next;
      this._current_word_bits_left -= bits_read_next;
      result = result << bits_read_next | result2;
      return result;
    }
    readBool() {
      return this.readBits(1) === 1;
    }
    readByte() {
      return this.readBits(8);
    }
    _skipLeadingZero() {
      let zero_count;
      for (zero_count = 0; zero_count < this._current_word_bits_left; zero_count++) {
        if (0 !== (this._current_word & 0x80000000 >>> zero_count)) {
          this._current_word <<= zero_count;
          this._current_word_bits_left -= zero_count;
          return zero_count;
        }
      }
      this._fillCurrentWord();
      return zero_count + this._skipLeadingZero();
    }
    readUEG() {
      // unsigned exponential golomb
      let leading_zeros = this._skipLeadingZero();
      return this.readBits(leading_zeros + 1) - 1;
    }
    readSEG() {
      // signed exponential golomb
      let value = this.readUEG();
      if (value & 0x01) {
        return value + 1 >>> 1;
      } else {
        return -1 * (value >>> 1);
      }
    }
  }

  /**
   * 生成aac的asc头
   * @param profile
   * @param sampleRate  这个是采样率的索引index, 不是采样率本身。
   * @param channel
   * @returns {Uint8Array}
   */
  function aacEncoderConfigurationRecordV2(_ref) {
    let {
      profile,
      sampleRate,
      channel
    } = _ref;
    const config1 = profile << 3 | (sampleRate & 0xe) >> 1;
    const config2 = (sampleRate & 0x1) << 7 | channel << 3;
    // 0xAF >> 4 === 10
    const temp = [0xAF, 0x00, config1, config2];
    const arrayBuffer = new Uint8Array(temp);
    return arrayBuffer;
  }

  /**
   *
   * @param payload
   * @returns {boolean}
   */
  function isAacCodecPacket(payload) {
    return isAAC(payload) && payload[1] === AVC_PACKET_TYPE.sequenceHeader;
  }
  function isAAC(payload) {
    return payload[0] >> 4 === AUDIO_ENC_CODE.AAC;
  }
  const FREQ = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  const MPEG4SamplingFrequencies$1 = FREQ;
  const AAC_FREQ_LIST = FREQ;
  const _mpegSamplingRates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  function parseAACAudioSpecificConfig(arrayBuffer) {
    let array = new Uint8Array(arrayBuffer);
    let config = null;

    /* Audio Object Type:
       0: Null
       1: AAC Main
       2: AAC LC
       3: AAC SSR (Scalable Sample Rate)
       4: AAC LTP (Long Term Prediction)
       5: HE-AAC / SBR (Spectral Band Replication)
       6: AAC Scalable
    */

    let audioObjectType = 0;
    let originalAudioObjectType = 0;
    let samplingIndex = 0;
    let extensionSamplingIndex = null;

    // 5 bits
    audioObjectType = originalAudioObjectType = array[0] >>> 3;
    // 4 bits
    samplingIndex = (array[0] & 0x07) << 1 | array[1] >>> 7;
    if (samplingIndex < 0 || samplingIndex >= _mpegSamplingRates.length) {
      console.error('Flv: AAC invalid sampling frequency index!');
      return;
    }
    let samplingFrequence = _mpegSamplingRates[samplingIndex];

    // 4 bits
    let channelConfig = (array[1] & 0x78) >>> 3;
    if (channelConfig < 0 || channelConfig >= 8) {
      console.log('Flv: AAC invalid channel configuration');
      return;
    }
    if (audioObjectType === 5) {
      // HE-AAC?
      // 4 bits
      extensionSamplingIndex = (array[1] & 0x07) << 1 | array[2] >>> 7;
      // 5 bits
      (array[2] & 0x7C) >>> 2;
    }

    // workarounds for various browsers
    let userAgent = self.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('firefox') !== -1) {
      // firefox: use SBR (HE-AAC) if freq less than 24kHz
      if (samplingIndex >= 6) {
        audioObjectType = 5;
        config = new Array(4);
        extensionSamplingIndex = samplingIndex - 3;
      } else {
        // use LC-AAC
        audioObjectType = 2;
        config = new Array(2);
        extensionSamplingIndex = samplingIndex;
      }
    } else if (userAgent.indexOf('android') !== -1) {
      // android: always use LC-AAC
      audioObjectType = 2;
      config = new Array(2);
      extensionSamplingIndex = samplingIndex;
    } else {
      // for other browsers, e.g. chrome...
      // Always use HE-AAC to make it easier to switch aac codec profile
      audioObjectType = 5;
      extensionSamplingIndex = samplingIndex;
      config = new Array(4);
      if (samplingIndex >= 6) {
        extensionSamplingIndex = samplingIndex - 3;
      } else if (channelConfig === 1) {
        // Mono channel
        audioObjectType = 2;
        config = new Array(2);
        extensionSamplingIndex = samplingIndex;
      }
    }
    config[0] = audioObjectType << 3;
    config[0] |= (samplingIndex & 0x0F) >>> 1;
    config[1] = (samplingIndex & 0x0F) << 7;
    config[1] |= (channelConfig & 0x0F) << 3;
    if (audioObjectType === 5) {
      config[1] |= (extensionSamplingIndex & 0x0F) >>> 1;
      config[2] = (extensionSamplingIndex & 0x01) << 7;
      // extended audio object type: force to 2 (LC-AAC)
      config[2] |= 2 << 2;
      config[3] = 0;
    }
    return {
      audioType: 'aac',
      config: config,
      sampleRate: samplingFrequence,
      channelCount: channelConfig,
      objectType: audioObjectType,
      codec: 'mp4a.40.' + audioObjectType,
      originalCodec: 'mp4a.40.' + originalAudioObjectType
    };
  }
  class AACADTSParser {
    constructor(data) {
      this.data_ = data;
      this.eof_flag_ = false;
      this.current_syncword_offset_ = this.findNextSyncwordOffset(0);
      if (this.eof_flag_) {
        console.error('Could not found ADTS syncword until payload end');
      }
    }
    findNextSyncwordOffset(syncword_offset) {
      let i = syncword_offset;
      let data = this.data_;
      while (true) {
        if (i + 7 >= data.byteLength) {
          this.eof_flag_ = true;
          return data.byteLength;
        }

        // search 12-bit 0xFFF syncword
        let syncword = (data[i + 0] << 8 | data[i + 1]) >>> 4;
        if (syncword === 0xFFF) {
          return i;
        } else {
          i++;
        }
      }
    }
    readNextAACFrame() {
      let data = this.data_;
      let aac_frame = null;
      while (aac_frame == null) {
        if (this.eof_flag_) {
          break;
        }
        let syncword_offset = this.current_syncword_offset_;
        let offset = syncword_offset;

        // adts_fixed_header()
        // syncword 0xFFF: 12-bit
        let ID = (data[offset + 1] & 0x08) >>> 3;
        let layer = (data[offset + 1] & 0x06) >>> 1;
        let protection_absent = data[offset + 1] & 0x01;
        let profile = (data[offset + 2] & 0xC0) >>> 6;
        let sampling_frequency_index = (data[offset + 2] & 0x3C) >>> 2;
        let channel_configuration = (data[offset + 2] & 0x01) << 2 | (data[offset + 3] & 0xC0) >>> 6;

        // adts_variable_header()
        let aac_frame_length = (data[offset + 3] & 0x03) << 11 | data[offset + 4] << 3 | (data[offset + 5] & 0xE0) >>> 5;
        data[offset + 6] & 0x03;
        if (offset + aac_frame_length > this.data_.byteLength) {
          // data not enough for extracting last sample
          this.eof_flag_ = true;
          this.has_last_incomplete_data = true;
          break;
        }
        let adts_header_length = protection_absent === 1 ? 7 : 9;
        let adts_frame_payload_length = aac_frame_length - adts_header_length;
        offset += adts_header_length;
        let next_syncword_offset = this.findNextSyncwordOffset(offset + adts_frame_payload_length);
        this.current_syncword_offset_ = next_syncword_offset;
        if (ID !== 0 && ID !== 1 || layer !== 0) {
          // invalid adts frame ?
          continue;
        }
        let frame_data = data.subarray(offset, offset + adts_frame_payload_length);
        aac_frame = {};
        aac_frame.audio_object_type = profile + 1;
        aac_frame.sampling_freq_index = sampling_frequency_index;
        aac_frame.sampling_frequency = MPEG4SamplingFrequencies$1[sampling_frequency_index];
        aac_frame.channel_config = channel_configuration;
        aac_frame.data = frame_data;
      }
      return aac_frame;
    }
    hasIncompleteData() {
      return this.has_last_incomplete_data;
    }
    getIncompleteData() {
      if (!this.has_last_incomplete_data) {
        return null;
      }
      return this.data_.subarray(this.current_syncword_offset_);
    }
  }
  class AACLOASParser {
    constructor(data) {
      this.data_ = data;
      this.eof_flag_ = false;
      this.current_syncword_offset_ = this.findNextSyncwordOffset(0);
      if (this.eof_flag_) {
        console.error('Could not found ADTS syncword until payload end');
      }
    }
    findNextSyncwordOffset(syncword_offset) {
      let i = syncword_offset;
      let data = this.data_;
      while (true) {
        if (i + 1 >= data.byteLength) {
          this.eof_flag_ = true;
          return data.byteLength;
        }

        // search 12-bit 0xFFF syncword
        let syncword = data[i + 0] << 3 | data[i + 1] >>> 5;
        if (syncword === 0x2B7) {
          return i;
        } else {
          i++;
        }
      }
    }
    getLATMValue(gb) {
      let bytesForValue = gb.readBits(2);
      let value = 0;
      for (let i = 0; i <= bytesForValue; i++) {
        value = value << 8;
        value = value | gb.readByte();
      }
      return value;
    }
    readNextAACFrame(privious) {
      let data = this.data_;
      let aac_frame = null;
      while (aac_frame == null) {
        if (this.eof_flag_) {
          break;
        }
        let syncword_offset = this.current_syncword_offset_;
        let offset = syncword_offset;
        let audioMuxLengthBytes = (data[offset + 1] & 0x1F) << 8 | data[offset + 2];
        if (offset + 3 + audioMuxLengthBytes >= this.data_.byteLength) {
          // data not enough for extracting last sample
          this.eof_flag_ = true;
          this.has_last_incomplete_data = true;
          break;
        }

        // AudioMuxElement(1)
        let gb = new ExpGolomb(data.subarray(offset + 3, offset + 3 + audioMuxLengthBytes));
        let useSameStreamMux = gb.readBool();
        let streamMuxConfig = null;
        if (!useSameStreamMux) {
          let audioMuxVersion = gb.readBool();
          let audioMuxVersionA = audioMuxVersion && gb.readBool();
          if (audioMuxVersionA) {
            console.error('audioMuxVersionA is Not Supported');
            gb.destroy();
            break;
          }
          if (audioMuxVersion) {
            this.getLATMValue(gb);
          }
          let allStreamsSameTimeFraming = gb.readBool();
          if (!allStreamsSameTimeFraming) {
            console.error('allStreamsSameTimeFraming zero is Not Supported');
            gb.destroy();
            break;
          }
          let numSubFrames = gb.readBits(6);
          if (numSubFrames !== 0) {
            console.error('more than 2 numSubFrames Not Supported');
            gb.destroy();
            break;
          }
          let numProgram = gb.readBits(4);
          if (numProgram !== 0) {
            console.error('more than 2 numProgram Not Supported');
            gb.destroy();
            break;
          }
          let numLayer = gb.readBits(3);
          if (numLayer !== 0) {
            console.error('more than 2 numLayer Not Supported');
            gb.destroy();
            break;
          }
          let fillBits = audioMuxVersion ? this.getLATMValue(gb) : 0;
          let audio_object_type = gb.readBits(5);
          fillBits -= 5;
          let sampling_freq_index = gb.readBits(4);
          fillBits -= 4;
          let channel_config = gb.readBits(4);
          fillBits -= 4;
          gb.readBits(3);
          fillBits -= 3; // GA Specfic Config
          if (fillBits > 0) {
            gb.readBits(fillBits);
          }
          let frameLengthType = gb.readBits(3);
          if (frameLengthType === 0) {
            gb.readByte();
          } else {
            console.error(`frameLengthType = ${frameLengthType}. Only frameLengthType = 0 Supported`);
            gb.destroy();
            break;
          }
          let otherDataPresent = gb.readBool();
          if (otherDataPresent) {
            if (audioMuxVersion) {
              this.getLATMValue(gb);
            } else {
              let otherDataLenBits = 0;
              while (true) {
                otherDataLenBits = otherDataLenBits << 8;
                let otherDataLenEsc = gb.readBool();
                let otherDataLenTmp = gb.readByte();
                otherDataLenBits += otherDataLenTmp;
                if (!otherDataLenEsc) {
                  break;
                }
              }
              console.log(otherDataLenBits);
            }
          }
          let crcCheckPresent = gb.readBool();
          if (crcCheckPresent) {
            gb.readByte();
          }
          streamMuxConfig = {};
          streamMuxConfig.audio_object_type = audio_object_type;
          streamMuxConfig.sampling_freq_index = sampling_freq_index;
          streamMuxConfig.sampling_frequency = MPEG4SamplingFrequencies$1[streamMuxConfig.sampling_freq_index];
          streamMuxConfig.channel_config = channel_config;
          streamMuxConfig.other_data_present = otherDataPresent;
        } else if (privious == null) {
          console.warn('StreamMuxConfig Missing');
          this.current_syncword_offset_ = this.findNextSyncwordOffset(offset + 3 + audioMuxLengthBytes);
          gb.destroy();
          continue;
        } else {
          streamMuxConfig = privious;
        }
        let length = 0;
        while (true) {
          let tmp = gb.readByte();
          length += tmp;
          if (tmp !== 0xFF) {
            break;
          }
        }
        let aac_data = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          aac_data[i] = gb.readByte();
        }
        aac_frame = {};
        aac_frame.audio_object_type = streamMuxConfig.audio_object_type;
        aac_frame.sampling_freq_index = streamMuxConfig.sampling_freq_index;
        aac_frame.sampling_frequency = MPEG4SamplingFrequencies$1[streamMuxConfig.sampling_freq_index];
        aac_frame.channel_config = streamMuxConfig.channel_config;
        aac_frame.other_data_present = streamMuxConfig.other_data_present;
        aac_frame.data = aac_data;
        this.current_syncword_offset_ = this.findNextSyncwordOffset(offset + 3 + audioMuxLengthBytes);
      }
      return aac_frame;
    }
    hasIncompleteData() {
      return this.has_last_incomplete_data;
    }
    getIncompleteData() {
      if (!this.has_last_incomplete_data) {
        return null;
      }
      return this.data_.subarray(this.current_syncword_offset_);
    }
  }

  function readBig32(data) {
    let i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return (data[i] << 24 >>> 0) + (data[i + 1] << 16) + (data[i + 2] << 8) + (data[i + 3] || 0);
  }

  //  AVCC格式 也叫AVC1格式，MPEG-4格式，字节对齐，因此也叫Byte-Stream Format。用于mp4/flv/mkv, VideoToolbox。
  // 使用NALU长度（固定字节，通常为4字节）分隔NAL。
  function parseAvcC(data) {
    let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    if (data.length < 4) return;
    const dataLen = data.length;
    const units = [];
    let offset = 0;
    let length;
    while (offset + size < dataLen) {
      length = readBig32(data, offset);
      if (size === 3) length >>>= 8;
      offset += size;
      if (!length) continue;
      if (offset + length > dataLen) {
        break;
      }
      units.push(data.subarray(offset, offset + length));
      offset += length;
    }
    return units;
  }

  //  add preview 4 byte length (preview tag size)
  function addNaleHeaderLength(nalUnit) {
    const nalUnitLength = nalUnit.byteLength;
    const header = new Uint8Array(4);
    header[0] = nalUnitLength >>> 24 & 0xff;
    header[1] = nalUnitLength >>> 16 & 0xff;
    header[2] = nalUnitLength >>> 8 & 0xff;
    header[3] = nalUnitLength & 0xff;
    const result = new Uint8Array(nalUnitLength + 4);
    result.set(header, 0);
    result.set(nalUnit, 4);
    return result;
  }
  function getUnitSizeFromVideoSequenceHeader(payload, isHevc) {
    let result = null;
    if (isHevc) {
      if (payload.length >= 23 + 5) {
        result = (payload[21 + 5] & 3) + 1;
      }
    } else {
      if (payload.length >= 7 + 5) {
        result = (payload[4 + 5] & 3) + 1;
      }
    }
    return result;
  }

  function now() {
    return new Date().getTime();
  }
  (() => {
    try {
      if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
        const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
        if (module instanceof WebAssembly.Module) return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    } catch (e) {}
    return false;
  })();
  function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }
  function getNowTime() {
    if (performance && typeof performance.now === 'function') {
      return performance.now();
    }
    return Date.now();
  }
  function calculationRate(callback) {
    let totalSize = 0;
    let lastTime = getNowTime();
    return size => {
      if (!isNumber(size)) {
        return;
      }
      totalSize += size;
      const thisTime = getNowTime();
      const diffTime = thisTime - lastTime;
      if (diffTime >= 1000) {
        callback(totalSize / diffTime * 1000);
        lastTime = thisTime;
        totalSize = 0;
      }
    };
  }
  function isFirefox() {
    const UA = window.navigator.userAgent.toLowerCase();
    return /firefox/i.test(UA);
  }
  function isNumber(value) {
    const toString = Object.prototype.toString;
    return toString.call(value) === "[object Number]";
  }

  //
  function supportMSEDecodeHevc() {
    let result = false;
    if ('MediaSource' in self && (self.MediaSource.isTypeSupported(MP4_CODECS.hev) || self.MediaSource.isTypeSupported(MP4_CODECS.hev2) || self.MediaSource.isTypeSupported(MP4_CODECS.hev3) || self.MediaSource.isTypeSupported(MP4_CODECS.hev4) || self.MediaSource.isTypeSupported(MP4_CODECS.hev5))) {
      result = true;
    }
    return result;
  }
  function isEmpty(value) {
    return value === null || value === undefined;
  }
  function isNotEmpty(value) {
    return !isEmpty(value);
  }
  function isFunction(fn) {
    return typeof fn === "function";
  }
  function checkNaluType(naluBuffer) {
    let result = null;
    let type = naluBuffer[0] & 0b0001_1111;
    if (type === H264_NAL_TYPE.sps || type === H264_NAL_TYPE.pps) {
      result = VIDEO_ENC_TYPE_SHOW.h264;
    }
    if (!result) {
      type = (naluBuffer[0] & 0x7E) >> 1;
      if (type === H265_NAL_TYPE.vps || type === H265_NAL_TYPE.sps || type === H265_NAL_TYPE.pps) {
        result = VIDEO_ENC_TYPE_SHOW.h265;
      }
    }
    return result;
  }
  function supportWritableStream() {
    return typeof WritableStream !== 'undefined';
  }
  function closeVideoFrame(videoFrame) {
    videoFrame.close();
  }
  function calcStreamFpsByBufferList(bufferList, type) {
    if (type) {
      bufferList = bufferList.filter(item => item.type && item.type === type);
    }
    let firstItem = bufferList[0];
    let oneSecondLength = null;
    let nextIndex = 1;
    if (bufferList.length > 0) {
      let nextItem = bufferList[1];
      if (nextItem && nextItem.ts - firstItem.ts > 100000) {
        firstItem = nextItem;
        nextIndex = 2;
      }
    }
    if (firstItem) {
      // next start
      for (let i = nextIndex; i < bufferList.length; i++) {
        let tempItem = bufferList[i];
        if (type && tempItem.type && tempItem.type !== type) {
          tempItem = null;
        }
        if (tempItem) {
          const diff = tempItem.ts - firstItem.ts;
          if (diff >= 1000) {
            const prevTempItem = bufferList[i - 1];
            const diff2 = prevTempItem.ts - firstItem.ts;
            if (diff2 < 1000) {
              oneSecondLength = i + 1;
            }
          }
        }
      }
    }
    return oneSecondLength;
  }
  function isFetchSuccess(res) {
    return res.ok && res.status >= 200 && res.status <= 299;
  }
  function clone(obj) {
    let result = '';
    //
    if (typeof obj === 'object') {
      try {
        result = JSON.stringify(obj);
        result = JSON.parse(result);
      } catch (e) {
        result = obj;
      }
    } else {
      result = obj;
    }
    return result;
  }

  /**
   *
   * @returns {object:DEFAULT_PLAYER_OPTIONS}
   */
  function getDefaultPlayerOptions() {
    return clone(DEFAULT_PLAYER_OPTIONS);
  }
  function isVideoSequenceHeader(payload) {
    return payload[0] >> 4 === FRAME_TYPE.keyFrame && payload[1] === AVC_PACKET_TYPE.sequenceHeader;
  }
  function isTrue(value) {
    return value === true || value === 'true';
  }
  function isFalse(value) {
    return value !== true && value !== 'true';
  }
  function supportMSEForWorker() {
    return self.Worker && self.MediaSource && 'canConstructInDedicatedWorker' in self.MediaSource && self.MediaSource['canConstructInDedicatedWorker'] === true ? true : false;
  }

  var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  };
  const U32 = Symbol(32);
  const U16 = Symbol(16);
  const U8 = Symbol(8);
  class OPut {
      constructor(g) {
          this.g = g;
          this.consumed = 0;
          if (g)
              this.need = g.next().value;
      }
      setG(g) {
          this.g = g;
          this.demand(g.next().value, true);
      }
      consume() {
          if (this.buffer && this.consumed) {
              this.buffer.copyWithin(0, this.consumed);
              this.buffer = this.buffer.subarray(0, this.buffer.length - this.consumed);
              this.consumed = 0;
          }
      }
      demand(n, consume) {
          if (consume)
              this.consume();
          this.need = n;
          return this.flush();
      }
      read(need) {
          return __awaiter(this, void 0, void 0, function* () {
              if (this.lastReadPromise) {
                  yield this.lastReadPromise;
              }
              return this.lastReadPromise = new Promise((resolve, reject) => {
                  var _a;
                  this.reject = reject;
                  this.resolve = (data) => {
                      delete this.lastReadPromise;
                      delete this.resolve;
                      delete this.need;
                      resolve(data);
                  };
                  const result = this.demand(need, true);
                  if (!result)
                      (_a = this.pull) === null || _a === void 0 ? void 0 : _a.call(this, need); //已饥饿，等待数据
              });
          });
      }
      readU32() {
          return this.read(U32);
      }
      readU16() {
          return this.read(U16);
      }
      readU8() {
          return this.read(U8);
      }
      close() {
          var _a;
          if (this.g)
              this.g.return();
          if (this.buffer)
              this.buffer.subarray(0, 0);
          (_a = this.reject) === null || _a === void 0 ? void 0 : _a.call(this, new Error('EOF'));
          delete this.lastReadPromise;
      }
      flush() {
          if (!this.buffer || !this.need)
              return;
          let returnValue = null;
          const unread = this.buffer.subarray(this.consumed);
          let n = 0;
          const notEnough = (x) => unread.length < (n = x);
          if (typeof this.need === 'number') {
              if (notEnough(this.need))
                  return;
              returnValue = unread.subarray(0, n);
          }
          else if (this.need === U32) {
              if (notEnough(4))
                  return;
              returnValue = (unread[0] << 24) | (unread[1] << 16) | (unread[2] << 8) | unread[3];
          }
          else if (this.need === U16) {
              if (notEnough(2))
                  return;
              returnValue = (unread[0] << 8) | unread[1];
          }
          else if (this.need === U8) {
              if (notEnough(1))
                  return;
              returnValue = unread[0];
          }
          else if (!('buffer' in this.need)) {
              if (notEnough(this.need.byteLength))
                  return;
              new Uint8Array(this.need).set(unread.subarray(0, n));
              returnValue = this.need;
          }
          else if ('byteOffset' in this.need) {
              if (notEnough(this.need.byteLength - this.need.byteOffset))
                  return;
              new Uint8Array(this.need.buffer, this.need.byteOffset).set(unread.subarray(0, n));
              returnValue = this.need;
          }
          else if (this.g) {
              this.g.throw(new Error('Unsupported type'));
              return;
          }
          this.consumed += n;
          if (this.g)
              this.demand(this.g.next(returnValue).value, true);
          else if (this.resolve)
              this.resolve(returnValue);
          return returnValue;
      }
      write(value) {
          if (value instanceof Uint8Array) {
              this.malloc(value.length).set(value);
          }
          else if ('buffer' in value) {
              this.malloc(value.byteLength).set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
          }
          else {
              this.malloc(value.byteLength).set(new Uint8Array(value));
          }
          if (this.g || this.resolve)
              this.flush();
          //富余，需要等到饥饿
          else
              return new Promise((resolve) => this.pull = resolve);
      }
      writeU32(value) {
          this.malloc(4).set([(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]);
          this.flush();
      }
      writeU16(value) {
          this.malloc(2).set([(value >> 8) & 0xff, value & 0xff]);
          this.flush();
      }
      writeU8(value) {
          this.malloc(1)[0] = value;
          this.flush();
      }
      malloc(size) {
          if (this.buffer) {
              const l = this.buffer.length;
              const nl = l + size;
              if (nl <= this.buffer.buffer.byteLength - this.buffer.byteOffset) {
                  this.buffer = new Uint8Array(this.buffer.buffer, this.buffer.byteOffset, nl);
              }
              else {
                  const n = new Uint8Array(nl);
                  n.set(this.buffer);
                  this.buffer = n;
              }
              return this.buffer.subarray(l, nl);
          }
          else {
              this.buffer = new Uint8Array(size);
              return this.buffer;
          }
      }
  }
  OPut.U32 = U32;
  OPut.U16 = U16;
  OPut.U8 = U8;

  class Debug {
    constructor(master) {
      this.log = function (name) {
        if (master._opt.debug && master._opt.debugLevel == DEBUG_LEVEL.debug) {
          const prefix = master._opt.debugUuid ? `[${master._opt.debugUuid}]` : '';
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          console.log(`JbPro${prefix}[\u2705\u2705\u2705][${name}]`, ...args);
        }
      };
      this.warn = function (name) {
        if (master._opt.debug && (master._opt.debugLevel == DEBUG_LEVEL.debug || master._opt.debugLevel == DEBUG_LEVEL.warn)) {
          const prefix = master._opt.debugUuid ? `[${master._opt.debugUuid}]` : '';
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          console.log(`JbPro${prefix}[\u2757\u2757\u2757][${name}]`, ...args);
        }
      };
      this.error = function (name) {
        const prefix = master._opt.debugUuid ? `[${master._opt.debugUuid}]` : '';
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        console.error(`JbPro${prefix}[\u274C\u274C\u274C][${name}]`, ...args);

        // if (master.addMemoryLog) {
        //     master.addMemoryLog(`[${name}]`, ...args);
        // }
      };
    }
  }

  /*
   * Copyright (C) 2016 Bilibili. All Rights Reserved.
   *
   * @author zheng qian <xqq@xqq.im>
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class SPSParser {
    static _ebsp2rbsp(uint8array) {
      let src = uint8array;
      let src_length = src.byteLength;
      let dst = new Uint8Array(src_length);
      let dst_idx = 0;
      for (let i = 0; i < src_length; i++) {
        if (i >= 2) {
          // Unescape: Skip 0x03 after 00 00
          if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {
            continue;
          }
        }
        dst[dst_idx] = src[i];
        dst_idx++;
      }
      return new Uint8Array(dst.buffer, 0, dst_idx);
    }

    // 解析 SPS
    // https://zhuanlan.zhihu.com/p/27896239
    static parseSPS(uint8array) {
      let rbsp = SPSParser._ebsp2rbsp(uint8array);
      let gb = new ExpGolomb(rbsp);
      gb.readByte();
      // 标识当前H.264码流的profile。
      // 我们知道，H.264中定义了三种常用的档次profile： 基准档次：baseline profile;主要档次：main profile; 扩展档次：extended profile;

      let profile_idc = gb.readByte(); // profile_idc
      gb.readByte(); // constraint_set_flags[5] + reserved_zero[3]
      // 标识当前码流的Level。编码的Level定义了某种条件下的最大视频分辨率、最大视频帧率等参数，码流所遵从的level由level_idc指定。
      let level_idc = gb.readByte(); // level_idc
      // 表示当前的序列参数集的id。通过该id值，图像参数集pps可以引用其代表的sps中的参数。
      gb.readUEG(); // seq_parameter_set_id

      let profile_string = SPSParser.getProfileString(profile_idc);
      let level_string = SPSParser.getLevelString(level_idc);
      let chroma_format_idc = 1;
      let chroma_format = 420;
      let chroma_format_table = [0, 420, 422, 444];
      let bit_depth = 8;

      //
      if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 || profile_idc === 244 || profile_idc === 44 || profile_idc === 83 || profile_idc === 86 || profile_idc === 118 || profile_idc === 128 || profile_idc === 138 || profile_idc === 144) {
        //
        chroma_format_idc = gb.readUEG();
        if (chroma_format_idc === 3) {
          gb.readBits(1); // separate_colour_plane_flag
        }

        if (chroma_format_idc <= 3) {
          chroma_format = chroma_format_table[chroma_format_idc];
        }
        bit_depth = gb.readUEG() + 8; // bit_depth_luma_minus8
        gb.readUEG(); // bit_depth_chroma_minus8
        gb.readBits(1); // qpprime_y_zero_transform_bypass_flag
        if (gb.readBool()) {
          // seq_scaling_matrix_present_flag
          let scaling_list_count = chroma_format_idc !== 3 ? 8 : 12;
          for (let i = 0; i < scaling_list_count; i++) {
            if (gb.readBool()) {
              // seq_scaling_list_present_flag
              if (i < 6) {
                SPSParser._skipScalingList(gb, 16);
              } else {
                SPSParser._skipScalingList(gb, 64);
              }
            }
          }
        }
      }
      // 用于计算MaxFrameNum的值。计算公式为MaxFrameNum = 2^(log2_max_frame_num_minus4 +
      gb.readUEG(); // log2_max_frame_num_minus4
      // 表示解码picture order count(POC)的方法。POC是另一种计量图像序号的方式，与frame_num有着不同的计算方法。该语法元素的取值为0、1或2。
      let pic_order_cnt_type = gb.readUEG();
      if (pic_order_cnt_type === 0) {
        gb.readUEG(); // log2_max_pic_order_cnt_lsb_minus_4
      } else if (pic_order_cnt_type === 1) {
        gb.readBits(1); // delta_pic_order_always_zero_flag
        gb.readSEG(); // offset_for_non_ref_pic
        gb.readSEG(); // offset_for_top_to_bottom_field
        let num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();
        for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {
          gb.readSEG(); // offset_for_ref_frame
        }
      }
      // 用于表示参考帧的最大数目。
      let ref_frames = gb.readUEG(); // max_num_ref_frames
      // 标识位，说明frame_num中是否允许不连续的值。
      gb.readBits(1); // gaps_in_frame_num_value_allowed_flag
      // 用于计算图像的宽度。单位为宏块个数，因此图像的实际宽度为:
      let pic_width_in_mbs_minus1 = gb.readUEG();
      // 使用PicHeightInMapUnits来度量视频中一帧图像的高度。
      // PicHeightInMapUnits并非图像明确的以像素或宏块为单位的高度，而需要考虑该宏块是帧编码或场编码。PicHeightInMapUnits的计算方式为：
      let pic_height_in_map_units_minus1 = gb.readUEG();
      // 标识位，说明宏块的编码方式。当该标识位为0时，宏块可能为帧编码或场编码；
      // 该标识位为1时，所有宏块都采用帧编码。根据该标识位取值不同，PicHeightInMapUnits的含义也不同，
      // 为0时表示一场数据按宏块计算的高度，为1时表示一帧数据按宏块计算的高度。
      let frame_mbs_only_flag = gb.readBits(1);
      if (frame_mbs_only_flag === 0) {
        // 标识位，说明是否采用了宏块级的帧场自适应编码。当该标识位为0时，不存在帧编码和场编码之间的切换；当标识位为1时，宏块可能在帧编码和场编码模式之间进行选择。
        gb.readBits(1); // mb_adaptive_frame_field_flag
      }
      // 标识位，用于B_Skip、B_Direct模式运动矢量的推导计算。
      gb.readBits(1); // direct_8x8_inference_flag

      let frame_crop_left_offset = 0;
      let frame_crop_right_offset = 0;
      let frame_crop_top_offset = 0;
      let frame_crop_bottom_offset = 0;
      let frame_cropping_flag = gb.readBool();
      if (frame_cropping_flag) {
        frame_crop_left_offset = gb.readUEG();
        frame_crop_right_offset = gb.readUEG();
        frame_crop_top_offset = gb.readUEG();
        frame_crop_bottom_offset = gb.readUEG();
      }
      let sar_width = 1,
        sar_height = 1;
      let fps = 0,
        fps_fixed = true,
        fps_num = 0,
        fps_den = 0;
      // 标识位，说明SPS中是否存在VUI信息。
      let vui_parameters_present_flag = gb.readBool();
      if (vui_parameters_present_flag) {
        if (gb.readBool()) {
          // aspect_ratio_info_present_flag
          let aspect_ratio_idc = gb.readByte();
          let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
          let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
          if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
            sar_width = sar_w_table[aspect_ratio_idc - 1];
            sar_height = sar_h_table[aspect_ratio_idc - 1];
          } else if (aspect_ratio_idc === 255) {
            sar_width = gb.readByte() << 8 | gb.readByte();
            sar_height = gb.readByte() << 8 | gb.readByte();
          }
        }
        if (gb.readBool()) {
          // overscan_info_present_flag
          gb.readBool(); // overscan_appropriate_flag
        }

        if (gb.readBool()) {
          // video_signal_type_present_flag
          gb.readBits(4); // video_format & video_full_range_flag
          if (gb.readBool()) {
            // colour_description_present_flag
            gb.readBits(24); // colour_primaries & transfer_characteristics & matrix_coefficients
          }
        }

        if (gb.readBool()) {
          // chroma_loc_info_present_flag
          gb.readUEG(); // chroma_sample_loc_type_top_field
          gb.readUEG(); // chroma_sample_loc_type_bottom_field
        }

        if (gb.readBool()) {
          // timing_info_present_flag
          let num_units_in_tick = gb.readBits(32);
          let time_scale = gb.readBits(32);
          fps_fixed = gb.readBool(); // fixed_frame_rate_flag

          fps_num = time_scale;
          fps_den = num_units_in_tick * 2;
          fps = fps_num / fps_den;
        }
      }
      let sarScale = 1;
      if (sar_width !== 1 || sar_height !== 1) {
        sarScale = sar_width / sar_height;
      }
      let crop_unit_x = 0,
        crop_unit_y = 0;
      if (chroma_format_idc === 0) {
        crop_unit_x = 1;
        crop_unit_y = 2 - frame_mbs_only_flag;
      } else {
        let sub_wc = chroma_format_idc === 3 ? 1 : 2;
        let sub_hc = chroma_format_idc === 1 ? 2 : 1;
        crop_unit_x = sub_wc;
        crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);
      }
      let codec_width = (pic_width_in_mbs_minus1 + 1) * 16;
      let codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);
      codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;
      codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;
      let present_width = Math.ceil(codec_width * sarScale);
      gb.destroy();
      gb = null;

      // 解析出来的SPS 内容。
      return {
        profile_string: profile_string,
        // baseline, high, high10, ...
        level_string: level_string,
        // 3, 3.1, 4, 4.1, 5, 5.1, ...
        bit_depth: bit_depth,
        // 8bit, 10bit, ...
        ref_frames: ref_frames,
        chroma_format: chroma_format,
        // 4:2:0, 4:2:2, ...
        chroma_format_string: SPSParser.getChromaFormatString(chroma_format),
        frame_rate: {
          fixed: fps_fixed,
          fps: fps,
          fps_den: fps_den,
          fps_num: fps_num
        },
        sar_ratio: {
          width: sar_width,
          height: sar_height
        },
        codec_size: {
          width: codec_width,
          height: codec_height
        },
        present_size: {
          width: present_width,
          height: codec_height
        }
      };
    }
    static parseSPS$2(uint8array) {
      let codec_array = uint8array.subarray(1, 4);
      let codec_mimetype = 'avc1.';
      for (let j = 0; j < 3; j++) {
        let h = codec_array[j].toString(16);
        if (h.length < 2) {
          h = '0' + h;
        }
        codec_mimetype += h;
      }
      let rbsp = SPSParser._ebsp2rbsp(uint8array);
      let gb = new ExpGolomb(rbsp);
      gb.readByte();
      let profile_idc = gb.readByte(); // profile_idc
      gb.readByte(); // constraint_set_flags[5] + reserved_zero[3]
      let level_idc = gb.readByte(); // level_idc
      gb.readUEG(); // seq_parameter_set_id

      let profile_string = SPSParser.getProfileString(profile_idc);
      let level_string = SPSParser.getLevelString(level_idc);
      let chroma_format_idc = 1;
      let chroma_format = 420;
      let chroma_format_table = [0, 420, 422, 444];
      let bit_depth_luma = 8;
      let bit_depth_chroma = 8;
      if (profile_idc === 100 || profile_idc === 110 || profile_idc === 122 || profile_idc === 244 || profile_idc === 44 || profile_idc === 83 || profile_idc === 86 || profile_idc === 118 || profile_idc === 128 || profile_idc === 138 || profile_idc === 144) {
        chroma_format_idc = gb.readUEG();
        if (chroma_format_idc === 3) {
          gb.readBits(1); // separate_colour_plane_flag
        }

        if (chroma_format_idc <= 3) {
          chroma_format = chroma_format_table[chroma_format_idc];
        }
        bit_depth_luma = gb.readUEG() + 8; // bit_depth_luma_minus8
        bit_depth_chroma = gb.readUEG() + 8; // bit_depth_chroma_minus8
        gb.readBits(1); // qpprime_y_zero_transform_bypass_flag
        if (gb.readBool()) {
          // seq_scaling_matrix_present_flag
          let scaling_list_count = chroma_format_idc !== 3 ? 8 : 12;
          for (let i = 0; i < scaling_list_count; i++) {
            if (gb.readBool()) {
              // seq_scaling_list_present_flag
              if (i < 6) {
                SPSParser._skipScalingList(gb, 16);
              } else {
                SPSParser._skipScalingList(gb, 64);
              }
            }
          }
        }
      }
      gb.readUEG(); // log2_max_frame_num_minus4
      let pic_order_cnt_type = gb.readUEG();
      if (pic_order_cnt_type === 0) {
        gb.readUEG(); // log2_max_pic_order_cnt_lsb_minus_4
      } else if (pic_order_cnt_type === 1) {
        gb.readBits(1); // delta_pic_order_always_zero_flag
        gb.readSEG(); // offset_for_non_ref_pic
        gb.readSEG(); // offset_for_top_to_bottom_field
        let num_ref_frames_in_pic_order_cnt_cycle = gb.readUEG();
        for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {
          gb.readSEG(); // offset_for_ref_frame
        }
      }

      let ref_frames = gb.readUEG(); // max_num_ref_frames
      gb.readBits(1); // gaps_in_frame_num_value_allowed_flag

      let pic_width_in_mbs_minus1 = gb.readUEG();
      let pic_height_in_map_units_minus1 = gb.readUEG();
      let frame_mbs_only_flag = gb.readBits(1);
      if (frame_mbs_only_flag === 0) {
        gb.readBits(1); // mb_adaptive_frame_field_flag
      }

      gb.readBits(1); // direct_8x8_inference_flag

      let frame_crop_left_offset = 0;
      let frame_crop_right_offset = 0;
      let frame_crop_top_offset = 0;
      let frame_crop_bottom_offset = 0;
      let frame_cropping_flag = gb.readBool();
      if (frame_cropping_flag) {
        frame_crop_left_offset = gb.readUEG();
        frame_crop_right_offset = gb.readUEG();
        frame_crop_top_offset = gb.readUEG();
        frame_crop_bottom_offset = gb.readUEG();
      }
      let sar_width = 1,
        sar_height = 1;
      let fps = 0,
        fps_fixed = true,
        fps_num = 0,
        fps_den = 0;
      let vui_parameters_present_flag = gb.readBool();
      if (vui_parameters_present_flag) {
        if (gb.readBool()) {
          // aspect_ratio_info_present_flag
          let aspect_ratio_idc = gb.readByte();
          let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
          let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
          if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
            sar_width = sar_w_table[aspect_ratio_idc - 1];
            sar_height = sar_h_table[aspect_ratio_idc - 1];
          } else if (aspect_ratio_idc === 255) {
            sar_width = gb.readByte() << 8 | gb.readByte();
            sar_height = gb.readByte() << 8 | gb.readByte();
          }
        }
        if (gb.readBool()) {
          // overscan_info_present_flag
          gb.readBool(); // overscan_appropriate_flag
        }

        if (gb.readBool()) {
          // video_signal_type_present_flag
          gb.readBits(4); // video_format & video_full_range_flag
          if (gb.readBool()) {
            // colour_description_present_flag
            gb.readBits(24); // colour_primaries & transfer_characteristics & matrix_coefficients
          }
        }

        if (gb.readBool()) {
          // chroma_loc_info_present_flag
          gb.readUEG(); // chroma_sample_loc_type_top_field
          gb.readUEG(); // chroma_sample_loc_type_bottom_field
        }

        if (gb.readBool()) {
          // timing_info_present_flag
          let num_units_in_tick = gb.readBits(32);
          let time_scale = gb.readBits(32);
          fps_fixed = gb.readBool(); // fixed_frame_rate_flag

          fps_num = time_scale;
          fps_den = num_units_in_tick * 2;
          fps = fps_num / fps_den;
        }
      }
      let sarScale = 1;
      if (sar_width !== 1 || sar_height !== 1) {
        sarScale = sar_width / sar_height;
      }
      let crop_unit_x = 0,
        crop_unit_y = 0;
      if (chroma_format_idc === 0) {
        crop_unit_x = 1;
        crop_unit_y = 2 - frame_mbs_only_flag;
      } else {
        let sub_wc = chroma_format_idc === 3 ? 1 : 2;
        let sub_hc = chroma_format_idc === 1 ? 2 : 1;
        crop_unit_x = sub_wc;
        crop_unit_y = sub_hc * (2 - frame_mbs_only_flag);
      }
      let codec_width = (pic_width_in_mbs_minus1 + 1) * 16;
      let codec_height = (2 - frame_mbs_only_flag) * ((pic_height_in_map_units_minus1 + 1) * 16);
      codec_width -= (frame_crop_left_offset + frame_crop_right_offset) * crop_unit_x;
      codec_height -= (frame_crop_top_offset + frame_crop_bottom_offset) * crop_unit_y;
      let present_width = Math.ceil(codec_width * sarScale);
      gb.destroy();
      gb = null;
      return {
        codec_mimetype,
        profile_idc,
        level_idc,
        profile_string,
        // baseline, high, high10, ...
        level_string,
        // 3, 3.1, 4, 4.1, 5, 5.1, ...
        chroma_format_idc,
        bit_depth: bit_depth_luma,
        // 8bit, 10bit, ...
        bit_depth_luma,
        bit_depth_chroma,
        ref_frames,
        chroma_format,
        // 4:2:0, 4:2:2, ...
        chroma_format_string: SPSParser.getChromaFormatString(chroma_format),
        frame_rate: {
          fixed: fps_fixed,
          fps: fps,
          fps_den: fps_den,
          fps_num: fps_num
        },
        sar_ratio: {
          width: sar_width,
          height: sar_height
        },
        codec_size: {
          width: codec_width,
          height: codec_height
        },
        present_size: {
          width: present_width,
          height: codec_height
        }
      };
    }
    static _skipScalingList(gb, count) {
      let last_scale = 8,
        next_scale = 8;
      let delta_scale = 0;
      for (let i = 0; i < count; i++) {
        if (next_scale !== 0) {
          delta_scale = gb.readSEG();
          next_scale = (last_scale + delta_scale + 256) % 256;
        }
        last_scale = next_scale === 0 ? last_scale : next_scale;
      }
    }

    // profile_idc = 66 → baseline profile;
    // profile_idc = 77 → main profile;
    // profile_idc = 88 → extended profile;
    // 在新版的标准中，还包括了High、High 10、High 4:2:2、High 4:4:4、High 10 Intra、High
    // 4:2:2 Intra、High 4:4:4 Intra、CAVLC 4:4:4 Intra
    static getProfileString(profile_idc) {
      switch (profile_idc) {
        case 66:
          return 'Baseline';
        case 77:
          return 'Main';
        case 88:
          return 'Extended';
        case 100:
          return 'High';
        case 110:
          return 'High10';
        case 122:
          return 'High422';
        case 244:
          return 'High444';
        default:
          return 'Unknown';
      }
    }
    static getLevelString(level_idc) {
      return (level_idc / 10).toFixed(1);
    }
    static getChromaFormatString(chroma) {
      switch (chroma) {
        case 420:
          return '4:2:0';
        case 422:
          return '4:2:2';
        case 444:
          return '4:4:4';
        default:
          return 'Unknown';
      }
    }
  }

  class Bitop {
    constructor(buffer) {
      this.buffer = buffer;
      this.buflen = buffer.length;
      this.bufpos = 0;
      this.bufoff = 0;
      this.iserro = false;
    }
    read(n) {
      let v = 0;
      let d = 0;
      while (n) {
        if (n < 0 || this.bufpos >= this.buflen) {
          this.iserro = true;
          return 0;
        }
        this.iserro = false;
        d = this.bufoff + n > 8 ? 8 - this.bufoff : n;
        v <<= d;
        v += this.buffer[this.bufpos] >> 8 - this.bufoff - d & 0xff >> 8 - d;
        this.bufoff += d;
        n -= d;
        if (this.bufoff == 8) {
          this.bufpos++;
          this.bufoff = 0;
        }
      }
      return v;
    }
    look(n) {
      let p = this.bufpos;
      let o = this.bufoff;
      let v = this.read(n);
      this.bufpos = p;
      this.bufoff = o;
      return v;
    }
    read_golomb() {
      let n;
      for (n = 0; this.read(1) === 0 && !this.iserro; n++);
      return (1 << n) + this.read(n) - 1;
    }
  }

  //
  function parseAVCDecoderConfigurationRecord(arrayBuffer) {
    const meta = {};
    let le = function () {
      let buf = new ArrayBuffer(2);
      new DataView(buf).setInt16(0, 256, true); // little-endian write
      return new Int16Array(buf)[0] === 256; // platform-spec read, if equal then LE
    }();

    const v = new DataView(arrayBuffer.buffer);
    let version = v.getUint8(0); // configurationVersion
    let avcProfile = v.getUint8(1); // avcProfileIndication
    v.getUint8(2); // profile_compatibil
    v.getUint8(3); // AVCLevelIndication

    if (version !== 1 || avcProfile === 0) {
      // this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord');

      return {};
    }
    const _naluLengthSize = (v.getUint8(4) & 3) + 1; // lengthSizeMinusOne

    if (_naluLengthSize !== 3 && _naluLengthSize !== 4) {
      // holy shit!!!
      // this._onError(DemuxErrors.FORMAT_ERROR, `Flv: Strange NaluLengthSizeMinusOne: ${_naluLengthSize - 1}`);
      return {};
    }
    let spsCount = v.getUint8(5) & 31; // numOfSequenceParameterSets

    if (spsCount === 0) {
      // this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No SPS');
      return {};
    }
    let offset = 6;
    for (let i = 0; i < spsCount; i++) {
      let len = v.getUint16(offset, !le); // sequenceParameterSetLength
      offset += 2;
      if (len === 0) {
        continue;
      }

      // Notice: Nalu without startcode header (00 00 00 01)
      let sps = new Uint8Array(arrayBuffer.buffer, offset, len);
      offset += len;
      // flv.js作者选择了自己来解析这个数据结构，也是迫不得已，因为JS环境下没有ffmpeg，解析这个结构主要是为了提取 sps和pps。虽然理论上sps允许有多个，但其实一般就一个。
      // packetTtype 为 1 表示 NALU，NALU= network abstract layer unit，这是H.264的概念，网络抽象层数据单元，其实简单理解就是一帧视频数据。
      // pps的信息没什么用，所以作者只实现了sps的分析器，说明作者下了很大功夫去学习264的标准，其中的Golomb解码还是挺复杂的，能解对不容易，我在PC和手机平台都是用ffmpeg去解析的。
      // SPS里面包括了视频分辨率，帧率，profile level等视频重要信息。
      let config = SPSParser.parseSPS(sps);
      // console.log('h264 sps config',config)
      if (i !== 0) {
        // ignore other sps's config
        continue;
      }
      meta.sps = sps;
      meta.timescale = 1000;
      meta.codecWidth = config.codec_size.width;
      meta.codecHeight = config.codec_size.height;
      meta.presentWidth = config.present_size.width;
      meta.presentHeight = config.present_size.height;
      meta.profile = config.profile_string;
      meta.level = config.level_string;
      meta.bitDepth = config.bit_depth;
      meta.chromaFormat = config.chroma_format;
      meta.sarRatio = config.sar_ratio;
      meta.frameRate = config.frame_rate;
      if (config.frame_rate.fixed === false || config.frame_rate.fps_num === 0 || config.frame_rate.fps_den === 0) {
        meta.frameRate = {
          fixed: true,
          // fps: 23.976,
          // fps_num: 23976,
          fps: 25,
          fps_num: 25000,
          fps_den: 1000
        };
      }
      let fps_den = meta.frameRate.fps_den;
      let fps_num = meta.frameRate.fps_num;
      meta.refSampleDuration = meta.timescale * (fps_den / fps_num);
      let codecArray = sps.subarray(1, 4);
      let codecString = 'avc1.';
      for (let j = 0; j < 3; j++) {
        let h = codecArray[j].toString(16);
        if (h.length < 2) {
          h = '0' + h;
        }
        codecString += h;
      }
      // codec
      meta.codec = codecString;
    }
    let ppsCount = v.getUint8(offset); // numOfPictureParameterSets
    if (ppsCount === 0) {
      // this._onError(DemuxErrors.FORMAT_ERROR, 'Flv: Invalid AVCDecoderConfigurationRecord: No PPS');
      return {};
    }
    offset++;
    for (let i = 0; i < ppsCount; i++) {
      let len = v.getUint16(offset, !le); // pictureParameterSetLength
      offset += 2;
      if (len === 0) {
        continue;
      }
      let pps = new Uint8Array(arrayBuffer.buffer, offset, len);

      // pps is useless for extracting video information
      offset += len;
      meta.pps = pps;
    }
    meta.videoType = VIDEO_ENCODE_TYPE.h264;
    if (meta.sps) {
      const spsLength = meta.sps.byteLength;
      const spsFlag = new Uint8Array([spsLength >>> 24 & 0xFF, spsLength >>> 16 & 0xFF, spsLength >>> 8 & 0xFF, spsLength & 0xFF]);
      const sps = new Uint8Array(spsLength + 4);
      sps.set(spsFlag, 0);
      sps.set(meta.sps, 4);
      meta.sps = sps;
    }
    if (meta.pps) {
      const ppsLength = meta.pps.byteLength;
      const ppsFlag = new Uint8Array([ppsLength >>> 24 & 0xFF, ppsLength >>> 16 & 0xFF, ppsLength >>> 8 & 0xFF, ppsLength & 0xFF]);
      const pps = new Uint8Array(ppsLength + 4);
      pps.set(ppsFlag, 0);
      pps.set(meta.pps, 4);
      meta.pps = pps;
    }

    // meta.avcc = arrayBuffer;
    return meta;
  }

  /**
   *
   * @param sps
   * @param pps
   * @returns {Uint8Array}
   */
  function avcEncoderConfigurationRecord(_ref) {
    let {
      sps,
      pps
    } = _ref;
    //     todo: 1 是 序列帧 2-4cts帧
    // 从 0x01 开始 表示version。
    // RTMP_AVC_HEAD
    // 0x17 keyframe  7:AVC
    // 0x00 AVC sequence header
    // 0x00 0x00 0x00
    // 0x01 configurationVersion
    // 0x42 AVCProfileIndication
    // 0x00 profile_compatibility
    // 0x1E AVCLevelIndication
    // 0xFF lengthSizeMinusOne
    const tmp = [0x17, 0x00, 0x00, 0x00, 0x00, 0x01, 0x42, 0x00, 0x1E, 0xFF];
    // 是个是私有协议标识，h264的。
    // 0x17 :23
    tmp[0] = 0x17;

    // 标准的 nale 格式。。。
    tmp[6] = sps[1]; // 0x42 avc profile ( sps[0][1] )
    tmp[7] = sps[2]; // 0x00 avc compatibility ( sps[0][2] )
    tmp[8] = sps[3]; // 0x1E avc level ( sps[0][3] )
    //tmp[9]  0xFF  6   reserved ( all bits on )
    // temp 的length 是10  最后的下标就是 9

    // 0xE1 : 225
    tmp[10] = 0xE1; //
    // number of SPS NALUs (usually 1)  repeated once per SPS:
    //
    tmp[11] = sps.byteLength >> 8 & 0xff; //
    // SPS size
    tmp[12] = sps.byteLength & 0xff; //
    // variable   SPS NALU data
    // number of PPS NALUs (usually 1)  　repeated once per PPS
    // PPS size
    // variable PPS NALU data
    tmp.push(...sps, 0x01, pps.byteLength >> 8 & 0xff, pps.byteLength & 0xff, ...pps);
    //

    const arrayBuffer = new Uint8Array(tmp);
    return arrayBuffer;
  }
  function avcEncoderConfigurationRecord$2(_ref2) {
    let {
      sps,
      pps
    } = _ref2;
    // require Nalu without 4 byte length-header
    let length = 6 + 2 + sps.byteLength + 1 + 2 + pps.byteLength;
    let need_extra_fields = false;
    const sps_details = SPSParser.parseSPS$2(sps);
    if (sps[3] !== 66 && sps[3] !== 77 && sps[3] !== 88) {
      need_extra_fields = true;
      length += 4;
    }
    let data = new Uint8Array(length);
    data[0] = 0x01; // configurationVersion
    data[1] = sps[1]; // AVCProfileIndication
    data[2] = sps[2]; // profile_compatibility
    data[3] = sps[3]; // AVCLevelIndication
    data[4] = 0xFF; // 111111 + lengthSizeMinusOne(3)

    data[5] = 0xE0 | 0x01; // 111 + numOfSequenceParameterSets
    let sps_length = sps.byteLength;
    data[6] = sps_length >>> 8; // sequenceParameterSetLength
    data[7] = sps_length & 0xFF;
    let offset = 8;
    data.set(sps, 8);
    offset += sps_length;
    data[offset] = 1; // numOfPictureParameterSets

    let pps_length = pps.byteLength;
    data[offset + 1] = pps_length >>> 8; // pictureParameterSetLength
    data[offset + 2] = pps_length & 0xFF;
    data.set(pps, offset + 3);
    offset += 3 + pps_length;
    if (need_extra_fields) {
      data[offset] = 0xFC | sps_details.chroma_format_idc;
      data[offset + 1] = 0xF8 | sps_details.bit_depth_luma - 8;
      data[offset + 2] = 0xF8 | sps_details.bit_depth_chroma - 8;
      data[offset + 3] = 0x00; // number of sps ext
      offset += 4;
    }
    const prevData = [0x17, 0x00, 0x00, 0x00, 0x00];
    const newData = new Uint8Array(prevData.length + data.byteLength);
    newData.set(prevData, 0);
    newData.set(data, prevData.length);
    return newData;
  }

  /**
   *
   * @param oneNALBuffer
   * @param isIframe
   * @returns {Uint8Array}
   */
  function avcEncoderNalePacket(oneNALBuffer, isIframe) {
    //     正常发送nal
    const idrBit = 0x10 | 7;
    const nIdrBit = 0x20 | 7;
    let tmp = [];
    if (isIframe) {
      tmp[0] = idrBit;
    } else {
      tmp[0] = nIdrBit;
    }
    // compositionTime
    tmp[1] = 1;
    tmp[2] = 0;
    tmp[3] = 0;
    tmp[4] = 0;

    //
    tmp[5] = oneNALBuffer.byteLength >> 24 & 0xff;
    tmp[6] = oneNALBuffer.byteLength >> 16 & 0xff;
    tmp[7] = oneNALBuffer.byteLength >> 8 & 0xff;
    tmp[8] = oneNALBuffer.byteLength & 0xff;
    const arrayBuffer = new Uint8Array(tmp.length + oneNALBuffer.byteLength);
    arrayBuffer.set(tmp, 0);
    arrayBuffer.set(oneNALBuffer, tmp.length);
    return arrayBuffer;
  }
  function avcEncoderNalePacketNotLength(oneNALBuffer, isIframe) {
    //     正常发送nal
    const idrBit = 0x10 | 7;
    const nIdrBit = 0x20 | 7;
    let tmp = [];
    if (isIframe) {
      tmp[0] = idrBit;
    } else {
      tmp[0] = nIdrBit;
    }
    // compositionTime
    tmp[1] = 1;
    tmp[2] = 0;
    tmp[3] = 0;
    tmp[4] = 0;
    const arrayBuffer = new Uint8Array(tmp.length + oneNALBuffer.byteLength);
    arrayBuffer.set(tmp, 0);
    arrayBuffer.set(oneNALBuffer, tmp.length);
    return arrayBuffer;
  }

  /**
   * (NALU类型  & 0001  1111)
   * @param nalu
   * @returns {number}
   */
  function getAvcSeqHeadType(nalu) {
    return nalu[0] & 0b0001_1111;
  }
  function isAvcSeqHead(type) {
    return type === H264_NAL_TYPE.sps || type === H264_NAL_TYPE.pps;
  }
  function isHvcSEIType(type) {
    return type === H264_NAL_TYPE.kSliceSEI;
  }
  function isNotAvcSeqHead(type) {
    return !isAvcSeqHead(type) && !isHvcSEIType(type);
  }
  function isAvcNaluIFrame(type) {
    return type === H264_NAL_TYPE.iFrame;
  }
  function isSameAvcNaluType(naluList) {
    if (naluList.length === 0) {
      return false;
    }
    const type = getAvcSeqHeadType(naluList[0]);
    for (let i = 1; i < naluList.length; i++) {
      if (type !== getAvcSeqHeadType(naluList[i])) {
        return false;
      }
    }
    return true;
  }
  class H264AnnexBParser {
    constructor(data) {
      this.data = data;
      this.eofFlag = false;
      this.currentStartcodeOffset = this.findNextStartCodeOffset(0);
      if (this.eofFlag) {
        console.error('Could not find H264 startcode until payload end!');
      }
    }
    findNextStartCodeOffset(start_offset) {
      let i = start_offset;
      let data = this.data;
      while (true) {
        if (i + 3 >= data.byteLength) {
          this.eofFlag = true;
          return data.byteLength;
        }

        // search 00 00 00 01 or 00 00 01
        let uint32 = data[i + 0] << 24 | data[i + 1] << 16 | data[i + 2] << 8 | data[i + 3];
        let uint24 = data[i + 0] << 16 | data[i + 1] << 8 | data[i + 2];
        if (uint32 === 0x00000001 || uint24 === 0x000001) {
          return i;
        } else {
          i++;
        }
      }
    }
    readNextNaluPayload() {
      let data = this.data;
      let nalu_payload = null;
      while (nalu_payload == null) {
        if (this.eofFlag) {
          break;
        }
        // offset pointed to start code
        let startcode_offset = this.currentStartcodeOffset;

        // nalu payload start offset
        let offset = startcode_offset;
        let u32 = data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3];
        if (u32 === 0x00000001) {
          offset += 4;
        } else {
          offset += 3;
        }
        let nalu_type = data[offset] & 0x1F;
        let forbidden_bit = (data[offset] & 0x80) >>> 7;
        let next_startcode_offset = this.findNextStartCodeOffset(offset);
        this.currentStartcodeOffset = next_startcode_offset;
        if (nalu_type >= H264_NAL_TYPE.kReserved0) {
          continue;
        }
        if (forbidden_bit !== 0) {
          // Log.e(this.TAG, `forbidden_bit near offset ${offset} should be 0 but has value ${forbidden_bit}`);
          continue;
        }
        let payload_data = data.subarray(offset, next_startcode_offset);
        nalu_payload = {
          type: nalu_type,
          data: payload_data
        };
      }
      return nalu_payload;
    }
  }
  class H264NaluAVC1 {
    constructor(nalu) {
      let nalu_size = nalu.data.byteLength;
      this.type = nalu.type;
      this.data = new Uint8Array(4 + nalu_size); // 4 byte length-header + nalu payload

      let v = new DataView(this.data.buffer);
      // Fill 4 byte length-header
      v.setUint32(0, nalu_size);
      // Copy payload
      this.data.set(nalu.data, 4);
    }
  }

  const _ebsp2rbsp = uint8array => {
    let src = uint8array;
    let src_length = src.byteLength;
    let dst = new Uint8Array(src_length);
    let dst_idx = 0;
    for (let i = 0; i < src_length; i++) {
      if (i >= 2) {
        // Unescape: Skip 0x03 after 00 00
        if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {
          continue;
        }
      }
      dst[dst_idx] = src[i];
      dst_idx++;
    }
    return new Uint8Array(dst.buffer, 0, dst_idx);
  };
  const getLevelString = level_idc => {
    return (level_idc / 30).toFixed(1);
  };
  const getChromaFormatString = chroma_format_idc => {
    switch (chroma_format_idc) {
      case 0:
        return '4:0:0';
      case 1:
        return '4:2:0';
      case 2:
        return '4:2:2';
      case 3:
        return '4:4:4';
      default:
        return 'Unknown';
    }
  };
  const parseHevcSPS = uint8array => {
    let rbsp = _ebsp2rbsp(uint8array);
    let gb = new ExpGolomb(rbsp);

    /* remove NALu Header */
    gb.readByte();
    gb.readByte();
    let left_offset = 0,
      right_offset = 0,
      top_offset = 0,
      bottom_offset = 0;

    // SPS
    gb.readBits(4);
    let max_sub_layers_minus1 = gb.readBits(3);
    gb.readBool();

    // profile_tier_level begin
    let general_profile_space = gb.readBits(2);
    let general_tier_flag = gb.readBool();
    let general_profile_idc = gb.readBits(5);
    let general_profile_compatibility_flags_1 = gb.readByte();
    let general_profile_compatibility_flags_2 = gb.readByte();
    let general_profile_compatibility_flags_3 = gb.readByte();
    let general_profile_compatibility_flags_4 = gb.readByte();
    let general_constraint_indicator_flags_1 = gb.readByte();
    let general_constraint_indicator_flags_2 = gb.readByte();
    let general_constraint_indicator_flags_3 = gb.readByte();
    let general_constraint_indicator_flags_4 = gb.readByte();
    let general_constraint_indicator_flags_5 = gb.readByte();
    let general_constraint_indicator_flags_6 = gb.readByte();
    let general_level_idc = gb.readByte();
    let sub_layer_profile_present_flag = [];
    let sub_layer_level_present_flag = [];
    for (let i = 0; i < max_sub_layers_minus1; i++) {
      sub_layer_profile_present_flag.push(gb.readBool());
      sub_layer_level_present_flag.push(gb.readBool());
    }
    if (max_sub_layers_minus1 > 0) {
      for (let i = max_sub_layers_minus1; i < 8; i++) {
        gb.readBits(2);
      }
    }
    for (let i = 0; i < max_sub_layers_minus1; i++) {
      if (sub_layer_profile_present_flag[i]) {
        gb.readByte(); // sub_layer_profile_space, sub_layer_tier_flag, sub_layer_profile_idc
        gb.readByte();
        gb.readByte();
        gb.readByte();
        gb.readByte(); // sub_layer_profile_compatibility_flag
        gb.readByte();
        gb.readByte();
        gb.readByte();
        gb.readByte();
        gb.readByte();
        gb.readByte();
      }
      if (sub_layer_profile_present_flag[i]) {
        gb.readByte();
      }
    }
    // profile_tier_level end

    gb.readUEG();
    let chroma_format_idc = gb.readUEG();
    if (chroma_format_idc == 3) {
      gb.readBits(1); // separate_colour_plane_flag
    }

    let pic_width_in_luma_samples = gb.readUEG();
    let pic_height_in_luma_samples = gb.readUEG();
    let conformance_window_flag = gb.readBool();
    if (conformance_window_flag) {
      left_offset += gb.readUEG();
      right_offset += gb.readUEG();
      top_offset += gb.readUEG();
      bottom_offset += gb.readUEG();
    }
    let bit_depth_luma_minus8 = gb.readUEG();
    let bit_depth_chroma_minus8 = gb.readUEG();
    let log2_max_pic_order_cnt_lsb_minus4 = gb.readUEG();
    let sub_layer_ordering_info_present_flag = gb.readBool();
    for (let i = sub_layer_ordering_info_present_flag ? 0 : max_sub_layers_minus1; i <= max_sub_layers_minus1; i++) {
      gb.readUEG(); // max_dec_pic_buffering_minus1[i]
      gb.readUEG(); // max_num_reorder_pics[i]
      gb.readUEG(); // max_latency_increase_plus1[i]
    }

    gb.readUEG();
    gb.readUEG();
    gb.readUEG();
    gb.readUEG();
    gb.readUEG();
    gb.readUEG();
    let scaling_list_enabled_flag = gb.readBool();
    if (scaling_list_enabled_flag) {
      let sps_scaling_list_data_present_flag = gb.readBool();
      if (sps_scaling_list_data_present_flag) {
        for (let sizeId = 0; sizeId < 4; sizeId++) {
          for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) {
            let scaling_list_pred_mode_flag = gb.readBool();
            if (!scaling_list_pred_mode_flag) {
              gb.readUEG(); // scaling_list_pred_matrix_id_delta
            } else {
              let coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
              if (sizeId > 1) {
                gb.readSEG();
              }
              for (let i = 0; i < coefNum; i++) {
                gb.readSEG();
              }
            }
          }
        }
      }
    }
    gb.readBool();
    gb.readBool();
    let pcm_enabled_flag = gb.readBool();
    if (pcm_enabled_flag) {
      gb.readByte();
      gb.readUEG();
      gb.readUEG();
      gb.readBool();
    }
    let num_short_term_ref_pic_sets = gb.readUEG();
    let num_delta_pocs = 0;
    for (let i = 0; i < num_short_term_ref_pic_sets; i++) {
      let inter_ref_pic_set_prediction_flag = false;
      if (i !== 0) {
        inter_ref_pic_set_prediction_flag = gb.readBool();
      }
      if (inter_ref_pic_set_prediction_flag) {
        if (i === num_short_term_ref_pic_sets) {
          gb.readUEG();
        }
        gb.readBool();
        gb.readUEG();
        let next_num_delta_pocs = 0;
        for (let j = 0; j <= num_delta_pocs; j++) {
          let used_by_curr_pic_flag = gb.readBool();
          let use_delta_flag = false;
          if (!used_by_curr_pic_flag) {
            use_delta_flag = gb.readBool();
          }
          if (used_by_curr_pic_flag || use_delta_flag) {
            next_num_delta_pocs++;
          }
        }
        num_delta_pocs = next_num_delta_pocs;
      } else {
        let num_negative_pics = gb.readUEG();
        let num_positive_pics = gb.readUEG();
        num_delta_pocs = num_negative_pics + num_positive_pics;
        for (let j = 0; j < num_negative_pics; j++) {
          gb.readUEG();
          gb.readBool();
        }
        for (let j = 0; j < num_positive_pics; j++) {
          gb.readUEG();
          gb.readBool();
        }
      }
    }
    let long_term_ref_pics_present_flag = gb.readBool();
    if (long_term_ref_pics_present_flag) {
      let num_long_term_ref_pics_sps = gb.readUEG();
      for (let i = 0; i < num_long_term_ref_pics_sps; i++) {
        for (let j = 0; j < log2_max_pic_order_cnt_lsb_minus4 + 4; j++) {
          gb.readBits(1);
        }
        gb.readBits(1);
      }
    }
    //*
    let default_display_window_flag = false; // for calc offset
    let min_spatial_segmentation_idc = 0; // for hvcC
    let sar_width = 1,
      sar_height = 1;
    let fps_fixed = false,
      fps_den = 1,
      fps_num = 1;
    //*/
    gb.readBool();
    gb.readBool();
    let vui_parameters_present_flag = gb.readBool();
    if (vui_parameters_present_flag) {
      let aspect_ratio_info_present_flag = gb.readBool();
      if (aspect_ratio_info_present_flag) {
        let aspect_ratio_idc = gb.readByte();
        let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
        let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
        if (aspect_ratio_idc > 0 && aspect_ratio_idc < 16) {
          sar_width = sar_w_table[aspect_ratio_idc - 1];
          sar_height = sar_h_table[aspect_ratio_idc - 1];
        } else if (aspect_ratio_idc === 255) {
          sar_width = gb.readBits(16);
          sar_height = gb.readBits(16);
        }
      }
      let overscan_info_present_flag = gb.readBool();
      if (overscan_info_present_flag) {
        gb.readBool();
      }
      let video_signal_type_present_flag = gb.readBool();
      if (video_signal_type_present_flag) {
        gb.readBits(3);
        gb.readBool();
        let colour_description_present_flag = gb.readBool();
        if (colour_description_present_flag) {
          gb.readByte();
          gb.readByte();
          gb.readByte();
        }
      }
      let chroma_loc_info_present_flag = gb.readBool();
      if (chroma_loc_info_present_flag) {
        gb.readUEG();
        gb.readUEG();
      }
      gb.readBool();
      gb.readBool();
      gb.readBool();
      default_display_window_flag = gb.readBool();
      if (default_display_window_flag) {
        left_offset += gb.readUEG();
        right_offset += gb.readUEG();
        top_offset += gb.readUEG();
        bottom_offset += gb.readUEG();
      }
      let vui_timing_info_present_flag = gb.readBool();
      if (vui_timing_info_present_flag) {
        fps_den = gb.readBits(32);
        fps_num = gb.readBits(32);
        let vui_poc_proportional_to_timing_flag = gb.readBool();
        if (vui_poc_proportional_to_timing_flag) {
          gb.readUEG();
          let vui_hrd_parameters_present_flag = gb.readBool();
          if (vui_hrd_parameters_present_flag) {
            let nal_hrd_parameters_present_flag = false;
            let vcl_hrd_parameters_present_flag = false;
            let sub_pic_hrd_params_present_flag = false;
            {
              nal_hrd_parameters_present_flag = gb.readBool();
              vcl_hrd_parameters_present_flag = gb.readBool();
              if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
                sub_pic_hrd_params_present_flag = gb.readBool();
                if (sub_pic_hrd_params_present_flag) {
                  gb.readByte();
                  gb.readBits(5);
                  gb.readBool();
                  gb.readBits(5);
                }
                gb.readBits(4);
                gb.readBits(4);
                if (sub_pic_hrd_params_present_flag) {
                  gb.readBits(4);
                }
                gb.readBits(5);
                gb.readBits(5);
                gb.readBits(5);
              }
            }
            for (let i = 0; i <= max_sub_layers_minus1; i++) {
              let fixed_pic_rate_general_flag = gb.readBool();
              fps_fixed = fixed_pic_rate_general_flag;
              let fixed_pic_rate_within_cvs_flag = false;
              let cpbCnt = 1;
              if (!fixed_pic_rate_general_flag) {
                fixed_pic_rate_within_cvs_flag = gb.readBool();
              }
              let low_delay_hrd_flag = false;
              if (fixed_pic_rate_within_cvs_flag) {
                gb.readSEG();
              } else {
                low_delay_hrd_flag = gb.readBool();
              }
              if (!low_delay_hrd_flag) {
                cpbcnt = gb.readUEG() + 1;
              }
              if (nal_hrd_parameters_present_flag) {
                for (let j = 0; j < cpbCnt; j++) {
                  gb.readUEG();
                  gb.readUEG();
                  if (sub_pic_hrd_params_present_flag) {
                    gb.readUEG();
                    gb.readUEG();
                  }
                }
              }
              if (vcl_hrd_parameters_present_flag) {
                for (let j = 0; j < cpbCnt; j++) {
                  gb.readUEG();
                  gb.readUEG();
                  if (sub_pic_hrd_params_present_flag) {
                    gb.readUEG();
                    gb.readUEG();
                  }
                }
              }
            }
          }
        }
      }
      let bitstream_restriction_flag = gb.readBool();
      if (bitstream_restriction_flag) {
        gb.readBool();
        gb.readBool();
        gb.readBool();
        min_spatial_segmentation_idc = gb.readUEG();
        gb.readUEG();
        gb.readUEG();
        gb.readUEG();
        gb.readUEG();
      }
    }
    gb.readBool(); // ignore...

    // for meta data
    let codec_mimetype = `hvc1.${general_profile_idc}.1.L${general_level_idc}.B0`;
    let codec_width = pic_width_in_luma_samples;
    let codec_height = pic_height_in_luma_samples;
    let sar_scale = 1;
    if (sar_width !== 1 && sar_height !== 1) {
      sar_scale = sar_width / sar_height;
    }
    gb.destroy();
    gb = null;
    return {
      codec_mimetype,
      level_string: getLevelString(general_level_idc),
      profile_idc: general_profile_idc,
      bit_depth: bit_depth_luma_minus8 + 8,
      ref_frames: 1,
      // FIXME!!!
      chroma_format: chroma_format_idc,
      chroma_format_string: getChromaFormatString(chroma_format_idc),
      general_level_idc,
      general_profile_space,
      general_tier_flag,
      general_profile_idc,
      general_profile_compatibility_flags_1,
      general_profile_compatibility_flags_2,
      general_profile_compatibility_flags_3,
      general_profile_compatibility_flags_4,
      general_constraint_indicator_flags_1,
      general_constraint_indicator_flags_2,
      general_constraint_indicator_flags_3,
      general_constraint_indicator_flags_4,
      general_constraint_indicator_flags_5,
      general_constraint_indicator_flags_6,
      min_spatial_segmentation_idc,
      constant_frame_rate: 0 /* FIXME!! fps_fixed ? 1 : 0? */,
      chroma_format_idc,
      bit_depth_luma_minus8,
      bit_depth_chroma_minus8,
      frame_rate: {
        fixed: fps_fixed,
        fps: fps_num / fps_den,
        fps_den: fps_den,
        fps_num: fps_num
      },
      sar_ratio: {
        width: sar_width,
        height: sar_height
      },
      codec_size: {
        width: codec_width,
        height: codec_height
      },
      present_size: {
        width: codec_width * sar_scale,
        height: codec_height
      }
    };
  };
  const parseHevcVPS = uint8array => {
    let rbsp = _ebsp2rbsp(uint8array);
    let gb = new ExpGolomb(rbsp);

    /* remove NALu Header */
    gb.readByte();
    gb.readByte();

    // VPS
    gb.readBits(4);
    gb.readBits(2);
    gb.readBits(6);
    let max_sub_layers_minus1 = gb.readBits(3);
    let temporal_id_nesting_flag = gb.readBool();
    // and more ...

    return {
      num_temporal_layers: max_sub_layers_minus1 + 1,
      temporal_id_nested: temporal_id_nesting_flag
    };
  };
  const parseHevcPPS = uint8array => {
    let rbsp = _ebsp2rbsp(uint8array);
    let gb = new ExpGolomb(rbsp);

    /* remove NALu Header */
    gb.readByte();
    gb.readByte();
    gb.readUEG();
    gb.readUEG();
    gb.readBool();
    gb.readBool();
    gb.readBits(3);
    gb.readBool();
    gb.readBool();
    gb.readUEG();
    gb.readUEG();
    gb.readSEG();
    gb.readBool();
    gb.readBool();
    let cu_qp_delta_enabled_flag = gb.readBool();
    if (cu_qp_delta_enabled_flag) {
      gb.readUEG();
    }
    gb.readSEG();
    gb.readSEG();
    gb.readBool();
    gb.readBool();
    gb.readBool();
    gb.readBool();
    let tiles_enabled_flag = gb.readBool();
    let entropy_coding_sync_enabled_flag = gb.readBool();
    // and more ...

    // needs hvcC
    let parallelismType = 1; // slice-based parallel decoding
    if (entropy_coding_sync_enabled_flag && tiles_enabled_flag) {
      parallelismType = 0; // mixed-type parallel decoding
    } else if (entropy_coding_sync_enabled_flag) {
      parallelismType = 3; // wavefront-based parallel decoding
    } else if (tiles_enabled_flag) {
      parallelismType = 2; // tile-based parallel decoding
    }

    return {
      parallelismType
    };
  };

  class H265NaluParser {
    static _ebsp2rbsp(uint8array) {
      let src = uint8array;
      let src_length = src.byteLength;
      let dst = new Uint8Array(src_length);
      let dst_idx = 0;
      for (let i = 0; i < src_length; i++) {
        if (i >= 2) {
          // Unescape: Skip 0x03 after 00 00
          if (src[i] === 0x03 && src[i - 1] === 0x00 && src[i - 2] === 0x00) {
            continue;
          }
        }
        dst[dst_idx] = src[i];
        dst_idx++;
      }
      return new Uint8Array(dst.buffer, 0, dst_idx);
    }
    static parseVPS(uint8array) {
      let rbsp = H265NaluParser._ebsp2rbsp(uint8array);
      let gb = new ExpGolomb(rbsp);

      /* remove NALu Header */
      gb.readByte();
      gb.readByte();

      // VPS
      gb.readBits(4);
      gb.readBits(2);
      gb.readBits(6);
      let max_sub_layers_minus1 = gb.readBits(3);
      let temporal_id_nesting_flag = gb.readBool();
      // and more ...

      return {
        num_temporal_layers: max_sub_layers_minus1 + 1,
        temporal_id_nested: temporal_id_nesting_flag
      };
    }
    static parseSPS(uint8array) {
      let rbsp = H265NaluParser._ebsp2rbsp(uint8array);
      let gb = new ExpGolomb(rbsp);

      /* remove NALu Header */
      gb.readByte();
      gb.readByte();
      let left_offset = 0,
        right_offset = 0,
        top_offset = 0,
        bottom_offset = 0;

      // SPS
      gb.readBits(4);
      let max_sub_layers_minus1 = gb.readBits(3);
      gb.readBool();

      // profile_tier_level begin
      let general_profile_space = gb.readBits(2);
      let general_tier_flag = gb.readBool();
      let general_profile_idc = gb.readBits(5);
      let general_profile_compatibility_flags_1 = gb.readByte();
      let general_profile_compatibility_flags_2 = gb.readByte();
      let general_profile_compatibility_flags_3 = gb.readByte();
      let general_profile_compatibility_flags_4 = gb.readByte();
      let general_constraint_indicator_flags_1 = gb.readByte();
      let general_constraint_indicator_flags_2 = gb.readByte();
      let general_constraint_indicator_flags_3 = gb.readByte();
      let general_constraint_indicator_flags_4 = gb.readByte();
      let general_constraint_indicator_flags_5 = gb.readByte();
      let general_constraint_indicator_flags_6 = gb.readByte();
      let general_level_idc = gb.readByte();
      let sub_layer_profile_present_flag = [];
      let sub_layer_level_present_flag = [];
      for (let i = 0; i < max_sub_layers_minus1; i++) {
        sub_layer_profile_present_flag.push(gb.readBool());
        sub_layer_level_present_flag.push(gb.readBool());
      }
      if (max_sub_layers_minus1 > 0) {
        for (let i = max_sub_layers_minus1; i < 8; i++) {
          gb.readBits(2);
        }
      }
      for (let i = 0; i < max_sub_layers_minus1; i++) {
        if (sub_layer_profile_present_flag[i]) {
          gb.readByte(); // sub_layer_profile_space, sub_layer_tier_flag, sub_layer_profile_idc
          gb.readByte();
          gb.readByte();
          gb.readByte();
          gb.readByte(); // sub_layer_profile_compatibility_flag
          gb.readByte();
          gb.readByte();
          gb.readByte();
          gb.readByte();
          gb.readByte();
          gb.readByte();
        }
        if (sub_layer_level_present_flag[i]) {
          gb.readByte();
        }
      }
      // profile_tier_level end

      gb.readUEG();
      let chroma_format_idc = gb.readUEG();
      if (chroma_format_idc == 3) {
        gb.readBits(1); // separate_colour_plane_flag
      }

      let pic_width_in_luma_samples = gb.readUEG();
      let pic_height_in_luma_samples = gb.readUEG();
      let conformance_window_flag = gb.readBool();
      if (conformance_window_flag) {
        left_offset += gb.readUEG();
        right_offset += gb.readUEG();
        top_offset += gb.readUEG();
        bottom_offset += gb.readUEG();
      }
      let bit_depth_luma_minus8 = gb.readUEG();
      let bit_depth_chroma_minus8 = gb.readUEG();
      let log2_max_pic_order_cnt_lsb_minus4 = gb.readUEG();
      let sub_layer_ordering_info_present_flag = gb.readBool();
      for (let i = sub_layer_ordering_info_present_flag ? 0 : max_sub_layers_minus1; i <= max_sub_layers_minus1; i++) {
        gb.readUEG(); // max_dec_pic_buffering_minus1[i]
        gb.readUEG(); // max_num_reorder_pics[i]
        gb.readUEG(); // max_latency_increase_plus1[i]
      }

      gb.readUEG();
      gb.readUEG();
      gb.readUEG();
      gb.readUEG();
      gb.readUEG();
      gb.readUEG();
      let scaling_list_enabled_flag = gb.readBool();
      if (scaling_list_enabled_flag) {
        let sps_scaling_list_data_present_flag = gb.readBool();
        if (sps_scaling_list_data_present_flag) {
          for (let sizeId = 0; sizeId < 4; sizeId++) {
            for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) {
              let scaling_list_pred_mode_flag = gb.readBool();
              if (!scaling_list_pred_mode_flag) {
                gb.readUEG(); // scaling_list_pred_matrix_id_delta
              } else {
                let coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
                if (sizeId > 1) {
                  gb.readSEG();
                }
                for (let i = 0; i < coefNum; i++) {
                  gb.readSEG();
                }
              }
            }
          }
        }
      }
      gb.readBool();
      gb.readBool();
      let pcm_enabled_flag = gb.readBool();
      if (pcm_enabled_flag) {
        gb.readByte();
        gb.readUEG();
        gb.readUEG();
        gb.readBool();
      }
      let num_short_term_ref_pic_sets = gb.readUEG();
      let num_delta_pocs = 0;
      for (let i = 0; i < num_short_term_ref_pic_sets; i++) {
        let inter_ref_pic_set_prediction_flag = false;
        if (i !== 0) {
          inter_ref_pic_set_prediction_flag = gb.readBool();
        }
        if (inter_ref_pic_set_prediction_flag) {
          if (i === num_short_term_ref_pic_sets) {
            gb.readUEG();
          }
          gb.readBool();
          gb.readUEG();
          let next_num_delta_pocs = 0;
          for (let j = 0; j <= num_delta_pocs; j++) {
            let used_by_curr_pic_flag = gb.readBool();
            let use_delta_flag = false;
            if (!used_by_curr_pic_flag) {
              use_delta_flag = gb.readBool();
            }
            if (used_by_curr_pic_flag || use_delta_flag) {
              next_num_delta_pocs++;
            }
          }
          num_delta_pocs = next_num_delta_pocs;
        } else {
          let num_negative_pics = gb.readUEG();
          let num_positive_pics = gb.readUEG();
          num_delta_pocs = num_negative_pics + num_positive_pics;
          for (let j = 0; j < num_negative_pics; j++) {
            gb.readUEG();
            gb.readBool();
          }
          for (let j = 0; j < num_positive_pics; j++) {
            gb.readUEG();
            gb.readBool();
          }
        }
      }
      let long_term_ref_pics_present_flag = gb.readBool();
      if (long_term_ref_pics_present_flag) {
        let num_long_term_ref_pics_sps = gb.readUEG();
        for (let i = 0; i < num_long_term_ref_pics_sps; i++) {
          for (let j = 0; j < log2_max_pic_order_cnt_lsb_minus4 + 4; j++) {
            gb.readBits(1);
          }
          gb.readBits(1);
        }
      }
      //*
      let default_display_window_flag = false; // for calc offset
      let min_spatial_segmentation_idc = 0; // for hvcC
      let sar_width = 1,
        sar_height = 1;
      let fps_fixed = false,
        fps_den = 1,
        fps_num = 1;
      //*/
      gb.readBool();
      gb.readBool();
      let vui_parameters_present_flag = gb.readBool();
      if (vui_parameters_present_flag) {
        let aspect_ratio_info_present_flag = gb.readBool();
        if (aspect_ratio_info_present_flag) {
          let aspect_ratio_idc = gb.readByte();
          let sar_w_table = [1, 12, 10, 16, 40, 24, 20, 32, 80, 18, 15, 64, 160, 4, 3, 2];
          let sar_h_table = [1, 11, 11, 11, 33, 11, 11, 11, 33, 11, 11, 33, 99, 3, 2, 1];
          if (aspect_ratio_idc > 0 && aspect_ratio_idc <= 16) {
            sar_width = sar_w_table[aspect_ratio_idc - 1];
            sar_height = sar_h_table[aspect_ratio_idc - 1];
          } else if (aspect_ratio_idc === 255) {
            sar_width = gb.readBits(16);
            sar_height = gb.readBits(16);
          }
        }
        let overscan_info_present_flag = gb.readBool();
        if (overscan_info_present_flag) {
          gb.readBool();
        }
        let video_signal_type_present_flag = gb.readBool();
        if (video_signal_type_present_flag) {
          gb.readBits(3);
          gb.readBool();
          let colour_description_present_flag = gb.readBool();
          if (colour_description_present_flag) {
            gb.readByte();
            gb.readByte();
            gb.readByte();
          }
        }
        let chroma_loc_info_present_flag = gb.readBool();
        if (chroma_loc_info_present_flag) {
          gb.readUEG();
          gb.readUEG();
        }
        gb.readBool();
        gb.readBool();
        gb.readBool();
        default_display_window_flag = gb.readBool();
        if (default_display_window_flag) {
          gb.readUEG();
          gb.readUEG();
          gb.readUEG();
          gb.readUEG();
        }
        let vui_timing_info_present_flag = gb.readBool();
        if (vui_timing_info_present_flag) {
          fps_den = gb.readBits(32);
          fps_num = gb.readBits(32);
          let vui_poc_proportional_to_timing_flag = gb.readBool();
          if (vui_poc_proportional_to_timing_flag) {
            gb.readUEG();
          }
          let vui_hrd_parameters_present_flag = gb.readBool();
          if (vui_hrd_parameters_present_flag) {
            let nal_hrd_parameters_present_flag = false;
            let vcl_hrd_parameters_present_flag = false;
            let sub_pic_hrd_params_present_flag = false;
            {
              nal_hrd_parameters_present_flag = gb.readBool();
              vcl_hrd_parameters_present_flag = gb.readBool();
              if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
                sub_pic_hrd_params_present_flag = gb.readBool();
                if (sub_pic_hrd_params_present_flag) {
                  gb.readByte();
                  gb.readBits(5);
                  gb.readBool();
                  gb.readBits(5);
                }
                gb.readBits(4);
                gb.readBits(4);
                if (sub_pic_hrd_params_present_flag) {
                  gb.readBits(4);
                }
                gb.readBits(5);
                gb.readBits(5);
                gb.readBits(5);
              }
            }
            for (let i = 0; i <= max_sub_layers_minus1; i++) {
              let fixed_pic_rate_general_flag = gb.readBool();
              fps_fixed = fixed_pic_rate_general_flag;
              let fixed_pic_rate_within_cvs_flag = true;
              let cpbCnt = 1;
              if (!fixed_pic_rate_general_flag) {
                fixed_pic_rate_within_cvs_flag = gb.readBool();
              }
              let low_delay_hrd_flag = false;
              if (fixed_pic_rate_within_cvs_flag) {
                gb.readUEG();
              } else {
                low_delay_hrd_flag = gb.readBool();
              }
              if (!low_delay_hrd_flag) {
                cpbCnt = gb.readUEG() + 1;
              }
              if (nal_hrd_parameters_present_flag) {
                for (let j = 0; j < cpbCnt; j++) {
                  gb.readUEG();
                  gb.readUEG();
                  if (sub_pic_hrd_params_present_flag) {
                    gb.readUEG();
                    gb.readUEG();
                  }
                }
                gb.readBool();
              }
              if (vcl_hrd_parameters_present_flag) {
                for (let j = 0; j < cpbCnt; j++) {
                  gb.readUEG();
                  gb.readUEG();
                  if (sub_pic_hrd_params_present_flag) {
                    gb.readUEG();
                    gb.readUEG();
                  }
                }
                gb.readBool();
              }
            }
          }
        }
        let bitstream_restriction_flag = gb.readBool();
        if (bitstream_restriction_flag) {
          gb.readBool();
          gb.readBool();
          gb.readBool();
          min_spatial_segmentation_idc = gb.readUEG();
          gb.readUEG();
          gb.readUEG();
          gb.readUEG();
          gb.readUEG();
        }
      }
      gb.readBool(); // ignore...

      // for meta data
      let codec_mimetype = `hvc1.${general_profile_idc}.1.L${general_level_idc}.B0`;
      let sub_wc = chroma_format_idc === 1 || chroma_format_idc === 2 ? 2 : 1;
      let sub_hc = chroma_format_idc === 1 ? 2 : 1;
      let codec_width = pic_width_in_luma_samples - (left_offset + right_offset) * sub_wc;
      let codec_height = pic_height_in_luma_samples - (top_offset + bottom_offset) * sub_hc;
      let sar_scale = 1;
      if (sar_width !== 1 && sar_height !== 1) {
        sar_scale = sar_width / sar_height;
      }
      gb.destroy();
      gb = null;
      return {
        codec_mimetype,
        profile_string: H265NaluParser.getProfileString(general_profile_idc),
        level_string: H265NaluParser.getLevelString(general_level_idc),
        profile_idc: general_profile_idc,
        bit_depth: bit_depth_luma_minus8 + 8,
        ref_frames: 1,
        // FIXME!!!
        chroma_format: chroma_format_idc,
        chroma_format_string: H265NaluParser.getChromaFormatString(chroma_format_idc),
        general_level_idc,
        general_profile_space,
        general_tier_flag,
        general_profile_idc,
        general_profile_compatibility_flags_1,
        general_profile_compatibility_flags_2,
        general_profile_compatibility_flags_3,
        general_profile_compatibility_flags_4,
        general_constraint_indicator_flags_1,
        general_constraint_indicator_flags_2,
        general_constraint_indicator_flags_3,
        general_constraint_indicator_flags_4,
        general_constraint_indicator_flags_5,
        general_constraint_indicator_flags_6,
        min_spatial_segmentation_idc,
        constant_frame_rate: 0 /* FIXME!! fps_fixed ? 1 : 0? */,
        chroma_format_idc,
        bit_depth_luma_minus8,
        bit_depth_chroma_minus8,
        frame_rate: {
          fixed: fps_fixed,
          fps: fps_num / fps_den,
          fps_den: fps_den,
          fps_num: fps_num
        },
        sar_ratio: {
          width: sar_width,
          height: sar_height
        },
        codec_size: {
          width: codec_width,
          height: codec_height
        },
        present_size: {
          width: codec_width * sar_scale,
          height: codec_height
        }
      };
    }
    static parsePPS(uint8array) {
      let rbsp = H265NaluParser._ebsp2rbsp(uint8array);
      let gb = new ExpGolomb(rbsp);

      /* remove NALu Header */
      gb.readByte();
      gb.readByte();
      gb.readUEG();
      gb.readUEG();
      gb.readBool();
      gb.readBool();
      gb.readBits(3);
      gb.readBool();
      gb.readBool();
      gb.readUEG();
      gb.readUEG();
      gb.readSEG();
      gb.readBool();
      gb.readBool();
      let cu_qp_delta_enabled_flag = gb.readBool();
      if (cu_qp_delta_enabled_flag) {
        gb.readUEG();
      }
      gb.readSEG();
      gb.readSEG();
      gb.readBool();
      gb.readBool();
      gb.readBool();
      gb.readBool();
      let tiles_enabled_flag = gb.readBool();
      let entropy_coding_sync_enabled_flag = gb.readBool();
      // and more ...

      // needs hvcC
      let parallelismType = 1; // slice-based parallel decoding
      if (entropy_coding_sync_enabled_flag && tiles_enabled_flag) {
        parallelismType = 0; // mixed-type parallel decoding
      } else if (entropy_coding_sync_enabled_flag) {
        parallelismType = 3; // wavefront-based parallel decoding
      } else if (tiles_enabled_flag) {
        parallelismType = 2; // tile-based parallel decoding
      }

      return {
        parallelismType
      };
    }
    static getChromaFormatString(chroma_idc) {
      switch (chroma_idc) {
        case 0:
          return '4:0:0';
        case 1:
          return '4:2:0';
        case 2:
          return '4:2:2';
        case 3:
          return '4:4:4';
        default:
          return 'Unknown';
      }
    }
    static getProfileString(profile_idc) {
      switch (profile_idc) {
        case 1:
          return 'Main';
        case 2:
          return 'Main10';
        case 3:
          return 'MainSP';
        case 4:
          return 'Rext';
        case 9:
          return 'SCC';
        default:
          return 'Unknown';
      }
    }
    static getLevelString(level_idc) {
      return (level_idc / 30).toFixed(1);
    }
  }

  /**
   *
   * @param arrayBuffer
   */
  function parseHEVCDecoderConfigurationRecord$2(arrayBuffer) {
    let info = {
      codecWidth: 0,
      codecHeight: 0,
      videoType: VIDEO_ENCODE_TYPE.h265
    };
    info.width = 0;
    info.height = 0;
    info.profile = 0;
    info.level = 0;
    //  remove 5 bytes
    arrayBuffer = arrayBuffer.slice(5);
    do {
      let hevc = {};
      if (arrayBuffer.length < 23) {
        console.warn('parseHEVCDecoderConfigurationRecord$2', `arrayBuffer.length ${arrayBuffer.length} < 23`);
        break;
      }
      hevc.configurationVersion = arrayBuffer[0];
      if (hevc.configurationVersion != 1) {
        break;
      }
      hevc.general_profile_space = arrayBuffer[1] >> 6 & 0x03;
      hevc.general_tier_flag = arrayBuffer[1] >> 5 & 0x01;
      hevc.general_profile_idc = arrayBuffer[1] & 0x1F;
      hevc.general_profile_compatibility_flags = arrayBuffer[2] << 24 | arrayBuffer[3] << 16 | arrayBuffer[4] << 8 | arrayBuffer[5];
      hevc.general_constraint_indicator_flags = arrayBuffer[6] << 24 | arrayBuffer[7] << 16 | arrayBuffer[8] << 8 | arrayBuffer[9];
      hevc.general_constraint_indicator_flags = hevc.general_constraint_indicator_flags << 16 | arrayBuffer[10] << 8 | arrayBuffer[11];
      hevc.general_level_idc = arrayBuffer[12];
      hevc.min_spatial_segmentation_idc = (arrayBuffer[13] & 0x0F) << 8 | arrayBuffer[14];
      hevc.parallelismType = arrayBuffer[15] & 0x03;
      hevc.chromaFormat = arrayBuffer[16] & 0x03;
      hevc.bitDepthLumaMinus8 = arrayBuffer[17] & 0x07;
      hevc.bitDepthChromaMinus8 = arrayBuffer[18] & 0x07;
      hevc.avgFrameRate = arrayBuffer[19] << 8 | arrayBuffer[20];
      hevc.constantFrameRate = arrayBuffer[21] >> 6 & 0x03;
      hevc.numTemporalLayers = arrayBuffer[21] >> 3 & 0x07;
      hevc.temporalIdNested = arrayBuffer[21] >> 2 & 0x01;
      hevc.lengthSizeMinusOne = arrayBuffer[21] & 0x03;
      let numOfArrays = arrayBuffer[22];
      let p = arrayBuffer.slice(23);
      for (let i = 0; i < numOfArrays; i++) {
        if (p.length < 3) {
          break;
        }
        let nalutype = p[0] & 0x3F;
        let n = p[1] << 8 | p[2];
        // console.log('nalutype', nalutype,n)
        p = p.slice(3);
        for (let j = 0; j < n; j++) {
          if (p.length < 2) {
            break;
          }
          let k = p[0] << 8 | p[1];
          // console.log('k', k)
          if (p.length < 2 + k) {
            break;
          }
          p = p.slice(2);
          if (nalutype == 33) {
            //SPS
            let sps = new Uint8Array(k);
            sps.set(p.slice(0, k), 0);
            hevc.psps = HEVCParseSPS(sps, hevc);
            info.profile = hevc.general_profile_idc;
            info.level = hevc.general_level_idc / 30.0;
            info.width = hevc.psps.pic_width_in_luma_samples - (hevc.psps.conf_win_left_offset + hevc.psps.conf_win_right_offset);
            info.height = hevc.psps.pic_height_in_luma_samples - (hevc.psps.conf_win_top_offset + hevc.psps.conf_win_bottom_offset);
          }
          p = p.slice(k);
        }
      }
    } while (0);
    info.codecWidth = info.width || 1920;
    info.codecHeight = info.height || 1080;
    info.presentHeight = info.codecHeight;
    info.presentWidth = info.codecWidth;
    info.timescale = 1000;
    info.refSampleDuration = 1000 * (1000 / 23976);
    return info;
  }

  /**
   *
   * @param arrayBuffer
   * @returns {{}}
   * @desc v4 版本
   */
  function parseHEVCDecoderConfigurationRecord$4(arrayBuffer) {
    const hevcSequenceHeader = arrayBuffer;
    if (hevcSequenceHeader.length < 22) {
      console.error(`Invalid HEVCDecoderConfigurationRecord, lack of data!`);
      return;
    }
    let meta = {
      codecWidth: 0,
      codecHeight: 0,
      videoType: VIDEO_ENCODE_TYPE.h265
    };
    let le = function () {
      let buf = new ArrayBuffer(2);
      new DataView(buf).setInt16(0, 256, true); // little-endian write
      return new Int16Array(buf)[0] === 256; // platform-spec read, if equal then LE
    }();

    let v = new DataView(hevcSequenceHeader.buffer);
    let version = v.getUint8(0); // configurationVersion
    let hevcProfile = v.getUint8(1) & 0x1F; // hevcProfileIndication

    if (version !== 1 || hevcProfile === 0) {
      console.error(`Flv: Invalid HEVCDecoderConfigurationRecord`);
      return;
    }
    let naluLengthSize = (v.getUint8(21) & 3) + 1; // lengthSizeMinusOne
    if (naluLengthSize !== 3 && naluLengthSize !== 4) {
      // holy shit!!!
      console.error(`Strange NaluLengthSizeMinusOne: ${naluLengthSize - 1}`);
      return;
    }
    let numOfArrays = v.getUint8(22);
    for (let i = 0, offset = 23; i < numOfArrays; i++) {
      let nalUnitType = v.getUint8(offset + 0) & 0x3F;
      let numNalus = v.getUint16(offset + 1, !le);
      offset += 3;
      for (let j = 0; j < numNalus; j++) {
        let len = v.getUint16(offset + 0, !le);
        if (j !== 0) {
          offset += 2 + len;
          continue;
        }
        if (nalUnitType === 33) {
          offset += 2;
          let sps = new Uint8Array(hevcSequenceHeader.buffer, offset, len);
          let config = H265NaluParser.parseSPS(sps);
          meta.codecWidth = config.codec_size.width;
          meta.codecHeight = config.codec_size.height;
          meta.presentWidth = config.present_size.width;
          meta.presentHeight = config.present_size.height;
          meta.profile = config.profile_string;
          meta.level = config.level_string;
          meta.bitDepth = config.bit_depth;
          meta.chromaFormat = config.chroma_format;
          meta.sarRatio = config.sar_ratio;
          meta.frameRate = config.frame_rate;
          if (config.frame_rate.fixed === false || config.frame_rate.fps_num === 0 || config.frame_rate.fps_den === 0) {
            meta.frameRate = {
              fixed: true,
              fps: 23.976,
              fps_num: 23976,
              fps_den: 1000
            };
          }
          meta.frameRate.fps_den;
          meta.frameRate.fps_num;
          // meta.refSampleDuration = meta.timescale * (fps_den / fps_num);
          meta.codec = config.codec_mimetype;
          offset += len;
        } else {
          offset += 2 + len;
        }
      }
    }
    meta.hvcc = new Uint8Array(hevcSequenceHeader);
    return meta;
  }
  function HEVCParsePtl(bitop, hevc, max_sub_layers_minus1) {
    let general_ptl = {};
    general_ptl.profile_space = bitop.read(2);
    general_ptl.tier_flag = bitop.read(1);
    general_ptl.profile_idc = bitop.read(5);
    general_ptl.profile_compatibility_flags = bitop.read(32);
    general_ptl.general_progressive_source_flag = bitop.read(1);
    general_ptl.general_interlaced_source_flag = bitop.read(1);
    general_ptl.general_non_packed_constraint_flag = bitop.read(1);
    general_ptl.general_frame_only_constraint_flag = bitop.read(1);
    bitop.read(32);
    bitop.read(12);
    general_ptl.level_idc = bitop.read(8);
    general_ptl.sub_layer_profile_present_flag = [];
    general_ptl.sub_layer_level_present_flag = [];
    for (let i = 0; i < max_sub_layers_minus1; i++) {
      general_ptl.sub_layer_profile_present_flag[i] = bitop.read(1);
      general_ptl.sub_layer_level_present_flag[i] = bitop.read(1);
    }
    if (max_sub_layers_minus1 > 0) {
      for (let i = max_sub_layers_minus1; i < 8; i++) {
        bitop.read(2);
      }
    }
    general_ptl.sub_layer_profile_space = [];
    general_ptl.sub_layer_tier_flag = [];
    general_ptl.sub_layer_profile_idc = [];
    general_ptl.sub_layer_profile_compatibility_flag = [];
    general_ptl.sub_layer_progressive_source_flag = [];
    general_ptl.sub_layer_interlaced_source_flag = [];
    general_ptl.sub_layer_non_packed_constraint_flag = [];
    general_ptl.sub_layer_frame_only_constraint_flag = [];
    general_ptl.sub_layer_level_idc = [];
    for (let i = 0; i < max_sub_layers_minus1; i++) {
      if (general_ptl.sub_layer_profile_present_flag[i]) {
        general_ptl.sub_layer_profile_space[i] = bitop.read(2);
        general_ptl.sub_layer_tier_flag[i] = bitop.read(1);
        general_ptl.sub_layer_profile_idc[i] = bitop.read(5);
        general_ptl.sub_layer_profile_compatibility_flag[i] = bitop.read(32);
        general_ptl.sub_layer_progressive_source_flag[i] = bitop.read(1);
        general_ptl.sub_layer_interlaced_source_flag[i] = bitop.read(1);
        general_ptl.sub_layer_non_packed_constraint_flag[i] = bitop.read(1);
        general_ptl.sub_layer_frame_only_constraint_flag[i] = bitop.read(1);
        bitop.read(32);
        bitop.read(12);
      }
      if (general_ptl.sub_layer_level_present_flag[i]) {
        general_ptl.sub_layer_level_idc[i] = bitop.read(8);
      } else {
        general_ptl.sub_layer_level_idc[i] = 1;
      }
    }
    return general_ptl;
  }
  function HEVCParseSPS(SPS, hevc) {
    let psps = {};
    let NumBytesInNALunit = SPS.length;
    let rbsp_array = [];
    let bitop = new Bitop(SPS);
    bitop.read(1); //forbidden_zero_bit
    bitop.read(6); //nal_unit_type
    bitop.read(6); //nuh_reserved_zero_6bits
    bitop.read(3); //nuh_temporal_id_plus1

    for (let i = 2; i < NumBytesInNALunit; i++) {
      if (i + 2 < NumBytesInNALunit && bitop.look(24) == 0x000003) {
        rbsp_array.push(bitop.read(8));
        rbsp_array.push(bitop.read(8));
        i += 2;
        bitop.read(8); /* equal to 0x03 */
      } else {
        rbsp_array.push(bitop.read(8));
      }
    }
    let rbsp = new Uint8Array(rbsp_array);
    let rbspBitop = new Bitop(rbsp);
    psps.sps_video_parameter_set_id = rbspBitop.read(4);
    psps.sps_max_sub_layers_minus1 = rbspBitop.read(3);
    psps.sps_temporal_id_nesting_flag = rbspBitop.read(1);
    psps.profile_tier_level = HEVCParsePtl(rbspBitop, hevc, psps.sps_max_sub_layers_minus1);
    psps.sps_seq_parameter_set_id = rbspBitop.read_golomb();
    psps.chroma_format_idc = rbspBitop.read_golomb();
    if (psps.chroma_format_idc == 3) {
      psps.separate_colour_plane_flag = rbspBitop.read(1);
    } else {
      psps.separate_colour_plane_flag = 0;
    }
    psps.pic_width_in_luma_samples = rbspBitop.read_golomb();
    psps.pic_height_in_luma_samples = rbspBitop.read_golomb();
    psps.conformance_window_flag = rbspBitop.read(1);
    if (psps.conformance_window_flag) {
      let vert_mult = 1 + (psps.chroma_format_idc < 2);
      let horiz_mult = 1 + (psps.chroma_format_idc < 3);
      psps.conf_win_left_offset = rbspBitop.read_golomb() * horiz_mult;
      psps.conf_win_right_offset = rbspBitop.read_golomb() * horiz_mult;
      psps.conf_win_top_offset = rbspBitop.read_golomb() * vert_mult;
      psps.conf_win_bottom_offset = rbspBitop.read_golomb() * vert_mult;
    } else {
      psps.conf_win_left_offset = 0;
      psps.conf_win_right_offset = 0;
      psps.conf_win_top_offset = 0;
      psps.conf_win_bottom_offset = 0;
    }
    // Logger.debug(psps);
    return psps;
  }
  function hevcEncoderConfigurationRecord$2(_ref2) {
    let {
      vps,
      pps,
      sps
    } = _ref2;
    let detail = {
      configurationVersion: 1
    };
    const vpsDetail = parseHevcVPS(vps);
    const spsDetail = parseHevcSPS(sps);
    const ppsDetail = parseHevcPPS(pps);
    detail = Object.assign(detail, vpsDetail, spsDetail, ppsDetail);
    let length = 23 + (3 + 2 + vps.byteLength) + (3 + 2 + sps.byteLength) + (3 + 2 + pps.byteLength);
    let data = new Uint8Array(length);
    data[0] = 0x01; // configurationVersion
    data[1] = (detail.general_profile_space & 0x03) << 6 | (detail.general_tier_flag ? 1 : 0) << 5 | detail.general_profile_idc & 0x1F;
    data[2] = detail.general_profile_compatibility_flags_1 || 0;
    data[3] = detail.general_profile_compatibility_flags_2 || 0;
    data[4] = detail.general_profile_compatibility_flags_3 || 0;
    data[5] = detail.general_profile_compatibility_flags_4 || 0;
    data[6] = detail.general_constraint_indicator_flags_1 || 0;
    data[7] = detail.general_constraint_indicator_flags_2 || 0;
    data[8] = detail.general_constraint_indicator_flags_3 || 0;
    data[9] = detail.general_constraint_indicator_flags_4 || 0;
    data[10] = detail.general_constraint_indicator_flags_5 || 0;
    data[11] = detail.general_constraint_indicator_flags_6 || 0;
    data[12] = 0x3C;
    data[13] = 0xF0 | (detail.min_spatial_segmentation_idc & 0x0F00) >> 8;
    data[14] = detail.min_spatial_segmentation_idc & 0xFF;
    data[15] = 0xFC | detail.parallelismType & 0x03;
    data[16] = 0xFC | detail.chroma_format_idc & 0x03;
    data[17] = 0xF8 | detail.bit_depth_luma_minus8 & 0x07;
    data[18] = 0xF8 | detail.bit_depth_chroma_minus8 & 0x07;
    data[19] = 0;
    data[20] = 0;
    data[21] = (detail.constant_frame_rate & 0x03) << 6 | (detail.num_temporal_layers & 0x07) << 3 | (detail.temporal_id_nested ? 1 : 0) << 2 | 3;
    data[22] = 3;
    data[23 + 0 + 0] = 0x80 | H265_NAL_TYPE.vps;
    data[23 + 0 + 1] = 0;
    data[23 + 0 + 2] = 1;
    data[23 + 0 + 3] = (vps.byteLength & 0xFF00) >> 8;
    data[23 + 0 + 4] = (vps.byteLength & 0x00FF) >> 0;
    data.set(vps, 23 + 0 + 5);
    data[23 + (5 + vps.byteLength) + 0] = 0x80 | H265_NAL_TYPE.sps;
    data[23 + (5 + vps.byteLength) + 1] = 0;
    data[23 + (5 + vps.byteLength) + 2] = 1;
    data[23 + (5 + vps.byteLength) + 3] = (sps.byteLength & 0xFF00) >> 8;
    data[23 + (5 + vps.byteLength) + 4] = (sps.byteLength & 0x00FF) >> 0;
    data.set(sps, 23 + (5 + vps.byteLength) + 5);
    data[23 + (5 + vps.byteLength + 5 + sps.byteLength) + 0] = 0x80 | H265_NAL_TYPE.pps;
    data[23 + (5 + vps.byteLength + 5 + sps.byteLength) + 1] = 0;
    data[23 + (5 + vps.byteLength + 5 + sps.byteLength) + 2] = 1;
    data[23 + (5 + vps.byteLength + 5 + sps.byteLength) + 3] = (pps.byteLength & 0xFF00) >> 8;
    data[23 + (5 + vps.byteLength + 5 + sps.byteLength) + 4] = (pps.byteLength & 0x00FF) >> 0;
    data.set(pps, 23 + (5 + vps.byteLength + 5 + sps.byteLength) + 5);
    const prevData = [0x1c, 0, 0, 0, 0];
    const newData = new Uint8Array(prevData.length + data.byteLength);
    newData.set(prevData, 0);
    newData.set(data, prevData.length);
    return newData;
  }

  /**
   *
   * @param oneNALBuffer
   * @param isIframe
   * @returns {Uint8Array}
   */
  function hevcEncoderNalePacket(oneNALBuffer, isIframe) {
    //     正常发送nal
    // 这边增加 是否i帧， 然后前面封装了1 + 8 个字节的数据。
    const idrBit = 0x10 | 12;
    const nIdrBit = 0x20 | 12;
    let tmp = [];
    if (isIframe) {
      tmp[0] = idrBit;
    } else {
      tmp[0] = nIdrBit;
    }
    tmp[1] = 1;
    //
    tmp[2] = 0;
    tmp[3] = 0;
    tmp[4] = 0;
    // 真正开始的地方。。。
    tmp[5] = oneNALBuffer.byteLength >> 24 & 0xff;
    tmp[6] = oneNALBuffer.byteLength >> 16 & 0xff;
    tmp[7] = oneNALBuffer.byteLength >> 8 & 0xff;
    tmp[8] = oneNALBuffer.byteLength & 0xff;
    const arrayBuffer = new Uint8Array(tmp.length + oneNALBuffer.byteLength);
    arrayBuffer.set(tmp, 0);
    arrayBuffer.set(oneNALBuffer, tmp.length);
    return arrayBuffer;
  }
  function hevcEncoderNalePacketNotLength(oneNALBuffer, isIframe) {
    //     正常发送nal
    // 这边增加 是否i帧， 然后前面封装了1 + 8 个字节的数据。
    const idrBit = 0x10 | 12;
    const nIdrBit = 0x20 | 12;
    let tmp = [];
    if (isIframe) {
      tmp[0] = idrBit;
    } else {
      tmp[0] = nIdrBit;
    }
    tmp[1] = 1;
    //
    tmp[2] = 0;
    tmp[3] = 0;
    tmp[4] = 0;
    const arrayBuffer = new Uint8Array(tmp.length + oneNALBuffer.byteLength);
    arrayBuffer.set(tmp, 0);
    arrayBuffer.set(oneNALBuffer, tmp.length);
    return arrayBuffer;
  }
  function getHevcSeqHeadType(nalu) {
    return (nalu[0] & 0x7E) >> 1;
  }
  function isHevcSEIType(type) {
    return type === H265_NAL_TYPE.sei;
  }

  // 32-40是VPS SPS PPS SUFFIX_SEI_NUT等
  function isHevcSeqHead(type) {
    return type >= 32 && type <= 40;
  }
  function isNotHevcSeqHead(type) {
    return !isHevcSeqHead(type);
  }

  // 16-21是关键(I)帧
  function isHevcNaluIFrame(type) {
    return type >= 16 && type <= 21;
  }
  function isSameHevcNaluType(naluList) {
    if (naluList.length === 0) {
      return false;
    }
    const type = getHevcSeqHeadType(naluList[0]);
    for (let i = 1; i < naluList.length; i++) {
      if (type !== getHevcSeqHeadType(naluList[i])) {
        return false;
      }
    }
    return true;
  }
  class H265AnnexBParser {
    constructor(data) {
      this.data = data;
      this.eofFlag = false;
      this.currentStartcodeOffset = this.findNextStartCodeOffset(0);
      if (this.eofFlag) {
        console.error('Could not find H265 startcode until payload end!');
      }
    }
    findNextStartCodeOffset(start_offset) {
      let i = start_offset;
      let data = this.data;
      while (true) {
        if (i + 3 >= data.byteLength) {
          this.eofFlag = true;
          return data.byteLength;
        }

        // search 00 00 00 01 or 00 00 01
        let uint32 = data[i + 0] << 24 | data[i + 1] << 16 | data[i + 2] << 8 | data[i + 3];
        let uint24 = data[i + 0] << 16 | data[i + 1] << 8 | data[i + 2];
        if (uint32 === 0x00000001 || uint24 === 0x000001) {
          return i;
        } else {
          i++;
        }
      }
    }
    readNextNaluPayload() {
      let data = this.data;
      let nalu_payload = null;
      while (nalu_payload == null) {
        if (this.eofFlag) {
          break;
        }
        // offset pointed to start code
        let startcode_offset = this.currentStartcodeOffset;

        // nalu payload start offset
        let offset = startcode_offset;
        let u32 = data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3];
        if (u32 === 0x00000001) {
          offset += 4;
        } else {
          offset += 3;
        }
        let nalu_type = data[offset] >> 1 & 0x3F;
        let forbidden_bit = (data[offset] & 0x80) >>> 7;
        let next_startcode_offset = this.findNextStartCodeOffset(offset);
        this.currentStartcodeOffset = next_startcode_offset;
        if (forbidden_bit !== 0) {
          // Log.e(this.TAG, `forbidden_bit near offset ${offset} should be 0 but has value ${forbidden_bit}`);
          continue;
        }
        let payload_data = data.subarray(offset, next_startcode_offset);
        nalu_payload = {
          type: nalu_type,
          data: payload_data
        };
      }
      return nalu_payload;
    }
  }
  class H265NaluHVC1 {
    constructor(nalu) {
      let nalu_size = nalu.data.byteLength;
      this.type = nalu.type;
      this.data = new Uint8Array(4 + nalu_size); // 4 byte length-header + nalu payload

      let v = new DataView(this.data.buffer);
      // Fill 4 byte length-header
      v.setUint32(0, nalu_size);
      // Copy payload
      this.data.set(nalu.data, 4);
    }
  }

  function checkInt(value) {
    return parseInt(value) === value;
  }
  function checkInts(arrayish) {
    if (!checkInt(arrayish.length)) {
      return false;
    }
    for (var i = 0; i < arrayish.length; i++) {
      if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
        return false;
      }
    }
    return true;
  }
  function coerceArray(arg, copy) {
    // ArrayBuffer view
    if (arg.buffer && arg.name === 'Uint8Array') {
      if (copy) {
        if (arg.slice) {
          arg = arg.slice();
        } else {
          arg = Array.prototype.slice.call(arg);
        }
      }
      return arg;
    }

    // It's an array; check it is a valid representation of a byte
    if (Array.isArray(arg)) {
      if (!checkInts(arg)) {
        throw new Error('Array contains invalid value: ' + arg);
      }
      return new Uint8Array(arg);
    }

    // Something else, but behaves like an array (maybe a Buffer? Arguments?)
    if (checkInt(arg.length) && checkInts(arg)) {
      return new Uint8Array(arg);
    }
    throw new Error('unsupported array-like object');
  }
  function createArray(length) {
    return new Uint8Array(length);
  }
  function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
    if (sourceStart != null || sourceEnd != null) {
      if (sourceArray.slice) {
        sourceArray = sourceArray.slice(sourceStart, sourceEnd);
      } else {
        sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
      }
    }
    targetArray.set(sourceArray, targetStart);
  }
  var convertUtf8 = function () {
    function toBytes(text) {
      var result = [],
        i = 0;
      text = encodeURI(text);
      while (i < text.length) {
        var c = text.charCodeAt(i++);

        // if it is a % sign, encode the following 2 bytes as a hex value
        if (c === 37) {
          result.push(parseInt(text.substr(i, 2), 16));
          i += 2;

          // otherwise, just the actual byte
        } else {
          result.push(c);
        }
      }
      return coerceArray(result);
    }
    function fromBytes(bytes) {
      var result = [],
        i = 0;
      while (i < bytes.length) {
        var c = bytes[i];
        if (c < 128) {
          result.push(String.fromCharCode(c));
          i++;
        } else if (c > 191 && c < 224) {
          result.push(String.fromCharCode((c & 0x1f) << 6 | bytes[i + 1] & 0x3f));
          i += 2;
        } else {
          result.push(String.fromCharCode((c & 0x0f) << 12 | (bytes[i + 1] & 0x3f) << 6 | bytes[i + 2] & 0x3f));
          i += 3;
        }
      }
      return result.join('');
    }
    return {
      toBytes: toBytes,
      fromBytes: fromBytes
    };
  }();
  var convertHex = function () {
    function toBytes(text) {
      var result = [];
      for (var i = 0; i < text.length; i += 2) {
        result.push(parseInt(text.substr(i, 2), 16));
      }
      return result;
    }

    // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
    var Hex = '0123456789abcdef';
    function fromBytes(bytes) {
      var result = [];
      for (var i = 0; i < bytes.length; i++) {
        var v = bytes[i];
        result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
      }
      return result.join('');
    }
    return {
      toBytes: toBytes,
      fromBytes: fromBytes
    };
  }();

  // Number of rounds by keysize
  var numberOfRounds = {
    16: 10,
    24: 12,
    32: 14
  };

  // Round constant words
  var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

  // S-box and Inverse S-box (S is for Substitution)
  var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
  var Si = [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

  // Transformations for encryption
  var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
  var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
  var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
  var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

  // Transformations for decryption
  var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
  var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
  var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
  var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

  // Transformations for decryption key expansion
  var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
  var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
  var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
  var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];
  function convertToInt32(bytes) {
    var result = [];
    for (var i = 0; i < bytes.length; i += 4) {
      result.push(bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3]);
    }
    return result;
  }
  var AesJs = function (key) {
    if (!(this instanceof AesJs)) {
      throw Error('AES must be instanitated with `new`');
    }
    Object.defineProperty(this, 'key', {
      value: coerceArray(key, true)
    });
    this._prepare();
  };
  AesJs.prototype._prepare = function () {
    var rounds = numberOfRounds[this.key.length];
    if (rounds == null) {
      throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
    }

    // encryption round keys
    this._Ke = [];

    // decryption round keys
    this._Kd = [];
    for (var i = 0; i <= rounds; i++) {
      this._Ke.push([0, 0, 0, 0]);
      this._Kd.push([0, 0, 0, 0]);
    }
    var roundKeyCount = (rounds + 1) * 4;
    var KC = this.key.length / 4;

    // convert the key into ints
    var tk = convertToInt32(this.key);

    // copy values into round key arrays
    var index;
    for (var i = 0; i < KC; i++) {
      index = i >> 2;
      this._Ke[index][i % 4] = tk[i];
      this._Kd[rounds - index][i % 4] = tk[i];
    }

    // key expansion (fips-197 section 5.2)
    var rconpointer = 0;
    var t = KC,
      tt;
    while (t < roundKeyCount) {
      tt = tk[KC - 1];
      tk[0] ^= S[tt >> 16 & 0xFF] << 24 ^ S[tt >> 8 & 0xFF] << 16 ^ S[tt & 0xFF] << 8 ^ S[tt >> 24 & 0xFF] ^ rcon[rconpointer] << 24;
      rconpointer += 1;

      // key expansion (for non-256 bit)
      if (KC != 8) {
        for (var i = 1; i < KC; i++) {
          tk[i] ^= tk[i - 1];
        }

        // key expansion for 256-bit keys is "slightly different" (fips-197)
      } else {
        for (var i = 1; i < KC / 2; i++) {
          tk[i] ^= tk[i - 1];
        }
        tt = tk[KC / 2 - 1];
        tk[KC / 2] ^= S[tt & 0xFF] ^ S[tt >> 8 & 0xFF] << 8 ^ S[tt >> 16 & 0xFF] << 16 ^ S[tt >> 24 & 0xFF] << 24;
        for (var i = KC / 2 + 1; i < KC; i++) {
          tk[i] ^= tk[i - 1];
        }
      }

      // copy values into round key arrays
      var i = 0,
        r,
        c;
      while (i < KC && t < roundKeyCount) {
        r = t >> 2;
        c = t % 4;
        this._Ke[r][c] = tk[i];
        this._Kd[rounds - r][c] = tk[i++];
        t++;
      }
    }

    // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
    for (var r = 1; r < rounds; r++) {
      for (var c = 0; c < 4; c++) {
        tt = this._Kd[r][c];
        this._Kd[r][c] = U1[tt >> 24 & 0xFF] ^ U2[tt >> 16 & 0xFF] ^ U3[tt >> 8 & 0xFF] ^ U4[tt & 0xFF];
      }
    }
  };
  AesJs.prototype.encrypt = function (plaintext) {
    if (plaintext.length != 16) {
      throw new Error('invalid plaintext size (must be 16 bytes)');
    }
    var rounds = this._Ke.length - 1;
    var a = [0, 0, 0, 0];

    // convert plaintext to (ints ^ key)
    var t = convertToInt32(plaintext);
    for (var i = 0; i < 4; i++) {
      t[i] ^= this._Ke[0][i];
    }

    // apply round transforms
    for (var r = 1; r < rounds; r++) {
      for (var i = 0; i < 4; i++) {
        a[i] = T1[t[i] >> 24 & 0xff] ^ T2[t[(i + 1) % 4] >> 16 & 0xff] ^ T3[t[(i + 2) % 4] >> 8 & 0xff] ^ T4[t[(i + 3) % 4] & 0xff] ^ this._Ke[r][i];
      }
      t = a.slice();
    }

    // the last round is special
    var result = createArray(16),
      tt;
    for (var i = 0; i < 4; i++) {
      tt = this._Ke[rounds][i];
      result[4 * i] = (S[t[i] >> 24 & 0xff] ^ tt >> 24) & 0xff;
      result[4 * i + 1] = (S[t[(i + 1) % 4] >> 16 & 0xff] ^ tt >> 16) & 0xff;
      result[4 * i + 2] = (S[t[(i + 2) % 4] >> 8 & 0xff] ^ tt >> 8) & 0xff;
      result[4 * i + 3] = (S[t[(i + 3) % 4] & 0xff] ^ tt) & 0xff;
    }
    return result;
  };
  AesJs.prototype.decrypt = function (ciphertext) {
    if (ciphertext.length != 16) {
      throw new Error('invalid ciphertext size (must be 16 bytes)');
    }
    var rounds = this._Kd.length - 1;
    var a = [0, 0, 0, 0];

    // convert plaintext to (ints ^ key)
    var t = convertToInt32(ciphertext);
    for (var i = 0; i < 4; i++) {
      t[i] ^= this._Kd[0][i];
    }

    // apply round transforms
    for (var r = 1; r < rounds; r++) {
      for (var i = 0; i < 4; i++) {
        a[i] = T5[t[i] >> 24 & 0xff] ^ T6[t[(i + 3) % 4] >> 16 & 0xff] ^ T7[t[(i + 2) % 4] >> 8 & 0xff] ^ T8[t[(i + 1) % 4] & 0xff] ^ this._Kd[r][i];
      }
      t = a.slice();
    }

    // the last round is special
    var result = createArray(16),
      tt;
    for (var i = 0; i < 4; i++) {
      tt = this._Kd[rounds][i];
      result[4 * i] = (Si[t[i] >> 24 & 0xff] ^ tt >> 24) & 0xff;
      result[4 * i + 1] = (Si[t[(i + 3) % 4] >> 16 & 0xff] ^ tt >> 16) & 0xff;
      result[4 * i + 2] = (Si[t[(i + 2) % 4] >> 8 & 0xff] ^ tt >> 8) & 0xff;
      result[4 * i + 3] = (Si[t[(i + 1) % 4] & 0xff] ^ tt) & 0xff;
    }
    return result;
  };

  /**
   *  Mode Of Operation - Electonic Codebook (ECB)
   */
  var ModeOfOperationECB = function (key) {
    if (!(this instanceof ModeOfOperationECB)) {
      throw Error('AES must be instanitated with `new`');
    }
    this.description = "Electronic Code Block";
    this.name = "ecb";
    this._aes = new AesJs(key);
  };
  ModeOfOperationECB.prototype.encrypt = function (plaintext) {
    plaintext = coerceArray(plaintext);
    if (plaintext.length % 16 !== 0) {
      throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
    }
    var ciphertext = createArray(plaintext.length);
    var block = createArray(16);
    for (var i = 0; i < plaintext.length; i += 16) {
      copyArray(plaintext, block, 0, i, i + 16);
      block = this._aes.encrypt(block);
      copyArray(block, ciphertext, i);
    }
    return ciphertext;
  };
  ModeOfOperationECB.prototype.decrypt = function (ciphertext) {
    ciphertext = coerceArray(ciphertext);
    if (ciphertext.length % 16 !== 0) {
      throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
    }
    var plaintext = createArray(ciphertext.length);
    var block = createArray(16);
    for (var i = 0; i < ciphertext.length; i += 16) {
      copyArray(ciphertext, block, 0, i, i + 16);
      block = this._aes.decrypt(block);
      copyArray(block, plaintext, i);
    }
    return plaintext;
  };

  /**
   *  Mode Of Operation - Cipher Block Chaining (CBC)
   */
  var ModeOfOperationCBC = function (key, iv) {
    if (!(this instanceof ModeOfOperationCBC)) {
      throw Error('AES must be instanitated with `new`');
    }
    this.description = "Cipher Block Chaining";
    this.name = "cbc";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error('invalid initialation vector size (must be 16 bytes)');
    }
    this._lastCipherblock = coerceArray(iv, true);
    this._aes = new AesJs(key);
  };
  ModeOfOperationCBC.prototype.encrypt = function (plaintext) {
    plaintext = coerceArray(plaintext);
    if (plaintext.length % 16 !== 0) {
      throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
    }
    var ciphertext = createArray(plaintext.length);
    var block = createArray(16);
    for (var i = 0; i < plaintext.length; i += 16) {
      copyArray(plaintext, block, 0, i, i + 16);
      for (var j = 0; j < 16; j++) {
        block[j] ^= this._lastCipherblock[j];
      }
      this._lastCipherblock = this._aes.encrypt(block);
      copyArray(this._lastCipherblock, ciphertext, i);
    }
    return ciphertext;
  };
  ModeOfOperationCBC.prototype.decrypt = function (ciphertext) {
    ciphertext = coerceArray(ciphertext);
    if (ciphertext.length % 16 !== 0) {
      throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
    }
    var plaintext = createArray(ciphertext.length);
    var block = createArray(16);
    for (var i = 0; i < ciphertext.length; i += 16) {
      copyArray(ciphertext, block, 0, i, i + 16);
      block = this._aes.decrypt(block);
      for (var j = 0; j < 16; j++) {
        plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
      }
      copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
    }
    return plaintext;
  };

  /**
   *  Mode Of Operation - Cipher Feedback (CFB)
   */
  var ModeOfOperationCFB = function (key, iv, segmentSize) {
    if (!(this instanceof ModeOfOperationCFB)) {
      throw Error('AES must be instanitated with `new`');
    }
    this.description = "Cipher Feedback";
    this.name = "cfb";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error('invalid initialation vector size (must be 16 size)');
    }
    if (!segmentSize) {
      segmentSize = 1;
    }
    this.segmentSize = segmentSize;
    this._shiftRegister = coerceArray(iv, true);
    this._aes = new AesJs(key);
  };
  ModeOfOperationCFB.prototype.encrypt = function (plaintext) {
    if (plaintext.length % this.segmentSize != 0) {
      throw new Error('invalid plaintext size (must be segmentSize bytes)');
    }
    var encrypted = coerceArray(plaintext, true);
    var xorSegment;
    for (var i = 0; i < encrypted.length; i += this.segmentSize) {
      xorSegment = this._aes.encrypt(this._shiftRegister);
      for (var j = 0; j < this.segmentSize; j++) {
        encrypted[i + j] ^= xorSegment[j];
      }

      // Shift the register
      copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
      copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
    }
    return encrypted;
  };
  ModeOfOperationCFB.prototype.decrypt = function (ciphertext) {
    if (ciphertext.length % this.segmentSize != 0) {
      throw new Error('invalid ciphertext size (must be segmentSize bytes)');
    }
    var plaintext = coerceArray(ciphertext, true);
    var xorSegment;
    for (var i = 0; i < plaintext.length; i += this.segmentSize) {
      xorSegment = this._aes.encrypt(this._shiftRegister);
      for (var j = 0; j < this.segmentSize; j++) {
        plaintext[i + j] ^= xorSegment[j];
      }

      // Shift the register
      copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
      copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
    }
    return plaintext;
  };

  /**
   *  Mode Of Operation - Output Feedback (OFB)
   */
  var ModeOfOperationOFB = function (key, iv) {
    if (!(this instanceof ModeOfOperationOFB)) {
      throw Error('AES must be instanitated with `new`');
    }
    this.description = "Output Feedback";
    this.name = "ofb";
    if (!iv) {
      iv = createArray(16);
    } else if (iv.length != 16) {
      throw new Error('invalid initialation vector size (must be 16 bytes)');
    }
    this._lastPrecipher = coerceArray(iv, true);
    this._lastPrecipherIndex = 16;
    this._aes = new AesJs(key);
  };
  ModeOfOperationOFB.prototype.encrypt = function (plaintext) {
    var encrypted = coerceArray(plaintext, true);
    for (var i = 0; i < encrypted.length; i++) {
      if (this._lastPrecipherIndex === 16) {
        this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
        this._lastPrecipherIndex = 0;
      }
      encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
    }
    return encrypted;
  };

  // Decryption is symetric
  ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;

  /**
   *  Counter object for CTR common mode of operation
   */
  var Counter = function (initialValue) {
    if (!(this instanceof Counter)) {
      throw Error('Counter must be instanitated with `new`');
    }

    // We allow 0, but anything false-ish uses the default 1
    if (initialValue !== 0 && !initialValue) {
      initialValue = 1;
    }
    if (typeof initialValue === 'number') {
      this._counter = createArray(16);
      this.setValue(initialValue);
    } else {
      this.setBytes(initialValue);
    }
  };
  Counter.prototype.setValue = function (value) {
    if (typeof value !== 'number' || parseInt(value) != value) {
      throw new Error('invalid counter value (must be an integer)');
    }

    // We cannot safely handle numbers beyond the safe range for integers
    if (value > Number.MAX_SAFE_INTEGER) {
      throw new Error('integer value out of safe range');
    }
    for (var index = 15; index >= 0; --index) {
      this._counter[index] = value % 256;
      value = parseInt(value / 256);
    }
  };
  Counter.prototype.setBytes = function (bytes) {
    bytes = coerceArray(bytes, true);
    if (bytes.length != 16) {
      throw new Error('invalid counter bytes size (must be 16 bytes)');
    }
    this._counter = bytes;
  };
  Counter.prototype.increment = function () {
    for (var i = 15; i >= 0; i--) {
      if (this._counter[i] === 255) {
        this._counter[i] = 0;
      } else {
        this._counter[i]++;
        break;
      }
    }
  };

  /**
   *  Mode Of Operation - Counter (CTR)
   */
  var ModeOfOperationCTR = function (key, counter) {
    if (!(this instanceof ModeOfOperationCTR)) {
      throw Error('AES must be instanitated with `new`');
    }
    this.description = "Counter";
    this.name = "ctr";
    if (!(counter instanceof Counter)) {
      counter = new Counter(counter);
    }
    this._counter = counter;
    this._remainingCounter = null;
    this._remainingCounterIndex = 16;
    this._aes = new AesJs(key);
  };
  ModeOfOperationCTR.prototype.encrypt = function (plaintext) {
    var encrypted = coerceArray(plaintext, true);
    for (var i = 0; i < encrypted.length; i++) {
      if (this._remainingCounterIndex === 16) {
        this._remainingCounter = this._aes.encrypt(this._counter._counter);
        this._remainingCounterIndex = 0;
        this._counter.increment();
      }
      encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
    }
    return encrypted;
  };

  // Decryption is symetric
  ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;

  ///////////////////////
  // Padding

  // See:https://tools.ietf.org/html/rfc2315
  function pkcs7pad(data) {
    data = coerceArray(data, true);
    var padder = 16 - data.length % 16;
    var result = createArray(data.length + padder);
    copyArray(data, result);
    for (var i = data.length; i < result.length; i++) {
      result[i] = padder;
    }
    return result;
  }
  function pkcs7strip(data) {
    data = coerceArray(data, true);
    if (data.length < 16) {
      throw new Error('PKCS#7 invalid length');
    }
    var padder = data[data.length - 1];
    if (padder > 16) {
      throw new Error('PKCS#7 padding byte out of range');
    }
    var length = data.length - padder;
    for (var i = 0; i < padder; i++) {
      if (data[length + i] !== padder) {
        throw new Error('PKCS#7 invalid padding byte');
      }
    }
    var result = createArray(length);
    copyArray(data, result, 0, 0, length);
    return result;
  }

  ///////////////////////
  // Exporting

  // The block cipher
  const aesjs = {
    AES: AesJs,
    Counter: Counter,
    ModeOfOperation: {
      ecb: ModeOfOperationECB,
      cbc: ModeOfOperationCBC,
      cfb: ModeOfOperationCFB,
      ofb: ModeOfOperationOFB,
      ctr: ModeOfOperationCTR
    },
    utils: {
      hex: convertHex,
      utf8: convertUtf8
    },
    padding: {
      pkcs7: {
        pad: pkcs7pad,
        strip: pkcs7strip
      }
    },
    _arrayTest: {
      coerceArray: coerceArray,
      createArray: createArray,
      copyArray: copyArray
    }
  };

  function getNaluLength$2(data) {
    let length = data[3] | data[2] << 8 | data[1] << 16 | data[0] << 24;
    return length;
  }

  // aes-256-ctr 解密
  function aes256ctrDecrypt(arrayBuffer, key, iv) {
    let isHevc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    key = new Uint8Array(key);
    iv = new Uint8Array(iv);
    const totalLength = arrayBuffer.byteLength;
    // 17(23)/27(39)[是否i帧] ,0/1(), 0,0,0, 0,0,0,0,[NALU],0,0,0,0,[NALU].... 只需要解密NALU部分数据。
    // 其中NALU部分需要跳过两个（nalu头 + 再加一个字节数据）
    let startIndex = 5;
    while (startIndex < totalLength) {
      let tempNaluLength = getNaluLength$2(arrayBuffer.slice(startIndex, startIndex + 4));
      if (tempNaluLength > totalLength) {
        break;
      }
      let naluType = arrayBuffer[startIndex + 4];
      //  这边只是判断了h264的加密规则，265的目前没有做处理
      let needDecrypt = false;
      if (isHevc) {
        naluType = naluType >>> 1 & 0x3f;
        needDecrypt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21].includes(naluType);
      } else {
        naluType = naluType & 0x1f;
        needDecrypt = naluType === 1 || naluType === 5;
      }
      //
      if (needDecrypt) {
        const tempNalu = arrayBuffer.slice(startIndex + 4 + 2, startIndex + 4 + tempNaluLength);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv));
        const decryptMsg = aesCtr.decrypt(tempNalu);
        // release memory
        aesCtr = null;
        arrayBuffer.set(decryptMsg, startIndex + 4 + 2);
      }
      startIndex = startIndex + 4 + tempNaluLength;
    }
    return arrayBuffer;
  }
  function aes256ctrDecryptAacAudio(arrayBuffer, key, iv) {
    // 
    const totalLength = arrayBuffer.byteLength;
    if (totalLength <= 30) {
      return arrayBuffer;
    }
    // 
    const step = 30 + 2;
    const tempNalu = arrayBuffer.slice(step);
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(iv));
    const decryptMsg = aesCtr.decrypt(tempNalu);
    // release memory
    aesCtr = null;
    arrayBuffer.set(decryptMsg, step);
    return arrayBuffer;
  }

  var mp4box = createCommonjsModule(function (module, exports) {
    // file:src/log.js
    /* 
     * Copyright (c) 2012-2013. Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    var Log = function () {
      var start = new Date();
      var LOG_LEVEL_ERROR = 4;
      var LOG_LEVEL_WARNING = 3;
      var LOG_LEVEL_INFO = 2;
      var LOG_LEVEL_DEBUG = 1;
      var log_level = LOG_LEVEL_ERROR;
      var logObject = {
        setLogLevel: function (level) {
          if (level == this.debug) log_level = LOG_LEVEL_DEBUG;else if (level == this.info) log_level = LOG_LEVEL_INFO;else if (level == this.warn) log_level = LOG_LEVEL_WARNING;else if (level == this.error) log_level = LOG_LEVEL_ERROR;else log_level = LOG_LEVEL_ERROR;
        },
        debug: function (module, msg) {
          if (console.debug === undefined) {
            console.debug = console.log;
          }
          if (LOG_LEVEL_DEBUG >= log_level) {
            console.debug("[" + Log.getDurationString(new Date() - start, 1000) + "]", "[" + module + "]", msg);
          }
        },
        log: function (module, msg) {
          this.debug(module.msg);
        },
        info: function (module, msg) {
          if (LOG_LEVEL_INFO >= log_level) {
            console.info("[" + Log.getDurationString(new Date() - start, 1000) + "]", "[" + module + "]", msg);
          }
        },
        warn: function (module, msg) {
          if (LOG_LEVEL_WARNING >= log_level) {
            console.warn("[" + Log.getDurationString(new Date() - start, 1000) + "]", "[" + module + "]", msg);
          }
        },
        error: function (module, msg) {
          if (LOG_LEVEL_ERROR >= log_level) {
            console.error("[" + Log.getDurationString(new Date() - start, 1000) + "]", "[" + module + "]", msg);
          }
        }
      };
      return logObject;
    }();

    /* Helper function to print a duration value in the form H:MM:SS.MS */
    Log.getDurationString = function (duration, _timescale) {
      var neg;
      /* Helper function to print a number on a fixed number of digits */
      function pad(number, length) {
        var str = '' + number;
        var a = str.split('.');
        while (a[0].length < length) {
          a[0] = '0' + a[0];
        }
        return a.join('.');
      }
      if (duration < 0) {
        neg = true;
        duration = -duration;
      } else {
        neg = false;
      }
      var timescale = _timescale || 1;
      var duration_sec = duration / timescale;
      var hours = Math.floor(duration_sec / 3600);
      duration_sec -= hours * 3600;
      var minutes = Math.floor(duration_sec / 60);
      duration_sec -= minutes * 60;
      var msec = duration_sec * 1000;
      duration_sec = Math.floor(duration_sec);
      msec -= duration_sec * 1000;
      msec = Math.floor(msec);
      return (neg ? "-" : "") + hours + ":" + pad(minutes, 2) + ":" + pad(duration_sec, 2) + "." + pad(msec, 3);
    };

    /* Helper function to stringify HTML5 TimeRanges objects */
    Log.printRanges = function (ranges) {
      var length = ranges.length;
      if (length > 0) {
        var str = "";
        for (var i = 0; i < length; i++) {
          if (i > 0) str += ",";
          str += "[" + Log.getDurationString(ranges.start(i)) + "," + Log.getDurationString(ranges.end(i)) + "]";
        }
        return str;
      } else {
        return "(empty)";
      }
    };
    {
      exports.Log = Log;
    }
    // file:src/stream.js
    var MP4BoxStream = function (arrayBuffer) {
      if (arrayBuffer instanceof ArrayBuffer) {
        this.buffer = arrayBuffer;
        this.dataview = new DataView(arrayBuffer);
      } else {
        throw "Needs an array buffer";
      }
      this.position = 0;
    };

    /*************************************************************************
      Common API between MultiBufferStream and SimpleStream
     *************************************************************************/
    MP4BoxStream.prototype.getPosition = function () {
      return this.position;
    };
    MP4BoxStream.prototype.getEndPosition = function () {
      return this.buffer.byteLength;
    };
    MP4BoxStream.prototype.getLength = function () {
      return this.buffer.byteLength;
    };
    MP4BoxStream.prototype.seek = function (pos) {
      var npos = Math.max(0, Math.min(this.buffer.byteLength, pos));
      this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
      return true;
    };
    MP4BoxStream.prototype.isEos = function () {
      return this.getPosition() >= this.getEndPosition();
    };

    /*************************************************************************
      Read methods, simimar to DataStream but simpler
     *************************************************************************/
    MP4BoxStream.prototype.readAnyInt = function (size, signed) {
      var res = 0;
      if (this.position + size <= this.buffer.byteLength) {
        switch (size) {
          case 1:
            if (signed) {
              res = this.dataview.getInt8(this.position);
            } else {
              res = this.dataview.getUint8(this.position);
            }
            break;
          case 2:
            if (signed) {
              res = this.dataview.getInt16(this.position);
            } else {
              res = this.dataview.getUint16(this.position);
            }
            break;
          case 3:
            if (signed) {
              throw "No method for reading signed 24 bits values";
            } else {
              res = this.dataview.getUint8(this.position) << 16;
              res |= this.dataview.getUint8(this.position + 1) << 8;
              res |= this.dataview.getUint8(this.position + 2);
            }
            break;
          case 4:
            if (signed) {
              res = this.dataview.getInt32(this.position);
            } else {
              res = this.dataview.getUint32(this.position);
            }
            break;
          case 8:
            if (signed) {
              throw "No method for reading signed 64 bits values";
            } else {
              res = this.dataview.getUint32(this.position) << 32;
              res |= this.dataview.getUint32(this.position + 4);
            }
            break;
          default:
            throw "readInt method not implemented for size: " + size;
        }
        this.position += size;
        return res;
      } else {
        throw "Not enough bytes in buffer";
      }
    };
    MP4BoxStream.prototype.readUint8 = function () {
      return this.readAnyInt(1, false);
    };
    MP4BoxStream.prototype.readUint16 = function () {
      return this.readAnyInt(2, false);
    };
    MP4BoxStream.prototype.readUint24 = function () {
      return this.readAnyInt(3, false);
    };
    MP4BoxStream.prototype.readUint32 = function () {
      return this.readAnyInt(4, false);
    };
    MP4BoxStream.prototype.readUint64 = function () {
      return this.readAnyInt(8, false);
    };
    MP4BoxStream.prototype.readString = function (length) {
      if (this.position + length <= this.buffer.byteLength) {
        var s = "";
        for (var i = 0; i < length; i++) {
          s += String.fromCharCode(this.readUint8());
        }
        return s;
      } else {
        throw "Not enough bytes in buffer";
      }
    };
    MP4BoxStream.prototype.readCString = function () {
      var arr = [];
      while (true) {
        var b = this.readUint8();
        if (b !== 0) {
          arr.push(b);
        } else {
          break;
        }
      }
      return String.fromCharCode.apply(null, arr);
    };
    MP4BoxStream.prototype.readInt8 = function () {
      return this.readAnyInt(1, true);
    };
    MP4BoxStream.prototype.readInt16 = function () {
      return this.readAnyInt(2, true);
    };
    MP4BoxStream.prototype.readInt32 = function () {
      return this.readAnyInt(4, true);
    };
    MP4BoxStream.prototype.readInt64 = function () {
      return this.readAnyInt(8, false);
    };
    MP4BoxStream.prototype.readUint8Array = function (length) {
      var arr = new Uint8Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = this.readUint8();
      }
      return arr;
    };
    MP4BoxStream.prototype.readInt16Array = function (length) {
      var arr = new Int16Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = this.readInt16();
      }
      return arr;
    };
    MP4BoxStream.prototype.readUint16Array = function (length) {
      var arr = new Int16Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = this.readUint16();
      }
      return arr;
    };
    MP4BoxStream.prototype.readUint32Array = function (length) {
      var arr = new Uint32Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = this.readUint32();
      }
      return arr;
    };
    MP4BoxStream.prototype.readInt32Array = function (length) {
      var arr = new Int32Array(length);
      for (var i = 0; i < length; i++) {
        arr[i] = this.readInt32();
      }
      return arr;
    };
    {
      exports.MP4BoxStream = MP4BoxStream;
    } // file:src/DataStream.js
    /**
      DataStream reads scalars, arrays and structs of data from an ArrayBuffer.
      It's like a file-like DataView on steroids.
    
      @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
      @param {?Number} byteOffset Offset from arrayBuffer beginning for the DataStream.
      @param {?Boolean} endianness DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN (the default).
      */
    var DataStream = function (arrayBuffer, byteOffset, endianness) {
      this._byteOffset = byteOffset || 0;
      if (arrayBuffer instanceof ArrayBuffer) {
        this.buffer = arrayBuffer;
      } else if (typeof arrayBuffer == "object") {
        this.dataView = arrayBuffer;
        if (byteOffset) {
          this._byteOffset += byteOffset;
        }
      } else {
        this.buffer = new ArrayBuffer(arrayBuffer || 0);
      }
      this.position = 0;
      this.endianness = endianness == null ? DataStream.LITTLE_ENDIAN : endianness;
    };
    DataStream.prototype = {};
    DataStream.prototype.getPosition = function () {
      return this.position;
    };

    /**
      Internal function to resize the DataStream buffer when required.
      @param {number} extra Number of bytes to add to the buffer allocation.
      @return {null}
      */
    DataStream.prototype._realloc = function (extra) {
      if (!this._dynamicSize) {
        return;
      }
      var req = this._byteOffset + this.position + extra;
      var blen = this._buffer.byteLength;
      if (req <= blen) {
        if (req > this._byteLength) {
          this._byteLength = req;
        }
        return;
      }
      if (blen < 1) {
        blen = 1;
      }
      while (req > blen) {
        blen *= 2;
      }
      var buf = new ArrayBuffer(blen);
      var src = new Uint8Array(this._buffer);
      var dst = new Uint8Array(buf, 0, src.length);
      dst.set(src);
      this.buffer = buf;
      this._byteLength = req;
    };

    /**
      Internal function to trim the DataStream buffer when required.
      Used for stripping out the extra bytes from the backing buffer when
      the virtual byteLength is smaller than the buffer byteLength (happens after
      growing the buffer with writes and not filling the extra space completely).
    
      @return {null}
      */
    DataStream.prototype._trimAlloc = function () {
      if (this._byteLength == this._buffer.byteLength) {
        return;
      }
      var buf = new ArrayBuffer(this._byteLength);
      var dst = new Uint8Array(buf);
      var src = new Uint8Array(this._buffer, 0, dst.length);
      dst.set(src);
      this.buffer = buf;
    };

    /**
      Big-endian const to use as default endianness.
      @type {boolean}
      */
    DataStream.BIG_ENDIAN = false;

    /**
      Little-endian const to use as default endianness.
      @type {boolean}
      */
    DataStream.LITTLE_ENDIAN = true;

    /**
      Virtual byte length of the DataStream backing buffer.
      Updated to be max of original buffer size and last written size.
      If dynamicSize is false is set to buffer size.
      @type {number}
      */
    DataStream.prototype._byteLength = 0;

    /**
      Returns the byte length of the DataStream object.
      @type {number}
      */
    Object.defineProperty(DataStream.prototype, 'byteLength', {
      get: function () {
        return this._byteLength - this._byteOffset;
      }
    });

    /**
      Set/get the backing ArrayBuffer of the DataStream object.
      The setter updates the DataView to point to the new buffer.
      @type {Object}
      */
    Object.defineProperty(DataStream.prototype, 'buffer', {
      get: function () {
        this._trimAlloc();
        return this._buffer;
      },
      set: function (v) {
        this._buffer = v;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._buffer.byteLength;
      }
    });

    /**
      Set/get the byteOffset of the DataStream object.
      The setter updates the DataView to point to the new byteOffset.
      @type {number}
      */
    Object.defineProperty(DataStream.prototype, 'byteOffset', {
      get: function () {
        return this._byteOffset;
      },
      set: function (v) {
        this._byteOffset = v;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._buffer.byteLength;
      }
    });

    /**
      Set/get the backing DataView of the DataStream object.
      The setter updates the buffer and byteOffset to point to the DataView values.
      @type {Object}
      */
    Object.defineProperty(DataStream.prototype, 'dataView', {
      get: function () {
        return this._dataView;
      },
      set: function (v) {
        this._byteOffset = v.byteOffset;
        this._buffer = v.buffer;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._byteOffset + v.byteLength;
      }
    });

    /**
      Sets the DataStream read/write position to given position.
      Clamps between 0 and DataStream length.
    
      @param {number} pos Position to seek to.
      @return {null}
      */
    DataStream.prototype.seek = function (pos) {
      var npos = Math.max(0, Math.min(this.byteLength, pos));
      this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
    };

    /**
      Returns true if the DataStream seek pointer is at the end of buffer and
      there's no more data to read.
    
      @return {boolean} True if the seek pointer is at the end of the buffer.
      */
    DataStream.prototype.isEof = function () {
      return this.position >= this._byteLength;
    };

    /**
      Maps a Uint8Array into the DataStream buffer.
    
      Nice for quickly reading in data.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Uint8Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapUint8Array = function (length) {
      this._realloc(length * 1);
      var arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
      this.position += length * 1;
      return arr;
    };

    /**
      Reads an Int32Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Int32Array.
     */
    DataStream.prototype.readInt32Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 4 : length;
      var arr = new Int32Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads an Int16Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Int16Array.
     */
    DataStream.prototype.readInt16Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 2 : length;
      var arr = new Int16Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads an Int8Array of desired length from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Int8Array.
     */
    DataStream.prototype.readInt8Array = function (length) {
      length = length == null ? this.byteLength - this.position : length;
      var arr = new Int8Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a Uint32Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Uint32Array.
     */
    DataStream.prototype.readUint32Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 4 : length;
      var arr = new Uint32Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a Uint16Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Uint16Array.
     */
    DataStream.prototype.readUint16Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 2 : length;
      var arr = new Uint16Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a Uint8Array of desired length from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Uint8Array.
     */
    DataStream.prototype.readUint8Array = function (length) {
      length = length == null ? this.byteLength - this.position : length;
      var arr = new Uint8Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a Float64Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Float64Array.
     */
    DataStream.prototype.readFloat64Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 8 : length;
      var arr = new Float64Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a Float32Array of desired length and endianness from the DataStream.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} The read Float32Array.
     */
    DataStream.prototype.readFloat32Array = function (length, e) {
      length = length == null ? this.byteLength - this.position / 4 : length;
      var arr = new Float32Array(length);
      DataStream.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += arr.byteLength;
      return arr;
    };

    /**
      Reads a 32-bit int from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readInt32 = function (e) {
      var v = this._dataView.getInt32(this.position, e == null ? this.endianness : e);
      this.position += 4;
      return v;
    };

    /**
      Reads a 16-bit int from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readInt16 = function (e) {
      var v = this._dataView.getInt16(this.position, e == null ? this.endianness : e);
      this.position += 2;
      return v;
    };

    /**
      Reads an 8-bit int from the DataStream.
    
      @return {number} The read number.
     */
    DataStream.prototype.readInt8 = function () {
      var v = this._dataView.getInt8(this.position);
      this.position += 1;
      return v;
    };

    /**
      Reads a 32-bit unsigned int from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readUint32 = function (e) {
      var v = this._dataView.getUint32(this.position, e == null ? this.endianness : e);
      this.position += 4;
      return v;
    };

    /**
      Reads a 16-bit unsigned int from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readUint16 = function (e) {
      var v = this._dataView.getUint16(this.position, e == null ? this.endianness : e);
      this.position += 2;
      return v;
    };

    /**
      Reads an 8-bit unsigned int from the DataStream.
    
      @return {number} The read number.
     */
    DataStream.prototype.readUint8 = function () {
      var v = this._dataView.getUint8(this.position);
      this.position += 1;
      return v;
    };

    /**
      Reads a 32-bit float from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readFloat32 = function (e) {
      var v = this._dataView.getFloat32(this.position, e == null ? this.endianness : e);
      this.position += 4;
      return v;
    };

    /**
      Reads a 64-bit float from the DataStream with the desired endianness.
    
      @param {?boolean} e Endianness of the number.
      @return {number} The read number.
     */
    DataStream.prototype.readFloat64 = function (e) {
      var v = this._dataView.getFloat64(this.position, e == null ? this.endianness : e);
      this.position += 8;
      return v;
    };

    /**
      Native endianness. Either DataStream.BIG_ENDIAN or DataStream.LITTLE_ENDIAN
      depending on the platform endianness.
    
      @type {boolean}
     */
    DataStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

    /**
      Copies byteLength bytes from the src buffer at srcOffset to the
      dst buffer at dstOffset.
    
      @param {Object} dst Destination ArrayBuffer to write to.
      @param {number} dstOffset Offset to the destination ArrayBuffer.
      @param {Object} src Source ArrayBuffer to read from.
      @param {number} srcOffset Offset to the source ArrayBuffer.
      @param {number} byteLength Number of bytes to copy.
     */
    DataStream.memcpy = function (dst, dstOffset, src, srcOffset, byteLength) {
      var dstU8 = new Uint8Array(dst, dstOffset, byteLength);
      var srcU8 = new Uint8Array(src, srcOffset, byteLength);
      dstU8.set(srcU8);
    };

    /**
      Converts array to native endianness in-place.
    
      @param {Object} array Typed array to convert.
      @param {boolean} arrayIsLittleEndian True if the data in the array is
                                           little-endian. Set false for big-endian.
      @return {Object} The converted typed array.
     */
    DataStream.arrayToNative = function (array, arrayIsLittleEndian) {
      if (arrayIsLittleEndian == this.endianness) {
        return array;
      } else {
        return this.flipArrayEndianness(array);
      }
    };

    /**
      Converts native endianness array to desired endianness in-place.
    
      @param {Object} array Typed array to convert.
      @param {boolean} littleEndian True if the converted array should be
                                    little-endian. Set false for big-endian.
      @return {Object} The converted typed array.
     */
    DataStream.nativeToEndian = function (array, littleEndian) {
      if (this.endianness == littleEndian) {
        return array;
      } else {
        return this.flipArrayEndianness(array);
      }
    };

    /**
      Flips typed array endianness in-place.
    
      @param {Object} array Typed array to flip.
      @return {Object} The converted typed array.
     */
    DataStream.flipArrayEndianness = function (array) {
      var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      for (var i = 0; i < array.byteLength; i += array.BYTES_PER_ELEMENT) {
        for (var j = i + array.BYTES_PER_ELEMENT - 1, k = i; j > k; j--, k++) {
          var tmp = u8[k];
          u8[k] = u8[j];
          u8[j] = tmp;
        }
      }
      return array;
    };

    /**
      Seek position where DataStream#readStruct ran into a problem.
      Useful for debugging struct parsing.
    
      @type {number}
     */
    DataStream.prototype.failurePosition = 0;
    String.fromCharCodeUint8 = function (uint8arr) {
      var arr = [];
      for (var i = 0; i < uint8arr.length; i++) {
        arr[i] = uint8arr[i];
      }
      return String.fromCharCode.apply(null, arr);
    };
    /**
      Read a string of desired length and encoding from the DataStream.
    
      @param {number} length The length of the string to read in bytes.
      @param {?string} encoding The encoding of the string data in the DataStream.
                                Defaults to ASCII.
      @return {string} The read string.
     */
    DataStream.prototype.readString = function (length, encoding) {
      if (encoding == null || encoding == "ASCII") {
        return String.fromCharCodeUint8.apply(null, [this.mapUint8Array(length == null ? this.byteLength - this.position : length)]);
      } else {
        return new TextDecoder(encoding).decode(this.mapUint8Array(length));
      }
    };

    /**
      Read null-terminated string of desired length from the DataStream. Truncates
      the returned string so that the null byte is not a part of it.
    
      @param {?number} length The length of the string to read.
      @return {string} The read string.
     */
    DataStream.prototype.readCString = function (length) {
      var blen = this.byteLength - this.position;
      var u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
      var len = blen;
      if (length != null) {
        len = Math.min(length, blen);
      }
      for (var i = 0; i < len && u8[i] !== 0; i++); // find first zero byte
      var s = String.fromCharCodeUint8.apply(null, [this.mapUint8Array(i)]);
      if (length != null) {
        this.position += len - i;
      } else if (i != blen) {
        this.position += 1; // trailing zero if not at end of buffer
      }

      return s;
    };

    /* 
       TODO: fix endianness for 24/64-bit fields
       TODO: check range/support for 64-bits numbers in JavaScript
    */
    var MAX_SIZE = Math.pow(2, 32);
    DataStream.prototype.readInt64 = function () {
      return this.readInt32() * MAX_SIZE + this.readUint32();
    };
    DataStream.prototype.readUint64 = function () {
      return this.readUint32() * MAX_SIZE + this.readUint32();
    };
    DataStream.prototype.readInt64 = function () {
      return this.readUint32() * MAX_SIZE + this.readUint32();
    };
    DataStream.prototype.readUint24 = function () {
      return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8();
    };
    {
      exports.DataStream = DataStream;
    }
    // file:src/DataStream-write.js
    /**
      Saves the DataStream contents to the given filename.
      Uses Chrome's anchor download property to initiate download.
     
      @param {string} filename Filename to save as.
      @return {null}
      */
    DataStream.prototype.save = function (filename) {
      var blob = new Blob([this.buffer]);
      if (window.URL && URL.createObjectURL) {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        // Required in Firefox:
        document.body.appendChild(a);
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        // Required in Firefox:
        a.setAttribute('target', '_self');
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw "DataStream.save: Can't create object URL.";
      }
    };

    /**
      Whether to extend DataStream buffer when trying to write beyond its size.
      If set, the buffer is reallocated to twice its current size until the
      requested write fits the buffer.
      @type {boolean}
      */
    DataStream.prototype._dynamicSize = true;
    Object.defineProperty(DataStream.prototype, 'dynamicSize', {
      get: function () {
        return this._dynamicSize;
      },
      set: function (v) {
        if (!v) {
          this._trimAlloc();
        }
        this._dynamicSize = v;
      }
    });

    /**
      Internal function to trim the DataStream buffer when required.
      Used for stripping out the first bytes when not needed anymore.
    
      @return {null}
      */
    DataStream.prototype.shift = function (offset) {
      var buf = new ArrayBuffer(this._byteLength - offset);
      var dst = new Uint8Array(buf);
      var src = new Uint8Array(this._buffer, offset, dst.length);
      dst.set(src);
      this.buffer = buf;
      this.position -= offset;
    };

    /**
      Writes an Int32Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeInt32Array = function (arr, e) {
      this._realloc(arr.length * 4);
      if (arr instanceof Int32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapInt32Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeInt32(arr[i], e);
        }
      }
    };

    /**
      Writes an Int16Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeInt16Array = function (arr, e) {
      this._realloc(arr.length * 2);
      if (arr instanceof Int16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapInt16Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeInt16(arr[i], e);
        }
      }
    };

    /**
      Writes an Int8Array to the DataStream.
    
      @param {Object} arr The array to write.
     */
    DataStream.prototype.writeInt8Array = function (arr) {
      this._realloc(arr.length * 1);
      if (arr instanceof Int8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapInt8Array(arr.length);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeInt8(arr[i]);
        }
      }
    };

    /**
      Writes a Uint32Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeUint32Array = function (arr, e) {
      this._realloc(arr.length * 4);
      if (arr instanceof Uint32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapUint32Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeUint32(arr[i], e);
        }
      }
    };

    /**
      Writes a Uint16Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeUint16Array = function (arr, e) {
      this._realloc(arr.length * 2);
      if (arr instanceof Uint16Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapUint16Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeUint16(arr[i], e);
        }
      }
    };

    /**
      Writes a Uint8Array to the DataStream.
    
      @param {Object} arr The array to write.
     */
    DataStream.prototype.writeUint8Array = function (arr) {
      this._realloc(arr.length * 1);
      if (arr instanceof Uint8Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapUint8Array(arr.length);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeUint8(arr[i]);
        }
      }
    };

    /**
      Writes a Float64Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeFloat64Array = function (arr, e) {
      this._realloc(arr.length * 8);
      if (arr instanceof Float64Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapFloat64Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeFloat64(arr[i], e);
        }
      }
    };

    /**
      Writes a Float32Array of specified endianness to the DataStream.
    
      @param {Object} arr The array to write.
      @param {?boolean} e Endianness of the data to write.
     */
    DataStream.prototype.writeFloat32Array = function (arr, e) {
      this._realloc(arr.length * 4);
      if (arr instanceof Float32Array && this.byteOffset + this.position % arr.BYTES_PER_ELEMENT === 0) {
        DataStream.memcpy(this._buffer, this.byteOffset + this.position, arr.buffer, 0, arr.byteLength);
        this.mapFloat32Array(arr.length, e);
      } else {
        for (var i = 0; i < arr.length; i++) {
          this.writeFloat32(arr[i], e);
        }
      }
    };

    /**
      Writes a 32-bit int to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeInt32 = function (v, e) {
      this._realloc(4);
      this._dataView.setInt32(this.position, v, e == null ? this.endianness : e);
      this.position += 4;
    };

    /**
      Writes a 16-bit int to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeInt16 = function (v, e) {
      this._realloc(2);
      this._dataView.setInt16(this.position, v, e == null ? this.endianness : e);
      this.position += 2;
    };

    /**
      Writes an 8-bit int to the DataStream.
    
      @param {number} v Number to write.
     */
    DataStream.prototype.writeInt8 = function (v) {
      this._realloc(1);
      this._dataView.setInt8(this.position, v);
      this.position += 1;
    };

    /**
      Writes a 32-bit unsigned int to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeUint32 = function (v, e) {
      this._realloc(4);
      this._dataView.setUint32(this.position, v, e == null ? this.endianness : e);
      this.position += 4;
    };

    /**
      Writes a 16-bit unsigned int to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeUint16 = function (v, e) {
      this._realloc(2);
      this._dataView.setUint16(this.position, v, e == null ? this.endianness : e);
      this.position += 2;
    };

    /**
      Writes an 8-bit unsigned  int to the DataStream.
    
      @param {number} v Number to write.
     */
    DataStream.prototype.writeUint8 = function (v) {
      this._realloc(1);
      this._dataView.setUint8(this.position, v);
      this.position += 1;
    };

    /**
      Writes a 32-bit float to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeFloat32 = function (v, e) {
      this._realloc(4);
      this._dataView.setFloat32(this.position, v, e == null ? this.endianness : e);
      this.position += 4;
    };

    /**
      Writes a 64-bit float to the DataStream with the desired endianness.
    
      @param {number} v Number to write.
      @param {?boolean} e Endianness of the number.
     */
    DataStream.prototype.writeFloat64 = function (v, e) {
      this._realloc(8);
      this._dataView.setFloat64(this.position, v, e == null ? this.endianness : e);
      this.position += 8;
    };

    /**
      Write a UCS-2 string of desired endianness to the DataStream. The
      lengthOverride argument lets you define the number of characters to write.
      If the string is shorter than lengthOverride, the extra space is padded with
      zeroes.
    
      @param {string} str The string to write.
      @param {?boolean} endianness The endianness to use for the written string data.
      @param {?number} lengthOverride The number of characters to write.
     */
    DataStream.prototype.writeUCS2String = function (str, endianness, lengthOverride) {
      if (lengthOverride == null) {
        lengthOverride = str.length;
      }
      for (var i = 0; i < str.length && i < lengthOverride; i++) {
        this.writeUint16(str.charCodeAt(i), endianness);
      }
      for (; i < lengthOverride; i++) {
        this.writeUint16(0);
      }
    };

    /**
      Writes a string of desired length and encoding to the DataStream.
    
      @param {string} s The string to write.
      @param {?string} encoding The encoding for the written string data.
                                Defaults to ASCII.
      @param {?number} length The number of characters to write.
     */
    DataStream.prototype.writeString = function (s, encoding, length) {
      var i = 0;
      if (encoding == null || encoding == "ASCII") {
        if (length != null) {
          var len = Math.min(s.length, length);
          for (i = 0; i < len; i++) {
            this.writeUint8(s.charCodeAt(i));
          }
          for (; i < length; i++) {
            this.writeUint8(0);
          }
        } else {
          for (i = 0; i < s.length; i++) {
            this.writeUint8(s.charCodeAt(i));
          }
        }
      } else {
        this.writeUint8Array(new TextEncoder(encoding).encode(s.substring(0, length)));
      }
    };

    /**
      Writes a null-terminated string to DataStream and zero-pads it to length
      bytes. If length is not given, writes the string followed by a zero.
      If string is longer than length, the written part of the string does not have
      a trailing zero.
    
      @param {string} s The string to write.
      @param {?number} length The number of characters to write.
     */
    DataStream.prototype.writeCString = function (s, length) {
      var i = 0;
      if (length != null) {
        var len = Math.min(s.length, length);
        for (i = 0; i < len; i++) {
          this.writeUint8(s.charCodeAt(i));
        }
        for (; i < length; i++) {
          this.writeUint8(0);
        }
      } else {
        for (i = 0; i < s.length; i++) {
          this.writeUint8(s.charCodeAt(i));
        }
        this.writeUint8(0);
      }
    };

    /**
      Writes a struct to the DataStream. Takes a structDefinition that gives the
      types and a struct object that gives the values. Refer to readStruct for the
      structure of structDefinition.
    
      @param {Object} structDefinition Type definition of the struct.
      @param {Object} struct The struct data object.
      */
    DataStream.prototype.writeStruct = function (structDefinition, struct) {
      for (var i = 0; i < structDefinition.length; i += 2) {
        var t = structDefinition[i + 1];
        this.writeType(t, struct[structDefinition[i]], struct);
      }
    };

    /**
      Writes object v of type t to the DataStream.
    
      @param {Object} t Type of data to write.
      @param {Object} v Value of data to write.
      @param {Object} struct Struct to pass to write callback functions.
      */
    DataStream.prototype.writeType = function (t, v, struct) {
      var tp;
      if (typeof t == "function") {
        return t(this, v);
      } else if (typeof t == "object" && !(t instanceof Array)) {
        return t.set(this, v, struct);
      }
      var lengthOverride = null;
      var charset = "ASCII";
      var pos = this.position;
      if (typeof t == 'string' && /:/.test(t)) {
        tp = t.split(":");
        t = tp[0];
        lengthOverride = parseInt(tp[1]);
      }
      if (typeof t == 'string' && /,/.test(t)) {
        tp = t.split(",");
        t = tp[0];
        charset = parseInt(tp[1]);
      }
      switch (t) {
        case 'uint8':
          this.writeUint8(v);
          break;
        case 'int8':
          this.writeInt8(v);
          break;
        case 'uint16':
          this.writeUint16(v, this.endianness);
          break;
        case 'int16':
          this.writeInt16(v, this.endianness);
          break;
        case 'uint32':
          this.writeUint32(v, this.endianness);
          break;
        case 'int32':
          this.writeInt32(v, this.endianness);
          break;
        case 'float32':
          this.writeFloat32(v, this.endianness);
          break;
        case 'float64':
          this.writeFloat64(v, this.endianness);
          break;
        case 'uint16be':
          this.writeUint16(v, DataStream.BIG_ENDIAN);
          break;
        case 'int16be':
          this.writeInt16(v, DataStream.BIG_ENDIAN);
          break;
        case 'uint32be':
          this.writeUint32(v, DataStream.BIG_ENDIAN);
          break;
        case 'int32be':
          this.writeInt32(v, DataStream.BIG_ENDIAN);
          break;
        case 'float32be':
          this.writeFloat32(v, DataStream.BIG_ENDIAN);
          break;
        case 'float64be':
          this.writeFloat64(v, DataStream.BIG_ENDIAN);
          break;
        case 'uint16le':
          this.writeUint16(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'int16le':
          this.writeInt16(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'uint32le':
          this.writeUint32(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'int32le':
          this.writeInt32(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'float32le':
          this.writeFloat32(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'float64le':
          this.writeFloat64(v, DataStream.LITTLE_ENDIAN);
          break;
        case 'cstring':
          this.writeCString(v, lengthOverride);
          break;
        case 'string':
          this.writeString(v, charset, lengthOverride);
          break;
        case 'u16string':
          this.writeUCS2String(v, this.endianness, lengthOverride);
          break;
        case 'u16stringle':
          this.writeUCS2String(v, DataStream.LITTLE_ENDIAN, lengthOverride);
          break;
        case 'u16stringbe':
          this.writeUCS2String(v, DataStream.BIG_ENDIAN, lengthOverride);
          break;
        default:
          if (t.length == 3) {
            var ta = t[1];
            for (var i = 0; i < v.length; i++) {
              this.writeType(ta, v[i]);
            }
            break;
          } else {
            this.writeStruct(t, v);
            break;
          }
      }
      if (lengthOverride != null) {
        this.position = pos;
        this._realloc(lengthOverride);
        this.position = pos + lengthOverride;
      }
    };
    DataStream.prototype.writeUint64 = function (v) {
      var h = Math.floor(v / MAX_SIZE);
      this.writeUint32(h);
      this.writeUint32(v & 0xFFFFFFFF);
    };
    DataStream.prototype.writeUint24 = function (v) {
      this.writeUint8((v & 0x00FF0000) >> 16);
      this.writeUint8((v & 0x0000FF00) >> 8);
      this.writeUint8(v & 0x000000FF);
    };
    DataStream.prototype.adjustUint32 = function (position, value) {
      var pos = this.position;
      this.seek(position);
      this.writeUint32(value);
      this.seek(pos);
    };
    // file:src/DataStream-map.js
    /**
      Maps an Int32Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Int32Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapInt32Array = function (length, e) {
      this._realloc(length * 4);
      var arr = new Int32Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 4;
      return arr;
    };

    /**
      Maps an Int16Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Int16Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapInt16Array = function (length, e) {
      this._realloc(length * 2);
      var arr = new Int16Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 2;
      return arr;
    };

    /**
      Maps an Int8Array into the DataStream buffer.
    
      Nice for quickly reading in data.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Int8Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapInt8Array = function (length) {
      this._realloc(length * 1);
      var arr = new Int8Array(this._buffer, this.byteOffset + this.position, length);
      this.position += length * 1;
      return arr;
    };

    /**
      Maps a Uint32Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Uint32Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapUint32Array = function (length, e) {
      this._realloc(length * 4);
      var arr = new Uint32Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 4;
      return arr;
    };

    /**
      Maps a Uint16Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Uint16Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapUint16Array = function (length, e) {
      this._realloc(length * 2);
      var arr = new Uint16Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 2;
      return arr;
    };

    /**
      Maps a Float64Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Float64Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapFloat64Array = function (length, e) {
      this._realloc(length * 8);
      var arr = new Float64Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 8;
      return arr;
    };

    /**
      Maps a Float32Array into the DataStream buffer, swizzling it to native
      endianness in-place. The current offset from the start of the buffer needs to
      be a multiple of element size, just like with typed array views.
    
      Nice for quickly reading in data. Warning: potentially modifies the buffer
      contents.
    
      @param {number} length Number of elements to map.
      @param {?boolean} e Endianness of the data to read.
      @return {Object} Float32Array to the DataStream backing buffer.
      */
    DataStream.prototype.mapFloat32Array = function (length, e) {
      this._realloc(length * 4);
      var arr = new Float32Array(this._buffer, this.byteOffset + this.position, length);
      DataStream.arrayToNative(arr, e == null ? this.endianness : e);
      this.position += length * 4;
      return arr;
    };
    // file:src/buffer.js
    /**
     * MultiBufferStream is a class that acts as a SimpleStream for parsing 
     * It holds several, possibly non-contiguous ArrayBuffer objects, each with a fileStart property 
     * containing the offset for the buffer data in an original/virtual file 
     *
     * It inherits also from DataStream for all read/write/alloc operations
     */

    /**
     * Constructor
     */
    var MultiBufferStream = function (buffer) {
      /* List of ArrayBuffers, with a fileStart property, sorted in fileStart order and non overlapping */
      this.buffers = [];
      this.bufferIndex = -1;
      if (buffer) {
        this.insertBuffer(buffer);
        this.bufferIndex = 0;
      }
    };
    MultiBufferStream.prototype = new DataStream(new ArrayBuffer(), 0, DataStream.BIG_ENDIAN);

    /************************************************************************************
      Methods for the managnement of the buffers (insertion, removal, concatenation, ...)
     ***********************************************************************************/

    MultiBufferStream.prototype.initialized = function () {
      var firstBuffer;
      if (this.bufferIndex > -1) {
        return true;
      } else if (this.buffers.length > 0) {
        firstBuffer = this.buffers[0];
        if (firstBuffer.fileStart === 0) {
          this.buffer = firstBuffer;
          this.bufferIndex = 0;
          Log.debug("MultiBufferStream", "Stream ready for parsing");
          return true;
        } else {
          Log.warn("MultiBufferStream", "The first buffer should have a fileStart of 0");
          this.logBufferLevel();
          return false;
        }
      } else {
        Log.warn("MultiBufferStream", "No buffer to start parsing from");
        this.logBufferLevel();
        return false;
      }
    };

    /**
     * helper functions to concatenate two ArrayBuffer objects
     * @param  {ArrayBuffer} buffer1 
     * @param  {ArrayBuffer} buffer2 
     * @return {ArrayBuffer} the concatenation of buffer1 and buffer2 in that order
     */
    ArrayBuffer.concat = function (buffer1, buffer2) {
      Log.debug("ArrayBuffer", "Trying to create a new buffer of size: " + (buffer1.byteLength + buffer2.byteLength));
      var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
      tmp.set(new Uint8Array(buffer1), 0);
      tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
      return tmp.buffer;
    };

    /**
     * Reduces the size of a given buffer, but taking the part between offset and offset+newlength
     * @param  {ArrayBuffer} buffer    
     * @param  {Number}      offset    the start of new buffer
     * @param  {Number}      newLength the length of the new buffer
     * @return {ArrayBuffer}           the new buffer
     */
    MultiBufferStream.prototype.reduceBuffer = function (buffer, offset, newLength) {
      var smallB;
      smallB = new Uint8Array(newLength);
      smallB.set(new Uint8Array(buffer, offset, newLength));
      smallB.buffer.fileStart = buffer.fileStart + offset;
      smallB.buffer.usedBytes = 0;
      return smallB.buffer;
    };

    /**
     * Inserts the new buffer in the sorted list of buffers,
     *  making sure, it is not overlapping with existing ones (possibly reducing its size).
     *  if the new buffer overrides/replaces the 0-th buffer (for instance because it is bigger), 
     *  updates the DataStream buffer for parsing 
    */
    MultiBufferStream.prototype.insertBuffer = function (ab) {
      var to_add = true;
      /* TODO: improve insertion if many buffers */
      for (var i = 0; i < this.buffers.length; i++) {
        var b = this.buffers[i];
        if (ab.fileStart <= b.fileStart) {
          /* the insertion position is found */
          if (ab.fileStart === b.fileStart) {
            /* The new buffer overlaps with an existing buffer */
            if (ab.byteLength > b.byteLength) {
              /* the new buffer is bigger than the existing one
                 remove the existing buffer and try again to insert 
                 the new buffer to check overlap with the next ones */
              this.buffers.splice(i, 1);
              i--;
              continue;
            } else {
              /* the new buffer is smaller than the existing one, just drop it */
              Log.warn("MultiBufferStream", "Buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ") already appended, ignoring");
            }
          } else {
            /* The beginning of the new buffer is not overlapping with an existing buffer
               let's check the end of it */
            if (ab.fileStart + ab.byteLength <= b.fileStart) ; else {
              /* There is some overlap, cut the new buffer short, and add it*/
              ab = this.reduceBuffer(ab, 0, b.fileStart - ab.fileStart);
            }
            Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
            this.buffers.splice(i, 0, ab);
            /* if this new buffer is inserted in the first place in the list of the buffer, 
               and the DataStream is initialized, make it the buffer used for parsing */
            if (i === 0) {
              this.buffer = ab;
            }
          }
          to_add = false;
          break;
        } else if (ab.fileStart < b.fileStart + b.byteLength) {
          /* the new buffer overlaps its beginning with the end of the current buffer */
          var offset = b.fileStart + b.byteLength - ab.fileStart;
          var newLength = ab.byteLength - offset;
          if (newLength > 0) {
            /* the new buffer is bigger than the current overlap, drop the overlapping part and try again inserting the remaining buffer */
            ab = this.reduceBuffer(ab, offset, newLength);
          } else {
            /* the content of the new buffer is entirely contained in the existing buffer, drop it entirely */
            to_add = false;
            break;
          }
        }
      }
      /* if the buffer has not been added, we can add it at the end */
      if (to_add) {
        Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
        this.buffers.push(ab);
        /* if this new buffer is inserted in the first place in the list of the buffer, 
           and the DataStream is initialized, make it the buffer used for parsing */
        if (i === 0) {
          this.buffer = ab;
        }
      }
    };

    /**
     * Displays the status of the buffers (number and used bytes)
     * @param  {Object} info callback method for display
     */
    MultiBufferStream.prototype.logBufferLevel = function (info) {
      var i;
      var buffer;
      var used, total;
      var ranges = [];
      var range;
      var bufferedString = "";
      used = 0;
      total = 0;
      for (i = 0; i < this.buffers.length; i++) {
        buffer = this.buffers[i];
        if (i === 0) {
          range = {};
          ranges.push(range);
          range.start = buffer.fileStart;
          range.end = buffer.fileStart + buffer.byteLength;
          bufferedString += "[" + range.start + "-";
        } else if (range.end === buffer.fileStart) {
          range.end = buffer.fileStart + buffer.byteLength;
        } else {
          range = {};
          range.start = buffer.fileStart;
          bufferedString += ranges[ranges.length - 1].end - 1 + "], [" + range.start + "-";
          range.end = buffer.fileStart + buffer.byteLength;
          ranges.push(range);
        }
        used += buffer.usedBytes;
        total += buffer.byteLength;
      }
      if (ranges.length > 0) {
        bufferedString += range.end - 1 + "]";
      }
      var log = info ? Log.info : Log.debug;
      if (this.buffers.length === 0) {
        log("MultiBufferStream", "No more buffer in memory");
      } else {
        log("MultiBufferStream", "" + this.buffers.length + " stored buffer(s) (" + used + "/" + total + " bytes), continuous ranges: " + bufferedString);
      }
    };
    MultiBufferStream.prototype.cleanBuffers = function () {
      var i;
      var buffer;
      for (i = 0; i < this.buffers.length; i++) {
        buffer = this.buffers[i];
        if (buffer.usedBytes === buffer.byteLength) {
          Log.debug("MultiBufferStream", "Removing buffer #" + i);
          this.buffers.splice(i, 1);
          i--;
        }
      }
    };
    MultiBufferStream.prototype.mergeNextBuffer = function () {
      var next_buffer;
      if (this.bufferIndex + 1 < this.buffers.length) {
        next_buffer = this.buffers[this.bufferIndex + 1];
        if (next_buffer.fileStart === this.buffer.fileStart + this.buffer.byteLength) {
          var oldLength = this.buffer.byteLength;
          var oldUsedBytes = this.buffer.usedBytes;
          var oldFileStart = this.buffer.fileStart;
          this.buffers[this.bufferIndex] = ArrayBuffer.concat(this.buffer, next_buffer);
          this.buffer = this.buffers[this.bufferIndex];
          this.buffers.splice(this.bufferIndex + 1, 1);
          this.buffer.usedBytes = oldUsedBytes; /* TODO: should it be += ? */
          this.buffer.fileStart = oldFileStart;
          Log.debug("ISOFile", "Concatenating buffer for box parsing (length: " + oldLength + "->" + this.buffer.byteLength + ")");
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    /*************************************************************************
      Seek-related functions
     *************************************************************************/

    /**
     * Finds the buffer that holds the given file position
     * @param  {Boolean} fromStart    indicates if the search should start from the current buffer (false) 
     *                                or from the first buffer (true)
     * @param  {Number}  filePosition position in the file to seek to
     * @param  {Boolean} markAsUsed   indicates if the bytes in between the current position and the seek position 
     *                                should be marked as used for garbage collection
     * @return {Number}               the index of the buffer holding the seeked file position, -1 if not found.
     */
    MultiBufferStream.prototype.findPosition = function (fromStart, filePosition, markAsUsed) {
      var i;
      var abuffer = null;
      var index = -1;

      /* find the buffer with the largest position smaller than the given position */
      if (fromStart === true) {
        /* the reposition can be in the past, we need to check from the beginning of the list of buffers */
        i = 0;
      } else {
        i = this.bufferIndex;
      }
      while (i < this.buffers.length) {
        abuffer = this.buffers[i];
        if (abuffer.fileStart <= filePosition) {
          index = i;
          if (markAsUsed) {
            if (abuffer.fileStart + abuffer.byteLength <= filePosition) {
              abuffer.usedBytes = abuffer.byteLength;
            } else {
              abuffer.usedBytes = filePosition - abuffer.fileStart;
            }
            this.logBufferLevel();
          }
        } else {
          break;
        }
        i++;
      }
      if (index !== -1) {
        abuffer = this.buffers[index];
        if (abuffer.fileStart + abuffer.byteLength >= filePosition) {
          Log.debug("MultiBufferStream", "Found position in existing buffer #" + index);
          return index;
        } else {
          return -1;
        }
      } else {
        return -1;
      }
    };

    /**
     * Finds the largest file position contained in a buffer or in the next buffers if they are contiguous (no gap)
     * starting from the given buffer index or from the current buffer if the index is not given
     *
     * @param  {Number} inputindex Index of the buffer to start from
     * @return {Number}            The largest file position found in the buffers
     */
    MultiBufferStream.prototype.findEndContiguousBuf = function (inputindex) {
      var i;
      var currentBuf;
      var nextBuf;
      var index = inputindex !== undefined ? inputindex : this.bufferIndex;
      currentBuf = this.buffers[index];
      /* find the end of the contiguous range of data */
      if (this.buffers.length > index + 1) {
        for (i = index + 1; i < this.buffers.length; i++) {
          nextBuf = this.buffers[i];
          if (nextBuf.fileStart === currentBuf.fileStart + currentBuf.byteLength) {
            currentBuf = nextBuf;
          } else {
            break;
          }
        }
      }
      /* return the position of last byte in the file that we have */
      return currentBuf.fileStart + currentBuf.byteLength;
    };

    /**
     * Returns the largest file position contained in the buffers, larger than the given position
     * @param  {Number} pos the file position to start from
     * @return {Number}     the largest position in the current buffer or in the buffer and the next contiguous 
     *                      buffer that holds the given position
     */
    MultiBufferStream.prototype.getEndFilePositionAfter = function (pos) {
      var index = this.findPosition(true, pos, false);
      if (index !== -1) {
        return this.findEndContiguousBuf(index);
      } else {
        return pos;
      }
    };

    /*************************************************************************
      Garbage collection related functions
     *************************************************************************/

    /**
     * Marks a given number of bytes as used in the current buffer for garbage collection
     * @param {Number} nbBytes 
     */
    MultiBufferStream.prototype.addUsedBytes = function (nbBytes) {
      this.buffer.usedBytes += nbBytes;
      this.logBufferLevel();
    };

    /**
     * Marks the entire current buffer as used, ready for garbage collection
     */
    MultiBufferStream.prototype.setAllUsedBytes = function () {
      this.buffer.usedBytes = this.buffer.byteLength;
      this.logBufferLevel();
    };

    /*************************************************************************
      Common API between MultiBufferStream and SimpleStream
     *************************************************************************/

    /**
     * Tries to seek to a given file position
     * if possible, repositions the parsing from there and returns true 
     * if not possible, does not change anything and returns false 
     * @param  {Number}  filePosition position in the file to seek to
     * @param  {Boolean} fromStart    indicates if the search should start from the current buffer (false) 
     *                                or from the first buffer (true)
     * @param  {Boolean} markAsUsed   indicates if the bytes in between the current position and the seek position 
     *                                should be marked as used for garbage collection
     * @return {Boolean}              true if the seek succeeded, false otherwise
     */
    MultiBufferStream.prototype.seek = function (filePosition, fromStart, markAsUsed) {
      var index;
      index = this.findPosition(fromStart, filePosition, markAsUsed);
      if (index !== -1) {
        this.buffer = this.buffers[index];
        this.bufferIndex = index;
        this.position = filePosition - this.buffer.fileStart;
        Log.debug("MultiBufferStream", "Repositioning parser at buffer position: " + this.position);
        return true;
      } else {
        Log.debug("MultiBufferStream", "Position " + filePosition + " not found in buffered data");
        return false;
      }
    };

    /**
     * Returns the current position in the file
     * @return {Number} the position in the file
     */
    MultiBufferStream.prototype.getPosition = function () {
      if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
        throw "Error accessing position in the MultiBufferStream";
      }
      return this.buffers[this.bufferIndex].fileStart + this.position;
    };

    /**
     * Returns the length of the current buffer
     * @return {Number} the length of the current buffer
     */
    MultiBufferStream.prototype.getLength = function () {
      return this.byteLength;
    };
    MultiBufferStream.prototype.getEndPosition = function () {
      if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === null) {
        throw "Error accessing position in the MultiBufferStream";
      }
      return this.buffers[this.bufferIndex].fileStart + this.byteLength;
    };
    {
      exports.MultiBufferStream = MultiBufferStream;
    } // file:src/descriptor.js
    /*
     * Copyright (c) 2012-2013. Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    var MPEG4DescriptorParser = function () {
      var ES_DescrTag = 0x03;
      var DecoderConfigDescrTag = 0x04;
      var DecSpecificInfoTag = 0x05;
      var SLConfigDescrTag = 0x06;
      var descTagToName = [];
      descTagToName[ES_DescrTag] = "ES_Descriptor";
      descTagToName[DecoderConfigDescrTag] = "DecoderConfigDescriptor";
      descTagToName[DecSpecificInfoTag] = "DecoderSpecificInfo";
      descTagToName[SLConfigDescrTag] = "SLConfigDescriptor";
      this.getDescriptorName = function (tag) {
        return descTagToName[tag];
      };
      var that = this;
      var classes = {};
      this.parseOneDescriptor = function (stream) {
        var size = 0;
        var tag;
        var desc;
        var byteRead;
        tag = stream.readUint8();
        byteRead = stream.readUint8();
        while (byteRead & 0x80) {
          size = (byteRead & 0x7F) << 7;
          byteRead = stream.readUint8();
        }
        size += byteRead & 0x7F;
        Log.debug("MPEG4DescriptorParser", "Found " + (descTagToName[tag] || "Descriptor " + tag) + ", size " + size + " at position " + stream.getPosition());
        if (descTagToName[tag]) {
          desc = new classes[descTagToName[tag]](size);
        } else {
          desc = new classes.Descriptor(size);
        }
        desc.parse(stream);
        return desc;
      };
      classes.Descriptor = function (_tag, _size) {
        this.tag = _tag;
        this.size = _size;
        this.descs = [];
      };
      classes.Descriptor.prototype.parse = function (stream) {
        this.data = stream.readUint8Array(this.size);
      };
      classes.Descriptor.prototype.findDescriptor = function (tag) {
        for (var i = 0; i < this.descs.length; i++) {
          if (this.descs[i].tag == tag) {
            return this.descs[i];
          }
        }
        return null;
      };
      classes.Descriptor.prototype.parseRemainingDescriptors = function (stream) {
        var start = stream.position;
        while (stream.position < start + this.size) {
          var desc = that.parseOneDescriptor(stream);
          this.descs.push(desc);
        }
      };
      classes.ES_Descriptor = function (size) {
        classes.Descriptor.call(this, ES_DescrTag, size);
      };
      classes.ES_Descriptor.prototype = new classes.Descriptor();
      classes.ES_Descriptor.prototype.parse = function (stream) {
        this.ES_ID = stream.readUint16();
        this.flags = stream.readUint8();
        this.size -= 3;
        if (this.flags & 0x80) {
          this.dependsOn_ES_ID = stream.readUint16();
          this.size -= 2;
        } else {
          this.dependsOn_ES_ID = 0;
        }
        if (this.flags & 0x40) {
          var l = stream.readUint8();
          this.URL = stream.readString(l);
          this.size -= l + 1;
        } else {
          this.URL = "";
        }
        if (this.flags & 0x20) {
          this.OCR_ES_ID = stream.readUint16();
          this.size -= 2;
        } else {
          this.OCR_ES_ID = 0;
        }
        this.parseRemainingDescriptors(stream);
      };
      classes.ES_Descriptor.prototype.getOTI = function (stream) {
        var dcd = this.findDescriptor(DecoderConfigDescrTag);
        if (dcd) {
          return dcd.oti;
        } else {
          return 0;
        }
      };
      classes.ES_Descriptor.prototype.getAudioConfig = function (stream) {
        var dcd = this.findDescriptor(DecoderConfigDescrTag);
        if (!dcd) return null;
        var dsi = dcd.findDescriptor(DecSpecificInfoTag);
        if (dsi && dsi.data) {
          var audioObjectType = (dsi.data[0] & 0xF8) >> 3;
          if (audioObjectType === 31 && dsi.data.length >= 2) {
            audioObjectType = 32 + ((dsi.data[0] & 0x7) << 3) + ((dsi.data[1] & 0xE0) >> 5);
          }
          return audioObjectType;
        } else {
          return null;
        }
      };
      classes.DecoderConfigDescriptor = function (size) {
        classes.Descriptor.call(this, DecoderConfigDescrTag, size);
      };
      classes.DecoderConfigDescriptor.prototype = new classes.Descriptor();
      classes.DecoderConfigDescriptor.prototype.parse = function (stream) {
        this.oti = stream.readUint8();
        this.streamType = stream.readUint8();
        this.upStream = (this.streamType >> 1 & 1) !== 0;
        this.streamType = this.streamType >>> 2;
        this.bufferSize = stream.readUint24();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
        this.size -= 13;
        this.parseRemainingDescriptors(stream);
      };
      classes.DecoderSpecificInfo = function (size) {
        classes.Descriptor.call(this, DecSpecificInfoTag, size);
      };
      classes.DecoderSpecificInfo.prototype = new classes.Descriptor();
      classes.SLConfigDescriptor = function (size) {
        classes.Descriptor.call(this, SLConfigDescrTag, size);
      };
      classes.SLConfigDescriptor.prototype = new classes.Descriptor();
      return this;
    };
    {
      exports.MPEG4DescriptorParser = MPEG4DescriptorParser;
    }
    // file:src/box.js
    /*
     * Copyright (c) 2012-2013. Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    var BoxParser = {
      ERR_INVALID_DATA: -1,
      ERR_NOT_ENOUGH_DATA: 0,
      OK: 1,
      // Boxes to be created with default parsing
      BASIC_BOXES: ["mdat", "idat", "free", "skip", "meco", "strk"],
      FULL_BOXES: ["hmhd", "nmhd", "iods", "xml ", "bxml", "ipro", "mere"],
      CONTAINER_BOXES: [["moov", ["trak", "pssh"]], ["trak"], ["edts"], ["mdia"], ["minf"], ["dinf"], ["stbl", ["sgpd", "sbgp"]], ["mvex", ["trex"]], ["moof", ["traf"]], ["traf", ["trun", "sgpd", "sbgp"]], ["vttc"], ["tref"], ["iref"], ["mfra", ["tfra"]], ["meco"], ["hnti"], ["hinf"], ["strk"], ["strd"], ["sinf"], ["rinf"], ["schi"], ["trgr"], ["udta", ["kind"]], ["iprp", ["ipma"]], ["ipco"], ["grpl"], ["j2kH"], ["etyp", ["tyco"]]],
      // Boxes effectively created
      boxCodes: [],
      fullBoxCodes: [],
      containerBoxCodes: [],
      sampleEntryCodes: {},
      sampleGroupEntryCodes: [],
      trackGroupTypes: [],
      UUIDBoxes: {},
      UUIDs: [],
      initialize: function () {
        BoxParser.FullBox.prototype = new BoxParser.Box();
        BoxParser.ContainerBox.prototype = new BoxParser.Box();
        BoxParser.SampleEntry.prototype = new BoxParser.Box();
        BoxParser.TrackGroupTypeBox.prototype = new BoxParser.FullBox();

        /* creating constructors for simple boxes */
        BoxParser.BASIC_BOXES.forEach(function (type) {
          BoxParser.createBoxCtor(type);
        });
        BoxParser.FULL_BOXES.forEach(function (type) {
          BoxParser.createFullBoxCtor(type);
        });
        BoxParser.CONTAINER_BOXES.forEach(function (types) {
          BoxParser.createContainerBoxCtor(types[0], null, types[1]);
        });
      },
      Box: function (_type, _size, _uuid) {
        this.type = _type;
        this.size = _size;
        this.uuid = _uuid;
      },
      FullBox: function (type, size, uuid) {
        BoxParser.Box.call(this, type, size, uuid);
        this.flags = 0;
        this.version = 0;
      },
      ContainerBox: function (type, size, uuid) {
        BoxParser.Box.call(this, type, size, uuid);
        this.boxes = [];
      },
      SampleEntry: function (type, size, hdr_size, start) {
        BoxParser.ContainerBox.call(this, type, size);
        this.hdr_size = hdr_size;
        this.start = start;
      },
      SampleGroupEntry: function (type) {
        this.grouping_type = type;
      },
      TrackGroupTypeBox: function (type, size) {
        BoxParser.FullBox.call(this, type, size);
      },
      createBoxCtor: function (type, parseMethod) {
        BoxParser.boxCodes.push(type);
        BoxParser[type + "Box"] = function (size) {
          BoxParser.Box.call(this, type, size);
        };
        BoxParser[type + "Box"].prototype = new BoxParser.Box();
        if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
      },
      createFullBoxCtor: function (type, parseMethod) {
        //BoxParser.fullBoxCodes.push(type);
        BoxParser[type + "Box"] = function (size) {
          BoxParser.FullBox.call(this, type, size);
        };
        BoxParser[type + "Box"].prototype = new BoxParser.FullBox();
        BoxParser[type + "Box"].prototype.parse = function (stream) {
          this.parseFullHeader(stream);
          if (parseMethod) {
            parseMethod.call(this, stream);
          }
        };
      },
      addSubBoxArrays: function (subBoxNames) {
        if (subBoxNames) {
          this.subBoxNames = subBoxNames;
          var nbSubBoxes = subBoxNames.length;
          for (var k = 0; k < nbSubBoxes; k++) {
            this[subBoxNames[k] + "s"] = [];
          }
        }
      },
      createContainerBoxCtor: function (type, parseMethod, subBoxNames) {
        //BoxParser.containerBoxCodes.push(type);
        BoxParser[type + "Box"] = function (size) {
          BoxParser.ContainerBox.call(this, type, size);
          BoxParser.addSubBoxArrays.call(this, subBoxNames);
        };
        BoxParser[type + "Box"].prototype = new BoxParser.ContainerBox();
        if (parseMethod) BoxParser[type + "Box"].prototype.parse = parseMethod;
      },
      createMediaSampleEntryCtor: function (mediaType, parseMethod, subBoxNames) {
        BoxParser.sampleEntryCodes[mediaType] = [];
        BoxParser[mediaType + "SampleEntry"] = function (type, size) {
          BoxParser.SampleEntry.call(this, type, size);
          BoxParser.addSubBoxArrays.call(this, subBoxNames);
        };
        BoxParser[mediaType + "SampleEntry"].prototype = new BoxParser.SampleEntry();
        if (parseMethod) BoxParser[mediaType + "SampleEntry"].prototype.parse = parseMethod;
      },
      createSampleEntryCtor: function (mediaType, type, parseMethod, subBoxNames) {
        BoxParser.sampleEntryCodes[mediaType].push(type);
        BoxParser[type + "SampleEntry"] = function (size) {
          BoxParser[mediaType + "SampleEntry"].call(this, type, size);
          BoxParser.addSubBoxArrays.call(this, subBoxNames);
        };
        BoxParser[type + "SampleEntry"].prototype = new BoxParser[mediaType + "SampleEntry"]();
        if (parseMethod) BoxParser[type + "SampleEntry"].prototype.parse = parseMethod;
      },
      createEncryptedSampleEntryCtor: function (mediaType, type, parseMethod) {
        BoxParser.createSampleEntryCtor.call(this, mediaType, type, parseMethod, ["sinf"]);
      },
      createSampleGroupCtor: function (type, parseMethod) {
        //BoxParser.sampleGroupEntryCodes.push(type);
        BoxParser[type + "SampleGroupEntry"] = function (size) {
          BoxParser.SampleGroupEntry.call(this, type, size);
        };
        BoxParser[type + "SampleGroupEntry"].prototype = new BoxParser.SampleGroupEntry();
        if (parseMethod) BoxParser[type + "SampleGroupEntry"].prototype.parse = parseMethod;
      },
      createTrackGroupCtor: function (type, parseMethod) {
        //BoxParser.trackGroupTypes.push(type);
        BoxParser[type + "TrackGroupTypeBox"] = function (size) {
          BoxParser.TrackGroupTypeBox.call(this, type, size);
        };
        BoxParser[type + "TrackGroupTypeBox"].prototype = new BoxParser.TrackGroupTypeBox();
        if (parseMethod) BoxParser[type + "TrackGroupTypeBox"].prototype.parse = parseMethod;
      },
      createUUIDBox: function (uuid, isFullBox, isContainerBox, parseMethod) {
        BoxParser.UUIDs.push(uuid);
        BoxParser.UUIDBoxes[uuid] = function (size) {
          if (isFullBox) {
            BoxParser.FullBox.call(this, "uuid", size, uuid);
          } else {
            if (isContainerBox) {
              BoxParser.ContainerBox.call(this, "uuid", size, uuid);
            } else {
              BoxParser.Box.call(this, "uuid", size, uuid);
            }
          }
        };
        BoxParser.UUIDBoxes[uuid].prototype = isFullBox ? new BoxParser.FullBox() : isContainerBox ? new BoxParser.ContainerBox() : new BoxParser.Box();
        if (parseMethod) {
          if (isFullBox) {
            BoxParser.UUIDBoxes[uuid].prototype.parse = function (stream) {
              this.parseFullHeader(stream);
              if (parseMethod) {
                parseMethod.call(this, stream);
              }
            };
          } else {
            BoxParser.UUIDBoxes[uuid].prototype.parse = parseMethod;
          }
        }
      }
    };
    BoxParser.initialize();
    BoxParser.TKHD_FLAG_ENABLED = 0x000001;
    BoxParser.TKHD_FLAG_IN_MOVIE = 0x000002;
    BoxParser.TKHD_FLAG_IN_PREVIEW = 0x000004;
    BoxParser.TFHD_FLAG_BASE_DATA_OFFSET = 0x01;
    BoxParser.TFHD_FLAG_SAMPLE_DESC = 0x02;
    BoxParser.TFHD_FLAG_SAMPLE_DUR = 0x08;
    BoxParser.TFHD_FLAG_SAMPLE_SIZE = 0x10;
    BoxParser.TFHD_FLAG_SAMPLE_FLAGS = 0x20;
    BoxParser.TFHD_FLAG_DUR_EMPTY = 0x10000;
    BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF = 0x20000;
    BoxParser.TRUN_FLAGS_DATA_OFFSET = 0x01;
    BoxParser.TRUN_FLAGS_FIRST_FLAG = 0x04;
    BoxParser.TRUN_FLAGS_DURATION = 0x100;
    BoxParser.TRUN_FLAGS_SIZE = 0x200;
    BoxParser.TRUN_FLAGS_FLAGS = 0x400;
    BoxParser.TRUN_FLAGS_CTS_OFFSET = 0x800;
    BoxParser.Box.prototype.add = function (name) {
      return this.addBox(new BoxParser[name + "Box"]());
    };
    BoxParser.Box.prototype.addBox = function (box) {
      this.boxes.push(box);
      if (this[box.type + "s"]) {
        this[box.type + "s"].push(box);
      } else {
        this[box.type] = box;
      }
      return box;
    };
    BoxParser.Box.prototype.set = function (prop, value) {
      this[prop] = value;
      return this;
    };
    BoxParser.Box.prototype.addEntry = function (value, _prop) {
      var prop = _prop || "entries";
      if (!this[prop]) {
        this[prop] = [];
      }
      this[prop].push(value);
      return this;
    };
    {
      exports.BoxParser = BoxParser;
    }
    // file:src/box-parse.js
    /* 
     * Copyright (c) Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    BoxParser.parseUUID = function (stream) {
      return BoxParser.parseHex16(stream);
    };
    BoxParser.parseHex16 = function (stream) {
      var hex16 = "";
      for (var i = 0; i < 16; i++) {
        var hex = stream.readUint8().toString(16);
        hex16 += hex.length === 1 ? "0" + hex : hex;
      }
      return hex16;
    };
    BoxParser.parseOneBox = function (stream, headerOnly, parentSize) {
      var box;
      var start = stream.getPosition();
      var hdr_size = 0;
      var diff;
      var uuid;
      if (stream.getEndPosition() - start < 8) {
        Log.debug("BoxParser", "Not enough data in stream to parse the type and size of the box");
        return {
          code: BoxParser.ERR_NOT_ENOUGH_DATA
        };
      }
      if (parentSize && parentSize < 8) {
        Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a new box");
        return {
          code: BoxParser.ERR_NOT_ENOUGH_DATA
        };
      }
      var size = stream.readUint32();
      var type = stream.readString(4);
      var box_type = type;
      Log.debug("BoxParser", "Found box of type '" + type + "' and size " + size + " at position " + start);
      hdr_size = 8;
      if (type == "uuid") {
        if (stream.getEndPosition() - stream.getPosition() < 16 || parentSize - hdr_size < 16) {
          stream.seek(start);
          Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a UUID box");
          return {
            code: BoxParser.ERR_NOT_ENOUGH_DATA
          };
        }
        uuid = BoxParser.parseUUID(stream);
        hdr_size += 16;
        box_type = uuid;
      }
      if (size == 1) {
        if (stream.getEndPosition() - stream.getPosition() < 8 || parentSize && parentSize - hdr_size < 8) {
          stream.seek(start);
          Log.warn("BoxParser", "Not enough data in stream to parse the extended size of the \"" + type + "\" box");
          return {
            code: BoxParser.ERR_NOT_ENOUGH_DATA
          };
        }
        size = stream.readUint64();
        hdr_size += 8;
      } else if (size === 0) {
        /* box extends till the end of file or invalid file */
        if (parentSize) {
          size = parentSize;
        } else {
          /* box extends till the end of file */
          if (type !== "mdat") {
            Log.error("BoxParser", "Unlimited box size not supported for type: '" + type + "'");
            box = new BoxParser.Box(type, size);
            return {
              code: BoxParser.OK,
              box: box,
              size: box.size
            };
          }
        }
      }
      if (size !== 0 && size < hdr_size) {
        Log.error("BoxParser", "Box of type " + type + " has an invalid size " + size + " (too small to be a box)");
        return {
          code: BoxParser.ERR_NOT_ENOUGH_DATA,
          type: type,
          size: size,
          hdr_size: hdr_size,
          start: start
        };
      }
      if (size !== 0 && parentSize && size > parentSize) {
        Log.error("BoxParser", "Box of type '" + type + "' has a size " + size + " greater than its container size " + parentSize);
        return {
          code: BoxParser.ERR_NOT_ENOUGH_DATA,
          type: type,
          size: size,
          hdr_size: hdr_size,
          start: start
        };
      }
      if (size !== 0 && start + size > stream.getEndPosition()) {
        stream.seek(start);
        Log.info("BoxParser", "Not enough data in stream to parse the entire '" + type + "' box");
        return {
          code: BoxParser.ERR_NOT_ENOUGH_DATA,
          type: type,
          size: size,
          hdr_size: hdr_size,
          start: start
        };
      }
      if (headerOnly) {
        return {
          code: BoxParser.OK,
          type: type,
          size: size,
          hdr_size: hdr_size,
          start: start
        };
      } else {
        if (BoxParser[type + "Box"]) {
          box = new BoxParser[type + "Box"](size);
        } else {
          if (type !== "uuid") {
            Log.warn("BoxParser", "Unknown box type: '" + type + "'");
            box = new BoxParser.Box(type, size);
            box.has_unparsed_data = true;
          } else {
            if (BoxParser.UUIDBoxes[uuid]) {
              box = new BoxParser.UUIDBoxes[uuid](size);
            } else {
              Log.warn("BoxParser", "Unknown uuid type: '" + uuid + "'");
              box = new BoxParser.Box(type, size);
              box.uuid = uuid;
              box.has_unparsed_data = true;
            }
          }
        }
      }
      box.hdr_size = hdr_size;
      /* recording the position of the box in the input stream */
      box.start = start;
      if (box.write === BoxParser.Box.prototype.write && box.type !== "mdat") {
        Log.info("BoxParser", "'" + box_type + "' box writing not yet implemented, keeping unparsed data in memory for later write");
        box.parseDataAndRewind(stream);
      }
      box.parse(stream);
      diff = stream.getPosition() - (box.start + box.size);
      if (diff < 0) {
        Log.warn("BoxParser", "Parsing of box '" + box_type + "' did not read the entire indicated box data size (missing " + -diff + " bytes), seeking forward");
        stream.seek(box.start + box.size);
      } else if (diff > 0) {
        Log.error("BoxParser", "Parsing of box '" + box_type + "' read " + diff + " more bytes than the indicated box data size, seeking backwards");
        if (box.size !== 0) stream.seek(box.start + box.size);
      }
      return {
        code: BoxParser.OK,
        box: box,
        size: box.size
      };
    };
    BoxParser.Box.prototype.parse = function (stream) {
      if (this.type != "mdat") {
        this.data = stream.readUint8Array(this.size - this.hdr_size);
      } else {
        if (this.size === 0) {
          stream.seek(stream.getEndPosition());
        } else {
          stream.seek(this.start + this.size);
        }
      }
    };

    /* Used to parse a box without consuming its data, to allow detailled parsing
       Useful for boxes for which a write method is not yet implemented */
    BoxParser.Box.prototype.parseDataAndRewind = function (stream) {
      this.data = stream.readUint8Array(this.size - this.hdr_size);
      // rewinding
      stream.position -= this.size - this.hdr_size;
    };
    BoxParser.FullBox.prototype.parseDataAndRewind = function (stream) {
      this.parseFullHeader(stream);
      this.data = stream.readUint8Array(this.size - this.hdr_size);
      // restore the header size as if the full header had not been parsed
      this.hdr_size -= 4;
      // rewinding
      stream.position -= this.size - this.hdr_size;
    };
    BoxParser.FullBox.prototype.parseFullHeader = function (stream) {
      this.version = stream.readUint8();
      this.flags = stream.readUint24();
      this.hdr_size += 4;
    };
    BoxParser.FullBox.prototype.parse = function (stream) {
      this.parseFullHeader(stream);
      this.data = stream.readUint8Array(this.size - this.hdr_size);
    };
    BoxParser.ContainerBox.prototype.parse = function (stream) {
      var ret;
      var box;
      while (stream.getPosition() < this.start + this.size) {
        ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          box = ret.box;
          /* store the box in the 'boxes' array to preserve box order (for offset) but also store box in a property for more direct access */
          this.boxes.push(box);
          if (this.subBoxNames && this.subBoxNames.indexOf(box.type) != -1) {
            this[this.subBoxNames[this.subBoxNames.indexOf(box.type)] + "s"].push(box);
          } else {
            var box_type = box.type !== "uuid" ? box.type : box.uuid;
            if (this[box_type]) {
              Log.warn("Box of type " + box_type + " already stored in field of this type");
            } else {
              this[box_type] = box;
            }
          }
        } else {
          return;
        }
      }
    };
    BoxParser.Box.prototype.parseLanguage = function (stream) {
      this.language = stream.readUint16();
      var chars = [];
      chars[0] = this.language >> 10 & 0x1F;
      chars[1] = this.language >> 5 & 0x1F;
      chars[2] = this.language & 0x1F;
      this.languageString = String.fromCharCode(chars[0] + 0x60, chars[1] + 0x60, chars[2] + 0x60);
    };

    // file:src/parsing/sampleentries/sampleentry.js
    BoxParser.SAMPLE_ENTRY_TYPE_VISUAL = "Visual";
    BoxParser.SAMPLE_ENTRY_TYPE_AUDIO = "Audio";
    BoxParser.SAMPLE_ENTRY_TYPE_HINT = "Hint";
    BoxParser.SAMPLE_ENTRY_TYPE_METADATA = "Metadata";
    BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE = "Subtitle";
    BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM = "System";
    BoxParser.SAMPLE_ENTRY_TYPE_TEXT = "Text";
    BoxParser.SampleEntry.prototype.parseHeader = function (stream) {
      stream.readUint8Array(6);
      this.data_reference_index = stream.readUint16();
      this.hdr_size += 8;
    };
    BoxParser.SampleEntry.prototype.parse = function (stream) {
      this.parseHeader(stream);
      this.data = stream.readUint8Array(this.size - this.hdr_size);
    };
    BoxParser.SampleEntry.prototype.parseDataAndRewind = function (stream) {
      this.parseHeader(stream);
      this.data = stream.readUint8Array(this.size - this.hdr_size);
      // restore the header size as if the sample entry header had not been parsed
      this.hdr_size -= 8;
      // rewinding
      stream.position -= this.size - this.hdr_size;
    };
    BoxParser.SampleEntry.prototype.parseFooter = function (stream) {
      BoxParser.ContainerBox.prototype.parse.call(this, stream);
    };

    // Base SampleEntry types with default parsing
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_HINT);
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA);
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE);
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM);
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_TEXT);

    //Base SampleEntry types for Audio and Video with specific parsing
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, function (stream) {
      var compressorname_length;
      this.parseHeader(stream);
      stream.readUint16();
      stream.readUint16();
      stream.readUint32Array(3);
      this.width = stream.readUint16();
      this.height = stream.readUint16();
      this.horizresolution = stream.readUint32();
      this.vertresolution = stream.readUint32();
      stream.readUint32();
      this.frame_count = stream.readUint16();
      compressorname_length = Math.min(31, stream.readUint8());
      this.compressorname = stream.readString(compressorname_length);
      if (compressorname_length < 31) {
        stream.readString(31 - compressorname_length);
      }
      this.depth = stream.readUint16();
      stream.readUint16();
      this.parseFooter(stream);
    });
    BoxParser.createMediaSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, function (stream) {
      this.parseHeader(stream);
      stream.readUint32Array(2);
      this.channel_count = stream.readUint16();
      this.samplesize = stream.readUint16();
      stream.readUint16();
      stream.readUint16();
      this.samplerate = stream.readUint32() / (1 << 16);
      this.parseFooter(stream);
    });

    // Sample entries inheriting from Audio and Video
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc2");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc3");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avc4");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "av01");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dav1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hvc1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hev1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "hvt1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "lhe1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dvh1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "dvhe");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvc1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvi1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvs1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vvcN");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vp08");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "vp09");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "avs3");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "j2ki");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "mjp2");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "mjpg");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "uncv");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mp4a");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ac-3");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ac-4");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "ec-3");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "Opus");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mha1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mha2");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mhm1");
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "mhm2");

    // Encrypted sample entries
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_VISUAL, "encv");
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_AUDIO, "enca");
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "encu");
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SYSTEM, "encs");
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_TEXT, "enct");
    BoxParser.createEncryptedSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "encm");
    // file:src/parsing/a1lx.js
    BoxParser.createBoxCtor("a1lx", function (stream) {
      var large_size = stream.readUint8() & 1;
      var FieldLength = ((large_size & 1) + 1) * 16;
      this.layer_size = [];
      for (var i = 0; i < 3; i++) {
        if (FieldLength == 16) {
          this.layer_size[i] = stream.readUint16();
        } else {
          this.layer_size[i] = stream.readUint32();
        }
      }
    }); // file:src/parsing/a1op.js
    BoxParser.createBoxCtor("a1op", function (stream) {
      this.op_index = stream.readUint8();
    }); // file:src/parsing/auxC.js
    BoxParser.createFullBoxCtor("auxC", function (stream) {
      this.aux_type = stream.readCString();
      var aux_subtype_length = this.size - this.hdr_size - (this.aux_type.length + 1);
      this.aux_subtype = stream.readUint8Array(aux_subtype_length);
    }); // file:src/parsing/av1C.js
    BoxParser.createBoxCtor("av1C", function (stream) {
      var tmp = stream.readUint8();
      if (tmp >> 7 & 0x1 !== 1) {
        Log.error("av1C marker problem");
        return;
      }
      this.version = tmp & 0x7F;
      if (this.version !== 1) {
        Log.error("av1C version " + this.version + " not supported");
        return;
      }
      tmp = stream.readUint8();
      this.seq_profile = tmp >> 5 & 0x7;
      this.seq_level_idx_0 = tmp & 0x1F;
      tmp = stream.readUint8();
      this.seq_tier_0 = tmp >> 7 & 0x1;
      this.high_bitdepth = tmp >> 6 & 0x1;
      this.twelve_bit = tmp >> 5 & 0x1;
      this.monochrome = tmp >> 4 & 0x1;
      this.chroma_subsampling_x = tmp >> 3 & 0x1;
      this.chroma_subsampling_y = tmp >> 2 & 0x1;
      this.chroma_sample_position = tmp & 0x3;
      tmp = stream.readUint8();
      this.reserved_1 = tmp >> 5 & 0x7;
      if (this.reserved_1 !== 0) {
        Log.error("av1C reserved_1 parsing problem");
        return;
      }
      this.initial_presentation_delay_present = tmp >> 4 & 0x1;
      if (this.initial_presentation_delay_present === 1) {
        this.initial_presentation_delay_minus_one = tmp & 0xF;
      } else {
        this.reserved_2 = tmp & 0xF;
        if (this.reserved_2 !== 0) {
          Log.error("av1C reserved_2 parsing problem");
          return;
        }
      }
      var configOBUs_length = this.size - this.hdr_size - 4;
      this.configOBUs = stream.readUint8Array(configOBUs_length);
    });

    // file:src/parsing/avcC.js
    BoxParser.createBoxCtor("avcC", function (stream) {
      var i;
      var toparse;
      this.configurationVersion = stream.readUint8();
      this.AVCProfileIndication = stream.readUint8();
      this.profile_compatibility = stream.readUint8();
      this.AVCLevelIndication = stream.readUint8();
      this.lengthSizeMinusOne = stream.readUint8() & 0x3;
      this.nb_SPS_nalus = stream.readUint8() & 0x1F;
      toparse = this.size - this.hdr_size - 6;
      this.SPS = [];
      for (i = 0; i < this.nb_SPS_nalus; i++) {
        this.SPS[i] = {};
        this.SPS[i].length = stream.readUint16();
        this.SPS[i].nalu = stream.readUint8Array(this.SPS[i].length);
        toparse -= 2 + this.SPS[i].length;
      }
      this.nb_PPS_nalus = stream.readUint8();
      toparse--;
      this.PPS = [];
      for (i = 0; i < this.nb_PPS_nalus; i++) {
        this.PPS[i] = {};
        this.PPS[i].length = stream.readUint16();
        this.PPS[i].nalu = stream.readUint8Array(this.PPS[i].length);
        toparse -= 2 + this.PPS[i].length;
      }
      if (toparse > 0) {
        this.ext = stream.readUint8Array(toparse);
      }
    });

    // file:src/parsing/btrt.js
    BoxParser.createBoxCtor("btrt", function (stream) {
      this.bufferSizeDB = stream.readUint32();
      this.maxBitrate = stream.readUint32();
      this.avgBitrate = stream.readUint32();
    });

    // file:src/parsing/ccst.js
    BoxParser.createFullBoxCtor("ccst", function (stream) {
      var flags = stream.readUint8();
      this.all_ref_pics_intra = (flags & 0x80) == 0x80;
      this.intra_pred_used = (flags & 0x40) == 0x40;
      this.max_ref_per_pic = (flags & 0x3f) >> 2;
      stream.readUint24();
    });

    // file:src/parsing/cdef.js
    BoxParser.createBoxCtor("cdef", function (stream) {
      var i;
      this.channel_count = stream.readUint16();
      this.channel_indexes = [];
      this.channel_types = [];
      this.channel_associations = [];
      for (i = 0; i < this.channel_count; i++) {
        this.channel_indexes.push(stream.readUint16());
        this.channel_types.push(stream.readUint16());
        this.channel_associations.push(stream.readUint16());
      }
    });

    // file:src/parsing/clap.js
    BoxParser.createBoxCtor("clap", function (stream) {
      this.cleanApertureWidthN = stream.readUint32();
      this.cleanApertureWidthD = stream.readUint32();
      this.cleanApertureHeightN = stream.readUint32();
      this.cleanApertureHeightD = stream.readUint32();
      this.horizOffN = stream.readUint32();
      this.horizOffD = stream.readUint32();
      this.vertOffN = stream.readUint32();
      this.vertOffD = stream.readUint32();
    }); // file:src/parsing/clli.js
    BoxParser.createBoxCtor("clli", function (stream) {
      this.max_content_light_level = stream.readUint16();
      this.max_pic_average_light_level = stream.readUint16();
    });

    // file:src/parsing/cmex.js
    BoxParser.createFullBoxCtor("cmex", function (stream) {
      if (this.flags & 0x1) {
        this.pos_x = stream.readInt32();
      }
      if (this.flags & 0x2) {
        this.pos_y = stream.readInt32();
      }
      if (this.flags & 0x4) {
        this.pos_z = stream.readInt32();
      }
      if (this.flags & 0x8) {
        if (this.version == 0) {
          if (this.flags & 0x10) {
            this.quat_x = stream.readInt32();
            this.quat_y = stream.readInt32();
            this.quat_z = stream.readInt32();
          } else {
            this.quat_x = stream.readInt16();
            this.quat_y = stream.readInt16();
            this.quat_z = stream.readInt16();
          }
        } else if (this.version == 1) ;
      }
      if (this.flags & 0x20) {
        this.id = stream.readUint32();
      }
    });
    // file:src/parsing/cmin.js
    BoxParser.createFullBoxCtor("cmin", function (stream) {
      this.focal_length_x = stream.readInt32();
      this.principal_point_x = stream.readInt32();
      this.principal_point_y = stream.readInt32();
      if (this.flags & 0x1) {
        this.focal_length_y = stream.readInt32();
        this.skew_factor = stream.readInt32();
      }
    }); // file:src/parsing/cmpd.js
    BoxParser.createBoxCtor("cmpd", function (stream) {
      this.component_count = stream.readUint32();
      this.component_types = [];
      this.component_type_urls = [];
      for (i = 0; i < this.component_count; i++) {
        var component_type = stream.readUint16();
        this.component_types.push(component_type);
        if (component_type >= 0x8000) {
          this.component_type_urls.push(stream.readCString());
        }
      }
    }); // file:src/parsing/co64.js
    BoxParser.createFullBoxCtor("co64", function (stream) {
      var entry_count;
      var i;
      entry_count = stream.readUint32();
      this.chunk_offsets = [];
      if (this.version === 0) {
        for (i = 0; i < entry_count; i++) {
          this.chunk_offsets.push(stream.readUint64());
        }
      }
    });

    // file:src/parsing/CoLL.js
    BoxParser.createFullBoxCtor("CoLL", function (stream) {
      this.maxCLL = stream.readUint16();
      this.maxFALL = stream.readUint16();
    });

    // file:src/parsing/colr.js
    BoxParser.createBoxCtor("colr", function (stream) {
      this.colour_type = stream.readString(4);
      if (this.colour_type === 'nclx') {
        this.colour_primaries = stream.readUint16();
        this.transfer_characteristics = stream.readUint16();
        this.matrix_coefficients = stream.readUint16();
        var tmp = stream.readUint8();
        this.full_range_flag = tmp >> 7;
      } else if (this.colour_type === 'rICC') {
        this.ICC_profile = stream.readUint8Array(this.size - 4);
      } else if (this.colour_type === 'prof') {
        this.ICC_profile = stream.readUint8Array(this.size - 4);
      }
    }); // file:src/parsing/cprt.js
    BoxParser.createFullBoxCtor("cprt", function (stream) {
      this.parseLanguage(stream);
      this.notice = stream.readCString();
    });

    // file:src/parsing/cslg.js
    BoxParser.createFullBoxCtor("cslg", function (stream) {
      if (this.version === 0) {
        this.compositionToDTSShift = stream.readInt32(); /* signed */
        this.leastDecodeToDisplayDelta = stream.readInt32(); /* signed */
        this.greatestDecodeToDisplayDelta = stream.readInt32(); /* signed */
        this.compositionStartTime = stream.readInt32(); /* signed */
        this.compositionEndTime = stream.readInt32(); /* signed */
      }
    });

    // file:src/parsing/ctts.js
    BoxParser.createFullBoxCtor("ctts", function (stream) {
      var entry_count;
      var i;
      entry_count = stream.readUint32();
      this.sample_counts = [];
      this.sample_offsets = [];
      if (this.version === 0) {
        for (i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          /* some files are buggy and declare version=0 while using signed offsets.
             The likelyhood of using the most significant bit in a 32-bits time offset is very low,
             so using signed value here as well */
          var value = stream.readInt32();
          if (value < 0) {
            Log.warn("BoxParser", "ctts box uses negative values without using version 1");
          }
          this.sample_offsets.push(value);
        }
      } else if (this.version == 1) {
        for (i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          this.sample_offsets.push(stream.readInt32()); /* signed */
        }
      }
    });

    // file:src/parsing/dac3.js
    BoxParser.createBoxCtor("dac3", function (stream) {
      var tmp_byte1 = stream.readUint8();
      var tmp_byte2 = stream.readUint8();
      var tmp_byte3 = stream.readUint8();
      this.fscod = tmp_byte1 >> 6;
      this.bsid = tmp_byte1 >> 1 & 0x1F;
      this.bsmod = (tmp_byte1 & 0x1) << 2 | tmp_byte2 >> 6 & 0x3;
      this.acmod = tmp_byte2 >> 3 & 0x7;
      this.lfeon = tmp_byte2 >> 2 & 0x1;
      this.bit_rate_code = tmp_byte2 & 0x3 | tmp_byte3 >> 5 & 0x7;
    });

    // file:src/parsing/dec3.js
    BoxParser.createBoxCtor("dec3", function (stream) {
      var tmp_16 = stream.readUint16();
      this.data_rate = tmp_16 >> 3;
      this.num_ind_sub = tmp_16 & 0x7;
      this.ind_subs = [];
      for (var i = 0; i < this.num_ind_sub + 1; i++) {
        var ind_sub = {};
        this.ind_subs.push(ind_sub);
        var tmp_byte1 = stream.readUint8();
        var tmp_byte2 = stream.readUint8();
        var tmp_byte3 = stream.readUint8();
        ind_sub.fscod = tmp_byte1 >> 6;
        ind_sub.bsid = tmp_byte1 >> 1 & 0x1F;
        ind_sub.bsmod = (tmp_byte1 & 0x1) << 4 | tmp_byte2 >> 4 & 0xF;
        ind_sub.acmod = tmp_byte2 >> 1 & 0x7;
        ind_sub.lfeon = tmp_byte2 & 0x1;
        ind_sub.num_dep_sub = tmp_byte3 >> 1 & 0xF;
        if (ind_sub.num_dep_sub > 0) {
          ind_sub.chan_loc = (tmp_byte3 & 0x1) << 8 | stream.readUint8();
        }
      }
    });

    // file:src/parsing/dfLa.js
    BoxParser.createFullBoxCtor("dfLa", function (stream) {
      var BLOCKTYPE_MASK = 0x7F;
      var LASTMETADATABLOCKFLAG_MASK = 0x80;
      var boxesFound = [];
      var knownBlockTypes = ["STREAMINFO", "PADDING", "APPLICATION", "SEEKTABLE", "VORBIS_COMMENT", "CUESHEET", "PICTURE", "RESERVED"];

      // dfLa is a FullBox
      this.parseFullHeader(stream);

      // for (i=0; ; i++) { // to end of box
      do {
        var flagAndType = stream.readUint8();
        var type = Math.min(flagAndType & BLOCKTYPE_MASK, knownBlockTypes.length - 1);

        // if this is a STREAMINFO block, read the true samplerate since this
        // can be different to the AudioSampleEntry samplerate.
        if (!type) {
          // read past all the other stuff
          stream.readUint8Array(13);

          // extract samplerate
          this.samplerate = stream.readUint32() >> 12;

          // read to end of STREAMINFO
          stream.readUint8Array(20);
        } else {
          // not interested in other block types so just discard length bytes
          stream.readUint8Array(stream.readUint24());
        }
        boxesFound.push(knownBlockTypes[type]);
        if (!!(flagAndType & LASTMETADATABLOCKFLAG_MASK)) {
          break;
        }
      } while (true);
      this.numMetadataBlocks = boxesFound.length + " (" + boxesFound.join(", ") + ")";
    });
    // file:src/parsing/dimm.js
    BoxParser.createBoxCtor("dimm", function (stream) {
      this.bytessent = stream.readUint64();
    });

    // file:src/parsing/dmax.js
    BoxParser.createBoxCtor("dmax", function (stream) {
      this.time = stream.readUint32();
    });

    // file:src/parsing/dmed.js
    BoxParser.createBoxCtor("dmed", function (stream) {
      this.bytessent = stream.readUint64();
    });

    // file:src/parsing/dOps.js
    BoxParser.createBoxCtor("dOps", function (stream) {
      this.Version = stream.readUint8();
      this.OutputChannelCount = stream.readUint8();
      this.PreSkip = stream.readUint16();
      this.InputSampleRate = stream.readUint32();
      this.OutputGain = stream.readInt16();
      this.ChannelMappingFamily = stream.readUint8();
      if (this.ChannelMappingFamily !== 0) {
        this.StreamCount = stream.readUint8();
        this.CoupledCount = stream.readUint8();
        this.ChannelMapping = [];
        for (var i = 0; i < this.OutputChannelCount; i++) {
          this.ChannelMapping[i] = stream.readUint8();
        }
      }
    });

    // file:src/parsing/dref.js
    BoxParser.createFullBoxCtor("dref", function (stream) {
      var ret;
      var box;
      this.entries = [];
      var entry_count = stream.readUint32();
      for (var i = 0; i < entry_count; i++) {
        ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          box = ret.box;
          this.entries.push(box);
        } else {
          return;
        }
      }
    });

    // file:src/parsing/drep.js
    BoxParser.createBoxCtor("drep", function (stream) {
      this.bytessent = stream.readUint64();
    });

    // file:src/parsing/elng.js
    BoxParser.createFullBoxCtor("elng", function (stream) {
      this.extended_language = stream.readString(this.size - this.hdr_size);
    });

    // file:src/parsing/elst.js
    BoxParser.createFullBoxCtor("elst", function (stream) {
      this.entries = [];
      var entry_count = stream.readUint32();
      for (var i = 0; i < entry_count; i++) {
        var entry = {};
        this.entries.push(entry);
        if (this.version === 1) {
          entry.segment_duration = stream.readUint64();
          entry.media_time = stream.readInt64();
        } else {
          entry.segment_duration = stream.readUint32();
          entry.media_time = stream.readInt32();
        }
        entry.media_rate_integer = stream.readInt16();
        entry.media_rate_fraction = stream.readInt16();
      }
    });

    // file:src/parsing/emsg.js
    BoxParser.createFullBoxCtor("emsg", function (stream) {
      if (this.version == 1) {
        this.timescale = stream.readUint32();
        this.presentation_time = stream.readUint64();
        this.event_duration = stream.readUint32();
        this.id = stream.readUint32();
        this.scheme_id_uri = stream.readCString();
        this.value = stream.readCString();
      } else {
        this.scheme_id_uri = stream.readCString();
        this.value = stream.readCString();
        this.timescale = stream.readUint32();
        this.presentation_time_delta = stream.readUint32();
        this.event_duration = stream.readUint32();
        this.id = stream.readUint32();
      }
      var message_size = this.size - this.hdr_size - (4 * 4 + (this.scheme_id_uri.length + 1) + (this.value.length + 1));
      if (this.version == 1) {
        message_size -= 4;
      }
      this.message_data = stream.readUint8Array(message_size);
    });

    // file:src/parsing/EntityToGroup.js
    // ISO/IEC 14496-12:2022 Section 8.18.3 Entity to group box
    BoxParser.createEntityToGroupCtor = function (type, parseMethod) {
      BoxParser[type + "Box"] = function (size) {
        BoxParser.FullBox.call(this, type, size);
      };
      BoxParser[type + "Box"].prototype = new BoxParser.FullBox();
      BoxParser[type + "Box"].prototype.parse = function (stream) {
        this.parseFullHeader(stream);
        if (parseMethod) {
          parseMethod.call(this, stream);
        } else {
          this.group_id = stream.readUint32();
          this.num_entities_in_group = stream.readUint32();
          this.entity_ids = [];
          for (i = 0; i < this.num_entities_in_group; i++) {
            var entity_id = stream.readUint32();
            this.entity_ids.push(entity_id);
          }
        }
      };
    };

    // Auto exposure bracketing (ISO/IEC 23008-12:2022 Section 6.8.6.2.1)
    BoxParser.createEntityToGroupCtor("aebr");

    // Flash exposure bracketing (ISO/IEC 23008-12:2022 Section 6.8.6.5.1)
    BoxParser.createEntityToGroupCtor("afbr");

    // Album collection (ISO/IEC 23008-12:2022 Section 6.8.7.1)
    BoxParser.createEntityToGroupCtor("albc");

    // Alternative entity (ISO/IEC 14496-12:2022 Section 8.18.3.1)
    BoxParser.createEntityToGroupCtor("altr");

    // Burst image entity group (ISO/IEC 23008-12:2022 Section 6.8.2.2)
    BoxParser.createEntityToGroupCtor("brst");

    // Depth of field bracketing (ISO/IEC 23008-12:2022 Section 6.8.6.6.1)
    BoxParser.createEntityToGroupCtor("dobr");

    // Equivalent entity (ISO/IEC 23008-12:2022 Section 6.8.1.1)
    BoxParser.createEntityToGroupCtor("eqiv");

    // Favourites collection (ISO/IEC 23008-12:2022 Section 6.8.7.2)
    BoxParser.createEntityToGroupCtor("favc");

    // Focus bracketing (ISO/IEC 23008-12:2022 Section 6.8.6.4.1)
    BoxParser.createEntityToGroupCtor("fobr");

    // Audio to image entity group (ISO/IEC 23008-12:2022 Section 6.8.4)
    BoxParser.createEntityToGroupCtor("iaug");

    // Panorama (ISO/IEC 23008-12:2022 Section 6.8.8.1)
    BoxParser.createEntityToGroupCtor("pano");

    // Slideshow (ISO/IEC 23008-12:2022 Section 6.8.9.1)
    BoxParser.createEntityToGroupCtor("slid");

    // Stereo pair (ISO/IEC 23008-12:2022 Section 6.8.5)
    BoxParser.createEntityToGroupCtor("ster");

    // Time-synchronised capture entity group (ISO/IEC 23008-12:2022 Section 6.8.3)
    BoxParser.createEntityToGroupCtor("tsyn");

    // White balance bracketing (ISO/IEC 23008-12:2022 Section 6.8.6.3.1)
    BoxParser.createEntityToGroupCtor("wbbr");

    // Alternative entity (ISO/IEC 23008-12:2022 AMD1 Section 6.8.10)
    BoxParser.createEntityToGroupCtor("prgr");
    // file:src/parsing/esds.js
    BoxParser.createFullBoxCtor("esds", function (stream) {
      var esd_data = stream.readUint8Array(this.size - this.hdr_size);
      if (typeof MPEG4DescriptorParser !== "undefined") {
        var esd_parser = new MPEG4DescriptorParser();
        this.esd = esd_parser.parseOneDescriptor(new DataStream(esd_data.buffer, 0, DataStream.BIG_ENDIAN));
      }
    });

    // file:src/parsing/fiel.js
    BoxParser.createBoxCtor("fiel", function (stream) {
      this.fieldCount = stream.readUint8();
      this.fieldOrdering = stream.readUint8();
    });

    // file:src/parsing/frma.js
    BoxParser.createBoxCtor("frma", function (stream) {
      this.data_format = stream.readString(4);
    });

    // file:src/parsing/ftyp.js
    BoxParser.createBoxCtor("ftyp", function (stream) {
      var toparse = this.size - this.hdr_size;
      this.major_brand = stream.readString(4);
      this.minor_version = stream.readUint32();
      toparse -= 8;
      this.compatible_brands = [];
      var i = 0;
      while (toparse >= 4) {
        this.compatible_brands[i] = stream.readString(4);
        toparse -= 4;
        i++;
      }
    });

    // file:src/parsing/hdlr.js
    BoxParser.createFullBoxCtor("hdlr", function (stream) {
      if (this.version === 0) {
        stream.readUint32();
        this.handler = stream.readString(4);
        stream.readUint32Array(3);
        this.name = stream.readString(this.size - this.hdr_size - 20);
        if (this.name[this.name.length - 1] === '\0') {
          this.name = this.name.slice(0, -1);
        }
      }
    });

    // file:src/parsing/hvcC.js
    BoxParser.createBoxCtor("hvcC", function (stream) {
      var i, j;
      var length;
      var tmp_byte;
      this.configurationVersion = stream.readUint8();
      tmp_byte = stream.readUint8();
      this.general_profile_space = tmp_byte >> 6;
      this.general_tier_flag = (tmp_byte & 0x20) >> 5;
      this.general_profile_idc = tmp_byte & 0x1F;
      this.general_profile_compatibility = stream.readUint32();
      this.general_constraint_indicator = stream.readUint8Array(6);
      this.general_level_idc = stream.readUint8();
      this.min_spatial_segmentation_idc = stream.readUint16() & 0xFFF;
      this.parallelismType = stream.readUint8() & 0x3;
      this.chroma_format_idc = stream.readUint8() & 0x3;
      this.bit_depth_luma_minus8 = stream.readUint8() & 0x7;
      this.bit_depth_chroma_minus8 = stream.readUint8() & 0x7;
      this.avgFrameRate = stream.readUint16();
      tmp_byte = stream.readUint8();
      this.constantFrameRate = tmp_byte >> 6;
      this.numTemporalLayers = (tmp_byte & 0XD) >> 3;
      this.temporalIdNested = (tmp_byte & 0X4) >> 2;
      this.lengthSizeMinusOne = tmp_byte & 0X3;
      this.nalu_arrays = [];
      var numOfArrays = stream.readUint8();
      for (i = 0; i < numOfArrays; i++) {
        var nalu_array = [];
        this.nalu_arrays.push(nalu_array);
        tmp_byte = stream.readUint8();
        nalu_array.completeness = (tmp_byte & 0x80) >> 7;
        nalu_array.nalu_type = tmp_byte & 0x3F;
        var numNalus = stream.readUint16();
        for (j = 0; j < numNalus; j++) {
          var nalu = {};
          nalu_array.push(nalu);
          length = stream.readUint16();
          nalu.data = stream.readUint8Array(length);
        }
      }
    });

    // file:src/parsing/iinf.js
    BoxParser.createFullBoxCtor("iinf", function (stream) {
      var ret;
      if (this.version === 0) {
        this.entry_count = stream.readUint16();
      } else {
        this.entry_count = stream.readUint32();
      }
      this.item_infos = [];
      for (var i = 0; i < this.entry_count; i++) {
        ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          if (ret.box.type !== "infe") {
            Log.error("BoxParser", "Expected 'infe' box, got " + ret.box.type);
          }
          this.item_infos[i] = ret.box;
        } else {
          return;
        }
      }
    });

    // file:src/parsing/iloc.js
    BoxParser.createFullBoxCtor("iloc", function (stream) {
      var byte;
      byte = stream.readUint8();
      this.offset_size = byte >> 4 & 0xF;
      this.length_size = byte & 0xF;
      byte = stream.readUint8();
      this.base_offset_size = byte >> 4 & 0xF;
      if (this.version === 1 || this.version === 2) {
        this.index_size = byte & 0xF;
      } else {
        this.index_size = 0;
        // reserved = byte & 0xF;
      }

      this.items = [];
      var item_count = 0;
      if (this.version < 2) {
        item_count = stream.readUint16();
      } else if (this.version === 2) {
        item_count = stream.readUint32();
      } else {
        throw "version of iloc box not supported";
      }
      for (var i = 0; i < item_count; i++) {
        var item = {};
        this.items.push(item);
        if (this.version < 2) {
          item.item_ID = stream.readUint16();
        } else if (this.version === 2) {
          item.item_ID = stream.readUint32();
        } else {
          throw "version of iloc box not supported";
        }
        if (this.version === 1 || this.version === 2) {
          item.construction_method = stream.readUint16() & 0xF;
        } else {
          item.construction_method = 0;
        }
        item.data_reference_index = stream.readUint16();
        switch (this.base_offset_size) {
          case 0:
            item.base_offset = 0;
            break;
          case 4:
            item.base_offset = stream.readUint32();
            break;
          case 8:
            item.base_offset = stream.readUint64();
            break;
          default:
            throw "Error reading base offset size";
        }
        var extent_count = stream.readUint16();
        item.extents = [];
        for (var j = 0; j < extent_count; j++) {
          var extent = {};
          item.extents.push(extent);
          if (this.version === 1 || this.version === 2) {
            switch (this.index_size) {
              case 0:
                extent.extent_index = 0;
                break;
              case 4:
                extent.extent_index = stream.readUint32();
                break;
              case 8:
                extent.extent_index = stream.readUint64();
                break;
              default:
                throw "Error reading extent index";
            }
          }
          switch (this.offset_size) {
            case 0:
              extent.extent_offset = 0;
              break;
            case 4:
              extent.extent_offset = stream.readUint32();
              break;
            case 8:
              extent.extent_offset = stream.readUint64();
              break;
            default:
              throw "Error reading extent index";
          }
          switch (this.length_size) {
            case 0:
              extent.extent_length = 0;
              break;
            case 4:
              extent.extent_length = stream.readUint32();
              break;
            case 8:
              extent.extent_length = stream.readUint64();
              break;
            default:
              throw "Error reading extent index";
          }
        }
      }
    });

    // file:src/parsing/imir.js
    BoxParser.createBoxCtor("imir", function (stream) {
      var tmp = stream.readUint8();
      this.reserved = tmp >> 7;
      this.axis = tmp & 1;
    }); // file:src/parsing/infe.js
    BoxParser.createFullBoxCtor("infe", function (stream) {
      if (this.version === 0 || this.version === 1) {
        this.item_ID = stream.readUint16();
        this.item_protection_index = stream.readUint16();
        this.item_name = stream.readCString();
        this.content_type = stream.readCString();
        this.content_encoding = stream.readCString();
      }
      if (this.version === 1) {
        this.extension_type = stream.readString(4);
        Log.warn("BoxParser", "Cannot parse extension type");
        stream.seek(this.start + this.size);
        return;
      }
      if (this.version >= 2) {
        if (this.version === 2) {
          this.item_ID = stream.readUint16();
        } else if (this.version === 3) {
          this.item_ID = stream.readUint32();
        }
        this.item_protection_index = stream.readUint16();
        this.item_type = stream.readString(4);
        this.item_name = stream.readCString();
        if (this.item_type === "mime") {
          this.content_type = stream.readCString();
          this.content_encoding = stream.readCString();
        } else if (this.item_type === "uri ") {
          this.item_uri_type = stream.readCString();
        }
      }
    });
    // file:src/parsing/ipma.js
    BoxParser.createFullBoxCtor("ipma", function (stream) {
      var i, j;
      entry_count = stream.readUint32();
      this.associations = [];
      for (i = 0; i < entry_count; i++) {
        var item_assoc = {};
        this.associations.push(item_assoc);
        if (this.version < 1) {
          item_assoc.id = stream.readUint16();
        } else {
          item_assoc.id = stream.readUint32();
        }
        var association_count = stream.readUint8();
        item_assoc.props = [];
        for (j = 0; j < association_count; j++) {
          var tmp = stream.readUint8();
          var p = {};
          item_assoc.props.push(p);
          p.essential = (tmp & 0x80) >> 7 === 1;
          if (this.flags & 0x1) {
            p.property_index = (tmp & 0x7F) << 8 | stream.readUint8();
          } else {
            p.property_index = tmp & 0x7F;
          }
        }
      }
    });

    // file:src/parsing/iref.js
    BoxParser.createFullBoxCtor("iref", function (stream) {
      var ret;
      var box;
      this.references = [];
      while (stream.getPosition() < this.start + this.size) {
        ret = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          if (this.version === 0) {
            box = new BoxParser.SingleItemTypeReferenceBox(ret.type, ret.size, ret.hdr_size, ret.start);
          } else {
            box = new BoxParser.SingleItemTypeReferenceBoxLarge(ret.type, ret.size, ret.hdr_size, ret.start);
          }
          if (box.write === BoxParser.Box.prototype.write && box.type !== "mdat") {
            Log.warn("BoxParser", box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
            box.parseDataAndRewind(stream);
          }
          box.parse(stream);
          this.references.push(box);
        } else {
          return;
        }
      }
    });
    // file:src/parsing/irot.js
    BoxParser.createBoxCtor("irot", function (stream) {
      this.angle = stream.readUint8() & 0x3;
    });

    // file:src/parsing/ispe.js
    BoxParser.createFullBoxCtor("ispe", function (stream) {
      this.image_width = stream.readUint32();
      this.image_height = stream.readUint32();
    }); // file:src/parsing/kind.js
    BoxParser.createFullBoxCtor("kind", function (stream) {
      this.schemeURI = stream.readCString();
      this.value = stream.readCString();
    });
    // file:src/parsing/leva.js
    BoxParser.createFullBoxCtor("leva", function (stream) {
      var count = stream.readUint8();
      this.levels = [];
      for (var i = 0; i < count; i++) {
        var level = {};
        this.levels[i] = level;
        level.track_ID = stream.readUint32();
        var tmp_byte = stream.readUint8();
        level.padding_flag = tmp_byte >> 7;
        level.assignment_type = tmp_byte & 0x7F;
        switch (level.assignment_type) {
          case 0:
            level.grouping_type = stream.readString(4);
            break;
          case 1:
            level.grouping_type = stream.readString(4);
            level.grouping_type_parameter = stream.readUint32();
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            level.sub_track_id = stream.readUint32();
            break;
          default:
            Log.warn("BoxParser", "Unknown leva assignement type");
        }
      }
    });

    // file:src/parsing/lsel.js
    BoxParser.createBoxCtor("lsel", function (stream) {
      this.layer_id = stream.readUint16();
    }); // file:src/parsing/maxr.js
    BoxParser.createBoxCtor("maxr", function (stream) {
      this.period = stream.readUint32();
      this.bytes = stream.readUint32();
    });

    // file:src/parsing/mdcv.js
    function ColorPoint(x, y) {
      this.x = x;
      this.y = y;
    }
    ColorPoint.prototype.toString = function () {
      return "(" + this.x + "," + this.y + ")";
    };
    BoxParser.createBoxCtor("mdcv", function (stream) {
      this.display_primaries = [];
      this.display_primaries[0] = new ColorPoint(stream.readUint16(), stream.readUint16());
      this.display_primaries[1] = new ColorPoint(stream.readUint16(), stream.readUint16());
      this.display_primaries[2] = new ColorPoint(stream.readUint16(), stream.readUint16());
      this.white_point = new ColorPoint(stream.readUint16(), stream.readUint16());
      this.max_display_mastering_luminance = stream.readUint32();
      this.min_display_mastering_luminance = stream.readUint32();
    });

    // file:src/parsing/mdhd.js
    BoxParser.createFullBoxCtor("mdhd", function (stream) {
      if (this.version == 1) {
        this.creation_time = stream.readUint64();
        this.modification_time = stream.readUint64();
        this.timescale = stream.readUint32();
        this.duration = stream.readUint64();
      } else {
        this.creation_time = stream.readUint32();
        this.modification_time = stream.readUint32();
        this.timescale = stream.readUint32();
        this.duration = stream.readUint32();
      }
      this.parseLanguage(stream);
      stream.readUint16();
    });

    // file:src/parsing/mehd.js
    BoxParser.createFullBoxCtor("mehd", function (stream) {
      if (this.flags & 0x1) {
        Log.warn("BoxParser", "mehd box incorrectly uses flags set to 1, converting version to 1");
        this.version = 1;
      }
      if (this.version == 1) {
        this.fragment_duration = stream.readUint64();
      } else {
        this.fragment_duration = stream.readUint32();
      }
    });

    // file:src/parsing/meta.js
    BoxParser.createFullBoxCtor("meta", function (stream) {
      this.boxes = [];
      BoxParser.ContainerBox.prototype.parse.call(this, stream);
    });
    // file:src/parsing/mfhd.js
    BoxParser.createFullBoxCtor("mfhd", function (stream) {
      this.sequence_number = stream.readUint32();
    });

    // file:src/parsing/mfro.js
    BoxParser.createFullBoxCtor("mfro", function (stream) {
      this._size = stream.readUint32();
    });

    // file:src/parsing/mskC.js
    BoxParser.createFullBoxCtor("mskC", function (stream) {
      this.bits_per_pixel = stream.readUint8();
    });

    // file:src/parsing/mvhd.js
    BoxParser.createFullBoxCtor("mvhd", function (stream) {
      if (this.version == 1) {
        this.creation_time = stream.readUint64();
        this.modification_time = stream.readUint64();
        this.timescale = stream.readUint32();
        this.duration = stream.readUint64();
      } else {
        this.creation_time = stream.readUint32();
        this.modification_time = stream.readUint32();
        this.timescale = stream.readUint32();
        this.duration = stream.readUint32();
      }
      this.rate = stream.readUint32();
      this.volume = stream.readUint16() >> 8;
      stream.readUint16();
      stream.readUint32Array(2);
      this.matrix = stream.readUint32Array(9);
      stream.readUint32Array(6);
      this.next_track_id = stream.readUint32();
    });
    // file:src/parsing/npck.js
    BoxParser.createBoxCtor("npck", function (stream) {
      this.packetssent = stream.readUint32();
    });

    // file:src/parsing/nump.js
    BoxParser.createBoxCtor("nump", function (stream) {
      this.packetssent = stream.readUint64();
    });

    // file:src/parsing/padb.js
    BoxParser.createFullBoxCtor("padb", function (stream) {
      var sample_count = stream.readUint32();
      this.padbits = [];
      for (var i = 0; i < Math.floor((sample_count + 1) / 2); i++) {
        this.padbits = stream.readUint8();
      }
    });

    // file:src/parsing/pasp.js
    BoxParser.createBoxCtor("pasp", function (stream) {
      this.hSpacing = stream.readUint32();
      this.vSpacing = stream.readUint32();
    }); // file:src/parsing/payl.js
    BoxParser.createBoxCtor("payl", function (stream) {
      this.text = stream.readString(this.size - this.hdr_size);
    });

    // file:src/parsing/payt.js
    BoxParser.createBoxCtor("payt", function (stream) {
      this.payloadID = stream.readUint32();
      var count = stream.readUint8();
      this.rtpmap_string = stream.readString(count);
    });

    // file:src/parsing/pdin.js
    BoxParser.createFullBoxCtor("pdin", function (stream) {
      var count = (this.size - this.hdr_size) / 8;
      this.rate = [];
      this.initial_delay = [];
      for (var i = 0; i < count; i++) {
        this.rate[i] = stream.readUint32();
        this.initial_delay[i] = stream.readUint32();
      }
    });

    // file:src/parsing/pitm.js
    BoxParser.createFullBoxCtor("pitm", function (stream) {
      if (this.version === 0) {
        this.item_id = stream.readUint16();
      } else {
        this.item_id = stream.readUint32();
      }
    });

    // file:src/parsing/pixi.js
    BoxParser.createFullBoxCtor("pixi", function (stream) {
      var i;
      this.num_channels = stream.readUint8();
      this.bits_per_channels = [];
      for (i = 0; i < this.num_channels; i++) {
        this.bits_per_channels[i] = stream.readUint8();
      }
    });

    // file:src/parsing/pmax.js
    BoxParser.createBoxCtor("pmax", function (stream) {
      this.bytes = stream.readUint32();
    });

    // file:src/parsing/prdi.js
    BoxParser.createFullBoxCtor("prdi", function (stream) {
      this.step_count = stream.readUint16();
      this.item_count = [];
      if (this.flags & 0x2) {
        for (var i = 0; i < this.step_count; i++) {
          this.item_count[i] = stream.readUint16();
        }
      }
    }); // file:src/parsing/prft.js
    BoxParser.createFullBoxCtor("prft", function (stream) {
      this.ref_track_id = stream.readUint32();
      this.ntp_timestamp = stream.readUint64();
      if (this.version === 0) {
        this.media_time = stream.readUint32();
      } else {
        this.media_time = stream.readUint64();
      }
    });

    // file:src/parsing/pssh.js
    BoxParser.createFullBoxCtor("pssh", function (stream) {
      this.system_id = BoxParser.parseHex16(stream);
      if (this.version > 0) {
        var count = stream.readUint32();
        this.kid = [];
        for (var i = 0; i < count; i++) {
          this.kid[i] = BoxParser.parseHex16(stream);
        }
      }
      var datasize = stream.readUint32();
      if (datasize > 0) {
        this.data = stream.readUint8Array(datasize);
      }
    });

    // file:src/parsing/qt/clef.js
    BoxParser.createFullBoxCtor("clef", function (stream) {
      this.width = stream.readUint32();
      this.height = stream.readUint32();
    }); // file:src/parsing/qt/enof.js
    BoxParser.createFullBoxCtor("enof", function (stream) {
      this.width = stream.readUint32();
      this.height = stream.readUint32();
    }); // file:src/parsing/qt/prof.js
    BoxParser.createFullBoxCtor("prof", function (stream) {
      this.width = stream.readUint32();
      this.height = stream.readUint32();
    }); // file:src/parsing/qt/tapt.js
    BoxParser.createContainerBoxCtor("tapt", null, ["clef", "prof", "enof"]); // file:src/parsing/rtp.js
    BoxParser.createBoxCtor("rtp ", function (stream) {
      this.descriptionformat = stream.readString(4);
      this.sdptext = stream.readString(this.size - this.hdr_size - 4);
    });

    // file:src/parsing/saio.js
    BoxParser.createFullBoxCtor("saio", function (stream) {
      if (this.flags & 0x1) {
        this.aux_info_type = stream.readUint32();
        this.aux_info_type_parameter = stream.readUint32();
      }
      var count = stream.readUint32();
      this.offset = [];
      for (var i = 0; i < count; i++) {
        if (this.version === 0) {
          this.offset[i] = stream.readUint32();
        } else {
          this.offset[i] = stream.readUint64();
        }
      }
    });
    // file:src/parsing/saiz.js
    BoxParser.createFullBoxCtor("saiz", function (stream) {
      if (this.flags & 0x1) {
        this.aux_info_type = stream.readUint32();
        this.aux_info_type_parameter = stream.readUint32();
      }
      this.default_sample_info_size = stream.readUint8();
      var count = stream.readUint32();
      this.sample_info_size = [];
      if (this.default_sample_info_size === 0) {
        for (var i = 0; i < count; i++) {
          this.sample_info_size[i] = stream.readUint8();
        }
      }
    });

    // file:src/parsing/sampleentries/mett.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "mett", function (stream) {
      this.parseHeader(stream);
      this.content_encoding = stream.readCString();
      this.mime_format = stream.readCString();
      this.parseFooter(stream);
    });

    // file:src/parsing/sampleentries/metx.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "metx", function (stream) {
      this.parseHeader(stream);
      this.content_encoding = stream.readCString();
      this.namespace = stream.readCString();
      this.schema_location = stream.readCString();
      this.parseFooter(stream);
    });

    // file:src/parsing/sampleentries/sbtt.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "sbtt", function (stream) {
      this.parseHeader(stream);
      this.content_encoding = stream.readCString();
      this.mime_format = stream.readCString();
      this.parseFooter(stream);
    });

    // file:src/parsing/sampleentries/stpp.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "stpp", function (stream) {
      this.parseHeader(stream);
      this.namespace = stream.readCString();
      this.schema_location = stream.readCString();
      this.auxiliary_mime_types = stream.readCString();
      this.parseFooter(stream);
    });

    // file:src/parsing/sampleentries/stxt.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "stxt", function (stream) {
      this.parseHeader(stream);
      this.content_encoding = stream.readCString();
      this.mime_format = stream.readCString();
      this.parseFooter(stream);
    });

    // file:src/parsing/sampleentries/tx3g.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_SUBTITLE, "tx3g", function (stream) {
      this.parseHeader(stream);
      this.displayFlags = stream.readUint32();
      this.horizontal_justification = stream.readInt8();
      this.vertical_justification = stream.readInt8();
      this.bg_color_rgba = stream.readUint8Array(4);
      this.box_record = stream.readInt16Array(4);
      this.style_record = stream.readUint8Array(12);
      this.parseFooter(stream);
    });
    // file:src/parsing/sampleentries/wvtt.js
    BoxParser.createSampleEntryCtor(BoxParser.SAMPLE_ENTRY_TYPE_METADATA, "wvtt", function (stream) {
      this.parseHeader(stream);
      this.parseFooter(stream);
    });

    // file:src/parsing/samplegroups/alst.js
    BoxParser.createSampleGroupCtor("alst", function (stream) {
      var i;
      var roll_count = stream.readUint16();
      this.first_output_sample = stream.readUint16();
      this.sample_offset = [];
      for (i = 0; i < roll_count; i++) {
        this.sample_offset[i] = stream.readUint32();
      }
      var remaining = this.description_length - 4 - 4 * roll_count;
      this.num_output_samples = [];
      this.num_total_samples = [];
      for (i = 0; i < remaining / 4; i++) {
        this.num_output_samples[i] = stream.readUint16();
        this.num_total_samples[i] = stream.readUint16();
      }
    });

    // file:src/parsing/samplegroups/avll.js
    BoxParser.createSampleGroupCtor("avll", function (stream) {
      this.layerNumber = stream.readUint8();
      this.accurateStatisticsFlag = stream.readUint8();
      this.avgBitRate = stream.readUint16();
      this.avgFrameRate = stream.readUint16();
    });

    // file:src/parsing/samplegroups/avss.js
    BoxParser.createSampleGroupCtor("avss", function (stream) {
      this.subSequenceIdentifier = stream.readUint16();
      this.layerNumber = stream.readUint8();
      var tmp_byte = stream.readUint8();
      this.durationFlag = tmp_byte >> 7;
      this.avgRateFlag = tmp_byte >> 6 & 0x1;
      if (this.durationFlag) {
        this.duration = stream.readUint32();
      }
      if (this.avgRateFlag) {
        this.accurateStatisticsFlag = stream.readUint8();
        this.avgBitRate = stream.readUint16();
        this.avgFrameRate = stream.readUint16();
      }
      this.dependency = [];
      var numReferences = stream.readUint8();
      for (var i = 0; i < numReferences; i++) {
        var dependencyInfo = {};
        this.dependency.push(dependencyInfo);
        dependencyInfo.subSeqDirectionFlag = stream.readUint8();
        dependencyInfo.layerNumber = stream.readUint8();
        dependencyInfo.subSequenceIdentifier = stream.readUint16();
      }
    });

    // file:src/parsing/samplegroups/dtrt.js
    BoxParser.createSampleGroupCtor("dtrt", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/mvif.js
    BoxParser.createSampleGroupCtor("mvif", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/prol.js
    BoxParser.createSampleGroupCtor("prol", function (stream) {
      this.roll_distance = stream.readInt16();
    });

    // file:src/parsing/samplegroups/rap.js
    BoxParser.createSampleGroupCtor("rap ", function (stream) {
      var tmp_byte = stream.readUint8();
      this.num_leading_samples_known = tmp_byte >> 7;
      this.num_leading_samples = tmp_byte & 0x7F;
    });

    // file:src/parsing/samplegroups/rash.js
    BoxParser.createSampleGroupCtor("rash", function (stream) {
      this.operation_point_count = stream.readUint16();
      if (this.description_length !== 2 + (this.operation_point_count === 1 ? 2 : this.operation_point_count * 6) + 9) {
        Log.warn("BoxParser", "Mismatch in " + this.grouping_type + " sample group length");
        this.data = stream.readUint8Array(this.description_length - 2);
      } else {
        if (this.operation_point_count === 1) {
          this.target_rate_share = stream.readUint16();
        } else {
          this.target_rate_share = [];
          this.available_bitrate = [];
          for (var i = 0; i < this.operation_point_count; i++) {
            this.available_bitrate[i] = stream.readUint32();
            this.target_rate_share[i] = stream.readUint16();
          }
        }
        this.maximum_bitrate = stream.readUint32();
        this.minimum_bitrate = stream.readUint32();
        this.discard_priority = stream.readUint8();
      }
    });

    // file:src/parsing/samplegroups/roll.js
    BoxParser.createSampleGroupCtor("roll", function (stream) {
      this.roll_distance = stream.readInt16();
    });

    // file:src/parsing/samplegroups/samplegroup.js
    BoxParser.SampleGroupEntry.prototype.parse = function (stream) {
      Log.warn("BoxParser", "Unknown Sample Group type: " + this.grouping_type);
      this.data = stream.readUint8Array(this.description_length);
    };

    // file:src/parsing/samplegroups/scif.js
    BoxParser.createSampleGroupCtor("scif", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/scnm.js
    BoxParser.createSampleGroupCtor("scnm", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/seig.js
    BoxParser.createSampleGroupCtor("seig", function (stream) {
      this.reserved = stream.readUint8();
      var tmp = stream.readUint8();
      this.crypt_byte_block = tmp >> 4;
      this.skip_byte_block = tmp & 0xF;
      this.isProtected = stream.readUint8();
      this.Per_Sample_IV_Size = stream.readUint8();
      this.KID = BoxParser.parseHex16(stream);
      this.constant_IV_size = 0;
      this.constant_IV = 0;
      if (this.isProtected === 1 && this.Per_Sample_IV_Size === 0) {
        this.constant_IV_size = stream.readUint8();
        this.constant_IV = stream.readUint8Array(this.constant_IV_size);
      }
    });

    // file:src/parsing/samplegroups/stsa.js
    BoxParser.createSampleGroupCtor("stsa", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/sync.js
    BoxParser.createSampleGroupCtor("sync", function (stream) {
      var tmp_byte = stream.readUint8();
      this.NAL_unit_type = tmp_byte & 0x3F;
    });

    // file:src/parsing/samplegroups/tele.js
    BoxParser.createSampleGroupCtor("tele", function (stream) {
      var tmp_byte = stream.readUint8();
      this.level_independently_decodable = tmp_byte >> 7;
    });

    // file:src/parsing/samplegroups/tsas.js
    BoxParser.createSampleGroupCtor("tsas", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/tscl.js
    BoxParser.createSampleGroupCtor("tscl", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/samplegroups/vipr.js
    BoxParser.createSampleGroupCtor("vipr", function (stream) {
      Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
    });

    // file:src/parsing/sbgp.js
    BoxParser.createFullBoxCtor("sbgp", function (stream) {
      this.grouping_type = stream.readString(4);
      if (this.version === 1) {
        this.grouping_type_parameter = stream.readUint32();
      } else {
        this.grouping_type_parameter = 0;
      }
      this.entries = [];
      var entry_count = stream.readUint32();
      for (var i = 0; i < entry_count; i++) {
        var entry = {};
        this.entries.push(entry);
        entry.sample_count = stream.readInt32();
        entry.group_description_index = stream.readInt32();
      }
    });

    // file:src/parsing/sbpm.js
    function Pixel(row, col) {
      this.bad_pixel_row = row;
      this.bad_pixel_column = col;
    }
    Pixel.prototype.toString = function pixelToString() {
      return "[row: " + this.bad_pixel_row + ", column: " + this.bad_pixel_column + "]";
    };
    BoxParser.createFullBoxCtor("sbpm", function (stream) {
      var i;
      this.component_count = stream.readUint16();
      this.component_index = [];
      for (i = 0; i < this.component_count; i++) {
        this.component_index.push(stream.readUint16());
      }
      var flags = stream.readUint8();
      this.correction_applied = 0x80 == (flags & 0x80);
      this.num_bad_rows = stream.readUint32();
      this.num_bad_cols = stream.readUint32();
      this.num_bad_pixels = stream.readUint32();
      this.bad_rows = [];
      this.bad_columns = [];
      this.bad_pixels = [];
      for (i = 0; i < this.num_bad_rows; i++) {
        this.bad_rows.push(stream.readUint32());
      }
      for (i = 0; i < this.num_bad_cols; i++) {
        this.bad_columns.push(stream.readUint32());
      }
      for (i = 0; i < this.num_bad_pixels; i++) {
        var row = stream.readUint32();
        var col = stream.readUint32();
        this.bad_pixels.push(new Pixel(row, col));
      }
    });

    // file:src/parsing/schm.js
    BoxParser.createFullBoxCtor("schm", function (stream) {
      this.scheme_type = stream.readString(4);
      this.scheme_version = stream.readUint32();
      if (this.flags & 0x000001) {
        this.scheme_uri = stream.readString(this.size - this.hdr_size - 8);
      }
    });

    // file:src/parsing/sdp.js
    BoxParser.createBoxCtor("sdp ", function (stream) {
      this.sdptext = stream.readString(this.size - this.hdr_size);
    });

    // file:src/parsing/sdtp.js
    BoxParser.createFullBoxCtor("sdtp", function (stream) {
      var tmp_byte;
      var count = this.size - this.hdr_size;
      this.is_leading = [];
      this.sample_depends_on = [];
      this.sample_is_depended_on = [];
      this.sample_has_redundancy = [];
      for (var i = 0; i < count; i++) {
        tmp_byte = stream.readUint8();
        this.is_leading[i] = tmp_byte >> 6;
        this.sample_depends_on[i] = tmp_byte >> 4 & 0x3;
        this.sample_is_depended_on[i] = tmp_byte >> 2 & 0x3;
        this.sample_has_redundancy[i] = tmp_byte & 0x3;
      }
    });

    // file:src/parsing/senc.js
    // Cannot be fully parsed because Per_Sample_IV_Size needs to be known
    BoxParser.createFullBoxCtor("senc" /*, function(stream) {
                                       this.parseFullHeader(stream);
                                       var sample_count = stream.readUint32();
                                       this.samples = [];
                                       for (var i = 0; i < sample_count; i++) {
                                       var sample = {};
                                       // tenc.default_Per_Sample_IV_Size or seig.Per_Sample_IV_Size
                                       sample.InitializationVector = this.readUint8Array(Per_Sample_IV_Size*8);
                                       if (this.flags & 0x2) {
                                       sample.subsamples = [];
                                       subsample_count = stream.readUint16();
                                       for (var j = 0; j < subsample_count; j++) {
                                       var subsample = {};
                                       subsample.BytesOfClearData = stream.readUint16();
                                       subsample.BytesOfProtectedData = stream.readUint32();
                                       sample.subsamples.push(subsample);
                                       }
                                       }
                                       // TODO
                                       this.samples.push(sample);
                                       }
                                       }*/);
    // file:src/parsing/sgpd.js
    BoxParser.createFullBoxCtor("sgpd", function (stream) {
      this.grouping_type = stream.readString(4);
      Log.debug("BoxParser", "Found Sample Groups of type " + this.grouping_type);
      if (this.version === 1) {
        this.default_length = stream.readUint32();
      } else {
        this.default_length = 0;
      }
      if (this.version >= 2) {
        this.default_group_description_index = stream.readUint32();
      }
      this.entries = [];
      var entry_count = stream.readUint32();
      for (var i = 0; i < entry_count; i++) {
        var entry;
        if (BoxParser[this.grouping_type + "SampleGroupEntry"]) {
          entry = new BoxParser[this.grouping_type + "SampleGroupEntry"](this.grouping_type);
        } else {
          entry = new BoxParser.SampleGroupEntry(this.grouping_type);
        }
        this.entries.push(entry);
        if (this.version === 1) {
          if (this.default_length === 0) {
            entry.description_length = stream.readUint32();
          } else {
            entry.description_length = this.default_length;
          }
        } else {
          entry.description_length = this.default_length;
        }
        if (entry.write === BoxParser.SampleGroupEntry.prototype.write) {
          Log.info("BoxParser", "SampleGroup for type " + this.grouping_type + " writing not yet implemented, keeping unparsed data in memory for later write");
          // storing data
          entry.data = stream.readUint8Array(entry.description_length);
          // rewinding
          stream.position -= entry.description_length;
        }
        entry.parse(stream);
      }
    });

    // file:src/parsing/sidx.js
    BoxParser.createFullBoxCtor("sidx", function (stream) {
      this.reference_ID = stream.readUint32();
      this.timescale = stream.readUint32();
      if (this.version === 0) {
        this.earliest_presentation_time = stream.readUint32();
        this.first_offset = stream.readUint32();
      } else {
        this.earliest_presentation_time = stream.readUint64();
        this.first_offset = stream.readUint64();
      }
      stream.readUint16();
      this.references = [];
      var count = stream.readUint16();
      for (var i = 0; i < count; i++) {
        var ref = {};
        this.references.push(ref);
        var tmp_32 = stream.readUint32();
        ref.reference_type = tmp_32 >> 31 & 0x1;
        ref.referenced_size = tmp_32 & 0x7FFFFFFF;
        ref.subsegment_duration = stream.readUint32();
        tmp_32 = stream.readUint32();
        ref.starts_with_SAP = tmp_32 >> 31 & 0x1;
        ref.SAP_type = tmp_32 >> 28 & 0x7;
        ref.SAP_delta_time = tmp_32 & 0xFFFFFFF;
      }
    });

    // file:src/parsing/singleitemtypereference.js
    BoxParser.SingleItemTypeReferenceBox = function (type, size, hdr_size, start) {
      BoxParser.Box.call(this, type, size);
      this.hdr_size = hdr_size;
      this.start = start;
    };
    BoxParser.SingleItemTypeReferenceBox.prototype = new BoxParser.Box();
    BoxParser.SingleItemTypeReferenceBox.prototype.parse = function (stream) {
      this.from_item_ID = stream.readUint16();
      var count = stream.readUint16();
      this.references = [];
      for (var i = 0; i < count; i++) {
        this.references[i] = {};
        this.references[i].to_item_ID = stream.readUint16();
      }
    };

    // file:src/parsing/singleitemtypereferencelarge.js
    BoxParser.SingleItemTypeReferenceBoxLarge = function (type, size, hdr_size, start) {
      BoxParser.Box.call(this, type, size);
      this.hdr_size = hdr_size;
      this.start = start;
    };
    BoxParser.SingleItemTypeReferenceBoxLarge.prototype = new BoxParser.Box();
    BoxParser.SingleItemTypeReferenceBoxLarge.prototype.parse = function (stream) {
      this.from_item_ID = stream.readUint32();
      var count = stream.readUint16();
      this.references = [];
      for (var i = 0; i < count; i++) {
        this.references[i] = {};
        this.references[i].to_item_ID = stream.readUint32();
      }
    };

    // file:src/parsing/SmDm.js
    BoxParser.createFullBoxCtor("SmDm", function (stream) {
      this.primaryRChromaticity_x = stream.readUint16();
      this.primaryRChromaticity_y = stream.readUint16();
      this.primaryGChromaticity_x = stream.readUint16();
      this.primaryGChromaticity_y = stream.readUint16();
      this.primaryBChromaticity_x = stream.readUint16();
      this.primaryBChromaticity_y = stream.readUint16();
      this.whitePointChromaticity_x = stream.readUint16();
      this.whitePointChromaticity_y = stream.readUint16();
      this.luminanceMax = stream.readUint32();
      this.luminanceMin = stream.readUint32();
    });

    // file:src/parsing/smhd.js
    BoxParser.createFullBoxCtor("smhd", function (stream) {
      this.balance = stream.readUint16();
      stream.readUint16();
    });

    // file:src/parsing/ssix.js
    BoxParser.createFullBoxCtor("ssix", function (stream) {
      this.subsegments = [];
      var subsegment_count = stream.readUint32();
      for (var i = 0; i < subsegment_count; i++) {
        var subsegment = {};
        this.subsegments.push(subsegment);
        subsegment.ranges = [];
        var range_count = stream.readUint32();
        for (var j = 0; j < range_count; j++) {
          var range = {};
          subsegment.ranges.push(range);
          range.level = stream.readUint8();
          range.range_size = stream.readUint24();
        }
      }
    });

    // file:src/parsing/stco.js
    BoxParser.createFullBoxCtor("stco", function (stream) {
      var entry_count;
      entry_count = stream.readUint32();
      this.chunk_offsets = [];
      if (this.version === 0) {
        for (var i = 0; i < entry_count; i++) {
          this.chunk_offsets.push(stream.readUint32());
        }
      }
    });

    // file:src/parsing/stdp.js
    BoxParser.createFullBoxCtor("stdp", function (stream) {
      var count = (this.size - this.hdr_size) / 2;
      this.priority = [];
      for (var i = 0; i < count; i++) {
        this.priority[i] = stream.readUint16();
      }
    });

    // file:src/parsing/sthd.js
    BoxParser.createFullBoxCtor("sthd");

    // file:src/parsing/stri.js
    BoxParser.createFullBoxCtor("stri", function (stream) {
      this.switch_group = stream.readUint16();
      this.alternate_group = stream.readUint16();
      this.sub_track_id = stream.readUint32();
      var count = (this.size - this.hdr_size - 8) / 4;
      this.attribute_list = [];
      for (var i = 0; i < count; i++) {
        this.attribute_list[i] = stream.readUint32();
      }
    });

    // file:src/parsing/stsc.js
    BoxParser.createFullBoxCtor("stsc", function (stream) {
      var entry_count;
      var i;
      entry_count = stream.readUint32();
      this.first_chunk = [];
      this.samples_per_chunk = [];
      this.sample_description_index = [];
      if (this.version === 0) {
        for (i = 0; i < entry_count; i++) {
          this.first_chunk.push(stream.readUint32());
          this.samples_per_chunk.push(stream.readUint32());
          this.sample_description_index.push(stream.readUint32());
        }
      }
    });

    // file:src/parsing/stsd.js
    BoxParser.createFullBoxCtor("stsd", function (stream) {
      var i;
      var ret;
      var entryCount;
      var box;
      this.entries = [];
      entryCount = stream.readUint32();
      for (i = 1; i <= entryCount; i++) {
        ret = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          if (BoxParser[ret.type + "SampleEntry"]) {
            box = new BoxParser[ret.type + "SampleEntry"](ret.size);
            box.hdr_size = ret.hdr_size;
            box.start = ret.start;
          } else {
            Log.warn("BoxParser", "Unknown sample entry type: " + ret.type);
            box = new BoxParser.SampleEntry(ret.type, ret.size, ret.hdr_size, ret.start);
          }
          if (box.write === BoxParser.SampleEntry.prototype.write) {
            Log.info("BoxParser", "SampleEntry " + box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
            box.parseDataAndRewind(stream);
          }
          box.parse(stream);
          this.entries.push(box);
        } else {
          return;
        }
      }
    });

    // file:src/parsing/stsg.js
    BoxParser.createFullBoxCtor("stsg", function (stream) {
      this.grouping_type = stream.readUint32();
      var count = stream.readUint16();
      this.group_description_index = [];
      for (var i = 0; i < count; i++) {
        this.group_description_index[i] = stream.readUint32();
      }
    });

    // file:src/parsing/stsh.js
    BoxParser.createFullBoxCtor("stsh", function (stream) {
      var entry_count;
      var i;
      entry_count = stream.readUint32();
      this.shadowed_sample_numbers = [];
      this.sync_sample_numbers = [];
      if (this.version === 0) {
        for (i = 0; i < entry_count; i++) {
          this.shadowed_sample_numbers.push(stream.readUint32());
          this.sync_sample_numbers.push(stream.readUint32());
        }
      }
    });

    // file:src/parsing/stss.js
    BoxParser.createFullBoxCtor("stss", function (stream) {
      var i;
      var entry_count;
      entry_count = stream.readUint32();
      if (this.version === 0) {
        this.sample_numbers = [];
        for (i = 0; i < entry_count; i++) {
          this.sample_numbers.push(stream.readUint32());
        }
      }
    });

    // file:src/parsing/stsz.js
    BoxParser.createFullBoxCtor("stsz", function (stream) {
      var i;
      this.sample_sizes = [];
      if (this.version === 0) {
        this.sample_size = stream.readUint32();
        this.sample_count = stream.readUint32();
        for (i = 0; i < this.sample_count; i++) {
          if (this.sample_size === 0) {
            this.sample_sizes.push(stream.readUint32());
          } else {
            this.sample_sizes[i] = this.sample_size;
          }
        }
      }
    });

    // file:src/parsing/stts.js
    BoxParser.createFullBoxCtor("stts", function (stream) {
      var entry_count;
      var i;
      var delta;
      entry_count = stream.readUint32();
      this.sample_counts = [];
      this.sample_deltas = [];
      if (this.version === 0) {
        for (i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          delta = stream.readInt32();
          if (delta < 0) {
            Log.warn("BoxParser", "File uses negative stts sample delta, using value 1 instead, sync may be lost!");
            delta = 1;
          }
          this.sample_deltas.push(delta);
        }
      }
    });

    // file:src/parsing/stvi.js
    BoxParser.createFullBoxCtor("stvi", function (stream) {
      var tmp32 = stream.readUint32();
      this.single_view_allowed = tmp32 & 0x3;
      this.stereo_scheme = stream.readUint32();
      var length = stream.readUint32();
      this.stereo_indication_type = stream.readString(length);
      var ret;
      var box;
      this.boxes = [];
      while (stream.getPosition() < this.start + this.size) {
        ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          box = ret.box;
          this.boxes.push(box);
          this[box.type] = box;
        } else {
          return;
        }
      }
    });

    // file:src/parsing/styp.js
    BoxParser.createBoxCtor("styp", function (stream) {
      BoxParser.ftypBox.prototype.parse.call(this, stream);
    });

    // file:src/parsing/stz2.js
    BoxParser.createFullBoxCtor("stz2", function (stream) {
      var i;
      var sample_count;
      this.sample_sizes = [];
      if (this.version === 0) {
        this.reserved = stream.readUint24();
        this.field_size = stream.readUint8();
        sample_count = stream.readUint32();
        if (this.field_size === 4) {
          for (i = 0; i < sample_count; i += 2) {
            var tmp = stream.readUint8();
            this.sample_sizes[i] = tmp >> 4 & 0xF;
            this.sample_sizes[i + 1] = tmp & 0xF;
          }
        } else if (this.field_size === 8) {
          for (i = 0; i < sample_count; i++) {
            this.sample_sizes[i] = stream.readUint8();
          }
        } else if (this.field_size === 16) {
          for (i = 0; i < sample_count; i++) {
            this.sample_sizes[i] = stream.readUint16();
          }
        } else {
          Log.error("BoxParser", "Error in length field in stz2 box");
        }
      }
    });

    // file:src/parsing/subs.js
    BoxParser.createFullBoxCtor("subs", function (stream) {
      var i, j;
      var entry_count;
      var subsample_count;
      entry_count = stream.readUint32();
      this.entries = [];
      for (i = 0; i < entry_count; i++) {
        var sampleInfo = {};
        this.entries[i] = sampleInfo;
        sampleInfo.sample_delta = stream.readUint32();
        sampleInfo.subsamples = [];
        subsample_count = stream.readUint16();
        if (subsample_count > 0) {
          for (j = 0; j < subsample_count; j++) {
            var subsample = {};
            sampleInfo.subsamples.push(subsample);
            if (this.version == 1) {
              subsample.size = stream.readUint32();
            } else {
              subsample.size = stream.readUint16();
            }
            subsample.priority = stream.readUint8();
            subsample.discardable = stream.readUint8();
            subsample.codec_specific_parameters = stream.readUint32();
          }
        }
      }
    });

    // file:src/parsing/tenc.js
    BoxParser.createFullBoxCtor("tenc", function (stream) {
      stream.readUint8(); // reserved
      if (this.version === 0) {
        stream.readUint8();
      } else {
        var tmp = stream.readUint8();
        this.default_crypt_byte_block = tmp >> 4 & 0xF;
        this.default_skip_byte_block = tmp & 0xF;
      }
      this.default_isProtected = stream.readUint8();
      this.default_Per_Sample_IV_Size = stream.readUint8();
      this.default_KID = BoxParser.parseHex16(stream);
      if (this.default_isProtected === 1 && this.default_Per_Sample_IV_Size === 0) {
        this.default_constant_IV_size = stream.readUint8();
        this.default_constant_IV = stream.readUint8Array(this.default_constant_IV_size);
      }
    }); // file:src/parsing/tfdt.js
    BoxParser.createFullBoxCtor("tfdt", function (stream) {
      if (this.version == 1) {
        this.baseMediaDecodeTime = stream.readUint64();
      } else {
        this.baseMediaDecodeTime = stream.readUint32();
      }
    });

    // file:src/parsing/tfhd.js
    BoxParser.createFullBoxCtor("tfhd", function (stream) {
      var readBytes = 0;
      this.track_id = stream.readUint32();
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
        this.base_data_offset = stream.readUint64();
        readBytes += 8;
      } else {
        this.base_data_offset = 0;
      }
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
        this.default_sample_description_index = stream.readUint32();
        readBytes += 4;
      } else {
        this.default_sample_description_index = 0;
      }
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
        this.default_sample_duration = stream.readUint32();
        readBytes += 4;
      } else {
        this.default_sample_duration = 0;
      }
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
        this.default_sample_size = stream.readUint32();
        readBytes += 4;
      } else {
        this.default_sample_size = 0;
      }
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
        this.default_sample_flags = stream.readUint32();
        readBytes += 4;
      } else {
        this.default_sample_flags = 0;
      }
    });

    // file:src/parsing/tfra.js
    BoxParser.createFullBoxCtor("tfra", function (stream) {
      this.track_ID = stream.readUint32();
      stream.readUint24();
      var tmp_byte = stream.readUint8();
      this.length_size_of_traf_num = tmp_byte >> 4 & 0x3;
      this.length_size_of_trun_num = tmp_byte >> 2 & 0x3;
      this.length_size_of_sample_num = tmp_byte & 0x3;
      this.entries = [];
      var number_of_entries = stream.readUint32();
      for (var i = 0; i < number_of_entries; i++) {
        if (this.version === 1) {
          this.time = stream.readUint64();
          this.moof_offset = stream.readUint64();
        } else {
          this.time = stream.readUint32();
          this.moof_offset = stream.readUint32();
        }
        this.traf_number = stream["readUint" + 8 * (this.length_size_of_traf_num + 1)]();
        this.trun_number = stream["readUint" + 8 * (this.length_size_of_trun_num + 1)]();
        this.sample_number = stream["readUint" + 8 * (this.length_size_of_sample_num + 1)]();
      }
    });

    // file:src/parsing/tkhd.js
    BoxParser.createFullBoxCtor("tkhd", function (stream) {
      if (this.version == 1) {
        this.creation_time = stream.readUint64();
        this.modification_time = stream.readUint64();
        this.track_id = stream.readUint32();
        stream.readUint32();
        this.duration = stream.readUint64();
      } else {
        this.creation_time = stream.readUint32();
        this.modification_time = stream.readUint32();
        this.track_id = stream.readUint32();
        stream.readUint32();
        this.duration = stream.readUint32();
      }
      stream.readUint32Array(2);
      this.layer = stream.readInt16();
      this.alternate_group = stream.readInt16();
      this.volume = stream.readInt16() >> 8;
      stream.readUint16();
      this.matrix = stream.readInt32Array(9);
      this.width = stream.readUint32();
      this.height = stream.readUint32();
    });

    // file:src/parsing/tmax.js
    BoxParser.createBoxCtor("tmax", function (stream) {
      this.time = stream.readUint32();
    });

    // file:src/parsing/tmin.js
    BoxParser.createBoxCtor("tmin", function (stream) {
      this.time = stream.readUint32();
    });

    // file:src/parsing/totl.js
    BoxParser.createBoxCtor("totl", function (stream) {
      this.bytessent = stream.readUint32();
    });

    // file:src/parsing/tpay.js
    BoxParser.createBoxCtor("tpay", function (stream) {
      this.bytessent = stream.readUint32();
    });

    // file:src/parsing/tpyl.js
    BoxParser.createBoxCtor("tpyl", function (stream) {
      this.bytessent = stream.readUint64();
    });

    // file:src/parsing/TrackGroup.js
    BoxParser.TrackGroupTypeBox.prototype.parse = function (stream) {
      this.parseFullHeader(stream);
      this.track_group_id = stream.readUint32();
    };

    // file:src/parsing/trackgroups/msrc.js
    BoxParser.createTrackGroupCtor("msrc"); // file:src/parsing/TrakReference.js
    BoxParser.TrackReferenceTypeBox = function (type, size, hdr_size, start) {
      BoxParser.Box.call(this, type, size);
      this.hdr_size = hdr_size;
      this.start = start;
    };
    BoxParser.TrackReferenceTypeBox.prototype = new BoxParser.Box();
    BoxParser.TrackReferenceTypeBox.prototype.parse = function (stream) {
      this.track_ids = stream.readUint32Array((this.size - this.hdr_size) / 4);
    };

    // file:src/parsing/tref.js
    BoxParser.trefBox.prototype.parse = function (stream) {
      var ret;
      var box;
      while (stream.getPosition() < this.start + this.size) {
        ret = BoxParser.parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          box = new BoxParser.TrackReferenceTypeBox(ret.type, ret.size, ret.hdr_size, ret.start);
          if (box.write === BoxParser.Box.prototype.write && box.type !== "mdat") {
            Log.info("BoxParser", "TrackReference " + box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
            box.parseDataAndRewind(stream);
          }
          box.parse(stream);
          this.boxes.push(box);
        } else {
          return;
        }
      }
    };

    // file:src/parsing/trep.js
    BoxParser.createFullBoxCtor("trep", function (stream) {
      this.track_ID = stream.readUint32();
      this.boxes = [];
      while (stream.getPosition() < this.start + this.size) {
        ret = BoxParser.parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
        if (ret.code === BoxParser.OK) {
          box = ret.box;
          this.boxes.push(box);
        } else {
          return;
        }
      }
    });

    // file:src/parsing/trex.js
    BoxParser.createFullBoxCtor("trex", function (stream) {
      this.track_id = stream.readUint32();
      this.default_sample_description_index = stream.readUint32();
      this.default_sample_duration = stream.readUint32();
      this.default_sample_size = stream.readUint32();
      this.default_sample_flags = stream.readUint32();
    });

    // file:src/parsing/trpy.js
    BoxParser.createBoxCtor("trpy", function (stream) {
      this.bytessent = stream.readUint64();
    });

    // file:src/parsing/trun.js
    BoxParser.createFullBoxCtor("trun", function (stream) {
      var readBytes = 0;
      this.sample_count = stream.readUint32();
      readBytes += 4;
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
        this.data_offset = stream.readInt32(); //signed
        readBytes += 4;
      } else {
        this.data_offset = 0;
      }
      if (this.size - this.hdr_size > readBytes && this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
        this.first_sample_flags = stream.readUint32();
        readBytes += 4;
      } else {
        this.first_sample_flags = 0;
      }
      this.sample_duration = [];
      this.sample_size = [];
      this.sample_flags = [];
      this.sample_composition_time_offset = [];
      if (this.size - this.hdr_size > readBytes) {
        for (var i = 0; i < this.sample_count; i++) {
          if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
            this.sample_duration[i] = stream.readUint32();
          }
          if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
            this.sample_size[i] = stream.readUint32();
          }
          if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
            this.sample_flags[i] = stream.readUint32();
          }
          if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
            if (this.version === 0) {
              this.sample_composition_time_offset[i] = stream.readUint32();
            } else {
              this.sample_composition_time_offset[i] = stream.readInt32(); //signed
            }
          }
        }
      }
    });

    // file:src/parsing/tsel.js
    BoxParser.createFullBoxCtor("tsel", function (stream) {
      this.switch_group = stream.readUint32();
      var count = (this.size - this.hdr_size - 4) / 4;
      this.attribute_list = [];
      for (var i = 0; i < count; i++) {
        this.attribute_list[i] = stream.readUint32();
      }
    });

    // file:src/parsing/txtC.js
    BoxParser.createFullBoxCtor("txtC", function (stream) {
      this.config = stream.readCString();
    });

    // file:src/parsing/tyco.js
    BoxParser.createBoxCtor("tyco", function (stream) {
      var count = (this.size - this.hdr_size) / 4;
      this.compatible_brands = [];
      for (var i = 0; i < count; i++) {
        this.compatible_brands[i] = stream.readString(4);
      }
    });

    // file:src/parsing/udes.js
    BoxParser.createFullBoxCtor("udes", function (stream) {
      this.lang = stream.readCString();
      this.name = stream.readCString();
      this.description = stream.readCString();
      this.tags = stream.readCString();
    });

    // file:src/parsing/uncC.js
    BoxParser.createFullBoxCtor("uncC", function (stream) {
      var i;
      this.profile = stream.readUint32();
      if (this.version == 1) ; else if (this.version == 0) {
        this.component_count = stream.readUint32();
        this.component_index = [];
        this.component_bit_depth_minus_one = [];
        this.component_format = [];
        this.component_align_size = [];
        for (i = 0; i < this.component_count; i++) {
          this.component_index.push(stream.readUint16());
          this.component_bit_depth_minus_one.push(stream.readUint8());
          this.component_format.push(stream.readUint8());
          this.component_align_size.push(stream.readUint8());
        }
        this.sampling_type = stream.readUint8();
        this.interleave_type = stream.readUint8();
        this.block_size = stream.readUint8();
        var flags = stream.readUint8();
        this.component_little_endian = flags >> 7 & 0x1;
        this.block_pad_lsb = flags >> 6 & 0x1;
        this.block_little_endian = flags >> 5 & 0x1;
        this.block_reversed = flags >> 4 & 0x1;
        this.pad_unknown = flags >> 3 & 0x1;
        this.pixel_size = stream.readUint32();
        this.row_align_size = stream.readUint32();
        this.tile_align_size = stream.readUint32();
        this.num_tile_cols_minus_one = stream.readUint32();
        this.num_tile_rows_minus_one = stream.readUint32();
      }
    });

    // file:src/parsing/url.js
    BoxParser.createFullBoxCtor("url ", function (stream) {
      if (this.flags !== 0x000001) {
        this.location = stream.readCString();
      }
    });

    // file:src/parsing/urn.js
    BoxParser.createFullBoxCtor("urn ", function (stream) {
      this.name = stream.readCString();
      if (this.size - this.hdr_size - this.name.length - 1 > 0) {
        this.location = stream.readCString();
      }
    });

    // file:src/parsing/uuid/piff/piffLsm.js
    BoxParser.createUUIDBox("a5d40b30e81411ddba2f0800200c9a66", true, false, function (stream) {
      this.LiveServerManifest = stream.readString(this.size - this.hdr_size).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }); // file:src/parsing/uuid/piff/piffPssh.js
    BoxParser.createUUIDBox("d08a4f1810f34a82b6c832d8aba183d3", true, false, function (stream) {
      this.system_id = BoxParser.parseHex16(stream);
      var datasize = stream.readUint32();
      if (datasize > 0) {
        this.data = stream.readUint8Array(datasize);
      }
    });

    // file:src/parsing/uuid/piff/piffSenc.js
    BoxParser.createUUIDBox("a2394f525a9b4f14a2446c427c648df4", true, false /*, function(stream) {
                                                                            if (this.flags & 0x1) {
                                                                            this.AlgorithmID = stream.readUint24();
                                                                            this.IV_size = stream.readUint8();
                                                                            this.KID = BoxParser.parseHex16(stream);
                                                                            }
                                                                            var sample_count = stream.readUint32();
                                                                            this.samples = [];
                                                                            for (var i = 0; i < sample_count; i++) {
                                                                            var sample = {};
                                                                            sample.InitializationVector = this.readUint8Array(this.IV_size*8);
                                                                            if (this.flags & 0x2) {
                                                                            sample.subsamples = [];
                                                                            sample.NumberOfEntries = stream.readUint16();
                                                                            for (var j = 0; j < sample.NumberOfEntries; j++) {
                                                                            var subsample = {};
                                                                            subsample.BytesOfClearData = stream.readUint16();
                                                                            subsample.BytesOfProtectedData = stream.readUint32();
                                                                            sample.subsamples.push(subsample);
                                                                            }
                                                                            }
                                                                            this.samples.push(sample);
                                                                            }
                                                                            }*/);
    // file:src/parsing/uuid/piff/piffTenc.js
    BoxParser.createUUIDBox("8974dbce7be74c5184f97148f9882554", true, false, function (stream) {
      this.default_AlgorithmID = stream.readUint24();
      this.default_IV_size = stream.readUint8();
      this.default_KID = BoxParser.parseHex16(stream);
    }); // file:src/parsing/uuid/piff/piffTfrf.js
    BoxParser.createUUIDBox("d4807ef2ca3946958e5426cb9e46a79f", true, false, function (stream) {
      this.fragment_count = stream.readUint8();
      this.entries = [];
      for (var i = 0; i < this.fragment_count; i++) {
        var entry = {};
        var absolute_time = 0;
        var absolute_duration = 0;
        if (this.version === 1) {
          absolute_time = stream.readUint64();
          absolute_duration = stream.readUint64();
        } else {
          absolute_time = stream.readUint32();
          absolute_duration = stream.readUint32();
        }
        entry.absolute_time = absolute_time;
        entry.absolute_duration = absolute_duration;
        this.entries.push(entry);
      }
    }); // file:src/parsing/uuid/piff/piffTfxd.js
    BoxParser.createUUIDBox("6d1d9b0542d544e680e2141daff757b2", true, false, function (stream) {
      if (this.version === 1) {
        this.absolute_time = stream.readUint64();
        this.duration = stream.readUint64();
      } else {
        this.absolute_time = stream.readUint32();
        this.duration = stream.readUint32();
      }
    }); // file:src/parsing/vmhd.js
    BoxParser.createFullBoxCtor("vmhd", function (stream) {
      this.graphicsmode = stream.readUint16();
      this.opcolor = stream.readUint16Array(3);
    });

    // file:src/parsing/vpcC.js
    BoxParser.createFullBoxCtor("vpcC", function (stream) {
      var tmp;
      if (this.version === 1) {
        this.profile = stream.readUint8();
        this.level = stream.readUint8();
        tmp = stream.readUint8();
        this.bitDepth = tmp >> 4;
        this.chromaSubsampling = tmp >> 1 & 0x7;
        this.videoFullRangeFlag = tmp & 0x1;
        this.colourPrimaries = stream.readUint8();
        this.transferCharacteristics = stream.readUint8();
        this.matrixCoefficients = stream.readUint8();
        this.codecIntializationDataSize = stream.readUint16();
        this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
      } else {
        this.profile = stream.readUint8();
        this.level = stream.readUint8();
        tmp = stream.readUint8();
        this.bitDepth = tmp >> 4 & 0xF;
        this.colorSpace = tmp & 0xF;
        tmp = stream.readUint8();
        this.chromaSubsampling = tmp >> 4 & 0xF;
        this.transferFunction = tmp >> 1 & 0x7;
        this.videoFullRangeFlag = tmp & 0x1;
        this.codecIntializationDataSize = stream.readUint16();
        this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
      }
    }); // file:src/parsing/vttC.js
    BoxParser.createBoxCtor("vttC", function (stream) {
      this.text = stream.readString(this.size - this.hdr_size);
    });

    // file:src/parsing/vvcC.js
    BoxParser.createFullBoxCtor("vvcC", function (stream) {
      var i, j;

      // helper object to simplify extracting individual bits
      var bitReader = {
        held_bits: undefined,
        num_held_bits: 0,
        stream_read_1_bytes: function (strm) {
          this.held_bits = strm.readUint8();
          this.num_held_bits = 1 * 8;
        },
        stream_read_2_bytes: function (strm) {
          this.held_bits = strm.readUint16();
          this.num_held_bits = 2 * 8;
        },
        extract_bits: function (num_bits) {
          var ret = this.held_bits >> this.num_held_bits - num_bits & (1 << num_bits) - 1;
          this.num_held_bits -= num_bits;
          return ret;
        }
      };

      // VvcDecoderConfigurationRecord
      bitReader.stream_read_1_bytes(stream);
      bitReader.extract_bits(5); // reserved
      this.lengthSizeMinusOne = bitReader.extract_bits(2);
      this.ptl_present_flag = bitReader.extract_bits(1);
      if (this.ptl_present_flag) {
        bitReader.stream_read_2_bytes(stream);
        this.ols_idx = bitReader.extract_bits(9);
        this.num_sublayers = bitReader.extract_bits(3);
        this.constant_frame_rate = bitReader.extract_bits(2);
        this.chroma_format_idc = bitReader.extract_bits(2);
        bitReader.stream_read_1_bytes(stream);
        this.bit_depth_minus8 = bitReader.extract_bits(3);
        bitReader.extract_bits(5); // reserved

        // VvcPTLRecord
        {
          bitReader.stream_read_2_bytes(stream);
          bitReader.extract_bits(2); // reserved
          this.num_bytes_constraint_info = bitReader.extract_bits(6);
          this.general_profile_idc = bitReader.extract_bits(7);
          this.general_tier_flag = bitReader.extract_bits(1);
          this.general_level_idc = stream.readUint8();
          bitReader.stream_read_1_bytes(stream);
          this.ptl_frame_only_constraint_flag = bitReader.extract_bits(1);
          this.ptl_multilayer_enabled_flag = bitReader.extract_bits(1);
          this.general_constraint_info = new Uint8Array(this.num_bytes_constraint_info);
          if (this.num_bytes_constraint_info) {
            for (i = 0; i < this.num_bytes_constraint_info - 1; i++) {
              var cnstr1 = bitReader.extract_bits(6);
              bitReader.stream_read_1_bytes(stream);
              var cnstr2 = bitReader.extract_bits(2);
              this.general_constraint_info[i] = cnstr1 << 2 | cnstr2;
            }
            this.general_constraint_info[this.num_bytes_constraint_info - 1] = bitReader.extract_bits(6);
          } else {
            //forbidden in spec!
            bitReader.extract_bits(6);
          }
          if (this.num_sublayers > 1) {
            bitReader.stream_read_1_bytes(stream);
            this.ptl_sublayer_present_mask = 0;
            for (j = this.num_sublayers - 2; j >= 0; --j) {
              var val = bitReader.extract_bits(1);
              this.ptl_sublayer_present_mask |= val << j;
            }
            for (j = this.num_sublayers; j <= 8 && this.num_sublayers > 1; ++j) {
              bitReader.extract_bits(1); // ptl_reserved_zero_bit
            }

            this.sublayer_level_idc = [];
            for (j = this.num_sublayers - 2; j >= 0; --j) {
              if (this.ptl_sublayer_present_mask & 1 << j) {
                this.sublayer_level_idc[j] = stream.readUint8();
              }
            }
          }
          this.ptl_num_sub_profiles = stream.readUint8();
          this.general_sub_profile_idc = [];
          if (this.ptl_num_sub_profiles) {
            for (i = 0; i < this.ptl_num_sub_profiles; i++) {
              this.general_sub_profile_idc.push(stream.readUint32());
            }
          }
        } // end VvcPTLRecord

        this.max_picture_width = stream.readUint16();
        this.max_picture_height = stream.readUint16();
        this.avg_frame_rate = stream.readUint16();
      }
      var VVC_NALU_OPI = 12;
      var VVC_NALU_DEC_PARAM = 13;
      this.nalu_arrays = [];
      var num_of_arrays = stream.readUint8();
      for (i = 0; i < num_of_arrays; i++) {
        var nalu_array = [];
        this.nalu_arrays.push(nalu_array);
        bitReader.stream_read_1_bytes(stream);
        nalu_array.completeness = bitReader.extract_bits(1);
        bitReader.extract_bits(2); // reserved
        nalu_array.nalu_type = bitReader.extract_bits(5);
        var numNalus = 1;
        if (nalu_array.nalu_type != VVC_NALU_DEC_PARAM && nalu_array.nalu_type != VVC_NALU_OPI) {
          numNalus = stream.readUint16();
        }
        for (j = 0; j < numNalus; j++) {
          var len = stream.readUint16();
          nalu_array.push({
            data: stream.readUint8Array(len),
            length: len
          });
        }
      }
    });
    // file:src/parsing/vvnC.js
    BoxParser.createFullBoxCtor("vvnC", function (stream) {
      // VvcNALUConfigBox
      var tmp = strm.readUint8();
      this.lengthSizeMinusOne = tmp & 0x3;
    });
    // file:src/box-codecs.js
    BoxParser.SampleEntry.prototype.isVideo = function () {
      return false;
    };
    BoxParser.SampleEntry.prototype.isAudio = function () {
      return false;
    };
    BoxParser.SampleEntry.prototype.isSubtitle = function () {
      return false;
    };
    BoxParser.SampleEntry.prototype.isMetadata = function () {
      return false;
    };
    BoxParser.SampleEntry.prototype.isHint = function () {
      return false;
    };
    BoxParser.SampleEntry.prototype.getCodec = function () {
      return this.type.replace('.', '');
    };
    BoxParser.SampleEntry.prototype.getWidth = function () {
      return "";
    };
    BoxParser.SampleEntry.prototype.getHeight = function () {
      return "";
    };
    BoxParser.SampleEntry.prototype.getChannelCount = function () {
      return "";
    };
    BoxParser.SampleEntry.prototype.getSampleRate = function () {
      return "";
    };
    BoxParser.SampleEntry.prototype.getSampleSize = function () {
      return "";
    };
    BoxParser.VisualSampleEntry.prototype.isVideo = function () {
      return true;
    };
    BoxParser.VisualSampleEntry.prototype.getWidth = function () {
      return this.width;
    };
    BoxParser.VisualSampleEntry.prototype.getHeight = function () {
      return this.height;
    };
    BoxParser.AudioSampleEntry.prototype.isAudio = function () {
      return true;
    };
    BoxParser.AudioSampleEntry.prototype.getChannelCount = function () {
      return this.channel_count;
    };
    BoxParser.AudioSampleEntry.prototype.getSampleRate = function () {
      return this.samplerate;
    };
    BoxParser.AudioSampleEntry.prototype.getSampleSize = function () {
      return this.samplesize;
    };
    BoxParser.SubtitleSampleEntry.prototype.isSubtitle = function () {
      return true;
    };
    BoxParser.MetadataSampleEntry.prototype.isMetadata = function () {
      return true;
    };
    BoxParser.decimalToHex = function (d, padding) {
      var hex = Number(d).toString(16);
      padding = typeof padding === "undefined" || padding === null ? padding = 2 : padding;
      while (hex.length < padding) {
        hex = "0" + hex;
      }
      return hex;
    };
    BoxParser.avc1SampleEntry.prototype.getCodec = BoxParser.avc2SampleEntry.prototype.getCodec = BoxParser.avc3SampleEntry.prototype.getCodec = BoxParser.avc4SampleEntry.prototype.getCodec = function () {
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      if (this.avcC) {
        return baseCodec + "." + BoxParser.decimalToHex(this.avcC.AVCProfileIndication) + "" + BoxParser.decimalToHex(this.avcC.profile_compatibility) + "" + BoxParser.decimalToHex(this.avcC.AVCLevelIndication);
      } else {
        return baseCodec;
      }
    };
    BoxParser.hev1SampleEntry.prototype.getCodec = BoxParser.hvc1SampleEntry.prototype.getCodec = function () {
      var i;
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      if (this.hvcC) {
        baseCodec += '.';
        switch (this.hvcC.general_profile_space) {
          case 0:
            baseCodec += '';
            break;
          case 1:
            baseCodec += 'A';
            break;
          case 2:
            baseCodec += 'B';
            break;
          case 3:
            baseCodec += 'C';
            break;
        }
        baseCodec += this.hvcC.general_profile_idc;
        baseCodec += '.';
        var val = this.hvcC.general_profile_compatibility;
        var reversed = 0;
        for (i = 0; i < 32; i++) {
          reversed |= val & 1;
          if (i == 31) break;
          reversed <<= 1;
          val >>= 1;
        }
        baseCodec += BoxParser.decimalToHex(reversed, 0);
        baseCodec += '.';
        if (this.hvcC.general_tier_flag === 0) {
          baseCodec += 'L';
        } else {
          baseCodec += 'H';
        }
        baseCodec += this.hvcC.general_level_idc;
        var hasByte = false;
        var constraint_string = "";
        for (i = 5; i >= 0; i--) {
          if (this.hvcC.general_constraint_indicator[i] || hasByte) {
            constraint_string = "." + BoxParser.decimalToHex(this.hvcC.general_constraint_indicator[i], 0) + constraint_string;
            hasByte = true;
          }
        }
        baseCodec += constraint_string;
      }
      return baseCodec;
    };
    BoxParser.vvc1SampleEntry.prototype.getCodec = BoxParser.vvi1SampleEntry.prototype.getCodec = function () {
      var i;
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      if (this.vvcC) {
        baseCodec += '.' + this.vvcC.general_profile_idc;
        if (this.vvcC.general_tier_flag) {
          baseCodec += '.H';
        } else {
          baseCodec += '.L';
        }
        baseCodec += this.vvcC.general_level_idc;
        var constraint_string = "";
        if (this.vvcC.general_constraint_info) {
          var bytes = [];
          var byte = 0;
          byte |= this.vvcC.ptl_frame_only_constraint << 7;
          byte |= this.vvcC.ptl_multilayer_enabled << 6;
          var last_nonzero;
          for (i = 0; i < this.vvcC.general_constraint_info.length; ++i) {
            byte |= this.vvcC.general_constraint_info[i] >> 2 & 0x3f;
            bytes.push(byte);
            if (byte) {
              last_nonzero = i;
            }
            byte = this.vvcC.general_constraint_info[i] >> 2 & 0x03;
          }
          if (last_nonzero === undefined) {
            constraint_string = ".CA";
          } else {
            constraint_string = ".C";
            var base32_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            var held_bits = 0;
            var num_held_bits = 0;
            for (i = 0; i <= last_nonzero; ++i) {
              held_bits = held_bits << 8 | bytes[i];
              num_held_bits += 8;
              while (num_held_bits >= 5) {
                var val = held_bits >> num_held_bits - 5 & 0x1f;
                constraint_string += base32_chars[val];
                num_held_bits -= 5;
                held_bits &= (1 << num_held_bits) - 1;
              }
            }
            if (num_held_bits) {
              held_bits <<= 5 - num_held_bits; // right-pad with zeros to 5 bits (is this correct?)
              constraint_string += base32_chars[held_bits & 0x1f];
            }
          }
        }
        baseCodec += constraint_string;
      }
      return baseCodec;
    };
    BoxParser.mp4aSampleEntry.prototype.getCodec = function () {
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      if (this.esds && this.esds.esd) {
        var oti = this.esds.esd.getOTI();
        var dsi = this.esds.esd.getAudioConfig();
        return baseCodec + "." + BoxParser.decimalToHex(oti) + (dsi ? "." + dsi : "");
      } else {
        return baseCodec;
      }
    };
    BoxParser.stxtSampleEntry.prototype.getCodec = function () {
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      if (this.mime_format) {
        return baseCodec + "." + this.mime_format;
      } else {
        return baseCodec;
      }
    };
    BoxParser.vp08SampleEntry.prototype.getCodec = BoxParser.vp09SampleEntry.prototype.getCodec = function () {
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      var level = this.vpcC.level;
      if (level == 0) {
        level = "00";
      }
      var bitDepth = this.vpcC.bitDepth;
      if (bitDepth == 8) {
        bitDepth = "08";
      }
      return baseCodec + ".0" + this.vpcC.profile + "." + level + "." + bitDepth;
    };
    BoxParser.av01SampleEntry.prototype.getCodec = function () {
      var baseCodec = BoxParser.SampleEntry.prototype.getCodec.call(this);
      var level = this.av1C.seq_level_idx_0;
      if (level < 10) {
        level = "0" + level;
      }
      var bitdepth;
      if (this.av1C.seq_profile === 2 && this.av1C.high_bitdepth === 1) {
        bitdepth = this.av1C.twelve_bit === 1 ? "12" : "10";
      } else if (this.av1C.seq_profile <= 2) {
        bitdepth = this.av1C.high_bitdepth === 1 ? "10" : "08";
      }
      // TODO need to parse the SH to find color config
      return baseCodec + "." + this.av1C.seq_profile + "." + level + (this.av1C.seq_tier_0 ? "H" : "M") + "." + bitdepth; //+"."+this.av1C.monochrome+"."+this.av1C.chroma_subsampling_x+""+this.av1C.chroma_subsampling_y+""+this.av1C.chroma_sample_position;
    };
    // file:src/box-write.js
    /* 
     * Copyright (c) Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    BoxParser.Box.prototype.writeHeader = function (stream, msg) {
      this.size += 8;
      if (this.size > MAX_SIZE) {
        this.size += 8;
      }
      if (this.type === "uuid") {
        this.size += 16;
      }
      Log.debug("BoxWriter", "Writing box " + this.type + " of size: " + this.size + " at position " + stream.getPosition() + (msg || ""));
      if (this.size > MAX_SIZE) {
        stream.writeUint32(1);
      } else {
        this.sizePosition = stream.getPosition();
        stream.writeUint32(this.size);
      }
      stream.writeString(this.type, null, 4);
      if (this.type === "uuid") {
        stream.writeUint8Array(this.uuid);
      }
      if (this.size > MAX_SIZE) {
        stream.writeUint64(this.size);
      }
    };
    BoxParser.FullBox.prototype.writeHeader = function (stream) {
      this.size += 4;
      BoxParser.Box.prototype.writeHeader.call(this, stream, " v=" + this.version + " f=" + this.flags);
      stream.writeUint8(this.version);
      stream.writeUint24(this.flags);
    };
    BoxParser.Box.prototype.write = function (stream) {
      if (this.type === "mdat") {
        /* TODO: fix this */
        if (this.data) {
          this.size = this.data.length;
          this.writeHeader(stream);
          stream.writeUint8Array(this.data);
        }
      } else {
        this.size = this.data ? this.data.length : 0;
        this.writeHeader(stream);
        if (this.data) {
          stream.writeUint8Array(this.data);
        }
      }
    };
    BoxParser.ContainerBox.prototype.write = function (stream) {
      this.size = 0;
      this.writeHeader(stream);
      for (var i = 0; i < this.boxes.length; i++) {
        if (this.boxes[i]) {
          this.boxes[i].write(stream);
          this.size += this.boxes[i].size;
        }
      }
      /* adjusting the size, now that all sub-boxes are known */
      Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
      stream.adjustUint32(this.sizePosition, this.size);
    };
    BoxParser.TrackReferenceTypeBox.prototype.write = function (stream) {
      this.size = this.track_ids.length * 4;
      this.writeHeader(stream);
      stream.writeUint32Array(this.track_ids);
    };

    // file:src/writing/avcC.js
    BoxParser.avcCBox.prototype.write = function (stream) {
      var i;
      this.size = 7;
      for (i = 0; i < this.SPS.length; i++) {
        this.size += 2 + this.SPS[i].length;
      }
      for (i = 0; i < this.PPS.length; i++) {
        this.size += 2 + this.PPS[i].length;
      }
      if (this.ext) {
        this.size += this.ext.length;
      }
      this.writeHeader(stream);
      stream.writeUint8(this.configurationVersion);
      stream.writeUint8(this.AVCProfileIndication);
      stream.writeUint8(this.profile_compatibility);
      stream.writeUint8(this.AVCLevelIndication);
      stream.writeUint8(this.lengthSizeMinusOne + (63 << 2));
      stream.writeUint8(this.SPS.length + (7 << 5));
      for (i = 0; i < this.SPS.length; i++) {
        stream.writeUint16(this.SPS[i].length);
        stream.writeUint8Array(this.SPS[i].nalu);
      }
      stream.writeUint8(this.PPS.length);
      for (i = 0; i < this.PPS.length; i++) {
        stream.writeUint16(this.PPS[i].length);
        stream.writeUint8Array(this.PPS[i].nalu);
      }
      if (this.ext) {
        stream.writeUint8Array(this.ext);
      }
    };

    // file:src/writing/co64.js
    BoxParser.co64Box.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 8 * this.chunk_offsets.length;
      this.writeHeader(stream);
      stream.writeUint32(this.chunk_offsets.length);
      for (i = 0; i < this.chunk_offsets.length; i++) {
        stream.writeUint64(this.chunk_offsets[i]);
      }
    };

    // file:src/writing/cslg.js
    BoxParser.cslgBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 * 5;
      this.writeHeader(stream);
      stream.writeInt32(this.compositionToDTSShift);
      stream.writeInt32(this.leastDecodeToDisplayDelta);
      stream.writeInt32(this.greatestDecodeToDisplayDelta);
      stream.writeInt32(this.compositionStartTime);
      stream.writeInt32(this.compositionEndTime);
    };

    // file:src/writing/ctts.js
    BoxParser.cttsBox.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 8 * this.sample_counts.length;
      this.writeHeader(stream);
      stream.writeUint32(this.sample_counts.length);
      for (i = 0; i < this.sample_counts.length; i++) {
        stream.writeUint32(this.sample_counts[i]);
        if (this.version === 1) {
          stream.writeInt32(this.sample_offsets[i]); /* signed */
        } else {
          stream.writeUint32(this.sample_offsets[i]); /* unsigned */
        }
      }
    };

    // file:src/writing/dref.js
    BoxParser.drefBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4; //
      this.writeHeader(stream);
      stream.writeUint32(this.entries.length);
      for (var i = 0; i < this.entries.length; i++) {
        this.entries[i].write(stream);
        this.size += this.entries[i].size;
      }
      /* adjusting the size, now that all sub-boxes are known */
      Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
      stream.adjustUint32(this.sizePosition, this.size);
    };

    // file:src/writing/elng.js
    BoxParser.elngBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = this.extended_language.length;
      this.writeHeader(stream);
      stream.writeString(this.extended_language);
    };

    // file:src/writing/elst.js
    BoxParser.elstBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 12 * this.entries.length;
      this.writeHeader(stream);
      stream.writeUint32(this.entries.length);
      for (var i = 0; i < this.entries.length; i++) {
        var entry = this.entries[i];
        stream.writeUint32(entry.segment_duration);
        stream.writeInt32(entry.media_time);
        stream.writeInt16(entry.media_rate_integer);
        stream.writeInt16(entry.media_rate_fraction);
      }
    };

    // file:src/writing/emsg.js
    BoxParser.emsgBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 * 4 + this.message_data.length + (this.scheme_id_uri.length + 1) + (this.value.length + 1);
      this.writeHeader(stream);
      stream.writeCString(this.scheme_id_uri);
      stream.writeCString(this.value);
      stream.writeUint32(this.timescale);
      stream.writeUint32(this.presentation_time_delta);
      stream.writeUint32(this.event_duration);
      stream.writeUint32(this.id);
      stream.writeUint8Array(this.message_data);
    };

    // file:src/writing/ftyp.js
    BoxParser.ftypBox.prototype.write = function (stream) {
      this.size = 8 + 4 * this.compatible_brands.length;
      this.writeHeader(stream);
      stream.writeString(this.major_brand, null, 4);
      stream.writeUint32(this.minor_version);
      for (var i = 0; i < this.compatible_brands.length; i++) {
        stream.writeString(this.compatible_brands[i], null, 4);
      }
    };

    // file:src/writing/hdlr.js
    BoxParser.hdlrBox.prototype.write = function (stream) {
      this.size = 5 * 4 + this.name.length + 1;
      this.version = 0;
      this.flags = 0;
      this.writeHeader(stream);
      stream.writeUint32(0);
      stream.writeString(this.handler, null, 4);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeCString(this.name);
    };

    // file:src/writing/hvcC.js
    BoxParser.hvcCBox.prototype.write = function (stream) {
      var i, j;
      this.size = 23;
      for (i = 0; i < this.nalu_arrays.length; i++) {
        this.size += 3;
        for (j = 0; j < this.nalu_arrays[i].length; j++) {
          this.size += 2 + this.nalu_arrays[i][j].data.length;
        }
      }
      this.writeHeader(stream);
      stream.writeUint8(this.configurationVersion);
      stream.writeUint8(this.general_profile_space << 6 + this.general_tier_flag << 5 + this.general_profile_idc);
      stream.writeUint32(this.general_profile_compatibility);
      stream.writeUint8Array(this.general_constraint_indicator);
      stream.writeUint8(this.general_level_idc);
      stream.writeUint16(this.min_spatial_segmentation_idc + (15 << 24));
      stream.writeUint8(this.parallelismType + (63 << 2));
      stream.writeUint8(this.chroma_format_idc + (63 << 2));
      stream.writeUint8(this.bit_depth_luma_minus8 + (31 << 3));
      stream.writeUint8(this.bit_depth_chroma_minus8 + (31 << 3));
      stream.writeUint16(this.avgFrameRate);
      stream.writeUint8((this.constantFrameRate << 6) + (this.numTemporalLayers << 3) + (this.temporalIdNested << 2) + this.lengthSizeMinusOne);
      stream.writeUint8(this.nalu_arrays.length);
      for (i = 0; i < this.nalu_arrays.length; i++) {
        // bit(1) array_completeness + bit(1) reserved = 0 + bit(6) nal_unit_type
        stream.writeUint8((this.nalu_arrays[i].completeness << 7) + this.nalu_arrays[i].nalu_type);
        stream.writeUint16(this.nalu_arrays[i].length);
        for (j = 0; j < this.nalu_arrays[i].length; j++) {
          stream.writeUint16(this.nalu_arrays[i][j].data.length);
          stream.writeUint8Array(this.nalu_arrays[i][j].data);
        }
      }
    };
    // file:src/writing/kind.js
    BoxParser.kindBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = this.schemeURI.length + 1 + (this.value.length + 1);
      this.writeHeader(stream);
      stream.writeCString(this.schemeURI);
      stream.writeCString(this.value);
    };

    // file:src/writing/mdhd.js
    BoxParser.mdhdBox.prototype.write = function (stream) {
      this.size = 4 * 4 + 2 * 2;
      this.flags = 0;
      this.version = 0;
      this.writeHeader(stream);
      stream.writeUint32(this.creation_time);
      stream.writeUint32(this.modification_time);
      stream.writeUint32(this.timescale);
      stream.writeUint32(this.duration);
      stream.writeUint16(this.language);
      stream.writeUint16(0);
    };

    // file:src/writing/mehd.js
    BoxParser.mehdBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4;
      this.writeHeader(stream);
      stream.writeUint32(this.fragment_duration);
    };

    // file:src/writing/mfhd.js
    BoxParser.mfhdBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4;
      this.writeHeader(stream);
      stream.writeUint32(this.sequence_number);
    };

    // file:src/writing/mvhd.js
    BoxParser.mvhdBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 23 * 4 + 2 * 2;
      this.writeHeader(stream);
      stream.writeUint32(this.creation_time);
      stream.writeUint32(this.modification_time);
      stream.writeUint32(this.timescale);
      stream.writeUint32(this.duration);
      stream.writeUint32(this.rate);
      stream.writeUint16(this.volume << 8);
      stream.writeUint16(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32Array(this.matrix);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(this.next_track_id);
    };

    // file:src/writing/sampleentry.js
    BoxParser.SampleEntry.prototype.writeHeader = function (stream) {
      this.size = 8;
      BoxParser.Box.prototype.writeHeader.call(this, stream);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint8(0);
      stream.writeUint16(this.data_reference_index);
    };
    BoxParser.SampleEntry.prototype.writeFooter = function (stream) {
      for (var i = 0; i < this.boxes.length; i++) {
        this.boxes[i].write(stream);
        this.size += this.boxes[i].size;
      }
      Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
      stream.adjustUint32(this.sizePosition, this.size);
    };
    BoxParser.SampleEntry.prototype.write = function (stream) {
      this.writeHeader(stream);
      stream.writeUint8Array(this.data);
      this.size += this.data.length;
      Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
      stream.adjustUint32(this.sizePosition, this.size);
    };
    BoxParser.VisualSampleEntry.prototype.write = function (stream) {
      this.writeHeader(stream);
      this.size += 2 * 7 + 6 * 4 + 32;
      stream.writeUint16(0);
      stream.writeUint16(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint16(this.width);
      stream.writeUint16(this.height);
      stream.writeUint32(this.horizresolution);
      stream.writeUint32(this.vertresolution);
      stream.writeUint32(0);
      stream.writeUint16(this.frame_count);
      stream.writeUint8(Math.min(31, this.compressorname.length));
      stream.writeString(this.compressorname, null, 31);
      stream.writeUint16(this.depth);
      stream.writeInt16(-1);
      this.writeFooter(stream);
    };
    BoxParser.AudioSampleEntry.prototype.write = function (stream) {
      this.writeHeader(stream);
      this.size += 2 * 4 + 3 * 4;
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeUint16(this.channel_count);
      stream.writeUint16(this.samplesize);
      stream.writeUint16(0);
      stream.writeUint16(0);
      stream.writeUint32(this.samplerate << 16);
      this.writeFooter(stream);
    };
    BoxParser.stppSampleEntry.prototype.write = function (stream) {
      this.writeHeader(stream);
      this.size += this.namespace.length + 1 + this.schema_location.length + 1 + this.auxiliary_mime_types.length + 1;
      stream.writeCString(this.namespace);
      stream.writeCString(this.schema_location);
      stream.writeCString(this.auxiliary_mime_types);
      this.writeFooter(stream);
    };

    // file:src/writing/samplegroups/samplegroup.js
    BoxParser.SampleGroupEntry.prototype.write = function (stream) {
      stream.writeUint8Array(this.data);
    };

    // file:src/writing/sbgp.js
    BoxParser.sbgpBox.prototype.write = function (stream) {
      this.version = 1;
      this.flags = 0;
      this.size = 12 + 8 * this.entries.length;
      this.writeHeader(stream);
      stream.writeString(this.grouping_type, null, 4);
      stream.writeUint32(this.grouping_type_parameter);
      stream.writeUint32(this.entries.length);
      for (var i = 0; i < this.entries.length; i++) {
        var entry = this.entries[i];
        stream.writeInt32(entry.sample_count);
        stream.writeInt32(entry.group_description_index);
      }
    };

    // file:src/writing/sgpd.js
    BoxParser.sgpdBox.prototype.write = function (stream) {
      var i;
      var entry;
      // leave version as read
      // this.version;
      this.flags = 0;
      this.size = 12;
      for (i = 0; i < this.entries.length; i++) {
        entry = this.entries[i];
        if (this.version === 1) {
          if (this.default_length === 0) {
            this.size += 4;
          }
          this.size += entry.data.length;
        }
      }
      this.writeHeader(stream);
      stream.writeString(this.grouping_type, null, 4);
      if (this.version === 1) {
        stream.writeUint32(this.default_length);
      }
      if (this.version >= 2) {
        stream.writeUint32(this.default_sample_description_index);
      }
      stream.writeUint32(this.entries.length);
      for (i = 0; i < this.entries.length; i++) {
        entry = this.entries[i];
        if (this.version === 1) {
          if (this.default_length === 0) {
            stream.writeUint32(entry.description_length);
          }
        }
        entry.write(stream);
      }
    };

    // file:src/writing/sidx.js
    BoxParser.sidxBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 * 4 + 2 + 2 + 12 * this.references.length;
      this.writeHeader(stream);
      stream.writeUint32(this.reference_ID);
      stream.writeUint32(this.timescale);
      stream.writeUint32(this.earliest_presentation_time);
      stream.writeUint32(this.first_offset);
      stream.writeUint16(0);
      stream.writeUint16(this.references.length);
      for (var i = 0; i < this.references.length; i++) {
        var ref = this.references[i];
        stream.writeUint32(ref.reference_type << 31 | ref.referenced_size);
        stream.writeUint32(ref.subsegment_duration);
        stream.writeUint32(ref.starts_with_SAP << 31 | ref.SAP_type << 28 | ref.SAP_delta_time);
      }
    };

    // file:src/writing/smhd.js
    BoxParser.smhdBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 1;
      this.size = 4;
      this.writeHeader(stream);
      stream.writeUint16(this.balance);
      stream.writeUint16(0);
    };
    // file:src/writing/stco.js
    BoxParser.stcoBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 4 * this.chunk_offsets.length;
      this.writeHeader(stream);
      stream.writeUint32(this.chunk_offsets.length);
      stream.writeUint32Array(this.chunk_offsets);
    };

    // file:src/writing/stsc.js
    BoxParser.stscBox.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 12 * this.first_chunk.length;
      this.writeHeader(stream);
      stream.writeUint32(this.first_chunk.length);
      for (i = 0; i < this.first_chunk.length; i++) {
        stream.writeUint32(this.first_chunk[i]);
        stream.writeUint32(this.samples_per_chunk[i]);
        stream.writeUint32(this.sample_description_index[i]);
      }
    };

    // file:src/writing/stsd.js
    BoxParser.stsdBox.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 0;
      this.writeHeader(stream);
      stream.writeUint32(this.entries.length);
      this.size += 4;
      for (i = 0; i < this.entries.length; i++) {
        this.entries[i].write(stream);
        this.size += this.entries[i].size;
      }
      /* adjusting the size, now that all sub-boxes are known */
      Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
      stream.adjustUint32(this.sizePosition, this.size);
    };

    // file:src/writing/stsh.js
    BoxParser.stshBox.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 8 * this.shadowed_sample_numbers.length;
      this.writeHeader(stream);
      stream.writeUint32(this.shadowed_sample_numbers.length);
      for (i = 0; i < this.shadowed_sample_numbers.length; i++) {
        stream.writeUint32(this.shadowed_sample_numbers[i]);
        stream.writeUint32(this.sync_sample_numbers[i]);
      }
    };

    // file:src/writing/stss.js
    BoxParser.stssBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 4 * this.sample_numbers.length;
      this.writeHeader(stream);
      stream.writeUint32(this.sample_numbers.length);
      stream.writeUint32Array(this.sample_numbers);
    };

    // file:src/writing/stsz.js
    BoxParser.stszBox.prototype.write = function (stream) {
      var i;
      var constant = true;
      this.version = 0;
      this.flags = 0;
      if (this.sample_sizes.length > 0) {
        i = 0;
        while (i + 1 < this.sample_sizes.length) {
          if (this.sample_sizes[i + 1] !== this.sample_sizes[0]) {
            constant = false;
            break;
          } else {
            i++;
          }
        }
      } else {
        constant = false;
      }
      this.size = 8;
      if (!constant) {
        this.size += 4 * this.sample_sizes.length;
      }
      this.writeHeader(stream);
      if (!constant) {
        stream.writeUint32(0);
      } else {
        stream.writeUint32(this.sample_sizes[0]);
      }
      stream.writeUint32(this.sample_sizes.length);
      if (!constant) {
        stream.writeUint32Array(this.sample_sizes);
      }
    };

    // file:src/writing/stts.js
    BoxParser.sttsBox.prototype.write = function (stream) {
      var i;
      this.version = 0;
      this.flags = 0;
      this.size = 4 + 8 * this.sample_counts.length;
      this.writeHeader(stream);
      stream.writeUint32(this.sample_counts.length);
      for (i = 0; i < this.sample_counts.length; i++) {
        stream.writeUint32(this.sample_counts[i]);
        stream.writeUint32(this.sample_deltas[i]);
      }
    };

    // file:src/writing/tfdt.js
    BoxParser.tfdtBox.prototype.write = function (stream) {
      var UINT32_MAX = Math.pow(2, 32) - 1;
      // use version 1 if baseMediaDecodeTime does not fit 32 bits
      this.version = this.baseMediaDecodeTime > UINT32_MAX ? 1 : 0;
      this.flags = 0;
      this.size = 4;
      if (this.version === 1) {
        this.size += 4;
      }
      this.writeHeader(stream);
      if (this.version === 1) {
        stream.writeUint64(this.baseMediaDecodeTime);
      } else {
        stream.writeUint32(this.baseMediaDecodeTime);
      }
    };

    // file:src/writing/tfhd.js
    BoxParser.tfhdBox.prototype.write = function (stream) {
      this.version = 0;
      this.size = 4;
      if (this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
        this.size += 8;
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
        this.size += 4;
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
        this.size += 4;
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
        this.size += 4;
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
        this.size += 4;
      }
      this.writeHeader(stream);
      stream.writeUint32(this.track_id);
      if (this.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET) {
        stream.writeUint64(this.base_data_offset);
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
        stream.writeUint32(this.default_sample_description_index);
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
        stream.writeUint32(this.default_sample_duration);
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
        stream.writeUint32(this.default_sample_size);
      }
      if (this.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
        stream.writeUint32(this.default_sample_flags);
      }
    };

    // file:src/writing/tkhd.js
    BoxParser.tkhdBox.prototype.write = function (stream) {
      this.version = 0;
      //this.flags = 0;
      this.size = 4 * 18 + 2 * 4;
      this.writeHeader(stream);
      stream.writeUint32(this.creation_time);
      stream.writeUint32(this.modification_time);
      stream.writeUint32(this.track_id);
      stream.writeUint32(0);
      stream.writeUint32(this.duration);
      stream.writeUint32(0);
      stream.writeUint32(0);
      stream.writeInt16(this.layer);
      stream.writeInt16(this.alternate_group);
      stream.writeInt16(this.volume << 8);
      stream.writeUint16(0);
      stream.writeInt32Array(this.matrix);
      stream.writeUint32(this.width);
      stream.writeUint32(this.height);
    };

    // file:src/writing/trex.js
    BoxParser.trexBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = 4 * 5;
      this.writeHeader(stream);
      stream.writeUint32(this.track_id);
      stream.writeUint32(this.default_sample_description_index);
      stream.writeUint32(this.default_sample_duration);
      stream.writeUint32(this.default_sample_size);
      stream.writeUint32(this.default_sample_flags);
    };

    // file:src/writing/trun.js
    BoxParser.trunBox.prototype.write = function (stream) {
      this.version = 0;
      this.size = 4;
      if (this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
        this.size += 4;
      }
      if (this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
        this.size += 4;
      }
      if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
        this.size += 4 * this.sample_duration.length;
      }
      if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
        this.size += 4 * this.sample_size.length;
      }
      if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
        this.size += 4 * this.sample_flags.length;
      }
      if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
        this.size += 4 * this.sample_composition_time_offset.length;
      }
      this.writeHeader(stream);
      stream.writeUint32(this.sample_count);
      if (this.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET) {
        this.data_offset_position = stream.getPosition();
        stream.writeInt32(this.data_offset); //signed
      }

      if (this.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
        stream.writeUint32(this.first_sample_flags);
      }
      for (var i = 0; i < this.sample_count; i++) {
        if (this.flags & BoxParser.TRUN_FLAGS_DURATION) {
          stream.writeUint32(this.sample_duration[i]);
        }
        if (this.flags & BoxParser.TRUN_FLAGS_SIZE) {
          stream.writeUint32(this.sample_size[i]);
        }
        if (this.flags & BoxParser.TRUN_FLAGS_FLAGS) {
          stream.writeUint32(this.sample_flags[i]);
        }
        if (this.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
          if (this.version === 0) {
            stream.writeUint32(this.sample_composition_time_offset[i]);
          } else {
            stream.writeInt32(this.sample_composition_time_offset[i]); //signed
          }
        }
      }
    };

    // file:src/writing/url.js
    BoxParser["url Box"].prototype.write = function (stream) {
      this.version = 0;
      if (this.location) {
        this.flags = 0;
        this.size = this.location.length + 1;
      } else {
        this.flags = 0x000001;
        this.size = 0;
      }
      this.writeHeader(stream);
      if (this.location) {
        stream.writeCString(this.location);
      }
    };

    // file:src/writing/urn.js
    BoxParser["urn Box"].prototype.write = function (stream) {
      this.version = 0;
      this.flags = 0;
      this.size = this.name.length + 1 + (this.location ? this.location.length + 1 : 0);
      this.writeHeader(stream);
      stream.writeCString(this.name);
      if (this.location) {
        stream.writeCString(this.location);
      }
    };

    // file:src/writing/vmhd.js
    BoxParser.vmhdBox.prototype.write = function (stream) {
      this.version = 0;
      this.flags = 1;
      this.size = 8;
      this.writeHeader(stream);
      stream.writeUint16(this.graphicsmode);
      stream.writeUint16Array(this.opcolor);
    };

    // file:src/box-unpack.js
    /* 
     * Copyright (c) Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    BoxParser.cttsBox.prototype.unpack = function (samples) {
      var i, j, k;
      k = 0;
      for (i = 0; i < this.sample_counts.length; i++) {
        for (j = 0; j < this.sample_counts[i]; j++) {
          samples[k].pts = samples[k].dts + this.sample_offsets[i];
          k++;
        }
      }
    };
    BoxParser.sttsBox.prototype.unpack = function (samples) {
      var i, j, k;
      k = 0;
      for (i = 0; i < this.sample_counts.length; i++) {
        for (j = 0; j < this.sample_counts[i]; j++) {
          if (k === 0) {
            samples[k].dts = 0;
          } else {
            samples[k].dts = samples[k - 1].dts + this.sample_deltas[i];
          }
          k++;
        }
      }
    };
    BoxParser.stcoBox.prototype.unpack = function (samples) {
      var i;
      for (i = 0; i < this.chunk_offsets.length; i++) {
        samples[i].offset = this.chunk_offsets[i];
      }
    };
    BoxParser.stscBox.prototype.unpack = function (samples) {
      var i, j, k, l, m;
      l = 0;
      m = 0;
      for (i = 0; i < this.first_chunk.length; i++) {
        for (j = 0; j < (i + 1 < this.first_chunk.length ? this.first_chunk[i + 1] : Infinity); j++) {
          m++;
          for (k = 0; k < this.samples_per_chunk[i]; k++) {
            if (samples[l]) {
              samples[l].description_index = this.sample_description_index[i];
              samples[l].chunk_index = m;
            } else {
              return;
            }
            l++;
          }
        }
      }
    };
    BoxParser.stszBox.prototype.unpack = function (samples) {
      var i;
      for (i = 0; i < this.sample_sizes.length; i++) {
        samples[i].size = this.sample_sizes[i];
      }
    };
    // file:src/box-diff.js

    BoxParser.DIFF_BOXES_PROP_NAMES = ["boxes", "entries", "references", "subsamples", "items", "item_infos", "extents", "associations", "subsegments", "ranges", "seekLists", "seekPoints", "esd", "levels"];
    BoxParser.DIFF_PRIMITIVE_ARRAY_PROP_NAMES = ["compatible_brands", "matrix", "opcolor", "sample_counts", "sample_counts", "sample_deltas", "first_chunk", "samples_per_chunk", "sample_sizes", "chunk_offsets", "sample_offsets", "sample_description_index", "sample_duration"];
    BoxParser.boxEqualFields = function (box_a, box_b) {
      if (box_a && !box_b) return false;
      var prop;
      for (prop in box_a) {
        if (BoxParser.DIFF_BOXES_PROP_NAMES.indexOf(prop) > -1) {
          continue;
          // } else if (excluded_fields && excluded_fields.indexOf(prop) > -1) {
          // 	continue;
        } else if (box_a[prop] instanceof BoxParser.Box || box_b[prop] instanceof BoxParser.Box) {
          continue;
        } else if (typeof box_a[prop] === "undefined" || typeof box_b[prop] === "undefined") {
          continue;
        } else if (typeof box_a[prop] === "function" || typeof box_b[prop] === "function") {
          continue;
        } else if (box_a.subBoxNames && box_a.subBoxNames.indexOf(prop.slice(0, 4)) > -1 || box_b.subBoxNames && box_b.subBoxNames.indexOf(prop.slice(0, 4)) > -1) {
          continue;
        } else {
          if (prop === "data" || prop === "start" || prop === "size" || prop === "creation_time" || prop === "modification_time") {
            continue;
          } else if (BoxParser.DIFF_PRIMITIVE_ARRAY_PROP_NAMES.indexOf(prop) > -1) {
            continue;
          } else {
            if (box_a[prop] !== box_b[prop]) {
              return false;
            }
          }
        }
      }
      return true;
    };
    BoxParser.boxEqual = function (box_a, box_b) {
      if (!BoxParser.boxEqualFields(box_a, box_b)) {
        return false;
      }
      for (var j = 0; j < BoxParser.DIFF_BOXES_PROP_NAMES.length; j++) {
        var name = BoxParser.DIFF_BOXES_PROP_NAMES[j];
        if (box_a[name] && box_b[name]) {
          if (!BoxParser.boxEqual(box_a[name], box_b[name])) {
            return false;
          }
        }
      }
      return true;
    }; // file:src/text-mp4.js
    var XMLSubtitlein4Parser = function () {};
    XMLSubtitlein4Parser.prototype.parseSample = function (sample) {
      var res = {};
      var i;
      res.resources = [];
      var stream = new MP4BoxStream(sample.data.buffer);
      if (!sample.subsamples || sample.subsamples.length === 0) {
        res.documentString = stream.readString(sample.data.length);
      } else {
        res.documentString = stream.readString(sample.subsamples[0].size);
        if (sample.subsamples.length > 1) {
          for (i = 1; i < sample.subsamples.length; i++) {
            res.resources[i] = stream.readUint8Array(sample.subsamples[i].size);
          }
        }
      }
      if (typeof DOMParser !== "undefined") {
        res.document = new DOMParser().parseFromString(res.documentString, "application/xml");
      }
      return res;
    };
    var Textin4Parser = function () {};
    Textin4Parser.prototype.parseSample = function (sample) {
      var textString;
      var stream = new MP4BoxStream(sample.data.buffer);
      textString = stream.readString(sample.data.length);
      return textString;
    };
    Textin4Parser.prototype.parseConfig = function (data) {
      var textString;
      var stream = new MP4BoxStream(data.buffer);
      stream.readUint32(); // version & flags
      textString = stream.readCString();
      return textString;
    };
    {
      exports.XMLSubtitlein4Parser = XMLSubtitlein4Parser;
      exports.Textin4Parser = Textin4Parser;
    }
    // file:src/isofile.js
    /*
     * Copyright (c) 2012-2013. Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    var ISOFile = function (stream) {
      /* MutiBufferStream object used to parse boxes */
      this.stream = stream || new MultiBufferStream();
      /* Array of all boxes (in order) found in the file */
      this.boxes = [];
      /* Array of all mdats */
      this.mdats = [];
      /* Array of all moofs */
      this.moofs = [];
      /* Boolean indicating if the file is compatible with progressive parsing (moov first) */
      this.isProgressive = false;
      /* Boolean used to fire moov start event only once */
      this.moovStartFound = false;
      /* Callback called when the moov parsing starts */
      this.onMoovStart = null;
      /* Boolean keeping track of the call to onMoovStart, to avoid double calls */
      this.moovStartSent = false;
      /* Callback called when the moov is entirely parsed */
      this.onReady = null;
      /* Boolean keeping track of the call to onReady, to avoid double calls */
      this.readySent = false;
      /* Callback to call when segments are ready */
      this.onSegment = null;
      /* Callback to call when samples are ready */
      this.onSamples = null;
      /* Callback to call when there is an error in the parsing or processing of samples */
      this.onError = null;
      /* Boolean indicating if the moov box run-length encoded tables of sample information have been processed */
      this.sampleListBuilt = false;
      /* Array of Track objects for which fragmentation of samples is requested */
      this.fragmentedTracks = [];
      /* Array of Track objects for which extraction of samples is requested */
      this.extractedTracks = [];
      /* Boolean indicating that fragmention is ready */
      this.isFragmentationInitialized = false;
      /* Boolean indicating that fragmented has started */
      this.sampleProcessingStarted = false;
      /* Number of the next 'moof' to generate when fragmenting */
      this.nextMoofNumber = 0;
      /* Boolean indicating if the initial list of items has been produced */
      this.itemListBuilt = false;
      /* Callback called when the sidx box is entirely parsed */
      this.onSidx = null;
      /* Boolean keeping track of the call to onSidx, to avoid double calls */
      this.sidxSent = false;
    };
    ISOFile.prototype.setSegmentOptions = function (id, user, options) {
      var trak = this.getTrackById(id);
      if (trak) {
        var fragTrack = {};
        this.fragmentedTracks.push(fragTrack);
        fragTrack.id = id;
        fragTrack.user = user;
        fragTrack.trak = trak;
        trak.nextSample = 0;
        fragTrack.segmentStream = null;
        fragTrack.nb_samples = 1000;
        fragTrack.rapAlignement = true;
        if (options) {
          if (options.nbSamples) fragTrack.nb_samples = options.nbSamples;
          if (options.rapAlignement) fragTrack.rapAlignement = options.rapAlignement;
        }
      }
    };
    ISOFile.prototype.unsetSegmentOptions = function (id) {
      var index = -1;
      for (var i = 0; i < this.fragmentedTracks.length; i++) {
        var fragTrack = this.fragmentedTracks[i];
        if (fragTrack.id == id) {
          index = i;
        }
      }
      if (index > -1) {
        this.fragmentedTracks.splice(index, 1);
      }
    };
    ISOFile.prototype.setExtractionOptions = function (id, user, options) {
      var trak = this.getTrackById(id);
      if (trak) {
        var extractTrack = {};
        this.extractedTracks.push(extractTrack);
        extractTrack.id = id;
        extractTrack.user = user;
        extractTrack.trak = trak;
        trak.nextSample = 0;
        extractTrack.nb_samples = 1000;
        extractTrack.samples = [];
        if (options) {
          if (options.nbSamples) extractTrack.nb_samples = options.nbSamples;
        }
      }
    };
    ISOFile.prototype.unsetExtractionOptions = function (id) {
      var index = -1;
      for (var i = 0; i < this.extractedTracks.length; i++) {
        var extractTrack = this.extractedTracks[i];
        if (extractTrack.id == id) {
          index = i;
        }
      }
      if (index > -1) {
        this.extractedTracks.splice(index, 1);
      }
    };
    ISOFile.prototype.parse = function () {
      var ret;
      var box;
      var parseBoxHeadersOnly = false;
      if (this.restoreParsePosition) {
        if (!this.restoreParsePosition()) {
          return;
        }
      }
      while (true) {
        if (this.hasIncompleteMdat && this.hasIncompleteMdat()) {
          if (this.processIncompleteMdat()) {
            continue;
          } else {
            return;
          }
        } else {
          if (this.saveParsePosition) {
            this.saveParsePosition();
          }
          ret = BoxParser.parseOneBox(this.stream, parseBoxHeadersOnly);
          if (ret.code === BoxParser.ERR_NOT_ENOUGH_DATA) {
            if (this.processIncompleteBox) {
              if (this.processIncompleteBox(ret)) {
                continue;
              } else {
                return;
              }
            } else {
              return;
            }
          } else {
            var box_type;
            /* the box is entirely parsed */
            box = ret.box;
            box_type = box.type !== "uuid" ? box.type : box.uuid;
            /* store the box in the 'boxes' array to preserve box order (for file rewrite if needed)  */
            this.boxes.push(box);
            /* but also store box in a property for more direct access */
            switch (box_type) {
              case "mdat":
                this.mdats.push(box);
                break;
              case "moof":
                this.moofs.push(box);
                break;
              case "moov":
                this.moovStartFound = true;
                if (this.mdats.length === 0) {
                  this.isProgressive = true;
                }
              /* no break */
              /* falls through */
              default:
                if (this[box_type] !== undefined) {
                  Log.warn("ISOFile", "Duplicate Box of type: " + box_type + ", overriding previous occurrence");
                }
                this[box_type] = box;
                break;
            }
            if (this.updateUsedBytes) {
              this.updateUsedBytes(box, ret);
            }
          }
        }
      }
    };
    ISOFile.prototype.checkBuffer = function (ab) {
      if (ab === null || ab === undefined) {
        throw "Buffer must be defined and non empty";
      }
      if (ab.fileStart === undefined) {
        throw "Buffer must have a fileStart property";
      }
      if (ab.byteLength === 0) {
        Log.warn("ISOFile", "Ignoring empty buffer (fileStart: " + ab.fileStart + ")");
        this.stream.logBufferLevel();
        return false;
      }
      Log.info("ISOFile", "Processing buffer (fileStart: " + ab.fileStart + ")");

      /* mark the bytes in the buffer as not being used yet */
      ab.usedBytes = 0;
      this.stream.insertBuffer(ab);
      this.stream.logBufferLevel();
      if (!this.stream.initialized()) {
        Log.warn("ISOFile", "Not ready to start parsing");
        return false;
      }
      return true;
    };

    /* Processes a new ArrayBuffer (with a fileStart property)
       Returns the next expected file position, or undefined if not ready to parse */
    ISOFile.prototype.appendBuffer = function (ab, last) {
      var nextFileStart;
      if (!this.checkBuffer(ab)) {
        return;
      }

      /* Parse whatever is in the existing buffers */
      this.parse();

      /* Check if the moovStart callback needs to be called */
      if (this.moovStartFound && !this.moovStartSent) {
        this.moovStartSent = true;
        if (this.onMoovStart) this.onMoovStart();
      }
      if (this.moov) {
        /* A moov box has been entirely parsed */

        /* if this is the first call after the moov is found we initialize the list of samples (may be empty in fragmented files) */
        if (!this.sampleListBuilt) {
          this.buildSampleLists();
          this.sampleListBuilt = true;
        }

        /* We update the sample information if there are any new moof boxes */
        this.updateSampleLists();

        /* If the application needs to be informed that the 'moov' has been found,
           we create the information object and callback the application */
        if (this.onReady && !this.readySent) {
          this.readySent = true;
          this.onReady(this.getInfo());
        }

        /* See if any sample extraction or segment creation needs to be done with the available samples */
        this.processSamples(last);

        /* Inform about the best range to fetch next */
        if (this.nextSeekPosition) {
          nextFileStart = this.nextSeekPosition;
          this.nextSeekPosition = undefined;
        } else {
          nextFileStart = this.nextParsePosition;
        }
        if (this.stream.getEndFilePositionAfter) {
          nextFileStart = this.stream.getEndFilePositionAfter(nextFileStart);
        }
      } else {
        if (this.nextParsePosition) {
          /* moov has not been parsed but the first buffer was received,
             the next fetch should probably be the next box start */
          nextFileStart = this.nextParsePosition;
        } else {
          /* No valid buffer has been parsed yet, we cannot know what to parse next */
          nextFileStart = 0;
        }
      }
      if (this.sidx) {
        if (this.onSidx && !this.sidxSent) {
          this.onSidx(this.sidx);
          this.sidxSent = true;
        }
      }
      if (this.meta) {
        if (this.flattenItemInfo && !this.itemListBuilt) {
          this.flattenItemInfo();
          this.itemListBuilt = true;
        }
        if (this.processItems) {
          this.processItems(this.onItem);
        }
      }
      if (this.stream.cleanBuffers) {
        Log.info("ISOFile", "Done processing buffer (fileStart: " + ab.fileStart + ") - next buffer to fetch should have a fileStart position of " + nextFileStart);
        this.stream.logBufferLevel();
        this.stream.cleanBuffers();
        this.stream.logBufferLevel(true);
        Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
      }
      return nextFileStart;
    };
    ISOFile.prototype.getInfo = function () {
      var i, j;
      var movie = {};
      var trak;
      var track;
      var ref;
      var sample_desc;
      var _1904 = new Date('1904-01-01T00:00:00Z').getTime();
      if (this.moov) {
        movie.hasMoov = true;
        movie.duration = this.moov.mvhd.duration;
        movie.timescale = this.moov.mvhd.timescale;
        movie.isFragmented = this.moov.mvex != null;
        if (movie.isFragmented && this.moov.mvex.mehd) {
          movie.fragment_duration = this.moov.mvex.mehd.fragment_duration;
        }
        movie.isProgressive = this.isProgressive;
        movie.hasIOD = this.moov.iods != null;
        movie.brands = [];
        movie.brands.push(this.ftyp.major_brand);
        movie.brands = movie.brands.concat(this.ftyp.compatible_brands);
        movie.created = new Date(_1904 + this.moov.mvhd.creation_time * 1000);
        movie.modified = new Date(_1904 + this.moov.mvhd.modification_time * 1000);
        movie.tracks = [];
        movie.audioTracks = [];
        movie.videoTracks = [];
        movie.subtitleTracks = [];
        movie.metadataTracks = [];
        movie.hintTracks = [];
        movie.otherTracks = [];
        for (i = 0; i < this.moov.traks.length; i++) {
          trak = this.moov.traks[i];
          sample_desc = trak.mdia.minf.stbl.stsd.entries[0];
          track = {};
          movie.tracks.push(track);
          track.id = trak.tkhd.track_id;
          track.name = trak.mdia.hdlr.name;
          track.references = [];
          if (trak.tref) {
            for (j = 0; j < trak.tref.boxes.length; j++) {
              ref = {};
              track.references.push(ref);
              ref.type = trak.tref.boxes[j].type;
              ref.track_ids = trak.tref.boxes[j].track_ids;
            }
          }
          if (trak.edts) {
            track.edits = trak.edts.elst.entries;
          }
          track.created = new Date(_1904 + trak.tkhd.creation_time * 1000);
          track.modified = new Date(_1904 + trak.tkhd.modification_time * 1000);
          track.movie_duration = trak.tkhd.duration;
          track.movie_timescale = movie.timescale;
          track.layer = trak.tkhd.layer;
          track.alternate_group = trak.tkhd.alternate_group;
          track.volume = trak.tkhd.volume;
          track.matrix = trak.tkhd.matrix;
          track.track_width = trak.tkhd.width / (1 << 16);
          track.track_height = trak.tkhd.height / (1 << 16);
          track.timescale = trak.mdia.mdhd.timescale;
          track.cts_shift = trak.mdia.minf.stbl.cslg;
          track.duration = trak.mdia.mdhd.duration;
          track.samples_duration = trak.samples_duration;
          track.codec = sample_desc.getCodec();
          track.kind = trak.udta && trak.udta.kinds.length ? trak.udta.kinds[0] : {
            schemeURI: "",
            value: ""
          };
          track.language = trak.mdia.elng ? trak.mdia.elng.extended_language : trak.mdia.mdhd.languageString;
          track.nb_samples = trak.samples.length;
          track.size = trak.samples_size;
          track.bitrate = track.size * 8 * track.timescale / track.samples_duration;
          if (sample_desc.isAudio()) {
            track.type = "audio";
            movie.audioTracks.push(track);
            track.audio = {};
            track.audio.sample_rate = sample_desc.getSampleRate();
            track.audio.channel_count = sample_desc.getChannelCount();
            track.audio.sample_size = sample_desc.getSampleSize();
          } else if (sample_desc.isVideo()) {
            track.type = "video";
            movie.videoTracks.push(track);
            track.video = {};
            track.video.width = sample_desc.getWidth();
            track.video.height = sample_desc.getHeight();
          } else if (sample_desc.isSubtitle()) {
            track.type = "subtitles";
            movie.subtitleTracks.push(track);
          } else if (sample_desc.isHint()) {
            track.type = "metadata";
            movie.hintTracks.push(track);
          } else if (sample_desc.isMetadata()) {
            track.type = "metadata";
            movie.metadataTracks.push(track);
          } else {
            track.type = "metadata";
            movie.otherTracks.push(track);
          }
        }
      } else {
        movie.hasMoov = false;
      }
      movie.mime = "";
      if (movie.hasMoov && movie.tracks) {
        if (movie.videoTracks && movie.videoTracks.length > 0) {
          movie.mime += 'video/mp4; codecs=\"';
        } else if (movie.audioTracks && movie.audioTracks.length > 0) {
          movie.mime += 'audio/mp4; codecs=\"';
        } else {
          movie.mime += 'application/mp4; codecs=\"';
        }
        for (i = 0; i < movie.tracks.length; i++) {
          if (i !== 0) movie.mime += ',';
          movie.mime += movie.tracks[i].codec;
        }
        movie.mime += '\"; profiles=\"';
        movie.mime += this.ftyp.compatible_brands.join();
        movie.mime += '\"';
      }
      return movie;
    };
    ISOFile.prototype.setNextSeekPositionFromSample = function (sample) {
      if (!sample) {
        return;
      }
      if (this.nextSeekPosition) {
        this.nextSeekPosition = Math.min(sample.offset + sample.alreadyRead, this.nextSeekPosition);
      } else {
        this.nextSeekPosition = sample.offset + sample.alreadyRead;
      }
    };
    ISOFile.prototype.processSamples = function (last) {
      var i;
      var trak;
      if (!this.sampleProcessingStarted) return;

      /* For each track marked for fragmentation,
         check if the next sample is there (i.e. if the sample information is known (i.e. moof has arrived) and if it has been downloaded)
         and create a fragment with it */
      if (this.isFragmentationInitialized && this.onSegment !== null) {
        for (i = 0; i < this.fragmentedTracks.length; i++) {
          var fragTrak = this.fragmentedTracks[i];
          trak = fragTrak.trak;
          while (trak.nextSample < trak.samples.length && this.sampleProcessingStarted) {
            /* The sample information is there (either because the file is not fragmented and this is not the last sample,
            or because the file is fragmented and the moof for that sample has been received */
            Log.debug("ISOFile", "Creating media fragment on track #" + fragTrak.id + " for sample " + trak.nextSample);
            var result = this.createFragment(fragTrak.id, trak.nextSample, fragTrak.segmentStream);
            if (result) {
              fragTrak.segmentStream = result;
              trak.nextSample++;
            } else {
              /* The fragment could not be created because the media data is not there (not downloaded), wait for it */
              break;
            }
            /* A fragment is created by sample, but the segment is the accumulation in the buffer of these fragments.
               It is flushed only as requested by the application (nb_samples) to avoid too many callbacks */
            if (trak.nextSample % fragTrak.nb_samples === 0 || last || trak.nextSample >= trak.samples.length) {
              Log.info("ISOFile", "Sending fragmented data on track #" + fragTrak.id + " for samples [" + Math.max(0, trak.nextSample - fragTrak.nb_samples) + "," + (trak.nextSample - 1) + "]");
              Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
              if (this.onSegment) {
                this.onSegment(fragTrak.id, fragTrak.user, fragTrak.segmentStream.buffer, trak.nextSample, last || trak.nextSample >= trak.samples.length);
              }
              /* force the creation of a new buffer */
              fragTrak.segmentStream = null;
              if (fragTrak !== this.fragmentedTracks[i]) {
                /* make sure we can stop fragmentation if needed */
                break;
              }
            }
          }
        }
      }
      if (this.onSamples !== null) {
        /* For each track marked for data export,
           check if the next sample is there (i.e. has been downloaded) and send it */
        for (i = 0; i < this.extractedTracks.length; i++) {
          var extractTrak = this.extractedTracks[i];
          trak = extractTrak.trak;
          while (trak.nextSample < trak.samples.length && this.sampleProcessingStarted) {
            Log.debug("ISOFile", "Exporting on track #" + extractTrak.id + " sample #" + trak.nextSample);
            var sample = this.getSample(trak, trak.nextSample);
            if (sample) {
              trak.nextSample++;
              extractTrak.samples.push(sample);
            } else {
              this.setNextSeekPositionFromSample(trak.samples[trak.nextSample]);
              break;
            }
            if (trak.nextSample % extractTrak.nb_samples === 0 || trak.nextSample >= trak.samples.length) {
              Log.debug("ISOFile", "Sending samples on track #" + extractTrak.id + " for sample " + trak.nextSample);
              if (this.onSamples) {
                this.onSamples(extractTrak.id, extractTrak.user, extractTrak.samples);
              }
              extractTrak.samples = [];
              if (extractTrak !== this.extractedTracks[i]) {
                /* check if the extraction needs to be stopped */
                break;
              }
            }
          }
        }
      }
    };

    /* Find and return specific boxes using recursion and early return */
    ISOFile.prototype.getBox = function (type) {
      var result = this.getBoxes(type, true);
      return result.length ? result[0] : null;
    };
    ISOFile.prototype.getBoxes = function (type, returnEarly) {
      var result = [];
      ISOFile._sweep.call(this, type, result, returnEarly);
      return result;
    };
    ISOFile._sweep = function (type, result, returnEarly) {
      if (this.type && this.type == type) result.push(this);
      for (var box in this.boxes) {
        if (result.length && returnEarly) return;
        ISOFile._sweep.call(this.boxes[box], type, result, returnEarly);
      }
    };
    ISOFile.prototype.getTrackSamplesInfo = function (track_id) {
      var track = this.getTrackById(track_id);
      if (track) {
        return track.samples;
      } else {
        return;
      }
    };
    ISOFile.prototype.getTrackSample = function (track_id, number) {
      var track = this.getTrackById(track_id);
      var sample = this.getSample(track, number);
      return sample;
    };

    /* Called by the application to release the resources associated to samples already forwarded to the application */
    ISOFile.prototype.releaseUsedSamples = function (id, sampleNum) {
      var size = 0;
      var trak = this.getTrackById(id);
      if (!trak.lastValidSample) trak.lastValidSample = 0;
      for (var i = trak.lastValidSample; i < sampleNum; i++) {
        size += this.releaseSample(trak, i);
      }
      Log.info("ISOFile", "Track #" + id + " released samples up to " + sampleNum + " (released size: " + size + ", remaining: " + this.samplesDataSize + ")");
      trak.lastValidSample = sampleNum;
    };
    ISOFile.prototype.start = function () {
      this.sampleProcessingStarted = true;
      this.processSamples(false);
    };
    ISOFile.prototype.stop = function () {
      this.sampleProcessingStarted = false;
    };

    /* Called by the application to flush the remaining samples (e.g. once the download is finished or when no more samples will be added) */
    ISOFile.prototype.flush = function () {
      Log.info("ISOFile", "Flushing remaining samples");
      this.updateSampleLists();
      this.processSamples(true);
      this.stream.cleanBuffers();
      this.stream.logBufferLevel(true);
    };

    /* Finds the byte offset for a given time on a given track
       also returns the time of the previous rap */
    ISOFile.prototype.seekTrack = function (time, useRap, trak) {
      var j;
      var sample;
      var seek_offset = Infinity;
      var rap_seek_sample_num = 0;
      var seek_sample_num = 0;
      var timescale;
      if (trak.samples.length === 0) {
        Log.info("ISOFile", "No sample in track, cannot seek! Using time " + Log.getDurationString(0, 1) + " and offset: " + 0);
        return {
          offset: 0,
          time: 0
        };
      }
      for (j = 0; j < trak.samples.length; j++) {
        sample = trak.samples[j];
        if (j === 0) {
          seek_sample_num = 0;
          timescale = sample.timescale;
        } else if (sample.cts > time * sample.timescale) {
          seek_sample_num = j - 1;
          break;
        }
        if (useRap && sample.is_sync) {
          rap_seek_sample_num = j;
        }
      }
      if (useRap) {
        seek_sample_num = rap_seek_sample_num;
      }
      time = trak.samples[seek_sample_num].cts;
      trak.nextSample = seek_sample_num;
      while (trak.samples[seek_sample_num].alreadyRead === trak.samples[seek_sample_num].size) {
        // No remaining samples to look for, all are downloaded.
        if (!trak.samples[seek_sample_num + 1]) {
          break;
        }
        seek_sample_num++;
      }
      seek_offset = trak.samples[seek_sample_num].offset + trak.samples[seek_sample_num].alreadyRead;
      Log.info("ISOFile", "Seeking to " + (useRap ? "RAP" : "") + " sample #" + trak.nextSample + " on track " + trak.tkhd.track_id + ", time " + Log.getDurationString(time, timescale) + " and offset: " + seek_offset);
      return {
        offset: seek_offset,
        time: time / timescale
      };
    };
    ISOFile.prototype.getTrackDuration = function (trak) {
      var sample;
      if (!trak.samples) {
        return Infinity;
      }
      sample = trak.samples[trak.samples.length - 1];
      return (sample.cts + sample.duration) / sample.timescale;
    };

    /* Finds the byte offset in the file corresponding to the given time or to the time of the previous RAP */
    ISOFile.prototype.seek = function (time, useRap) {
      var moov = this.moov;
      var trak;
      var trak_seek_info;
      var i;
      var seek_info = {
        offset: Infinity,
        time: Infinity
      };
      if (!this.moov) {
        throw "Cannot seek: moov not received!";
      } else {
        for (i = 0; i < moov.traks.length; i++) {
          trak = moov.traks[i];
          if (time > this.getTrackDuration(trak)) {
            // skip tracks that already ended
            continue;
          }
          trak_seek_info = this.seekTrack(time, useRap, trak);
          if (trak_seek_info.offset < seek_info.offset) {
            seek_info.offset = trak_seek_info.offset;
          }
          if (trak_seek_info.time < seek_info.time) {
            seek_info.time = trak_seek_info.time;
          }
        }
        Log.info("ISOFile", "Seeking at time " + Log.getDurationString(seek_info.time, 1) + " needs a buffer with a fileStart position of " + seek_info.offset);
        if (seek_info.offset === Infinity) {
          /* No sample info, in all tracks, cannot seek */
          seek_info = {
            offset: this.nextParsePosition,
            time: 0
          };
        } else {
          /* check if the seek position is already in some buffer and
           in that case return the end of that buffer (or of the last contiguous buffer) */
          /* TODO: Should wait until append operations are done */
          seek_info.offset = this.stream.getEndFilePositionAfter(seek_info.offset);
        }
        Log.info("ISOFile", "Adjusted seek position (after checking data already in buffer): " + seek_info.offset);
        return seek_info;
      }
    };
    ISOFile.prototype.equal = function (b) {
      var box_index = 0;
      while (box_index < this.boxes.length && box_index < b.boxes.length) {
        var a_box = this.boxes[box_index];
        var b_box = b.boxes[box_index];
        if (!BoxParser.boxEqual(a_box, b_box)) {
          return false;
        }
        box_index++;
      }
      return true;
    };
    {
      exports.ISOFile = ISOFile;
    }
    // file:src/isofile-advanced-parsing.js
    /* position in the current buffer of the beginning of the last box parsed */
    ISOFile.prototype.lastBoxStartPosition = 0;
    /* indicator if the parsing is stuck in the middle of an mdat box */
    ISOFile.prototype.parsingMdat = null;
    /* next file position that the parser needs:
        - 0 until the first buffer (i.e. fileStart ===0) has been received 
        - otherwise, the next box start until the moov box has been parsed
        - otherwise, the position of the next sample to fetch
     */
    ISOFile.prototype.nextParsePosition = 0;
    /* keep mdat data */
    ISOFile.prototype.discardMdatData = false;
    ISOFile.prototype.processIncompleteBox = function (ret) {
      var box;
      var merged;
      var found;

      /* we did not have enough bytes in the current buffer to parse the entire box */
      if (ret.type === "mdat") {
        /* we had enough bytes to get its type and size and it's an 'mdat' */

        /* special handling for mdat boxes, since we don't actually need to parse it linearly 
           we create the box */
        box = new BoxParser[ret.type + "Box"](ret.size);
        this.parsingMdat = box;
        this.boxes.push(box);
        this.mdats.push(box);
        box.start = ret.start;
        box.hdr_size = ret.hdr_size;
        this.stream.addUsedBytes(box.hdr_size);

        /* indicate that the parsing should start from the end of the box */
        this.lastBoxStartPosition = box.start + box.size;
        /* let's see if we have the end of the box in the other buffers */
        found = this.stream.seek(box.start + box.size, false, this.discardMdatData);
        if (found) {
          /* found the end of the box */
          this.parsingMdat = null;
          /* let's see if we can parse more in this buffer */
          return true;
        } else {
          /* 'mdat' end not found in the existing buffers */
          /* determine the next position in the file to start parsing from */
          if (!this.moovStartFound) {
            /* moov not find yet, 
               the file probably has 'mdat' at the beginning, and 'moov' at the end, 
               indicate that the downloader should not try to download those bytes now */
            this.nextParsePosition = box.start + box.size;
          } else {
            /* we have the start of the moov box, 
               the next bytes should try to complete the current 'mdat' */
            this.nextParsePosition = this.stream.findEndContiguousBuf();
          }
          /* not much we can do, wait for more buffers to arrive */
          return false;
        }
      } else {
        /* box is incomplete, we may not even know its type */
        if (ret.type === "moov") {
          /* the incomplete box is a 'moov' box */
          this.moovStartFound = true;
          if (this.mdats.length === 0) {
            this.isProgressive = true;
          }
        }
        /* either it's not an mdat box (and we need to parse it, we cannot skip it)
           (TODO: we could skip 'free' boxes ...)
        	   or we did not have enough data to parse the type and size of the box, 
           we try to concatenate the current buffer with the next buffer to restart parsing */
        merged = this.stream.mergeNextBuffer ? this.stream.mergeNextBuffer() : false;
        if (merged) {
          /* The next buffer was contiguous, the merging succeeded,
             we can now continue parsing, 
             the next best position to parse is at the end of this new buffer */
          this.nextParsePosition = this.stream.getEndPosition();
          return true;
        } else {
          /* we cannot concatenate existing buffers because they are not contiguous or because there is no additional buffer */
          /* The next best position to parse is still at the end of this old buffer */
          if (!ret.type) {
            /* There were not enough bytes in the buffer to parse the box type and length,
               the next fetch should retrieve those missing bytes, i.e. the next bytes after this buffer */
            this.nextParsePosition = this.stream.getEndPosition();
          } else {
            /* we had enough bytes to parse size and type of the incomplete box
               if we haven't found yet the moov box, skip this one and try the next one 
               if we have found the moov box, let's continue linear parsing */
            if (this.moovStartFound) {
              this.nextParsePosition = this.stream.getEndPosition();
            } else {
              this.nextParsePosition = this.stream.getPosition() + ret.size;
            }
          }
          return false;
        }
      }
    };
    ISOFile.prototype.hasIncompleteMdat = function () {
      return this.parsingMdat !== null;
    };
    ISOFile.prototype.processIncompleteMdat = function () {
      var box;
      var found;

      /* we are in the parsing of an incomplete mdat box */
      box = this.parsingMdat;
      found = this.stream.seek(box.start + box.size, false, this.discardMdatData);
      if (found) {
        Log.debug("ISOFile", "Found 'mdat' end in buffered data");
        /* the end of the mdat has been found */
        this.parsingMdat = null;
        /* we can parse more in this buffer */
        return true;
      } else {
        /* we don't have the end of this mdat yet, 
           indicate that the next byte to fetch is the end of the buffers we have so far, 
           return and wait for more buffer to come */
        this.nextParsePosition = this.stream.findEndContiguousBuf();
        return false;
      }
    };
    ISOFile.prototype.restoreParsePosition = function () {
      /* Reposition at the start position of the previous box not entirely parsed */
      return this.stream.seek(this.lastBoxStartPosition, true, this.discardMdatData);
    };
    ISOFile.prototype.saveParsePosition = function () {
      /* remember the position of the box start in case we need to roll back (if the box is incomplete) */
      this.lastBoxStartPosition = this.stream.getPosition();
    };
    ISOFile.prototype.updateUsedBytes = function (box, ret) {
      if (this.stream.addUsedBytes) {
        if (box.type === "mdat") {
          /* for an mdat box, only its header is considered used, other bytes will be used when sample data is requested */
          this.stream.addUsedBytes(box.hdr_size);
          if (this.discardMdatData) {
            this.stream.addUsedBytes(box.size - box.hdr_size);
          }
        } else {
          /* for all other boxes, the entire box data is considered used */
          this.stream.addUsedBytes(box.size);
        }
      }
    };
    // file:src/isofile-advanced-creation.js
    ISOFile.prototype.add = BoxParser.Box.prototype.add;
    ISOFile.prototype.addBox = BoxParser.Box.prototype.addBox;
    ISOFile.prototype.init = function (_options) {
      var options = _options || {};
      this.add("ftyp").set("major_brand", options.brands && options.brands[0] || "iso4").set("minor_version", 0).set("compatible_brands", options.brands || ["iso4"]);
      var moov = this.add("moov");
      moov.add("mvhd").set("timescale", options.timescale || 600).set("rate", options.rate || 1 << 16).set("creation_time", 0).set("modification_time", 0).set("duration", options.duration || 0).set("volume", options.width ? 0 : 0x0100).set("matrix", [1 << 16, 0, 0, 0, 1 << 16, 0, 0, 0, 0x40000000]).set("next_track_id", 1);
      moov.add("mvex");
      return this;
    };
    ISOFile.prototype.addTrack = function (_options) {
      if (!this.moov) {
        this.init(_options);
      }
      var options = _options || {};
      options.width = options.width || 320;
      options.height = options.height || 320;
      options.id = options.id || this.moov.mvhd.next_track_id;
      options.type = options.type || "avc1";
      var trak = this.moov.add("trak");
      this.moov.mvhd.next_track_id = options.id + 1;
      trak.add("tkhd").set("flags", BoxParser.TKHD_FLAG_ENABLED | BoxParser.TKHD_FLAG_IN_MOVIE | BoxParser.TKHD_FLAG_IN_PREVIEW).set("creation_time", 0).set("modification_time", 0).set("track_id", options.id).set("duration", options.duration || 0).set("layer", options.layer || 0).set("alternate_group", 0).set("volume", 1).set("matrix", [0, 0, 0, 0, 0, 0, 0, 0, 0]).set("width", options.width << 16).set("height", options.height << 16);
      var mdia = trak.add("mdia");
      mdia.add("mdhd").set("creation_time", 0).set("modification_time", 0).set("timescale", options.timescale || 1).set("duration", options.media_duration || 0).set("language", options.language || "und");
      mdia.add("hdlr").set("handler", options.hdlr || "vide").set("name", options.name || "Track created with MP4Box.js");
      mdia.add("elng").set("extended_language", options.language || "fr-FR");
      var minf = mdia.add("minf");
      if (BoxParser[options.type + "SampleEntry"] === undefined) return;
      var sample_description_entry = new BoxParser[options.type + "SampleEntry"]();
      sample_description_entry.data_reference_index = 1;
      var media_type = "";
      for (var mediaType in BoxParser.sampleEntryCodes) {
        var codes = BoxParser.sampleEntryCodes[mediaType];
        for (var i = 0; i < codes.length; i++) {
          if (codes.indexOf(options.type) > -1) {
            media_type = mediaType;
            break;
          }
        }
      }
      switch (media_type) {
        case "Visual":
          minf.add("vmhd").set("graphicsmode", 0).set("opcolor", [0, 0, 0]);
          sample_description_entry.set("width", options.width).set("height", options.height).set("horizresolution", 0x48 << 16).set("vertresolution", 0x48 << 16).set("frame_count", 1).set("compressorname", options.type + " Compressor").set("depth", 0x18);
          if (options.avcDecoderConfigRecord) {
            var avcC = new BoxParser.avcCBox();
            avcC.parse(new MP4BoxStream(options.avcDecoderConfigRecord));
            sample_description_entry.addBox(avcC);
          } else if (options.hevcDecoderConfigRecord) {
            var hvcC = new BoxParser.hvcCBox();
            hvcC.parse(new MP4BoxStream(options.hevcDecoderConfigRecord));
            sample_description_entry.addBox(hvcC);
          }
          break;
        case "Audio":
          minf.add("smhd").set("balance", options.balance || 0);
          sample_description_entry.set("channel_count", options.channel_count || 2).set("samplesize", options.samplesize || 16).set("samplerate", options.samplerate || 1 << 16);
          break;
        case "Hint":
          minf.add("hmhd"); // TODO: add properties
          break;
        case "Subtitle":
          minf.add("sthd");
          switch (options.type) {
            case "stpp":
              sample_description_entry.set("namespace", options.namespace || "nonamespace").set("schema_location", options.schema_location || "").set("auxiliary_mime_types", options.auxiliary_mime_types || "");
              break;
          }
          break;
        case "Metadata":
          minf.add("nmhd");
          break;
        case "System":
          minf.add("nmhd");
          break;
        default:
          minf.add("nmhd");
          break;
      }
      if (options.description) {
        sample_description_entry.addBox(options.description);
      }
      if (options.description_boxes) {
        options.description_boxes.forEach(function (b) {
          sample_description_entry.addBox(b);
        });
      }
      minf.add("dinf").add("dref").addEntry(new BoxParser["url Box"]().set("flags", 0x1));
      var stbl = minf.add("stbl");
      stbl.add("stsd").addEntry(sample_description_entry);
      stbl.add("stts").set("sample_counts", []).set("sample_deltas", []);
      stbl.add("stsc").set("first_chunk", []).set("samples_per_chunk", []).set("sample_description_index", []);
      stbl.add("stco").set("chunk_offsets", []);
      stbl.add("stsz").set("sample_sizes", []);
      this.moov.mvex.add("trex").set("track_id", options.id).set("default_sample_description_index", options.default_sample_description_index || 1).set("default_sample_duration", options.default_sample_duration || 0).set("default_sample_size", options.default_sample_size || 0).set("default_sample_flags", options.default_sample_flags || 0);
      this.buildTrakSampleLists(trak);
      return options.id;
    };
    BoxParser.Box.prototype.computeSize = function (stream_) {
      var stream = stream_ || new DataStream();
      stream.endianness = DataStream.BIG_ENDIAN;
      this.write(stream);
    };
    ISOFile.prototype.addSample = function (track_id, data, _options) {
      var options = _options || {};
      var sample = {};
      var trak = this.getTrackById(track_id);
      if (trak === null) return;
      sample.number = trak.samples.length;
      sample.track_id = trak.tkhd.track_id;
      sample.timescale = trak.mdia.mdhd.timescale;
      sample.description_index = options.sample_description_index ? options.sample_description_index - 1 : 0;
      sample.description = trak.mdia.minf.stbl.stsd.entries[sample.description_index];
      sample.data = data;
      sample.size = data.byteLength;
      sample.alreadyRead = sample.size;
      sample.duration = options.duration || 1;
      sample.cts = options.cts || 0;
      sample.dts = options.dts || 0;
      sample.is_sync = options.is_sync || false;
      sample.is_leading = options.is_leading || 0;
      sample.depends_on = options.depends_on || 0;
      sample.is_depended_on = options.is_depended_on || 0;
      sample.has_redundancy = options.has_redundancy || 0;
      sample.degradation_priority = options.degradation_priority || 0;
      sample.offset = 0;
      sample.subsamples = options.subsamples;
      trak.samples.push(sample);
      trak.samples_size += sample.size;
      trak.samples_duration += sample.duration;
      if (trak.first_dts === undefined) {
        trak.first_dts = options.dts;
      }
      this.processSamples();
      var moof = this.createSingleSampleMoof(sample);
      this.addBox(moof);
      moof.computeSize();
      /* adjusting the data_offset now that the moof size is known*/
      moof.trafs[0].truns[0].data_offset = moof.size + 8; //8 is mdat header
      this.add("mdat").data = new Uint8Array(data);
      return sample;
    };
    ISOFile.prototype.createSingleSampleMoof = function (sample) {
      var sample_flags = 0;
      if (sample.is_sync) sample_flags = 1 << 25; // sample_depends_on_none (I picture)
      else sample_flags = 1 << 16; // non-sync

      var moof = new BoxParser.moofBox();
      moof.add("mfhd").set("sequence_number", this.nextMoofNumber);
      this.nextMoofNumber++;
      var traf = moof.add("traf");
      var trak = this.getTrackById(sample.track_id);
      traf.add("tfhd").set("track_id", sample.track_id).set("flags", BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF);
      traf.add("tfdt").set("baseMediaDecodeTime", sample.dts - (trak.first_dts || 0));
      traf.add("trun").set("flags", BoxParser.TRUN_FLAGS_DATA_OFFSET | BoxParser.TRUN_FLAGS_DURATION | BoxParser.TRUN_FLAGS_SIZE | BoxParser.TRUN_FLAGS_FLAGS | BoxParser.TRUN_FLAGS_CTS_OFFSET).set("data_offset", 0).set("first_sample_flags", 0).set("sample_count", 1).set("sample_duration", [sample.duration]).set("sample_size", [sample.size]).set("sample_flags", [sample_flags]).set("sample_composition_time_offset", [sample.cts - sample.dts]);
      return moof;
    };

    // file:src/isofile-sample-processing.js
    /* Index of the last moof box received */
    ISOFile.prototype.lastMoofIndex = 0;

    /* size of the buffers allocated for samples */
    ISOFile.prototype.samplesDataSize = 0;

    /* Resets all sample tables */
    ISOFile.prototype.resetTables = function () {
      var i;
      var trak, stco, stsc, stsz, stts, ctts, stss;
      this.initial_duration = this.moov.mvhd.duration;
      this.moov.mvhd.duration = 0;
      for (i = 0; i < this.moov.traks.length; i++) {
        trak = this.moov.traks[i];
        trak.tkhd.duration = 0;
        trak.mdia.mdhd.duration = 0;
        stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
        stco.chunk_offsets = [];
        stsc = trak.mdia.minf.stbl.stsc;
        stsc.first_chunk = [];
        stsc.samples_per_chunk = [];
        stsc.sample_description_index = [];
        stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
        stsz.sample_sizes = [];
        stts = trak.mdia.minf.stbl.stts;
        stts.sample_counts = [];
        stts.sample_deltas = [];
        ctts = trak.mdia.minf.stbl.ctts;
        if (ctts) {
          ctts.sample_counts = [];
          ctts.sample_offsets = [];
        }
        stss = trak.mdia.minf.stbl.stss;
        var k = trak.mdia.minf.stbl.boxes.indexOf(stss);
        if (k != -1) trak.mdia.minf.stbl.boxes[k] = null;
      }
    };
    ISOFile.initSampleGroups = function (trak, traf, sbgps, trak_sgpds, traf_sgpds) {
      var l;
      var k;
      var sample_group_info;
      var sample_group_key;
      function SampleGroupInfo(_type, _parameter, _sbgp) {
        this.grouping_type = _type;
        this.grouping_type_parameter = _parameter;
        this.sbgp = _sbgp;
        this.last_sample_in_run = -1;
        this.entry_index = -1;
      }
      if (traf) {
        traf.sample_groups_info = [];
      }
      if (!trak.sample_groups_info) {
        trak.sample_groups_info = [];
      }
      for (k = 0; k < sbgps.length; k++) {
        sample_group_key = sbgps[k].grouping_type + "/" + sbgps[k].grouping_type_parameter;
        sample_group_info = new SampleGroupInfo(sbgps[k].grouping_type, sbgps[k].grouping_type_parameter, sbgps[k]);
        if (traf) {
          traf.sample_groups_info[sample_group_key] = sample_group_info;
        }
        if (!trak.sample_groups_info[sample_group_key]) {
          trak.sample_groups_info[sample_group_key] = sample_group_info;
        }
        for (l = 0; l < trak_sgpds.length; l++) {
          if (trak_sgpds[l].grouping_type === sbgps[k].grouping_type) {
            sample_group_info.description = trak_sgpds[l];
            sample_group_info.description.used = true;
          }
        }
        if (traf_sgpds) {
          for (l = 0; l < traf_sgpds.length; l++) {
            if (traf_sgpds[l].grouping_type === sbgps[k].grouping_type) {
              sample_group_info.fragment_description = traf_sgpds[l];
              sample_group_info.fragment_description.used = true;
              sample_group_info.is_fragment = true;
            }
          }
        }
      }
      if (!traf) {
        for (k = 0; k < trak_sgpds.length; k++) {
          if (!trak_sgpds[k].used && trak_sgpds[k].version >= 2) {
            sample_group_key = trak_sgpds[k].grouping_type + "/0";
            sample_group_info = new SampleGroupInfo(trak_sgpds[k].grouping_type, 0);
            if (!trak.sample_groups_info[sample_group_key]) {
              trak.sample_groups_info[sample_group_key] = sample_group_info;
            }
          }
        }
      } else {
        if (traf_sgpds) {
          for (k = 0; k < traf_sgpds.length; k++) {
            if (!traf_sgpds[k].used && traf_sgpds[k].version >= 2) {
              sample_group_key = traf_sgpds[k].grouping_type + "/0";
              sample_group_info = new SampleGroupInfo(traf_sgpds[k].grouping_type, 0);
              sample_group_info.is_fragment = true;
              if (!traf.sample_groups_info[sample_group_key]) {
                traf.sample_groups_info[sample_group_key] = sample_group_info;
              }
            }
          }
        }
      }
    };
    ISOFile.setSampleGroupProperties = function (trak, sample, sample_number, sample_groups_info) {
      var k;
      var index;
      sample.sample_groups = [];
      for (k in sample_groups_info) {
        sample.sample_groups[k] = {};
        sample.sample_groups[k].grouping_type = sample_groups_info[k].grouping_type;
        sample.sample_groups[k].grouping_type_parameter = sample_groups_info[k].grouping_type_parameter;
        if (sample_number >= sample_groups_info[k].last_sample_in_run) {
          if (sample_groups_info[k].last_sample_in_run < 0) {
            sample_groups_info[k].last_sample_in_run = 0;
          }
          sample_groups_info[k].entry_index++;
          if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) {
            sample_groups_info[k].last_sample_in_run += sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].sample_count;
          }
        }
        if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) {
          sample.sample_groups[k].group_description_index = sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].group_description_index;
        } else {
          sample.sample_groups[k].group_description_index = -1; // special value for not defined
        }

        if (sample.sample_groups[k].group_description_index !== 0) {
          var description;
          if (sample_groups_info[k].fragment_description) {
            description = sample_groups_info[k].fragment_description;
          } else {
            description = sample_groups_info[k].description;
          }
          if (sample.sample_groups[k].group_description_index > 0) {
            if (sample.sample_groups[k].group_description_index > 65535) {
              index = (sample.sample_groups[k].group_description_index >> 16) - 1;
            } else {
              index = sample.sample_groups[k].group_description_index - 1;
            }
            if (description && index >= 0) {
              sample.sample_groups[k].description = description.entries[index];
            }
          } else {
            if (description && description.version >= 2) {
              if (description.default_group_description_index > 0) {
                sample.sample_groups[k].description = description.entries[description.default_group_description_index - 1];
              }
            }
          }
        }
      }
    };
    ISOFile.process_sdtp = function (sdtp, sample, number) {
      if (!sample) {
        return;
      }
      if (sdtp) {
        sample.is_leading = sdtp.is_leading[number];
        sample.depends_on = sdtp.sample_depends_on[number];
        sample.is_depended_on = sdtp.sample_is_depended_on[number];
        sample.has_redundancy = sdtp.sample_has_redundancy[number];
      } else {
        sample.is_leading = 0;
        sample.depends_on = 0;
        sample.is_depended_on = 0;
        sample.has_redundancy = 0;
      }
    };

    /* Build initial sample list from  sample tables */
    ISOFile.prototype.buildSampleLists = function () {
      var i;
      var trak;
      for (i = 0; i < this.moov.traks.length; i++) {
        trak = this.moov.traks[i];
        this.buildTrakSampleLists(trak);
      }
    };
    ISOFile.prototype.buildTrakSampleLists = function (trak) {
      var j;
      var stco, stsc, stsz, stts, ctts, stss, stsd, subs, sbgps, sgpds, stdp;
      var chunk_run_index, chunk_index, last_chunk_in_run, offset_in_chunk, last_sample_in_chunk;
      var last_sample_in_stts_run, stts_run_index, last_sample_in_ctts_run, ctts_run_index, last_stss_index, subs_entry_index, last_subs_sample_index;
      trak.samples = [];
      trak.samples_duration = 0;
      trak.samples_size = 0;
      stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
      stsc = trak.mdia.minf.stbl.stsc;
      stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
      stts = trak.mdia.minf.stbl.stts;
      ctts = trak.mdia.minf.stbl.ctts;
      stss = trak.mdia.minf.stbl.stss;
      stsd = trak.mdia.minf.stbl.stsd;
      subs = trak.mdia.minf.stbl.subs;
      stdp = trak.mdia.minf.stbl.stdp;
      sbgps = trak.mdia.minf.stbl.sbgps;
      sgpds = trak.mdia.minf.stbl.sgpds;
      last_sample_in_stts_run = -1;
      stts_run_index = -1;
      last_sample_in_ctts_run = -1;
      ctts_run_index = -1;
      last_stss_index = 0;
      subs_entry_index = 0;
      last_subs_sample_index = 0;
      ISOFile.initSampleGroups(trak, null, sbgps, sgpds);
      if (typeof stsz === "undefined") {
        return;
      }

      /* we build the samples one by one and compute their properties */
      for (j = 0; j < stsz.sample_sizes.length; j++) {
        var sample = {};
        sample.number = j;
        sample.track_id = trak.tkhd.track_id;
        sample.timescale = trak.mdia.mdhd.timescale;
        sample.alreadyRead = 0;
        trak.samples[j] = sample;
        /* size can be known directly */
        sample.size = stsz.sample_sizes[j];
        trak.samples_size += sample.size;
        /* computing chunk-based properties (offset, sample description index)*/
        if (j === 0) {
          chunk_index = 1; /* the first sample is in the first chunk (chunk indexes are 1-based) */
          chunk_run_index = 0; /* the first chunk is the first entry in the first_chunk table */
          sample.chunk_index = chunk_index;
          sample.chunk_run_index = chunk_run_index;
          last_sample_in_chunk = stsc.samples_per_chunk[chunk_run_index];
          offset_in_chunk = 0;

          /* Is there another entry in the first_chunk table ? */
          if (chunk_run_index + 1 < stsc.first_chunk.length) {
            /* The last chunk in the run is the chunk before the next first chunk */
            last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
          } else {
            /* There is only one entry in the table, it is valid for all future chunks*/
            last_chunk_in_run = Infinity;
          }
        } else {
          if (j < last_sample_in_chunk) {
            /* the sample is still in the current chunk */
            sample.chunk_index = chunk_index;
            sample.chunk_run_index = chunk_run_index;
          } else {
            /* the sample is in the next chunk */
            chunk_index++;
            sample.chunk_index = chunk_index;
            /* reset the accumulated offset in the chunk */
            offset_in_chunk = 0;
            if (chunk_index <= last_chunk_in_run) ; else {
              chunk_run_index++;
              /* Is there another entry in the first_chunk table ? */
              if (chunk_run_index + 1 < stsc.first_chunk.length) {
                /* The last chunk in the run is the chunk before the next first chunk */
                last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
              } else {
                /* There is only one entry in the table, it is valid for all future chunks*/
                last_chunk_in_run = Infinity;
              }
            }
            sample.chunk_run_index = chunk_run_index;
            last_sample_in_chunk += stsc.samples_per_chunk[chunk_run_index];
          }
        }
        sample.description_index = stsc.sample_description_index[sample.chunk_run_index] - 1;
        sample.description = stsd.entries[sample.description_index];
        sample.offset = stco.chunk_offsets[sample.chunk_index - 1] + offset_in_chunk; /* chunk indexes are 1-based */
        offset_in_chunk += sample.size;

        /* setting dts, cts, duration and rap flags */
        if (j > last_sample_in_stts_run) {
          stts_run_index++;
          if (last_sample_in_stts_run < 0) {
            last_sample_in_stts_run = 0;
          }
          last_sample_in_stts_run += stts.sample_counts[stts_run_index];
        }
        if (j > 0) {
          trak.samples[j - 1].duration = stts.sample_deltas[stts_run_index];
          trak.samples_duration += trak.samples[j - 1].duration;
          sample.dts = trak.samples[j - 1].dts + trak.samples[j - 1].duration;
        } else {
          sample.dts = 0;
        }
        if (ctts) {
          if (j >= last_sample_in_ctts_run) {
            ctts_run_index++;
            if (last_sample_in_ctts_run < 0) {
              last_sample_in_ctts_run = 0;
            }
            last_sample_in_ctts_run += ctts.sample_counts[ctts_run_index];
          }
          sample.cts = trak.samples[j].dts + ctts.sample_offsets[ctts_run_index];
        } else {
          sample.cts = sample.dts;
        }
        if (stss) {
          if (j == stss.sample_numbers[last_stss_index] - 1) {
            // sample numbers are 1-based
            sample.is_sync = true;
            last_stss_index++;
          } else {
            sample.is_sync = false;
            sample.degradation_priority = 0;
          }
          if (subs) {
            if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index == j + 1) {
              sample.subsamples = subs.entries[subs_entry_index].subsamples;
              last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
              subs_entry_index++;
            }
          }
        } else {
          sample.is_sync = true;
        }
        ISOFile.process_sdtp(trak.mdia.minf.stbl.sdtp, sample, sample.number);
        if (stdp) {
          sample.degradation_priority = stdp.priority[j];
        } else {
          sample.degradation_priority = 0;
        }
        if (subs) {
          if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index == j) {
            sample.subsamples = subs.entries[subs_entry_index].subsamples;
            last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
          }
        }
        if (sbgps.length > 0 || sgpds.length > 0) {
          ISOFile.setSampleGroupProperties(trak, sample, j, trak.sample_groups_info);
        }
      }
      if (j > 0) {
        trak.samples[j - 1].duration = Math.max(trak.mdia.mdhd.duration - trak.samples[j - 1].dts, 0);
        trak.samples_duration += trak.samples[j - 1].duration;
      }
    };

    /* Update sample list when new 'moof' boxes are received */
    ISOFile.prototype.updateSampleLists = function () {
      var i, j, k;
      var default_sample_description_index, default_sample_duration, default_sample_size, default_sample_flags;
      var last_run_position;
      var box, moof, traf, trak, trex;
      var sample;
      var sample_flags;
      if (this.moov === undefined) {
        return;
      }
      /* if the input file is fragmented and fetched in multiple downloads, we need to update the list of samples */
      while (this.lastMoofIndex < this.moofs.length) {
        box = this.moofs[this.lastMoofIndex];
        this.lastMoofIndex++;
        if (box.type == "moof") {
          moof = box;
          for (i = 0; i < moof.trafs.length; i++) {
            traf = moof.trafs[i];
            trak = this.getTrackById(traf.tfhd.track_id);
            trex = this.getTrexById(traf.tfhd.track_id);
            if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_DESC) {
              default_sample_description_index = traf.tfhd.default_sample_description_index;
            } else {
              default_sample_description_index = trex ? trex.default_sample_description_index : 1;
            }
            if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_DUR) {
              default_sample_duration = traf.tfhd.default_sample_duration;
            } else {
              default_sample_duration = trex ? trex.default_sample_duration : 0;
            }
            if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_SIZE) {
              default_sample_size = traf.tfhd.default_sample_size;
            } else {
              default_sample_size = trex ? trex.default_sample_size : 0;
            }
            if (traf.tfhd.flags & BoxParser.TFHD_FLAG_SAMPLE_FLAGS) {
              default_sample_flags = traf.tfhd.default_sample_flags;
            } else {
              default_sample_flags = trex ? trex.default_sample_flags : 0;
            }
            traf.sample_number = 0;
            /* process sample groups */
            if (traf.sbgps.length > 0) {
              ISOFile.initSampleGroups(trak, traf, traf.sbgps, trak.mdia.minf.stbl.sgpds, traf.sgpds);
            }
            for (j = 0; j < traf.truns.length; j++) {
              var trun = traf.truns[j];
              for (k = 0; k < trun.sample_count; k++) {
                sample = {};
                sample.moof_number = this.lastMoofIndex;
                sample.number_in_traf = traf.sample_number;
                traf.sample_number++;
                sample.number = trak.samples.length;
                traf.first_sample_index = trak.samples.length;
                trak.samples.push(sample);
                sample.track_id = trak.tkhd.track_id;
                sample.timescale = trak.mdia.mdhd.timescale;
                sample.description_index = default_sample_description_index - 1;
                sample.description = trak.mdia.minf.stbl.stsd.entries[sample.description_index];
                sample.size = default_sample_size;
                if (trun.flags & BoxParser.TRUN_FLAGS_SIZE) {
                  sample.size = trun.sample_size[k];
                }
                trak.samples_size += sample.size;
                sample.duration = default_sample_duration;
                if (trun.flags & BoxParser.TRUN_FLAGS_DURATION) {
                  sample.duration = trun.sample_duration[k];
                }
                trak.samples_duration += sample.duration;
                if (trak.first_traf_merged || k > 0) {
                  sample.dts = trak.samples[trak.samples.length - 2].dts + trak.samples[trak.samples.length - 2].duration;
                } else {
                  if (traf.tfdt) {
                    sample.dts = traf.tfdt.baseMediaDecodeTime;
                  } else {
                    sample.dts = 0;
                  }
                  trak.first_traf_merged = true;
                }
                sample.cts = sample.dts;
                if (trun.flags & BoxParser.TRUN_FLAGS_CTS_OFFSET) {
                  sample.cts = sample.dts + trun.sample_composition_time_offset[k];
                }
                sample_flags = default_sample_flags;
                if (trun.flags & BoxParser.TRUN_FLAGS_FLAGS) {
                  sample_flags = trun.sample_flags[k];
                } else if (k === 0 && trun.flags & BoxParser.TRUN_FLAGS_FIRST_FLAG) {
                  sample_flags = trun.first_sample_flags;
                }
                sample.is_sync = sample_flags >> 16 & 0x1 ? false : true;
                sample.is_leading = sample_flags >> 26 & 0x3;
                sample.depends_on = sample_flags >> 24 & 0x3;
                sample.is_depended_on = sample_flags >> 22 & 0x3;
                sample.has_redundancy = sample_flags >> 20 & 0x3;
                sample.degradation_priority = sample_flags & 0xFFFF;
                //ISOFile.process_sdtp(traf.sdtp, sample, sample.number_in_traf);
                var bdop = traf.tfhd.flags & BoxParser.TFHD_FLAG_BASE_DATA_OFFSET ? true : false;
                var dbim = traf.tfhd.flags & BoxParser.TFHD_FLAG_DEFAULT_BASE_IS_MOOF ? true : false;
                var dop = trun.flags & BoxParser.TRUN_FLAGS_DATA_OFFSET ? true : false;
                var bdo = 0;
                if (!bdop) {
                  if (!dbim) {
                    if (j === 0) {
                      // the first track in the movie fragment
                      bdo = moof.start; // the position of the first byte of the enclosing Movie Fragment Box
                    } else {
                      bdo = last_run_position; // end of the data defined by the preceding *track* (irrespective of the track id) fragment in the moof
                    }
                  } else {
                    bdo = moof.start;
                  }
                } else {
                  bdo = traf.tfhd.base_data_offset;
                }
                if (j === 0 && k === 0) {
                  if (dop) {
                    sample.offset = bdo + trun.data_offset; // If the data-offset is present, it is relative to the base-data-offset established in the track fragment header
                  } else {
                    sample.offset = bdo; // the data for this run starts the base-data-offset defined by the track fragment header
                  }
                } else {
                  sample.offset = last_run_position; // this run starts immediately after the data of the previous run
                }

                last_run_position = sample.offset + sample.size;
                if (traf.sbgps.length > 0 || traf.sgpds.length > 0 || trak.mdia.minf.stbl.sbgps.length > 0 || trak.mdia.minf.stbl.sgpds.length > 0) {
                  ISOFile.setSampleGroupProperties(trak, sample, sample.number_in_traf, traf.sample_groups_info);
                }
              }
            }
            if (traf.subs) {
              trak.has_fragment_subsamples = true;
              var sample_index = traf.first_sample_index;
              for (j = 0; j < traf.subs.entries.length; j++) {
                sample_index += traf.subs.entries[j].sample_delta;
                sample = trak.samples[sample_index - 1];
                sample.subsamples = traf.subs.entries[j].subsamples;
              }
            }
          }
        }
      }
    };

    /* Try to get sample data for a given sample:
       returns null if not found
       returns the same sample if already requested
     */
    ISOFile.prototype.getSample = function (trak, sampleNum) {
      var buffer;
      var sample = trak.samples[sampleNum];
      if (!this.moov) {
        return null;
      }
      if (!sample.data) {
        /* Not yet fetched */
        sample.data = new Uint8Array(sample.size);
        sample.alreadyRead = 0;
        this.samplesDataSize += sample.size;
        Log.debug("ISOFile", "Allocating sample #" + sampleNum + " on track #" + trak.tkhd.track_id + " of size " + sample.size + " (total: " + this.samplesDataSize + ")");
      } else if (sample.alreadyRead == sample.size) {
        /* Already fetched entirely */
        return sample;
      }

      /* The sample has only been partially fetched, we need to check in all buffers */
      while (true) {
        var index = this.stream.findPosition(true, sample.offset + sample.alreadyRead, false);
        if (index > -1) {
          buffer = this.stream.buffers[index];
          var lengthAfterStart = buffer.byteLength - (sample.offset + sample.alreadyRead - buffer.fileStart);
          if (sample.size - sample.alreadyRead <= lengthAfterStart) {
            /* the (rest of the) sample is entirely contained in this buffer */

            Log.debug("ISOFile", "Getting sample #" + sampleNum + " data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - buffer.fileStart) + " read size: " + (sample.size - sample.alreadyRead) + " full size: " + sample.size + ")");
            DataStream.memcpy(sample.data.buffer, sample.alreadyRead, buffer, sample.offset + sample.alreadyRead - buffer.fileStart, sample.size - sample.alreadyRead);

            /* update the number of bytes used in this buffer and check if it needs to be removed */
            buffer.usedBytes += sample.size - sample.alreadyRead;
            this.stream.logBufferLevel();
            sample.alreadyRead = sample.size;
            return sample;
          } else {
            /* the sample does not end in this buffer */

            if (lengthAfterStart === 0) return null;
            Log.debug("ISOFile", "Getting sample #" + sampleNum + " partial data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - buffer.fileStart) + " read size: " + lengthAfterStart + " full size: " + sample.size + ")");
            DataStream.memcpy(sample.data.buffer, sample.alreadyRead, buffer, sample.offset + sample.alreadyRead - buffer.fileStart, lengthAfterStart);
            sample.alreadyRead += lengthAfterStart;

            /* update the number of bytes used in this buffer and check if it needs to be removed */
            buffer.usedBytes += lengthAfterStart;
            this.stream.logBufferLevel();

            /* keep looking in the next buffer */
          }
        } else {
          return null;
        }
      }
    };

    /* Release the memory used to store the data of the sample */
    ISOFile.prototype.releaseSample = function (trak, sampleNum) {
      var sample = trak.samples[sampleNum];
      if (sample.data) {
        this.samplesDataSize -= sample.size;
        sample.data = null;
        sample.alreadyRead = 0;
        return sample.size;
      } else {
        return 0;
      }
    };
    ISOFile.prototype.getAllocatedSampleDataSize = function () {
      return this.samplesDataSize;
    };

    /* Builds the MIME Type 'codecs' sub-parameters for the whole file */
    ISOFile.prototype.getCodecs = function () {
      var i;
      var codecs = "";
      for (i = 0; i < this.moov.traks.length; i++) {
        var trak = this.moov.traks[i];
        if (i > 0) {
          codecs += ",";
        }
        codecs += trak.mdia.minf.stbl.stsd.entries[0].getCodec();
      }
      return codecs;
    };

    /* Helper function */
    ISOFile.prototype.getTrexById = function (id) {
      var i;
      if (!this.moov || !this.moov.mvex) return null;
      for (i = 0; i < this.moov.mvex.trexs.length; i++) {
        var trex = this.moov.mvex.trexs[i];
        if (trex.track_id == id) return trex;
      }
      return null;
    };

    /* Helper function */
    ISOFile.prototype.getTrackById = function (id) {
      if (this.moov === undefined) {
        return null;
      }
      for (var j = 0; j < this.moov.traks.length; j++) {
        var trak = this.moov.traks[j];
        if (trak.tkhd.track_id == id) return trak;
      }
      return null;
    };
    // file:src/isofile-item-processing.js
    ISOFile.prototype.items = [];
    ISOFile.prototype.entity_groups = [];
    /* size of the buffers allocated for samples */
    ISOFile.prototype.itemsDataSize = 0;
    ISOFile.prototype.flattenItemInfo = function () {
      var items = this.items;
      var entity_groups = this.entity_groups;
      var i, j;
      var item;
      var meta = this.meta;
      if (meta === null || meta === undefined) return;
      if (meta.hdlr === undefined) return;
      if (meta.iinf === undefined) return;
      for (i = 0; i < meta.iinf.item_infos.length; i++) {
        item = {};
        item.id = meta.iinf.item_infos[i].item_ID;
        items[item.id] = item;
        item.ref_to = [];
        item.name = meta.iinf.item_infos[i].item_name;
        if (meta.iinf.item_infos[i].protection_index > 0) {
          item.protection = meta.ipro.protections[meta.iinf.item_infos[i].protection_index - 1];
        }
        if (meta.iinf.item_infos[i].item_type) {
          item.type = meta.iinf.item_infos[i].item_type;
        } else {
          item.type = "mime";
        }
        item.content_type = meta.iinf.item_infos[i].content_type;
        item.content_encoding = meta.iinf.item_infos[i].content_encoding;
      }
      if (meta.grpl) {
        for (i = 0; i < meta.grpl.boxes.length; i++) {
          entity_group = {};
          entity_group.id = meta.grpl.boxes[i].group_id;
          entity_group.entity_ids = meta.grpl.boxes[i].entity_ids;
          entity_group.type = meta.grpl.boxes[i].type;
          entity_groups[entity_group.id] = entity_group;
        }
      }
      if (meta.iloc) {
        for (i = 0; i < meta.iloc.items.length; i++) {
          var itemloc = meta.iloc.items[i];
          item = items[itemloc.item_ID];
          if (itemloc.data_reference_index !== 0) {
            Log.warn("Item storage with reference to other files: not supported");
            item.source = meta.dinf.boxes[itemloc.data_reference_index - 1];
          }
          switch (itemloc.construction_method) {
            case 0:
              // offset into the file referenced by the data reference index
              break;
            case 1:
              // offset into the idat box of this meta box
              Log.warn("Item storage with construction_method : not supported");
              break;
            case 2:
              // offset into another item
              Log.warn("Item storage with construction_method : not supported");
              break;
          }
          item.extents = [];
          item.size = 0;
          for (j = 0; j < itemloc.extents.length; j++) {
            item.extents[j] = {};
            item.extents[j].offset = itemloc.extents[j].extent_offset + itemloc.base_offset;
            item.extents[j].length = itemloc.extents[j].extent_length;
            item.extents[j].alreadyRead = 0;
            item.size += item.extents[j].length;
          }
        }
      }
      if (meta.pitm) {
        items[meta.pitm.item_id].primary = true;
      }
      if (meta.iref) {
        for (i = 0; i < meta.iref.references.length; i++) {
          var ref = meta.iref.references[i];
          for (j = 0; j < ref.references.length; j++) {
            items[ref.from_item_ID].ref_to.push({
              type: ref.type,
              id: ref.references[j]
            });
          }
        }
      }
      if (meta.iprp) {
        for (var k = 0; k < meta.iprp.ipmas.length; k++) {
          var ipma = meta.iprp.ipmas[k];
          for (i = 0; i < ipma.associations.length; i++) {
            var association = ipma.associations[i];
            item = items[association.id];
            if (!item) {
              item = entity_groups[association.id];
            }
            if (item) {
              if (item.properties === undefined) {
                item.properties = {};
                item.properties.boxes = [];
              }
              for (j = 0; j < association.props.length; j++) {
                var propEntry = association.props[j];
                if (propEntry.property_index > 0 && propEntry.property_index - 1 < meta.iprp.ipco.boxes.length) {
                  var propbox = meta.iprp.ipco.boxes[propEntry.property_index - 1];
                  item.properties[propbox.type] = propbox;
                  item.properties.boxes.push(propbox);
                }
              }
            }
          }
        }
      }
    };
    ISOFile.prototype.getItem = function (item_id) {
      var buffer;
      var item;
      if (!this.meta) {
        return null;
      }
      item = this.items[item_id];
      if (!item.data && item.size) {
        /* Not yet fetched */
        item.data = new Uint8Array(item.size);
        item.alreadyRead = 0;
        this.itemsDataSize += item.size;
        Log.debug("ISOFile", "Allocating item #" + item_id + " of size " + item.size + " (total: " + this.itemsDataSize + ")");
      } else if (item.alreadyRead === item.size) {
        /* Already fetched entirely */
        return item;
      }

      /* The item has only been partially fetched, we need to check in all buffers to find the remaining extents*/

      for (var i = 0; i < item.extents.length; i++) {
        var extent = item.extents[i];
        if (extent.alreadyRead === extent.length) {
          continue;
        } else {
          var index = this.stream.findPosition(true, extent.offset + extent.alreadyRead, false);
          if (index > -1) {
            buffer = this.stream.buffers[index];
            var lengthAfterStart = buffer.byteLength - (extent.offset + extent.alreadyRead - buffer.fileStart);
            if (extent.length - extent.alreadyRead <= lengthAfterStart) {
              /* the (rest of the) extent is entirely contained in this buffer */

              Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i + " data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + (extent.length - extent.alreadyRead) + " full extent size: " + extent.length + " full item size: " + item.size + ")");
              DataStream.memcpy(item.data.buffer, item.alreadyRead, buffer, extent.offset + extent.alreadyRead - buffer.fileStart, extent.length - extent.alreadyRead);

              /* update the number of bytes used in this buffer and check if it needs to be removed */
              buffer.usedBytes += extent.length - extent.alreadyRead;
              this.stream.logBufferLevel();
              item.alreadyRead += extent.length - extent.alreadyRead;
              extent.alreadyRead = extent.length;
            } else {
              /* the sample does not end in this buffer */

              Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i + " partial data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + lengthAfterStart + " full extent size: " + extent.length + " full item size: " + item.size + ")");
              DataStream.memcpy(item.data.buffer, item.alreadyRead, buffer, extent.offset + extent.alreadyRead - buffer.fileStart, lengthAfterStart);
              extent.alreadyRead += lengthAfterStart;
              item.alreadyRead += lengthAfterStart;

              /* update the number of bytes used in this buffer and check if it needs to be removed */
              buffer.usedBytes += lengthAfterStart;
              this.stream.logBufferLevel();
              return null;
            }
          } else {
            return null;
          }
        }
      }
      if (item.alreadyRead === item.size) {
        /* fetched entirely */
        return item;
      } else {
        return null;
      }
    };

    /* Release the memory used to store the data of the item */
    ISOFile.prototype.releaseItem = function (item_id) {
      var item = this.items[item_id];
      if (item.data) {
        this.itemsDataSize -= item.size;
        item.data = null;
        item.alreadyRead = 0;
        for (var i = 0; i < item.extents.length; i++) {
          var extent = item.extents[i];
          extent.alreadyRead = 0;
        }
        return item.size;
      } else {
        return 0;
      }
    };
    ISOFile.prototype.processItems = function (callback) {
      for (var i in this.items) {
        var item = this.items[i];
        this.getItem(item.id);
        if (callback && !item.sent) {
          callback(item);
          item.sent = true;
          item.data = null;
        }
      }
    };
    ISOFile.prototype.hasItem = function (name) {
      for (var i in this.items) {
        var item = this.items[i];
        if (item.name === name) {
          return item.id;
        }
      }
      return -1;
    };
    ISOFile.prototype.getMetaHandler = function () {
      if (!this.meta) {
        return null;
      } else {
        return this.meta.hdlr.handler;
      }
    };
    ISOFile.prototype.getPrimaryItem = function () {
      if (!this.meta || !this.meta.pitm) {
        return null;
      } else {
        return this.getItem(this.meta.pitm.item_id);
      }
    };
    ISOFile.prototype.itemToFragmentedTrackFile = function (_options) {
      var options = _options || {};
      var item = null;
      if (options.itemId) {
        item = this.getItem(options.itemId);
      } else {
        item = this.getPrimaryItem();
      }
      if (item == null) return null;
      var file = new ISOFile();
      file.discardMdatData = false;
      // assuming the track type is the same as the item type
      var trackOptions = {
        type: item.type,
        description_boxes: item.properties.boxes
      };
      if (item.properties.ispe) {
        trackOptions.width = item.properties.ispe.image_width;
        trackOptions.height = item.properties.ispe.image_height;
      }
      var trackId = file.addTrack(trackOptions);
      if (trackId) {
        file.addSample(trackId, item.data);
        return file;
      } else {
        return null;
      }
    };

    // file:src/isofile-write.js
    /* Rewrite the entire file */
    ISOFile.prototype.write = function (outstream) {
      for (var i = 0; i < this.boxes.length; i++) {
        this.boxes[i].write(outstream);
      }
    };
    ISOFile.prototype.createFragment = function (track_id, sampleNumber, stream_) {
      var trak = this.getTrackById(track_id);
      var sample = this.getSample(trak, sampleNumber);
      if (sample == null) {
        this.setNextSeekPositionFromSample(trak.samples[sampleNumber]);
        return null;
      }
      var stream = stream_ || new DataStream();
      stream.endianness = DataStream.BIG_ENDIAN;
      var moof = this.createSingleSampleMoof(sample);
      moof.write(stream);

      /* adjusting the data_offset now that the moof size is known*/
      moof.trafs[0].truns[0].data_offset = moof.size + 8; //8 is mdat header
      Log.debug("MP4Box", "Adjusting data_offset with new value " + moof.trafs[0].truns[0].data_offset);
      stream.adjustUint32(moof.trafs[0].truns[0].data_offset_position, moof.trafs[0].truns[0].data_offset);
      var mdat = new BoxParser.mdatBox();
      mdat.data = sample.data;
      mdat.write(stream);
      return stream;
    };

    /* Modify the file and create the initialization segment */
    ISOFile.writeInitializationSegment = function (ftyp, moov, total_duration, sample_duration) {
      var i;
      Log.debug("ISOFile", "Generating initialization segment");
      var stream = new DataStream();
      stream.endianness = DataStream.BIG_ENDIAN;
      ftyp.write(stream);

      /* we can now create the new mvex box */
      var mvex = moov.add("mvex");
      if (total_duration) {
        mvex.add("mehd").set("fragment_duration", total_duration);
      }
      for (i = 0; i < moov.traks.length; i++) {
        mvex.add("trex").set("track_id", moov.traks[i].tkhd.track_id).set("default_sample_description_index", 1).set("default_sample_duration", sample_duration).set("default_sample_size", 0).set("default_sample_flags", 1 << 16);
      }
      moov.write(stream);
      return stream.buffer;
    };
    ISOFile.prototype.save = function (name) {
      var stream = new DataStream();
      stream.endianness = DataStream.BIG_ENDIAN;
      this.write(stream);
      stream.save(name);
    };
    ISOFile.prototype.getBuffer = function () {
      var stream = new DataStream();
      stream.endianness = DataStream.BIG_ENDIAN;
      this.write(stream);
      return stream.buffer;
    };
    ISOFile.prototype.initializeSegmentation = function () {
      var i;
      var initSegs;
      var trak;
      var seg;
      if (this.onSegment === null) {
        Log.warn("MP4Box", "No segmentation callback set!");
      }
      if (!this.isFragmentationInitialized) {
        this.isFragmentationInitialized = true;
        this.nextMoofNumber = 0;
        this.resetTables();
      }
      initSegs = [];
      for (i = 0; i < this.fragmentedTracks.length; i++) {
        var moov = new BoxParser.moovBox();
        moov.mvhd = this.moov.mvhd;
        moov.boxes.push(moov.mvhd);
        trak = this.getTrackById(this.fragmentedTracks[i].id);
        moov.boxes.push(trak);
        moov.traks.push(trak);
        seg = {};
        seg.id = trak.tkhd.track_id;
        seg.user = this.fragmentedTracks[i].user;
        seg.buffer = ISOFile.writeInitializationSegment(this.ftyp, moov, this.moov.mvex && this.moov.mvex.mehd ? this.moov.mvex.mehd.fragment_duration : undefined, this.moov.traks[i].samples.length > 0 ? this.moov.traks[i].samples[0].duration : 0);
        initSegs.push(seg);
      }
      return initSegs;
    };

    // file:src/box-print.js
    /* 
     * Copyright (c) Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    BoxParser.Box.prototype.printHeader = function (output) {
      this.size += 8;
      if (this.size > MAX_SIZE) {
        this.size += 8;
      }
      if (this.type === "uuid") {
        this.size += 16;
      }
      output.log(output.indent + "size:" + this.size);
      output.log(output.indent + "type:" + this.type);
    };
    BoxParser.FullBox.prototype.printHeader = function (output) {
      this.size += 4;
      BoxParser.Box.prototype.printHeader.call(this, output);
      output.log(output.indent + "version:" + this.version);
      output.log(output.indent + "flags:" + this.flags);
    };
    BoxParser.Box.prototype.print = function (output) {
      this.printHeader(output);
    };
    BoxParser.ContainerBox.prototype.print = function (output) {
      this.printHeader(output);
      for (var i = 0; i < this.boxes.length; i++) {
        if (this.boxes[i]) {
          var prev_indent = output.indent;
          output.indent += " ";
          this.boxes[i].print(output);
          output.indent = prev_indent;
        }
      }
    };
    ISOFile.prototype.print = function (output) {
      output.indent = "";
      for (var i = 0; i < this.boxes.length; i++) {
        if (this.boxes[i]) {
          this.boxes[i].print(output);
        }
      }
    };
    BoxParser.mvhdBox.prototype.print = function (output) {
      BoxParser.FullBox.prototype.printHeader.call(this, output);
      output.log(output.indent + "creation_time: " + this.creation_time);
      output.log(output.indent + "modification_time: " + this.modification_time);
      output.log(output.indent + "timescale: " + this.timescale);
      output.log(output.indent + "duration: " + this.duration);
      output.log(output.indent + "rate: " + this.rate);
      output.log(output.indent + "volume: " + (this.volume >> 8));
      output.log(output.indent + "matrix: " + this.matrix.join(", "));
      output.log(output.indent + "next_track_id: " + this.next_track_id);
    };
    BoxParser.tkhdBox.prototype.print = function (output) {
      BoxParser.FullBox.prototype.printHeader.call(this, output);
      output.log(output.indent + "creation_time: " + this.creation_time);
      output.log(output.indent + "modification_time: " + this.modification_time);
      output.log(output.indent + "track_id: " + this.track_id);
      output.log(output.indent + "duration: " + this.duration);
      output.log(output.indent + "volume: " + (this.volume >> 8));
      output.log(output.indent + "matrix: " + this.matrix.join(", "));
      output.log(output.indent + "layer: " + this.layer);
      output.log(output.indent + "alternate_group: " + this.alternate_group);
      output.log(output.indent + "width: " + this.width);
      output.log(output.indent + "height: " + this.height);
    }; // file:src/mp4box.js
    /*
     * Copyright (c) 2012-2013. Telecom ParisTech/TSI/MM/GPAC Cyril Concolato
     * License: BSD-3-Clause (see LICENSE file)
     */
    var MP4Box = {};
    MP4Box.createFile = function (_keepMdatData, _stream) {
      /* Boolean indicating if bytes containing media data should be kept in memory */
      var keepMdatData = _keepMdatData !== undefined ? _keepMdatData : true;
      var file = new ISOFile(_stream);
      file.discardMdatData = keepMdatData ? false : true;
      return file;
    };
    {
      exports.createFile = MP4Box.createFile;
    }
  });
  mp4box.Log;
  mp4box.MP4BoxStream;
  mp4box.DataStream;
  mp4box.MultiBufferStream;
  mp4box.MPEG4DescriptorParser;
  mp4box.BoxParser;
  mp4box.XMLSubtitlein4Parser;
  mp4box.Textin4Parser;
  mp4box.ISOFile;
  mp4box.createFile;

  function reduce(array) {
    return array.reduce((e, t) => 256 * e + t);
  }
  function range(array) {
    const s = [101, 103, 119, 99];
    const a = 28;
    const t = array.length - a,
      r = array.slice(t, t + s.length);
    return s.every((e, t) => e === r[t]);
  }
  class TransportDescrambler {
    constructor() {
      this.s = null;
      this.a = null;
      this.l = 0;
      this.c = 0;
      this.u = 1 / 0;
      this.A = false;
      this.d = false;
      this.r = 4194304;
      this.n = new Uint8Array([30, 158, 90, 33, 244, 57, 83, 165, 2, 70, 35, 87, 215, 231, 226, 108]);
      this.t = this.n.slice().reverse();
    }
    destroy() {
      this.s = null;
      this.a = null;
      this.l = 0;
      this.c = 0;
      this.u = 1 / 0;
      this.A = false;
      this.d = false;
      this.r = 4194304;
      this.n = null;
      this.t = null;
    }
    transport(buffer) {
      if (!this.s && this.l > 50) {
        return buffer;
      }
      this.l++;
      if (this.d) {
        return buffer;
      }
      const h = new Uint8Array(buffer);
      if (this.A) {
        if (!(this.c < this.u)) {
          if (this.a && this.s) {
            this.a.set(h, this.r);
            this.s.parse(null, this.r, h.byteLength);
            return this.a.slice(this.r, this.r + h.byteLength);
          } else {
            console.error("video_error_2");
            this.d = true;
            return buffer;
          }
        }
        if (range(h)) {
          this.c++;
        }
      } else {
        const r = function (e, t) {
          const r = function (e, t) {
            for (let r = 0; r < e.byteLength - t.length; r++) for (let n = 0; n < t.length && e[r + n] === t[n]; n++) if (n === t.length - 1) return r;
            return null;
          }(e, t);
          if (r) {
            const t = reduce(e.slice(r + 16, r + 16 + 8));
            return [t, reduce(e.slice(r + 24, r + 24 + 8)), function (e) {
              return e.map(e => ~e);
            }(e.slice(r + 32, r + 32 + t))];
          }
          return null;
        }(h, this.t);
        if (!r) {
          return buffer;
        }
        const l = function (e) {
          try {
            if ("object" != typeof WebAssembly || "function" != typeof WebAssembly.instantiate) {
              throw null;
            }
            {
              const e = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
              if (!(e instanceof WebAssembly.Module && new WebAssembly.Instance(e) instanceof WebAssembly.Instance)) throw null;
            }
          } catch (e) {
            return new Error("video_error_4");
          }
          let t;
          try {
            t = {
              env: {
                __handle_stack_overflow: () => e(new Error("video_error_1")),
                memory: new WebAssembly.Memory({
                  initial: 256,
                  maximum: 256
                })
              }
            };
          } catch (e) {
            return new Error("video_error_5");
          }
          return t;
        }(buffer);
        if (l instanceof Error) {
          console.error(l.message);
          this.d = true;
          return buffer;
        }
        this.A = true;
        this.u = r[1];
        if (range(h)) {
          this.c++;
        }
        WebAssembly.instantiate(r[2], l).then(t => {
          if (!function (e) {
            return "function" == typeof e.parse && "object" == typeof e.memory;
          }(t.instance.exports)) {
            this.d = true;
            console.error('video_error_3');
            return;
          }
          this.s = t.instance.exports;
          this.a = new Uint8Array(this.s.memory.buffer);
        }).catch(t => {
          this.d = true;
          console.error('video_error_6');
        });
      }
      return buffer;
    }
  }

  /* eslint-disable no-bitwise, no-mixed-operators, complexity */

  const DECRYPT = 0;
  const ROUND = 32;
  const BLOCK = 16;
  const Sbox = [0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05, 0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99, 0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62, 0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6, 0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8, 0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35, 0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87, 0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e, 0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1, 0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3, 0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f, 0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51, 0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8, 0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0, 0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84, 0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48];
  const CK = [0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9, 0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9, 0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299, 0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279];

  /**
   * 16 进制串转字节数组
   */
  function hexToArray(str) {
    const arr = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
      arr.push(parseInt(str.substr(i, 2), 16));
    }
    return arr;
  }

  /**
   * 字节数组转 16 进制串
   */
  function ArrayToHex(arr) {
    return arr.map(item => {
      item = item.toString(16);
      return item.length === 1 ? '0' + item : item;
    }).join('');
  }

  /**
   * utf8 串转字节数组
   */
  function utf8ToArray(str) {
    const arr = [];
    for (let i = 0, len = str.length; i < len; i++) {
      const point = str.codePointAt(i);
      if (point <= 0x007f) {
        // 单字节，标量值：00000000 00000000 0zzzzzzz
        arr.push(point);
      } else if (point <= 0x07ff) {
        // 双字节，标量值：00000000 00000yyy yyzzzzzz
        arr.push(0xc0 | point >>> 6); // 110yyyyy（0xc0-0xdf）
        arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
      } else if (point <= 0xD7FF || point >= 0xE000 && point <= 0xFFFF) {
        // 三字节：标量值：00000000 xxxxyyyy yyzzzzzz
        arr.push(0xe0 | point >>> 12); // 1110xxxx（0xe0-0xef）
        arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
        arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
      } else if (point >= 0x010000 && point <= 0x10FFFF) {
        // 四字节：标量值：000wwwxx xxxxyyyy yyzzzzzz
        i++;
        arr.push(0xf0 | point >>> 18 & 0x1c); // 11110www（0xf0-0xf7）
        arr.push(0x80 | point >>> 12 & 0x3f); // 10xxxxxx（0x80-0xbf）
        arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
        arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
      } else {
        // 五、六字节，暂时不支持
        arr.push(point);
        throw new Error('input is not supported');
      }
    }
    return arr;
  }

  /**
   * 字节数组转 utf8 串
   */
  function arrayToUtf8(arr) {
    const str = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i] >= 0xf0 && arr[i] <= 0xf7) {
        // 四字节
        str.push(String.fromCodePoint(((arr[i] & 0x07) << 18) + ((arr[i + 1] & 0x3f) << 12) + ((arr[i + 2] & 0x3f) << 6) + (arr[i + 3] & 0x3f)));
        i += 3;
      } else if (arr[i] >= 0xe0 && arr[i] <= 0xef) {
        // 三字节
        str.push(String.fromCodePoint(((arr[i] & 0x0f) << 12) + ((arr[i + 1] & 0x3f) << 6) + (arr[i + 2] & 0x3f)));
        i += 2;
      } else if (arr[i] >= 0xc0 && arr[i] <= 0xdf) {
        // 双字节
        str.push(String.fromCodePoint(((arr[i] & 0x1f) << 6) + (arr[i + 1] & 0x3f)));
        i++;
      } else {
        // 单字节
        str.push(String.fromCodePoint(arr[i]));
      }
    }
    return str.join('');
  }

  /**
   * 32 比特循环左移
   */
  function rotl(x, n) {
    const s = n & 31;
    return x << s | x >>> 32 - s;
  }

  /**
   * 非线性变换
   */
  function byteSub(a) {
    return (Sbox[a >>> 24 & 0xFF] & 0xFF) << 24 | (Sbox[a >>> 16 & 0xFF] & 0xFF) << 16 | (Sbox[a >>> 8 & 0xFF] & 0xFF) << 8 | Sbox[a & 0xFF] & 0xFF;
  }

  /**
   * 线性变换，加密/解密用
   */
  function l1(b) {
    return b ^ rotl(b, 2) ^ rotl(b, 10) ^ rotl(b, 18) ^ rotl(b, 24);
  }

  /**
   * 线性变换，生成轮密钥用
   */
  function l2(b) {
    return b ^ rotl(b, 13) ^ rotl(b, 23);
  }

  /**
   * 以一组 128 比特进行加密/解密操作
   */
  function sms4Crypt(input, output, roundKey) {
    const x = new Array(4);

    // 字节数组转成字数组（此处 1 字 = 32 比特）
    const tmp = new Array(4);
    for (let i = 0; i < 4; i++) {
      tmp[0] = input[4 * i] & 0xff;
      tmp[1] = input[4 * i + 1] & 0xff;
      tmp[2] = input[4 * i + 2] & 0xff;
      tmp[3] = input[4 * i + 3] & 0xff;
      x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
    }

    // x[i + 4] = x[i] ^ l1(byteSub(x[i + 1] ^ x[i + 2] ^ x[i + 3] ^ roundKey[i]))
    for (let r = 0, mid; r < 32; r += 4) {
      mid = x[1] ^ x[2] ^ x[3] ^ roundKey[r + 0];
      x[0] ^= l1(byteSub(mid)); // x[4]

      mid = x[2] ^ x[3] ^ x[0] ^ roundKey[r + 1];
      x[1] ^= l1(byteSub(mid)); // x[5]

      mid = x[3] ^ x[0] ^ x[1] ^ roundKey[r + 2];
      x[2] ^= l1(byteSub(mid)); // x[6]

      mid = x[0] ^ x[1] ^ x[2] ^ roundKey[r + 3];
      x[3] ^= l1(byteSub(mid)); // x[7]
    }

    // 反序变换
    for (let j = 0; j < 16; j += 4) {
      output[j] = x[3 - j / 4] >>> 24 & 0xff;
      output[j + 1] = x[3 - j / 4] >>> 16 & 0xff;
      output[j + 2] = x[3 - j / 4] >>> 8 & 0xff;
      output[j + 3] = x[3 - j / 4] & 0xff;
    }
  }

  /**
   * 密钥扩展算法
   */
  function sms4KeyExt(key, roundKey, cryptFlag) {
    const x = new Array(4);

    // 字节数组转成字数组（此处 1 字 = 32 比特）
    const tmp = new Array(4);
    for (let i = 0; i < 4; i++) {
      tmp[0] = key[0 + 4 * i] & 0xff;
      tmp[1] = key[1 + 4 * i] & 0xff;
      tmp[2] = key[2 + 4 * i] & 0xff;
      tmp[3] = key[3 + 4 * i] & 0xff;
      x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
    }

    // 与系统参数做异或
    x[0] ^= 0xa3b1bac6;
    x[1] ^= 0x56aa3350;
    x[2] ^= 0x677d9197;
    x[3] ^= 0xb27022dc;

    // roundKey[i] = x[i + 4] = x[i] ^ l2(byteSub(x[i + 1] ^ x[i + 2] ^ x[i + 3] ^ CK[i]))
    for (let r = 0, mid; r < 32; r += 4) {
      mid = x[1] ^ x[2] ^ x[3] ^ CK[r + 0];
      roundKey[r + 0] = x[0] ^= l2(byteSub(mid)); // x[4]

      mid = x[2] ^ x[3] ^ x[0] ^ CK[r + 1];
      roundKey[r + 1] = x[1] ^= l2(byteSub(mid)); // x[5]

      mid = x[3] ^ x[0] ^ x[1] ^ CK[r + 2];
      roundKey[r + 2] = x[2] ^= l2(byteSub(mid)); // x[6]

      mid = x[0] ^ x[1] ^ x[2] ^ CK[r + 3];
      roundKey[r + 3] = x[3] ^= l2(byteSub(mid)); // x[7]
    }

    // 解密时使用反序的轮密钥
    if (cryptFlag === DECRYPT) {
      for (let r = 0, mid; r < 16; r++) {
        mid = roundKey[r];
        roundKey[r] = roundKey[31 - r];
        roundKey[31 - r] = mid;
      }
    }
  }
  function sm4(inArray, key, cryptFlag) {
    let {
      padding = 'pkcs#7',
      mode,
      iv = [],
      output = 'string'
    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    //  默认走 ECB 模式

    if (mode === 'cbc') {
      // CBC 模式，
      if (typeof iv === 'string') iv = hexToArray(iv);
      if (iv.length !== 128 / 8) {
        // iv 不是 128 比特
        throw new Error('iv is invalid');
      }
    }

    // 检查 key
    if (typeof key === 'string') key = hexToArray(key);
    if (key.length !== 128 / 8) {
      // key 不是 128 比特
      throw new Error('key is invalid');
    }

    // 检查输入
    if (typeof inArray === 'string') {
      if (cryptFlag !== DECRYPT) {
        // 加密，输入为 utf8 串
        inArray = utf8ToArray(inArray);
      } else {
        // 解密，输入为 16 进制串
        inArray = hexToArray(inArray);
      }
    } else {
      inArray = [...inArray];
    }

    // 新增填充，sm4 是 16 个字节一个分组，所以统一走到 pkcs#7
    if ((padding === 'pkcs#5' || padding === 'pkcs#7') && cryptFlag !== DECRYPT) {
      const paddingCount = BLOCK - inArray.length % BLOCK;
      for (let i = 0; i < paddingCount; i++) inArray.push(paddingCount);
    }

    // 生成轮密钥
    const roundKey = new Array(ROUND);
    sms4KeyExt(key, roundKey, cryptFlag);
    const outArray = [];
    let lastVector = iv;
    let restLen = inArray.length;
    let point = 0;
    while (restLen >= BLOCK) {
      const input = inArray.slice(point, point + 16);
      const output = new Array(16);
      if (mode === 'cbc') {
        for (let i = 0; i < BLOCK; i++) {
          if (cryptFlag !== DECRYPT) {
            // 加密过程在组加密前进行异或
            input[i] ^= lastVector[i];
          }
        }
      }
      sms4Crypt(input, output, roundKey);
      for (let i = 0; i < BLOCK; i++) {
        if (mode === 'cbc') {
          if (cryptFlag === DECRYPT) {
            // 解密过程在组解密后进行异或
            output[i] ^= lastVector[i];
          }
        }
        outArray[point + i] = output[i];
      }
      if (mode === 'cbc') {
        if (cryptFlag !== DECRYPT) {
          // 使用上一次输出作为加密向量
          lastVector = output;
        } else {
          // 使用上一次输入作为解密向量
          lastVector = input;
        }
      }
      restLen -= BLOCK;
      point += BLOCK;
    }

    // 去除填充，sm4 是 16 个字节一个分组，所以统一走到 pkcs#7
    if ((padding === 'pkcs#5' || padding === 'pkcs#7') && cryptFlag === DECRYPT) {
      const len = outArray.length;
      const paddingCount = outArray[len - 1];
      for (let i = 1; i <= paddingCount; i++) {
        if (outArray[len - i] !== paddingCount) throw new Error('padding is invalid');
      }
      outArray.splice(len - paddingCount, paddingCount);
    }

    // 调整输出
    if (output !== 'array') {
      if (cryptFlag !== DECRYPT) {
        // 加密，输出转 16 进制串
        return ArrayToHex(outArray);
      } else {
        // 解密，输出转 utf8 串
        return arrayToUtf8(outArray);
      }
    } else {
      return outArray;
    }
  }

  // module.exports = {
  //     encrypt(inArray, key, options) {
  //         return sm4(inArray, key, 1, options)
  //     },
  //     // sm4.decrypt(frame, key, { mode: 'cbc', iv: key, output: 'array' })
  //     decrypt(inArray, key, options) {
  //         return sm4(inArray, key, 0, options)
  //     }
  // }

  function getNaluLength$1(data) {
    let length = data[3] | data[2] << 8 | data[1] << 16 | data[0] << 24;
    return length;
  }
  function sm4Decrypt(arrayBuffer, key) {
    let isHevc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const totalLength = arrayBuffer.byteLength;
    // 17(23)/27(39)[是否i帧] ,0/1(), 0,0,0, 0,0,0,0,[NALU],0,0,0,0,[NALU].... 只需要解密NALU部分数据。
    // 其中NALU部分需要跳过两个（nalu头 + 再加一个字节数据）
    let startIndex = 5;
    while (startIndex < totalLength) {
      let tempNaluLength = getNaluLength$1(arrayBuffer.slice(startIndex, startIndex + 4));
      if (tempNaluLength > totalLength) {
        break;
      }
      //
      let naluType = arrayBuffer[startIndex + 4];
      let needDecrypt = false;
      if (isHevc) {
        naluType = naluType >>> 1 & 0x3f;
        needDecrypt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21].includes(naluType);
      } else {
        naluType = naluType & 0x1f;
        needDecrypt = naluType === 1 || naluType === 5;
      }
      //
      if (needDecrypt) {
        const tempNalu = arrayBuffer.slice(startIndex + 4 + 2, startIndex + 4 + tempNaluLength);
        const decryptMsg = sm4(tempNalu, key, 0, {
          padding: 'none',
          output: 'array'
        });
        arrayBuffer.set(decryptMsg, startIndex + 4 + 2);
      }
      startIndex = startIndex + 4 + tempNaluLength;
    }
    return arrayBuffer;
  }

  class Emitter {
    on(name, fn, ctx) {
      const e = this.e || (this.e = {});
      (e[name] || (e[name] = [])).push({
        fn,
        ctx
      });
      return this;
    }
    once(name, fn, ctx) {
      const self = this;
      function listener() {
        self.off(name, listener);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        fn.apply(ctx, args);
      }
      listener._ = fn;
      return this.on(name, listener, ctx);
    }
    emit(name) {
      const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      for (var _len2 = arguments.length, data = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }
      for (let i = 0; i < evtArr.length; i += 1) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }
      return this;
    }
    off(name, callback) {
      const e = this.e || (this.e = {});
      if (!name) {
        Object.keys(e).forEach(key => {
          delete e[key];
        });
        delete this.e;
        return;
      }
      const evts = e[name];
      const liveEvents = [];
      if (evts && callback) {
        for (let i = 0, len = evts.length; i < len; i += 1) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
      }
      if (liveEvents.length) {
        e[name] = liveEvents;
      } else {
        delete e[name];
      }
      return this;
    }
  }

  const mp3FrameParseStats = {
    init: 0,
    findFirstStartCode: 1,
    findSecondStartCode: 2
  };
  class Mp3FrameParseLoader extends Emitter {
    constructor(player) {
      super();
      this.player = player;
      this.isDestroyed = false;
      this.reset();
    }
    destroy() {
      this.isDestroyed = false;
      this.off();
      this.reset();
    }
    reset() {
      this.stats = mp3FrameParseStats.init;
      this.tempBuffer = new Uint8Array(0);
      this.parsedOffset = 0;
      this.versionLayer = 0;
    }
    dispatch(data, ts) {
      let newBuffer = new Uint8Array(this.tempBuffer.length + data.length);
      newBuffer.set(this.tempBuffer, 0);
      newBuffer.set(data, this.tempBuffer.length);
      this.tempBuffer = newBuffer;
      while (1) {
        if (this.isDestroyed) {
          break;
        }
        if (this.state == mp3FrameParseStats.Init) {
          let bf = false;
          while (this.tempBuffer.length - this.parsedOffset >= 2) {
            if (this.isDestroyed) {
              break;
            }

            // mp3帧头是连续11bit等于1
            if (this.tempBuffer[this.parsedOffset] != 0xFF) {
              this.parsedOffset++;
              continue;
            }
            if (this.tempBuffer[this.parsedOffset + 1] & 0xE0 != 0xE0) {
              this.parsedOffset++;
              continue;
            }
            this.versionLayer = this.tempBuffer[this.parsedOffset + 1];
            this.state = mp3FrameParseStats.findFirstStartCode;
            this.fisrtStartCodeOffset = this.parsedOffset;
            this.parsedOffset += 2;
            bf = true;
            break;
          }
          if (bf) {
            continue;
          } else {
            break;
          }
        } else if (this.state == mp3FrameParseStats.findFirstStartCode) {
          let bf = false;
          while (this.tempBuffer.length - this.parsedOffset >= 2) {
            if (this.isDestroyed) {
              break;
            }
            if (this.tempBuffer[this.parsedOffset] != 0xFF) {
              this.parsedOffset++;
              continue;
            }
            if (this.tempBuffer[this.parsedOffset + 1] != this.versionLayer) {
              this.parsedOffset++;
              continue;
            }
            this.state = mp3FrameParseStats.findSecondStartCode;
            this.secondStartCodeOffset = this.parsedOffset;
            this.parsedOffset += 2;
            bf = true;
            break;
          }
          if (bf) {
            continue;
          } else {
            break;
          }
        } else if (this.state == mp3FrameParseStats.findSecondStartCode) {
          let lastFrame = this.tempBuffer.slice(this.fisrtStartCodeOffset, this.secondStartCodeOffset);
          this.emit('data', lastFrame, ts);
          this.tempBuffer = this.tempBuffer.slice(this.secondStartCodeOffset);
          this.fisrtStartCodeOffset = 0;
          this.parsedOffset = 2;
          this.state = mp3FrameParseStats.findFirstStartCode;
        }
      }
    }
  }

  function decrypt(arrayBuffer, key, iv) {
    //  start with 2 index，
    for (let i = 2; i < arrayBuffer.length; ++i) {
      const ii = i - 2;
      const a = key[ii % key.length];
      const b = iv[ii % iv.length];
      arrayBuffer[i] = arrayBuffer[i] ^ (a ^ b);
    }
    return arrayBuffer;
  }
  function getNaluLength(data) {
    let length = data[3] | data[2] << 8 | data[1] << 16 | data[0] << 24;
    return length;
  }
  function xorDecrypt(arrayBuffer, key, iv) {
    let isHevc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    const totalLength = arrayBuffer.byteLength;
    // 17(23)/27(39)[是否i帧] ,0/1(), 0,0,0, 0,0,0,0,[NALU],0,0,0,0,[NALU].... 只需要解密NALU部分数据。
    // 其中NALU部分需要跳过两个（nalu头 + 再加一个字节数据）
    let startIndex = 5;
    while (startIndex < totalLength) {
      let tempNaluLength = getNaluLength(arrayBuffer.slice(startIndex, startIndex + 4));
      if (tempNaluLength > totalLength) {
        break;
      }
      //
      let naluType = arrayBuffer[startIndex + 4];
      let needDecrypt = false;
      if (isHevc) {
        naluType = naluType >>> 1 & 0x3f;
        needDecrypt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21].includes(naluType);
      } else {
        naluType = naluType & 0x1f;
        needDecrypt = naluType === 1 || naluType === 5;
      }
      //
      if (needDecrypt) {
        const tempNalu = arrayBuffer.slice(startIndex + 4, startIndex + 4 + tempNaluLength);
        //  跳过2个字段
        const decryptMsg = decrypt(tempNalu, key, iv);
        arrayBuffer.set(decryptMsg, startIndex + 4);
      }
      startIndex = startIndex + 4 + tempNaluLength;
    }
    return arrayBuffer;
  }

  function concatUint8Array() {
    for (var _len = arguments.length, arr = new Array(_len), _key = 0; _key < _len; _key++) {
      arr[_key] = arguments[_key];
    }
    arr = arr.filter(Boolean);
    if (arr.length < 2) return arr[0];
    const data = new Uint8Array(arr.reduce((p, c) => p + c.byteLength, 0));
    let prevLen = 0;
    arr.forEach(d => {
      data.set(d, prevLen);
      prevLen += d.byteLength;
    });
    return data;
  }

  class Events {
    constructor(master) {
      this.destroys = [];
      this.proxy = this.proxy.bind(this);
      this.master = master;
    }
    proxy(target, name, callback) {
      let option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (!target) {
        return;
      }
      if (Array.isArray(name)) {
        return name.map(item => this.proxy(target, item, callback, option));
      }
      target.addEventListener(name, callback, option);
      const destroy = () => {
        if (isFunction(target.removeEventListener)) {
          target.removeEventListener(name, callback, option);
        }
      };
      this.destroys.push(destroy);
      return destroy;
    }
    destroy() {
      this.master.debug && this.master.debug.log(`Events`, 'destroy');
      this.destroys.forEach(event => event());
      this.destroys = [];
    }
  }

  //  MP4 boxes generator for ISO BMFF (ISO Base Media File Format, defined in ISO/IEC 14496-12)
  class MP4 {
    static init() {
      MP4.types = {
        avc1: [],
        avcC: [],
        hvc1: [],
        hvcC: [],
        av01: [],
        av1C: [],
        btrt: [],
        dinf: [],
        dref: [],
        esds: [],
        ftyp: [],
        hdlr: [],
        mdat: [],
        mdhd: [],
        mdia: [],
        mfhd: [],
        minf: [],
        moof: [],
        moov: [],
        mp4a: [],
        mvex: [],
        mvhd: [],
        sdtp: [],
        stbl: [],
        stco: [],
        stsc: [],
        stsd: [],
        stsz: [],
        stts: [],
        tfdt: [],
        tfhd: [],
        traf: [],
        trak: [],
        trun: [],
        trex: [],
        tkhd: [],
        vmhd: [],
        smhd: [],
        '.mp3': [],
        Opus: [],
        dOps: [],
        'ac-3': [],
        dac3: [],
        'ec-3': [],
        dec3: []
      };
      for (let name in MP4.types) {
        if (MP4.types.hasOwnProperty(name)) {
          MP4.types[name] = [name.charCodeAt(0), name.charCodeAt(1), name.charCodeAt(2), name.charCodeAt(3)];
        }
      }
      let constants = MP4.constants = {};
      constants.FTYP = new Uint8Array([0x69, 0x73, 0x6F, 0x6D,
      // major_brand: isom
      0x0, 0x0, 0x0, 0x1,
      // minor_version: 0x01
      0x69, 0x73, 0x6F, 0x6D,
      // isom
      0x61, 0x76, 0x63, 0x31 // avc1
      ]);

      constants.STSD_PREFIX = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x01 // entry_count
      ]);

      constants.STTS = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00 // entry_count
      ]);

      constants.STSC = constants.STCO = constants.STTS;
      constants.STSZ = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00,
      // sample_size
      0x00, 0x00, 0x00, 0x00 // sample_count
      ]);

      constants.HDLR_VIDEO = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00,
      // pre_defined
      0x76, 0x69, 0x64, 0x65,
      // handler_type: 'vide'
      0x00, 0x00, 0x00, 0x00,
      // reserved: 3 * 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x56, 0x69, 0x64, 0x65, 0x6F, 0x48, 0x61, 0x6E, 0x64, 0x6C, 0x65, 0x72, 0x00 // name: VideoHandler
      ]);

      constants.HDLR_AUDIO = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00,
      // pre_defined
      0x73, 0x6F, 0x75, 0x6E,
      // handler_type: 'soun'
      0x00, 0x00, 0x00, 0x00,
      // reserved: 3 * 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x53, 0x6F, 0x75, 0x6E, 0x64, 0x48, 0x61, 0x6E, 0x64, 0x6C, 0x65, 0x72, 0x00 // name: SoundHandler
      ]);

      constants.DREF = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x01,
      // entry_count
      0x00, 0x00, 0x00, 0x0C,
      // entry_size
      0x75, 0x72, 0x6C, 0x20,
      // type 'url '
      0x00, 0x00, 0x00, 0x01 // version(0) + flags
      ]);

      // Sound media header
      constants.SMHD = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00 // balance(2) + reserved(2)
      ]);

      // video media header
      constants.VMHD = new Uint8Array([0x00, 0x00, 0x00, 0x01,
      // version(0) + flags
      0x00, 0x00,
      // graphicsmode: 2 bytes
      0x00, 0x00, 0x00, 0x00,
      // opcolor: 3 * 2 bytes
      0x00, 0x00]);
    }

    // Generate a box
    static box(type) {
      let size = 8;
      let result = null;
      let datas = Array.prototype.slice.call(arguments, 1);
      let arrayCount = datas.length;
      for (let i = 0; i < arrayCount; i++) {
        size += datas[i].byteLength;
      }
      result = new Uint8Array(size);
      result[0] = size >>> 24 & 0xFF; // size
      result[1] = size >>> 16 & 0xFF;
      result[2] = size >>> 8 & 0xFF;
      result[3] = size & 0xFF;
      result.set(type, 4); // type

      let offset = 8;
      for (let i = 0; i < arrayCount; i++) {
        // data body
        result.set(datas[i], offset);
        offset += datas[i].byteLength;
      }
      return result;
    }

    // emit ftyp & moov
    /**
     * ftyp box与Moov box绑定，描述数据的类型、兼容协议以及视频参数
     * @param meta
     * @returns {Uint8Array}
     */
    static generateInitSegment(meta) {
      let ftyp = MP4.box(MP4.types.ftyp, MP4.constants.FTYP);
      let moov = MP4.moov(meta);
      let result = new Uint8Array(ftyp.byteLength + moov.byteLength);
      result.set(ftyp, 0);
      result.set(moov, ftyp.byteLength);
      return result;
    }

    // Movie metadata box
    static moov(meta) {
      let mvhd = MP4.mvhd(meta.timescale, meta.duration);
      let trak = MP4.trak(meta);
      let mvex = MP4.mvex(meta);
      return MP4.box(MP4.types.moov, mvhd, trak, mvex);
    }

    // Movie header box
    static mvhd(timescale, duration) {
      return MP4.box(MP4.types.mvhd, new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00,
      // creation_time
      0x00, 0x00, 0x00, 0x00,
      // modification_time
      timescale >>> 24 & 0xFF,
      // timescale: 4 bytes
      timescale >>> 16 & 0xFF, timescale >>> 8 & 0xFF, timescale & 0xFF, duration >>> 24 & 0xFF,
      // duration: 4 bytes
      duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, 0x00, 0x01, 0x00, 0x00,
      // Preferred rate: 1.0
      0x01, 0x00, 0x00, 0x00,
      // PreferredVolume(1.0, 2bytes) + reserved(2bytes)
      0x00, 0x00, 0x00, 0x00,
      // reserved: 4 + 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
      // ----begin composition matrix----
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
      // ----end composition matrix----
      0x00, 0x00, 0x00, 0x00,
      // ----begin pre_defined 6 * 4 bytes----
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // ----end pre_defined 6 * 4 bytes----
      0xFF, 0xFF, 0xFF, 0xFF // next_track_ID
      ]));
    }

    // Track box
    static trak(meta) {
      return MP4.box(MP4.types.trak, MP4.tkhd(meta), MP4.mdia(meta));
    }

    // Track header box
    static tkhd(meta) {
      let trackId = meta.id,
        duration = meta.duration;
      let width = meta.presentWidth,
        height = meta.presentHeight;
      return MP4.box(MP4.types.tkhd, new Uint8Array([0x00, 0x00, 0x00, 0x07,
      // version(0) + flags
      0x00, 0x00, 0x00, 0x00,
      // creation_time
      0x00, 0x00, 0x00, 0x00,
      // modification_time
      trackId >>> 24 & 0xFF,
      // track_ID: 4 bytes
      trackId >>> 16 & 0xFF, trackId >>> 8 & 0xFF, trackId & 0xFF, 0x00, 0x00, 0x00, 0x00,
      // reserved: 4 bytes
      duration >>> 24 & 0xFF,
      // duration: 4 bytes
      duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, 0x00, 0x00, 0x00, 0x00,
      // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // layer(2bytes) + alternate_group(2bytes)
      0x00, 0x00, 0x00, 0x00,
      // volume(2bytes) + reserved(2bytes)
      0x00, 0x01, 0x00, 0x00,
      // ----begin composition matrix----
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00,
      // ----end composition matrix----
      width >>> 8 & 0xFF,
      // width and height
      width & 0xFF, 0x00, 0x00,
      // width
      height >>> 8 & 0xFF, height & 0xFF, 0x00, 0x00 // height
      ]));
    }

    // Media Box
    static mdia(meta) {
      return MP4.box(MP4.types.mdia, MP4.mdhd(meta), MP4.hdlr(meta), MP4.minf(meta));
    }

    // Media header box
    static mdhd(meta) {
      let timescale = meta.timescale;
      let duration = meta.duration;
      return MP4.box(MP4.types.mdhd, new Uint8Array([0x00,
      // version(0)
      0x00, 0x00, 0x00,
      // flags
      0x00, 0x00, 0x00, 0x00,
      // creation_time
      0x00, 0x00, 0x00, 0x00,
      // modification_time
      timescale >>> 24 & 0xFF,
      // timescale: 4 bytes
      timescale >>> 16 & 0xFF, timescale >>> 8 & 0xFF, timescale & 0xFF,
      // timescale
      duration >>> 24 & 0xFF,
      // duration: 4 bytes
      duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF,
      // duration
      0x55, 0xC4,
      // language: und (undetermined)
      0x00, 0x00 // pre_defined = 0
      ]));
    }

    // Media handler reference box
    static hdlr(meta) {
      let data = null;
      if (meta.type === 'audio') {
        data = MP4.constants.HDLR_AUDIO;
      } else {
        data = MP4.constants.HDLR_VIDEO;
      }
      return MP4.box(MP4.types.hdlr, data);
    }

    // Media infomation box
    static minf(meta) {
      let xmhd = null;
      if (meta.type === 'audio') {
        xmhd = MP4.box(MP4.types.smhd, MP4.constants.SMHD);
      } else {
        xmhd = MP4.box(MP4.types.vmhd, MP4.constants.VMHD);
      }
      return MP4.box(MP4.types.minf, xmhd, MP4.dinf(), MP4.stbl(meta));
    }

    // Data infomation box
    static dinf() {
      let result = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, MP4.constants.DREF));
      return result;
    }

    // Sample table box
    static stbl(meta) {
      let result = MP4.box(MP4.types.stbl,
      // type: stbl
      MP4.stsd(meta),
      // Sample Description Table
      MP4.box(MP4.types.stts, MP4.constants.STTS),
      // Time-To-Sample
      MP4.box(MP4.types.stsc, MP4.constants.STSC),
      // Sample-To-Chunk
      MP4.box(MP4.types.stsz, MP4.constants.STSZ),
      // Sample size
      MP4.box(MP4.types.stco, MP4.constants.STCO) // Chunk offset
      );

      return result;
    }

    // Sample description box
    static stsd(meta) {
      if (meta.type === 'audio') {
        if (meta.audioType === 'mp3') {
          return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp3(meta));
        }

        // else: aac -> mp4a
        return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.mp4a(meta));
      } else {
        if (meta.videoType === 'avc') {
          // avc
          return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.avc1(meta));
        } else {
          // hevc
          return MP4.box(MP4.types.stsd, MP4.constants.STSD_PREFIX, MP4.hvc1(meta));
        }
      }
    }
    static mp3(meta) {
      let channelCount = meta.channelCount;
      let sampleRate = meta.audioSampleRate;
      let data = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // reserved(4)
      0x00, 0x00, 0x00, 0x01,
      // reserved(2) + data_reference_index(2)
      0x00, 0x00, 0x00, 0x00,
      // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, channelCount,
      // channelCount(2)
      0x00, 0x10,
      // sampleSize(2)
      0x00, 0x00, 0x00, 0x00,
      // reserved(4)
      sampleRate >>> 8 & 0xFF,
      // Audio sample rate
      sampleRate & 0xFF, 0x00, 0x00]);
      return MP4.box(MP4.types['.mp3'], data);
    }
    static mp4a(meta) {
      let channelCount = meta.channelCount;
      let sampleRate = meta.audioSampleRate;
      let data = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // reserved(4)
      0x00, 0x00, 0x00, 0x01,
      // reserved(2) + data_reference_index(2)
      0x00, 0x00, 0x00, 0x00,
      // reserved: 2 * 4 bytes
      0x00, 0x00, 0x00, 0x00, 0x00, channelCount,
      // channelCount(2)
      0x00, 0x10,
      // sampleSize(2)
      0x00, 0x00, 0x00, 0x00,
      // reserved(4)
      sampleRate >>> 8 & 0xFF,
      // Audio sample rate
      sampleRate & 0xFF, 0x00, 0x00]);
      return MP4.box(MP4.types.mp4a, data, MP4.esds(meta));
    }
    static esds(meta) {
      let config = meta.config || [];
      let configSize = config.length;
      let data = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version 0 + flags

      0x03,
      // descriptor_type
      0x17 + configSize,
      // length3
      0x00, 0x01,
      // es_id
      0x00,
      // stream_priority

      0x04,
      // descriptor_type
      0x0F + configSize,
      // length
      0x40,
      // codec: mpeg4_audio
      0x15,
      // stream_type: Audio
      0x00, 0x00, 0x00,
      // buffer_size
      0x00, 0x00, 0x00, 0x00,
      // maxBitrate
      0x00, 0x00, 0x00, 0x00,
      // avgBitrate

      0x05 // descriptor_type
      ].concat([configSize]).concat(config).concat([0x06, 0x01, 0x02 // GASpecificConfig
      ]));

      return MP4.box(MP4.types.esds, data);
    }

    // avc
    static avc1(meta) {
      let avcc = meta.avcc;
      const width = meta.codecWidth;
      const height = meta.codecHeight;
      let data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, width >>> 8 & 255, width & 255, height >>> 8 & 255, height & 255, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 255, 255]);
      return MP4.box(MP4.types.avc1, data, MP4.box(MP4.types.avcC, avcc));
    }

    // hvc
    static hvc1(meta) {
      let avcc = meta.avcc;
      const width = meta.codecWidth;
      const height = meta.codecHeight;
      let data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, width >>> 8 & 255, width & 255, height >>> 8 & 255, height & 255, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 255, 255]);
      return MP4.box(MP4.types.hvc1, data, MP4.box(MP4.types.hvcC, avcc));
    }

    // Movie Extends box
    static mvex(meta) {
      return MP4.box(MP4.types.mvex, MP4.trex(meta));
    }

    // Track Extends box
    static trex(meta) {
      let trackId = meta.id;
      let data = new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) + flags
      trackId >>> 24 & 0xFF,
      // track_ID
      trackId >>> 16 & 0xFF, trackId >>> 8 & 0xFF, trackId & 0xFF, 0x00, 0x00, 0x00, 0x01,
      // default_sample_description_index
      0x00, 0x00, 0x00, 0x00,
      // default_sample_duration
      0x00, 0x00, 0x00, 0x00,
      // default_sample_size
      0x00, 0x01, 0x00, 0x01 // default_sample_flags
      ]);

      return MP4.box(MP4.types.trex, data);
    }

    // Movie fragment box
    static moof(meta, baseMediaDecodeTime) {
      return MP4.box(MP4.types.moof, MP4.mfhd(meta.sequenceNumber), MP4.traf(meta, baseMediaDecodeTime));
    }
    //
    static mfhd(sequenceNumber) {
      let data = new Uint8Array([0x00, 0x00, 0x00, 0x00, sequenceNumber >>> 24 & 0xFF,
      // sequence_number: int32
      sequenceNumber >>> 16 & 0xFF, sequenceNumber >>> 8 & 0xFF, sequenceNumber & 0xFF]);
      return MP4.box(MP4.types.mfhd, data);
    }

    // Track fragment box
    static traf(meta, baseMediaDecodeTime) {
      let trackId = meta.id;

      // Track fragment header box
      let tfhd = MP4.box(MP4.types.tfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) & flags
      trackId >>> 24 & 0xFF,
      // track_ID
      trackId >>> 16 & 0xFF, trackId >>> 8 & 0xFF, trackId & 0xFF]));
      // Track Fragment Decode Time
      let tfdt = MP4.box(MP4.types.tfdt, new Uint8Array([0x00, 0x00, 0x00, 0x00,
      // version(0) & flags
      baseMediaDecodeTime >>> 24 & 0xFF,
      // baseMediaDecodeTime: int32
      baseMediaDecodeTime >>> 16 & 0xFF, baseMediaDecodeTime >>> 8 & 0xFF, baseMediaDecodeTime & 0xFF]));
      let sdtp = MP4.sdtp(meta);
      let trun = MP4.trun(meta, sdtp.byteLength + 16 + 16 + 8 + 16 + 8 + 8);
      return MP4.box(MP4.types.traf, tfhd, tfdt, trun, sdtp);
    }

    // Sample Dependency Type box
    static sdtp(meta) {
      let data = new Uint8Array(4 + 1);
      let flags = meta.flags;
      data[4] = flags.isLeading << 6 | flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
      return MP4.box(MP4.types.sdtp, data);
    }
    // trun
    static trun(meta, offset) {
      let dataSize = 12 + 16;
      let data = new Uint8Array(dataSize);
      offset += 8 + dataSize;
      data.set([0x00, 0x00, 0x0F, 0x01,
      // version(0) & flags
      0x00, 0x00, 0x00, 0x01,
      // sample_count
      offset >>> 24 & 0xFF,
      // data_offset
      offset >>> 16 & 0xFF, offset >>> 8 & 0xFF, offset & 0xFF], 0);
      let duration = meta.duration;
      let size = meta.size;
      let flags = meta.flags;
      let cts = meta.cts;
      data.set([duration >>> 24 & 0xFF,
      // sample_duration
      duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, size >>> 24 & 0xFF,
      // sample_size
      size >>> 16 & 0xFF, size >>> 8 & 0xFF, size & 0xFF, flags.isLeading << 2 | flags.dependsOn,
      // sample_flags
      flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.isNonSync, 0x00, 0x00,
      // sample_degradation_priority
      cts >>> 24 & 0xFF,
      // sample_composition_time_offset
      cts >>> 16 & 0xFF, cts >>> 8 & 0xFF, cts & 0xFF], 12);
      return MP4.box(MP4.types.trun, data);
    }
    // mdat
    static mdat(data) {
      return MP4.box(MP4.types.mdat, data);
    }
  }
  MP4.init();

  var defineProperty = createCommonjsModule(function (module) {
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  });

  unwrapExports(defineProperty);

  const mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];
  const mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];
  const mpegAudioV25SampleRateTable = [11025, 12000, 8000, 0];
  const mpegAudioL1BitRateTable = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, -1];
  const mpegAudioL2BitRateTable = [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, -1];
  const mpegAudioL3BitRateTable = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1];
  function parseMp3AudioSpecificConfig(mp3frame) {
    if (mp3frame.length < 4) {
      console.error(`Invalid MP3 packet, header missing!`);
      return;
    }
    let array = new Uint8Array(mp3frame.buffer);
    let result = null;
    if (array[0] !== 0xFF) {
      console.error(`Invalid MP3 packet, first byte != 0xFF `);
      return;
    }
    let ver = array[1] >>> 3 & 0x03;
    let layer = (array[1] & 0x06) >> 1;
    let bitrate_index = (array[2] & 0xF0) >>> 4;
    let sampling_freq_index = (array[2] & 0x0C) >>> 2;
    let channel_mode = array[3] >>> 6 & 0x03;
    let channel_count = channel_mode !== 3 ? 2 : 1;
    let sample_rate = 0;
    let bit_rate = 0;

    let codec = 'mp3';
    switch (ver) {
      case 0:
        // MPEG 2.5
        sample_rate = mpegAudioV25SampleRateTable[sampling_freq_index];
        break;
      case 2:
        // MPEG 2
        sample_rate = mpegAudioV20SampleRateTable[sampling_freq_index];
        break;
      case 3:
        // MPEG 1
        sample_rate = mpegAudioV10SampleRateTable[sampling_freq_index];
        break;
    }
    switch (layer) {
      case 1:
        if (bitrate_index < mpegAudioL3BitRateTable.length) {
          bit_rate = mpegAudioL3BitRateTable[bitrate_index];
        }
        break;
      case 2:
        if (bitrate_index < mpegAudioL2BitRateTable.length) {
          bit_rate = mpegAudioL2BitRateTable[bitrate_index];
        }
        break;
      case 3:
        if (bitrate_index < mpegAudioL1BitRateTable.length) {
          bit_rate = mpegAudioL1BitRateTable[bitrate_index];
        }
        break;
    }
    result = {
      bitRate: bit_rate,
      samplingRate: sample_rate,
      channelCount: channel_count,
      codec: codec,
      originalCodec: codec,
      audioType: 'mp3'
    };
    return result;
  }

  const TS_STREAM_TYPE = {
    kMPEG1Audio: 0x03,
    kMPEG2Audio: 0x04,
    kPESPrivateData: 0x06,
    kADTSAAC: 0x0F,
    kLOASAAC: 0x11,
    kAC3: 0x81,
    kEAC3: 0x87,
    kMetadata: 0x15,
    kSCTE35: 0x86,
    kH264: 0x1b,
    kH265: 0x24
  };
  class SliceQueue {
    constructor() {
      this.slices = [];
      this.total_length = 0;
      this.expected_length = 0;
      this.random_access_indicator = 0;
    }
  }
  class PESData {
    constructor() {
      this.pid = null;
      this.data = null;
      this.stream_type = null;
      this.random_access_indicator = null;
    }
  }
  class PESPrivateData {
    constructor() {
      this.pid = null;
      this.stream_id = null;
      this.len = null;
      this.data = null;
      this.pts = null;
      this.nearest_pts = null;
      this.dts = null;
    }
  }
  const MPEG4SamplingFrequencies = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  class MediaInfo {
    constructor() {
      this.mimeType = null;
      this.duration = null;
      this.hasAudio = null;
      this.hasVideo = null;
      this.audioCodec = null;
      this.videoCodec = null;
      this.audioDataRate = null;
      this.videoDataRate = null;
      this.audioSampleRate = null;
      this.audioChannelCount = null;
      this.width = null;
      this.height = null;
      this.fps = null;
      this.profile = null;
      this.level = null;
      this.refFrames = null;
      this.chromaFormat = null;
      this.sarNum = null;
      this.sarDen = null;
      this.metadata = null;
      this.segments = null; // MediaInfo[]
      this.segmentCount = null;
      this.hasKeyframesIndex = null;
      this.keyframesIndex = null;
    }
    isComplete() {
      let audioInfoComplete = this.hasAudio === false || this.hasAudio === true && this.audioCodec != null && this.audioSampleRate != null && this.audioChannelCount != null;
      let videoInfoComplete = this.hasVideo === false || this.hasVideo === true && this.videoCodec != null && this.width != null && this.height != null && this.fps != null && this.profile != null && this.level != null && this.refFrames != null && this.chromaFormat != null && this.sarNum != null && this.sarDen != null;

      // keyframesIndex may not be present
      return this.mimeType != null && audioInfoComplete && videoInfoComplete;
    }
    isSeekable() {
      return this.hasKeyframesIndex === true;
    }
    getNearestKeyframe(milliseconds) {
      if (this.keyframesIndex == null) {
        return null;
      }
      let table = this.keyframesIndex;
      let keyframeIdx = this._search(table.times, milliseconds);
      return {
        index: keyframeIdx,
        milliseconds: table.times[keyframeIdx],
        fileposition: table.filepositions[keyframeIdx]
      };
    }
    _search(list, value) {
      let idx = 0;
      let last = list.length - 1;
      let mid = 0;
      let lbound = 0;
      let ubound = last;
      if (value < list[0]) {
        idx = 0;
        lbound = ubound + 1; // skip search
      }

      while (lbound <= ubound) {
        mid = lbound + Math.floor((ubound - lbound) / 2);
        if (mid === last || value >= list[mid] && value < list[mid + 1]) {
          idx = mid;
          break;
        } else if (list[mid] < value) {
          lbound = mid + 1;
        } else {
          ubound = mid - 1;
        }
      }
      return idx;
    }
  }
  class AudioSpecificConfig {
    constructor(frame) {
      let config = null;
      let original_audio_object_type = frame.audio_object_type;
      let audio_object_type = frame.audio_object_type;
      let sampling_index = frame.sampling_freq_index;
      let channel_config = frame.channel_config;
      let extension_sampling_index = 0;
      let userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('firefox') !== -1) {
        // firefox: use SBR (HE-AAC) if freq less than 24kHz
        if (sampling_index >= 6) {
          audio_object_type = 5;
          config = new Array(4);
          extension_sampling_index = sampling_index - 3;
        } else {
          // use LC-AAC
          audio_object_type = 2;
          config = new Array(2);
          extension_sampling_index = sampling_index;
        }
      } else if (userAgent.indexOf('android') !== -1) {
        // android: always use LC-AAC
        audio_object_type = 2;
        config = new Array(2);
        extension_sampling_index = sampling_index;
      } else {
        // for other browsers, e.g. chrome...
        // Always use HE-AAC to make it easier to switch aac codec profile
        audio_object_type = 5;
        extension_sampling_index = sampling_index;
        config = new Array(4);
        if (sampling_index >= 6) {
          extension_sampling_index = sampling_index - 3;
        } else if (channel_config === 1) {
          // Mono channel
          audio_object_type = 2;
          config = new Array(2);
          extension_sampling_index = sampling_index;
        }
      }
      config[0] = audio_object_type << 3;
      config[0] |= (sampling_index & 0x0F) >>> 1;
      config[1] = (sampling_index & 0x0F) << 7;
      config[1] |= (channel_config & 0x0F) << 3;
      if (audio_object_type === 5) {
        config[1] |= (extension_sampling_index & 0x0F) >>> 1;
        config[2] = (extension_sampling_index & 0x01) << 7;
        // extended audio object type: force to 2 (LC-AAC)
        config[2] |= 2 << 2;
        config[3] = 0;
      }
      this.config = config;
      this.sampling_rate = MPEG4SamplingFrequencies[sampling_index];
      this.sampling_index = sampling_index;
      this.channel_count = channel_config;
      this.object_type = audio_object_type;
      this.original_object_type = original_audio_object_type;
      this.codec_mimetype = 'mp4a.40.' + audio_object_type;
      this.original_codec_mimetype = 'mp4a.40.' + original_audio_object_type;
    }
  }

  if (!Date.now) Date.now = function () {
    return new Date().getTime();
  };

  /**
   *
   * @param ModuleVideo 视频解码器
   * @param ModuleAudio 音频解码器
   * @param forHardDecode 是否硬解码，只在worker线程请求，并且解封装协议，解码交给上层。
   */
  function workerPostRun () {
    let ModuleVideo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let ModuleAudio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let forHardDecode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let bufferList = [];
    let tempAudioBuffer = [];
    let wcsVideoDecoder = {};
    let abortController = new AbortController();
    let socket = null;
    let streamRate = null;
    let streamRateAndStatsInterval = null;
    let input = null;
    let videoWidth = null;
    let videoHeight = null;
    let hasInitVideoCodec = false;
    let hasInitAudioCodec = false;
    let isVideoFirstIFrame = isTrue(forHardDecode) ? true : false;
    // let lastDecodeVideoFrameTimestamp = 0;
    // let lastDecodeVideoFrameLocalTimestamp = 0;
    // let lastDecodeAudioFrameTimestamp = 0;
    // let newDecodedVideoFrameTimestamp = 0;
    // let newDecodedVideoFrameLocalTimestamp = 0;
    // let newDecodedAudioFrameTimestamp = 0;
    let isStreamTimeDiffMoreThanLocalTimeDiff = false;
    let preLoopTimestamp = null;
    let bufferStartDts = null;
    let bufferStartLocalTs = null;
    let audioOutputArray = [];
    let wasmDecodeErrorStartTime = null;
    let iframeIntervalTimestamp = null;
    let audioRemain = 0;
    let audioChannels = 0;
    let preIframeTs = null;
    let preTimestamp = null;
    let preTimestampDuration = 0;
    let prevPayloadBufferSize = 0;
    let isWebglContextLost = false;
    let isWidthOrHeightChanged = false;
    let isSimdDecodeError = false;
    let isHevc = null;
    let nalUnitSize = null;
    let audioDepth = null;
    let requestAbort = false;
    let getDefaultOpt = () => {
      const defaultOptions = getDefaultPlayerOptions();
      return {
        debug: defaultOptions.debug,
        debugLevel: defaultOptions.debugLevel,
        debugUuid: defaultOptions.debugUuid,
        useOffscreen: defaultOptions.useOffscreen,
        useWCS: defaultOptions.useWCS,
        useMSE: defaultOptions.useMSE,
        videoBuffer: defaultOptions.videoBuffer,
        videoBufferDelay: defaultOptions.videoBufferDelay,
        openWebglAlignment: defaultOptions.openWebglAlignment,
        playType: defaultOptions.playType,
        hasAudio: defaultOptions.hasAudio,
        hasVideo: defaultOptions.hasVideo,
        playbackRate: 1,
        playbackForwardMaxRateDecodeIFrame: defaultOptions.playbackForwardMaxRateDecodeIFrame,
        playbackIsCacheBeforeDecodeForFpsRender: defaultOptions.playbackConfig.isCacheBeforeDecodeForFpsRender,
        sampleRate: 0,
        networkDelay: defaultOptions.networkDelay,
        visibility: true,
        useSIMD: defaultOptions.useSIMD,
        isRecording: false,
        recordType: defaultOptions.recordType,
        isNakedFlow: defaultOptions.isNakedFlow,
        checkFirstIFrame: defaultOptions.checkFirstIFrame,
        audioBufferSize: 1024,
        isM7sCrypto: defaultOptions.isM7sCrypto,
        m7sCryptoAudio: defaultOptions.m7sCryptoAudio,
        cryptoKey: defaultOptions.cryptoKey,
        cryptoIV: defaultOptions.cryptoIV,
        isSm4Crypto: defaultOptions.isSm4Crypto,
        sm4CryptoKey: defaultOptions.sm4CryptoKey,
        isXorCrypto: defaultOptions.isXorCrypto,
        isHls265: false,
        isFlv: defaultOptions.isFlv,
        isFmp4: defaultOptions.isFmp4,
        isMpeg4: defaultOptions.isMpeg4,
        isTs: defaultOptions.isTs,
        isFmp4Private: defaultOptions.isFmp4Private,
        isEmitSEI: defaultOptions.isEmitSEI,
        isRecordTypeFlv: false,
        isWasmMp4: false,
        isChrome: false,
        isDropSameTimestampGop: defaultOptions.isDropSameTimestampGop,
        mseDecodeAudio: defaultOptions.mseDecodeAudio,
        nakedFlowH265DemuxUseNew: defaultOptions.nakedFlowH265DemuxUseNew,
        mseDecoderUseWorker: defaultOptions.mseDecoderUseWorker,
        mseAutoCleanupSourceBuffer: defaultOptions.mseAutoCleanupSourceBuffer,
        mseAutoCleanupMaxBackwardDuration: defaultOptions.mseAutoCleanupMaxBackwardDuration,
        mseAutoCleanupMinBackwardDuration: defaultOptions.mseAutoCleanupMinBackwardDuration,
        mseCorrectTimeDuration: defaultOptions.mseCorrectTimeDuration,
        mseCorrectAudioTimeDuration: defaultOptions.mseCorrectAudioTimeDuration
      };
    };
    //  wcs demuxer
    if ("VideoEncoder" in self) {
      //  废弃掉了，暂时不用
      wcsVideoDecoder = {
        hasInit: false,
        isEmitInfo: false,
        offscreenCanvas: null,
        offscreenCanvasCtx: null,
        decoder: new VideoDecoder({
          output: function (videoFrame) {
            if (!wcsVideoDecoder.isEmitInfo) {
              decoder.debug.log('worker', 'Webcodecs Video Decoder initSize');
              postMessage({
                cmd: WORKER_CMD_TYPE.initVideo,
                w: videoFrame.codedWidth,
                h: videoFrame.codedHeight
              });
              wcsVideoDecoder.isEmitInfo = true;
              wcsVideoDecoder.offscreenCanvas = new OffscreenCanvas(videoFrame.codedWidth, videoFrame.codedHeight);
              wcsVideoDecoder.offscreenCanvasCtx = wcsVideoDecoder.offscreenCanvas.getContext("2d");
            }
            if (isFunction(videoFrame.createImageBitmap)) {
              videoFrame.createImageBitmap().then(image => {
                wcsVideoDecoder.offscreenCanvasCtx.drawImage(image, 0, 0, videoFrame.codedWidth, videoFrame.codedHeight);
                let image_bitmap = wcsVideoDecoder.offscreenCanvas.transferToImageBitmap();
                postMessage({
                  cmd: WORKER_CMD_TYPE.render,
                  buffer: image_bitmap,
                  delay: decoder.delay,
                  ts: 0
                }, [image_bitmap]);
                closeVideoFrame(videoFrame);
              });
            } else {
              wcsVideoDecoder.offscreenCanvasCtx.drawImage(videoFrame, 0, 0, videoFrame.codedWidth, videoFrame.codedHeight);
              let image_bitmap = wcsVideoDecoder.offscreenCanvas.transferToImageBitmap();
              postMessage({
                cmd: WORKER_CMD_TYPE.render,
                buffer: image_bitmap,
                delay: decoder.delay,
                ts: 0
              }, [image_bitmap]);
              closeVideoFrame(videoFrame);
            }
          },
          error: function (error) {
            decoder.debug.error('worker', 'VideoDecoder error', error);
          }
        }),
        decode: function (payload, ts, cts) {
          const isIFrame = payload[0] >> 4 === 1;
          if (!wcsVideoDecoder.hasInit) {
            if (isIFrame && payload[1] === 0) {
              const videoCodec = payload[0] & 0x0F;
              postMessage({
                cmd: WORKER_CMD_TYPE.videoCode,
                code: videoCodec
              });
              const payloadNew = new Uint8Array(payload);
              postMessage({
                cmd: WORKER_CMD_TYPE.videoCodec,
                buffer: payloadNew,
                codecId: videoCodec
              }, [payloadNew.buffer]);
              let config = null;
              let videInfo = null;
              const extraData = payload.slice(5);
              if (videoCodec === VIDEO_ENC_CODE.h264) {
                // config = formatAvcVideoDecoderConfigure(extraData);
                videInfo = parseAVCDecoderConfigurationRecord(extraData);
                config = {
                  codec: videInfo.codec,
                  description: extraData
                };
              } else if (videoCodec === VIDEO_ENC_CODE.h265) {
                // config = formatHevcVideoDecoderConfigure(extraData);
                videInfo = parseHEVCDecoderConfigurationRecord$4(extraData);
                config = {
                  codec: videInfo.codec,
                  description: extraData
                };
              }
              if (videInfo && videInfo.codecWidth && videInfo.codecHeight) {
                config.codedHeight = videInfo.codecHeight;
                config.codedWidth = videInfo.codecWidth;
              }
              try {
                wcsVideoDecoder.decoder.configure(config);
                wcsVideoDecoder.hasInit = true;
              } catch (e) {
                decoder.debug.log('worker', 'VideoDecoder configure error', e.code, e);
              }
            }
          } else {
            const chunk = new EncodedVideoChunk({
              data: payload.slice(5),
              timestamp: ts,
              type: isIFrame ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta
            });
            wcsVideoDecoder.decoder.decode(chunk);
          }
        },
        reset() {
          wcsVideoDecoder.hasInit = false;
          wcsVideoDecoder.isEmitInfo = false;
          wcsVideoDecoder.offscreenCanvas = null;
          wcsVideoDecoder.offscreenCanvasCtx = null;
        }
      };
    }
    let abort = function () {
      requestAbort = true;
      if (decoder.fetchStatus !== LOADER_STATUS.buffering || isFalse(decoder._opt.isChrome)) {
        if (abortController) {
          try {
            abortController.abort();
            abortController = null;
          } catch (e) {
            //
            decoder.debug.log('worker', 'abort catch', e);
          }
        }
      } else {
        abortController = null;
        decoder.debug.log('worker', `abort() and not abortController.abort() _status is ${decoder.fetchStatus} and _isChrome is ${decoder._opt.isChrome}`);
      }
    };
    //  nakedFlowDemuxer
    let nakedFlowDemuxer = {
      init() {
        nakedFlowDemuxer.lastBuf = null;
        nakedFlowDemuxer.vps = null;
        nakedFlowDemuxer.sps = null;
        nakedFlowDemuxer.pps = null;
        nakedFlowDemuxer.streamType = null;
        nakedFlowDemuxer.localDts = 0;
        nakedFlowDemuxer.isSendSeqHeader = false;
      },
      destroy() {
        nakedFlowDemuxer.lastBuf = null;
        nakedFlowDemuxer.vps = null;
        nakedFlowDemuxer.sps = null;
        nakedFlowDemuxer.pps = null;
        nakedFlowDemuxer.streamType = null;
        nakedFlowDemuxer.localDts = 0;
        nakedFlowDemuxer.isSendSeqHeader = false;
      },
      //
      dispatch(data) {
        const uint8Array = new Uint8Array(data);
        // decoder.debug.log('worker', 'nakedFlowDemuxer dispatch', uint8Array.byteLength);
        nakedFlowDemuxer.extractNALu$2(uint8Array);
        // nakedFlowDemuxer.handleNALu(uint8Array);
      },

      getNaluDts() {
        let resul = nakedFlowDemuxer.localDts;
        nakedFlowDemuxer.localDts = nakedFlowDemuxer.localDts + 1000 / 25;
        return resul;
      },
      getNaluAudioDts() {
        const audioContextSampleRate = decoder._opt.sampleRate;
        const audioBufferSize = decoder._opt.audioBufferSize;
        return nakedFlowDemuxer.localDts + parseInt(audioBufferSize / audioContextSampleRate * 1000);
      },
      extractNALu(buffer) {
        let i = 0,
          length = buffer.byteLength,
          value,
          state = 0,
          result = [],
          lastIndex;
        while (i < length) {
          value = buffer[i++];
          // Annex-B格式使用start code进行分割，start code为0x000001或0x00000001，SPS/PPS作为一般NALU单元以start code作为分隔符的方式放在文件或者直播流的头部。
          // finding 3 or 4-byte start codes (00 00 01 OR 00 00 00 01)
          switch (state) {
            case 0:
              if (value === 0) {
                state = 1;
              }
              break;
            case 1:
              if (value === 0) {
                state = 2;
              } else {
                state = 0;
              }
              break;
            case 2:
            case 3:
              if (value === 0) {
                state = 3;
              } else if (value === 1 && i < length) {
                if (lastIndex) {
                  result.push(buffer.subarray(lastIndex, i - state - 1));
                }
                lastIndex = i;
                state = 0;
              } else {
                state = 0;
              }
              break;
          }
        }
        if (lastIndex) {
          result.push(buffer.subarray(lastIndex, length));
        }
        return result;
      },
      extractNALu$2(buffer) {
        let typedArray = null;
        if (!buffer || buffer.byteLength < 1) return;
        if (nakedFlowDemuxer.lastBuf) {
          typedArray = new Uint8Array(buffer.byteLength + nakedFlowDemuxer.lastBuf.length);
          typedArray.set(nakedFlowDemuxer.lastBuf);
          typedArray.set(new Uint8Array(buffer), nakedFlowDemuxer.lastBuf.length);
        } else {
          typedArray = new Uint8Array(buffer);
        }
        let lastNalEndPos = 0;
        let b1 = -1; // byte before one
        let b2 = -2; // byte before two
        const nalStartPos = new Array();
        for (let i = 0; i < typedArray.length; i += 2) {
          const b_0 = typedArray[i];
          const b_1 = typedArray[i + 1];
          if (b1 == 0 && b_0 == 0 && b_1 == 0) {
            nalStartPos.push(i - 1);
          } else if (b_1 == 1 && b_0 == 0 && b1 == 0 && b2 == 0) {
            nalStartPos.push(i - 2);
          }
          b2 = b_0;
          b1 = b_1;
        }
        if (nalStartPos.length > 1) {
          for (let i = 0; i < nalStartPos.length - 1; ++i) {
            const naluItem = typedArray.subarray(nalStartPos[i], nalStartPos[i + 1] + 1);
            nakedFlowDemuxer.handleNALu(naluItem);
            //console.log('nakedFlowDemuxer.lastBuf nalType', nakedFlowDemuxer.lastBuf.byteLength);
            lastNalEndPos = nalStartPos[i + 1];
          }
        } else {
          lastNalEndPos = nalStartPos[0];
        }
        if (lastNalEndPos != 0 && lastNalEndPos < typedArray.length) {
          nakedFlowDemuxer.lastBuf = typedArray.subarray(lastNalEndPos);
        } else {
          if (!!!nakedFlowDemuxer.lastBuf) {
            nakedFlowDemuxer.lastBuf = typedArray;
          }
          const _newBuf = new Uint8Array(nakedFlowDemuxer.lastBuf.length + buffer.byteLength);
          _newBuf.set(nakedFlowDemuxer.lastBuf);
          _newBuf.set(new Uint8Array(buffer), nakedFlowDemuxer.lastBuf.length);
          nakedFlowDemuxer.lastBuf = _newBuf;
        }
      },
      handleNALu(nalu) {
        if (nalu.byteLength <= 4) {
          decoder.debug.warn('worker', `handleNALu nalu byteLength is ${nalu.byteLength} <= 4`);
          return;
        }
        // 0001 去掉前4个字节（start code）
        nalu = nalu.slice(4);
        nakedFlowDemuxer.handleVideoNalu(nalu);
      },
      handleVideoNalu(nalu) {
        // decoder.debug.log('worker', 'handleVideoNalu', nalu);
        if (!nakedFlowDemuxer.streamType) {
          nakedFlowDemuxer.streamType = checkNaluType(nalu);
          isHevc = nakedFlowDemuxer.streamType === VIDEO_ENC_TYPE_SHOW.h265;
        }
        if (nakedFlowDemuxer.streamType === VIDEO_ENC_TYPE_SHOW.h264) {
          const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
          const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
          if (naluList.length === 0) {
            decoder.debug.warn('worker', 'handleVideoNalu', 'h264 naluList.length === 0');
            return;
          }
          const newNaluList = [];
          naluList.forEach(naluItem => {
            const nalType = getAvcSeqHeadType(naluItem);
            if (nalType === H264_NAL_TYPE.pps || nalType === H264_NAL_TYPE.sps) {
              nakedFlowDemuxer.handleVideoH264Nalu(naluItem);
            } else {
              if (isNotAvcSeqHead(nalType)) {
                newNaluList.push(naluItem);
              }
            }
          });
          if (newNaluList.length === 1) {
            nakedFlowDemuxer.handleVideoH264Nalu(newNaluList[0]);
          } else {
            const isSameNaluType = isSameAvcNaluType(newNaluList);
            if (isSameNaluType) {
              const naluType = getAvcSeqHeadType(newNaluList[0]);
              const isIFrame = isAvcNaluIFrame(naluType);
              nakedFlowDemuxer.handleVideoH264NaluList(newNaluList, isIFrame, naluType);
            } else {
              newNaluList.forEach(naluItem => {
                nakedFlowDemuxer.handleVideoH264Nalu(naluItem);
              });
            }
          }
        } else if (nakedFlowDemuxer.streamType === VIDEO_ENC_TYPE_SHOW.h265) {
          if (decoder._opt.nakedFlowH265DemuxUseNew) {
            const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
            const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
            if (naluList.length === 0) {
              decoder.debug.warn('worker', 'handleVideoNalu', 'h265 naluList.length === 0');
              return;
            }
            const newNaluList = [];
            naluList.forEach(naluItem => {
              const nalType = getHevcSeqHeadType(naluItem);
              if (nalType === H265_NAL_TYPE.pps || nalType === H265_NAL_TYPE.sps || nalType === H265_NAL_TYPE.vps) {
                nakedFlowDemuxer.handleVideoH265Nalu(naluItem);
              } else {
                if (isNotHevcSeqHead(nalType)) {
                  newNaluList.push(naluItem);
                }
              }
            });
            if (newNaluList.length === 1) {
              nakedFlowDemuxer.handleVideoH265Nalu(newNaluList[0]);
            } else {
              const isSameNaluType = isSameHevcNaluType(newNaluList);
              if (isSameNaluType) {
                const naluType = getHevcSeqHeadType(newNaluList[0]);
                const isIFrame = isHevcNaluIFrame(naluType);
                nakedFlowDemuxer.handleVideoH265NaluList(newNaluList, isIFrame, naluType);
              } else {
                newNaluList.forEach(naluItem => {
                  nakedFlowDemuxer.handleVideoH265Nalu(naluItem);
                });
              }
            }
          } else {
            const naluType = getHevcSeqHeadType(nalu);
            if (naluType === H265_NAL_TYPE.pps) {
              nakedFlowDemuxer.extractH265PPS(nalu);
            } else {
              nakedFlowDemuxer.handleVideoH265Nalu(nalu);
            }
          }
        }
      },
      extractH264PPS(nalu) {
        const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
        const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
        naluList.forEach(naluItem => {
          const nalType = getAvcSeqHeadType(naluItem);
          if (isHvcSEIType(nalType)) {
            nakedFlowDemuxer.extractH264SEI(naluItem);
          } else {
            nakedFlowDemuxer.handleVideoH264Nalu(naluItem);
          }
        });
      },
      extractH265PPS(nalu) {
        const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
        const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
        naluList.forEach(naluItem => {
          const nalType = getHevcSeqHeadType(naluItem);
          if (isHevcSEIType(nalType)) {
            nakedFlowDemuxer.extractH265SEI(naluItem);
          } else {
            nakedFlowDemuxer.handleVideoH265Nalu(naluItem);
          }
        });
      },
      extractH264SEI(nalu) {
        const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
        const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
        naluList.forEach(naluItem => {
          nakedFlowDemuxer.handleVideoH264Nalu(naluItem);
        });
      },
      extractH265SEI(nalu) {
        const tempNalu = nakedFlowDemuxer.handleAddNaluStartCode(nalu);
        const naluList = nakedFlowDemuxer.extractNALu(tempNalu);
        //console.log('extractH265SEI', naluList);
        naluList.forEach(naluItem => {
          nakedFlowDemuxer.handleVideoH265Nalu(naluItem);
        });
      },
      handleAddNaluStartCode(nalu) {
        const prefix = [0, 0, 0, 1];
        const newNalu = new Uint8Array(nalu.length + prefix.length);
        newNalu.set(prefix);
        newNalu.set(nalu, prefix.length);
        return newNalu;
      },
      handleVideoH264Nalu(nalu) {
        const nalType = getAvcSeqHeadType(nalu);
        switch (nalType) {
          case H264_NAL_TYPE.sps:
            nakedFlowDemuxer.sps = nalu;
            break;
          case H264_NAL_TYPE.pps:
            nakedFlowDemuxer.pps = nalu;
            break;
        }
        if (!nakedFlowDemuxer.isSendSeqHeader) {
          if (nakedFlowDemuxer.sps && nakedFlowDemuxer.pps) {
            nakedFlowDemuxer.isSendSeqHeader = true;
            const seqHeader = avcEncoderConfigurationRecord({
              sps: nakedFlowDemuxer.sps,
              pps: nakedFlowDemuxer.pps
            });
            decoder.decode(seqHeader, {
              type: MEDIA_TYPE.video,
              ts: 0,
              isIFrame: true,
              cts: 0
            });
            nakedFlowDemuxer.sps = null;
            nakedFlowDemuxer.pps = null;
          }
        } else {
          if (nakedFlowDemuxer.sps && nakedFlowDemuxer.pps) {
            const seqHeader = avcEncoderConfigurationRecord({
              sps: nakedFlowDemuxer.sps,
              pps: nakedFlowDemuxer.pps
            });
            const dts = nakedFlowDemuxer.getNaluDts();
            decoder.decode(seqHeader, {
              type: MEDIA_TYPE.video,
              ts: dts,
              isIFrame: true,
              cts: 0
            });
            nakedFlowDemuxer.sps = null;
            nakedFlowDemuxer.pps = null;
          }
          if (isNotAvcSeqHead(nalType)) {
            const isIFrame = isAvcNaluIFrame(nalType);
            const dts = nakedFlowDemuxer.getNaluDts();
            const packet = avcEncoderNalePacket(nalu, isIFrame);
            nakedFlowDemuxer.doDecode(packet, {
              type: MEDIA_TYPE.video,
              ts: dts,
              isIFrame: isIFrame,
              cts: 0
            });
          } else {
            decoder.debug.warn('work', `handleVideoH264Nalu Avc Seq Head is ${nalType}`);
          }
        }
      },
      handleVideoH264NaluList(naluList, isIFrame, naluType) {
        if (nakedFlowDemuxer.isSendSeqHeader) {
          const dts = nakedFlowDemuxer.getNaluDts();
          const newNalu = naluList.reduce((pre, cur) => {
            const nalu2 = addNaleHeaderLength(pre);
            const nalu3 = addNaleHeaderLength(cur);
            const nalu4 = new Uint8Array(nalu2.byteLength + nalu3.byteLength);
            nalu4.set(nalu2, 0);
            nalu4.set(nalu3, nalu2.byteLength);
            return nalu4;
          });
          const packet = avcEncoderNalePacketNotLength(newNalu, isIFrame);
          nakedFlowDemuxer.doDecode(packet, {
            type: MEDIA_TYPE.video,
            ts: dts,
            isIFrame: isIFrame,
            cts: 0
          });
          decoder.debug.log('worker', `handleVideoH264NaluList list size is ${naluList.length} package length is ${packet.byteLength} isIFrame is ${isIFrame},nalu type is ${naluType}, dts is ${dts}`);
        } else {
          decoder.debug.warn('worker', 'handleVideoH264NaluList isSendSeqHeader is false');
        }
      },
      handleVideoH265Nalu(nalu) {
        const nalType = getHevcSeqHeadType(nalu);
        switch (nalType) {
          case H265_NAL_TYPE.vps:
            nakedFlowDemuxer.vps = nalu;
            break;
          case H265_NAL_TYPE.sps:
            nakedFlowDemuxer.sps = nalu;
            break;
          case H265_NAL_TYPE.pps:
            nakedFlowDemuxer.pps = nalu;
            break;
        }
        if (!nakedFlowDemuxer.isSendSeqHeader) {
          if (nakedFlowDemuxer.vps && nakedFlowDemuxer.sps && nakedFlowDemuxer.pps) {
            nakedFlowDemuxer.isSendSeqHeader = true;
            const seqHeader = hevcEncoderConfigurationRecord$2({
              vps: nakedFlowDemuxer.vps,
              sps: nakedFlowDemuxer.sps,
              pps: nakedFlowDemuxer.pps
            });
            decoder.decode(seqHeader, {
              type: MEDIA_TYPE.video,
              ts: 0,
              isIFrame: true,
              cts: 0
            });
            nakedFlowDemuxer.vps = null;
            nakedFlowDemuxer.sps = null;
            nakedFlowDemuxer.pps = null;
          }
        } else {
          if (nakedFlowDemuxer.vps && nakedFlowDemuxer.sps && nakedFlowDemuxer.pps) {
            const seqHeader = hevcEncoderConfigurationRecord$2({
              vps: nakedFlowDemuxer.vps,
              sps: nakedFlowDemuxer.sps,
              pps: nakedFlowDemuxer.pps
            });
            const dts = nakedFlowDemuxer.getNaluDts();
            decoder.decode(seqHeader, {
              type: MEDIA_TYPE.video,
              ts: dts,
              isIFrame: true,
              cts: 0
            });
            nakedFlowDemuxer.vps = null;
            nakedFlowDemuxer.sps = null;
            nakedFlowDemuxer.pps = null;
          }
          if (isNotHevcSeqHead(nalType)) {
            const isIFrame = isHevcNaluIFrame(nalType);
            const dts = nakedFlowDemuxer.getNaluDts();
            const packet = hevcEncoderNalePacket(nalu, isIFrame);
            nakedFlowDemuxer.doDecode(packet, {
              type: MEDIA_TYPE.video,
              ts: dts,
              isIFrame: isIFrame,
              cts: 0
            });
          } else {
            decoder.debug.warn('work', `handleVideoH265Nalu HevcSeqHead is ${nalType}`);
          }
        }
      },
      handleVideoH265NaluList(naluList, isIFrame, naluType) {
        if (nakedFlowDemuxer.isSendSeqHeader) {
          const dts = nakedFlowDemuxer.getNaluDts();
          const newNalu = naluList.reduce((pre, cur) => {
            const nalu2 = addNaleHeaderLength(pre);
            const nalu3 = addNaleHeaderLength(cur);
            const nalu4 = new Uint8Array(nalu2.byteLength + nalu3.byteLength);
            nalu4.set(nalu2, 0);
            nalu4.set(nalu3, nalu2.byteLength);
            return nalu4;
          });
          const packet = hevcEncoderNalePacketNotLength(newNalu, isIFrame);
          nakedFlowDemuxer.doDecode(packet, {
            type: MEDIA_TYPE.video,
            ts: dts,
            isIFrame: isIFrame,
            cts: 0
          });
          decoder.debug.log('worker', `handleVideoH265NaluList list size is ${naluList.length} package length is ${packet.byteLength} isIFrame is ${isIFrame},nalu type is ${naluType}, dts is ${dts}`);
        } else {
          decoder.debug.warn('worker', 'handleVideoH265NaluList isSendSeqHeader is false');
        }
      },
      doDecode(payload, options) {
        decoder.calcNetworkDelay(options.ts);
        if (options.isIFrame) {
          decoder.calcIframeIntervalTimestamp(options.ts);
        }
        decoder.decode(payload, options);
      }
    };
    // fmp4Demuxer
    let fmp4Demuxer = {
      LOG_NAME: 'worker fmp4Demuxer',
      mp4Box: mp4box.createFile(),
      offset: 0,
      videoTrackId: null,
      audioTrackId: null,
      isHevc: false,
      listenMp4Box() {
        fmp4Demuxer.mp4Box.onReady = fmp4Demuxer.onReady;
        fmp4Demuxer.mp4Box.onError = fmp4Demuxer.onError;
        fmp4Demuxer.mp4Box.onSamples = fmp4Demuxer.onSamples;
      },
      initTransportDescarmber() {
        fmp4Demuxer.transportDescarmber = new TransportDescrambler();
      },
      _getSeqHeader(track) {
        const trak = fmp4Demuxer.mp4Box.getTrackById(track.id);
        for (const entry of trak.mdia.minf.stbl.stsd.entries) {
          if (entry.avcC || entry.hvcC) {
            const stream = new mp4box.DataStream(undefined, 0, mp4box.DataStream.BIG_ENDIAN);
            let prevData = [];
            if (entry.avcC) {
              entry.avcC.write(stream);
              prevData = [0x17, 0x00, 0x00, 0x00, 0x00];
            } else {
              fmp4Demuxer.isHevc = true;
              isHevc = true;
              entry.hvcC.write(stream);
              prevData = [0x1c, 0x00, 0x00, 0x00, 0x00];
            }
            const seqHeader = new Uint8Array(stream.buffer, 8); // Remove the box header.
            const newData = new Uint8Array(prevData.length + seqHeader.length);
            newData.set(prevData, 0);
            newData.set(seqHeader, prevData.length);
            return newData;
          }
        }
        return null;
      },
      onReady(info) {
        decoder.debug.log(fmp4Demuxer.LOG_NAME, 'onReady()', info);
        const videoTrack = info.videoTracks[0];
        const audioTrack = info.audioTracks[0];
        if (videoTrack) {
          //
          fmp4Demuxer.videoTrackId = videoTrack.id;
          const seqHeader = fmp4Demuxer._getSeqHeader(videoTrack);
          if (seqHeader) {
            decoder.debug.log(fmp4Demuxer.LOG_NAME, 'seqHeader');
            decoder.decodeVideo(seqHeader, 0, true, 0);
          }
          fmp4Demuxer.mp4Box.setExtractionOptions(videoTrack.id);
        }
        if (audioTrack && decoder._opt.hasAudio) {
          fmp4Demuxer.audioTrackId = audioTrack.id;
          const audioInfo = audioTrack.audio || {};
          const sampleRateIndex = AAC_FREQ_LIST.indexOf(audioInfo.sample_rate);
          const profile = audioTrack.codec.replace('mp4a.40.', '');
          fmp4Demuxer.mp4Box.setExtractionOptions(audioTrack.id);
          const config = {
            profile: parseInt(profile, 10),
            sampleRate: sampleRateIndex,
            channel: audioInfo.channel_count
          };
          const aacADTSHeader = aacEncoderConfigurationRecordV2(config);
          decoder.decodeAudio(aacADTSHeader, 0);
        }
        fmp4Demuxer.mp4Box.start();
      },
      onError(error) {
        decoder.debug.error(fmp4Demuxer.LOG_NAME, 'mp4Box onError', error);
      },
      onSamples(trackId, ref, samples) {
        if (trackId === fmp4Demuxer.videoTrackId) {
          for (const sample of samples) {
            const data = sample.data;
            const isIFrame = sample.is_sync;
            const timestamp = 1000 * sample.cts / sample.timescale;
            1000 * sample.duration / sample.timescale;
            if (isIFrame) {
              decoder.calcIframeIntervalTimestamp(timestamp);
            }
            let packet = null;
            if (fmp4Demuxer.isHevc) {
              packet = hevcEncoderNalePacketNotLength(data, isIFrame);
            } else {
              packet = avcEncoderNalePacketNotLength(data, isIFrame);
            }
            decoder.decode(packet, {
              type: MEDIA_TYPE.video,
              ts: timestamp,
              isIFrame: isIFrame,
              cts: 0
            });
          }
        } else if (trackId === fmp4Demuxer.audioTrackId) {
          if (decoder._opt.hasAudio) {
            for (const sample of samples) {
              const data = sample.data;
              const timestamp = 1000 * sample.cts / sample.timescale;
              1000 * sample.duration / sample.timescale;
              const packet = new Uint8Array(data.byteLength + 2);
              packet.set([0xAF, 0x01], 0);
              packet.set(data, 2);
              decoder.decode(packet, {
                type: MEDIA_TYPE.audio,
                ts: timestamp,
                isIFrame: false,
                cts: 0
              });
            }
          }
        } else {
          decoder.debug.warn(fmp4Demuxer.LOG_NAME, 'onSamples() trackId error', trackId);
        }
      },
      dispatch(data) {
        let buffer = data;
        if (typeof data === 'string') {
          decoder.debug.warn(fmp4Demuxer.LOG_NAME, 'dispatch()', 'data is string', data);
          return;
        }
        if (typeof data === 'object') {
          if (fmp4Demuxer.transportDescarmber) {
            buffer = fmp4Demuxer.transportDescarmber.transport(buffer);
          }
          buffer.buffer.fileStart = fmp4Demuxer.offset;
          fmp4Demuxer.offset += buffer.byteLength;
          fmp4Demuxer.mp4Box.appendBuffer(buffer.buffer);
        } else {
          decoder.debug.warn(fmp4Demuxer.LOG_NAME, 'dispatch()', 'data is not object', data);
        }
      },
      destroy() {
        if (fmp4Demuxer.mp4Box) {
          fmp4Demuxer.mp4Box.flush();
          fmp4Demuxer.mp4Box = null;
        }
        if (fmp4Demuxer.transportDescarmber) {
          fmp4Demuxer.transportDescarmber.destroy();
          fmp4Demuxer.transportDescarmber = null;
        }
        fmp4Demuxer.offset = 0;
        fmp4Demuxer.videoTrackId = null;
        fmp4Demuxer.audioTrackId = null;
        fmp4Demuxer.isHevc = false;
      }
    };
    // mpeg4Demuxer
    let mpeg4Demuxer = {
      LOG_NAME: 'worker mpeg4Demuxer',
      lastBuffer: new Uint8Array(0),
      parsedOffset: 0,
      firstStartCodeOffset: 0,
      secondStartCodeOffset: 0,
      state: 'init',
      hasInitVideoCodec: false,
      localDts: 0,
      dispatch(data) {
        const uint8Array = new Uint8Array(data);
        mpeg4Demuxer.extractNALu(uint8Array);
      },
      destroy() {
        mpeg4Demuxer.lastBuffer = new Uint8Array(0);
        mpeg4Demuxer.parsedOffset = 0;
        mpeg4Demuxer.firstStartCodeOffset = 0;
        mpeg4Demuxer.secondStartCodeOffset = 0;
        mpeg4Demuxer.state = 'init';
        mpeg4Demuxer.hasInitVideoCodec = false;
        mpeg4Demuxer.localDts = 0;
      },
      extractNALu(buffer) {
        if (!buffer || buffer.byteLength < 1) {
          decoder.debug.warn(mpeg4Demuxer.LOG_NAME, 'extractNALu() buffer error', buffer);
          return;
        }
        const newBuffer = new Uint8Array(mpeg4Demuxer.lastBuffer.length + buffer.length);
        newBuffer.set(mpeg4Demuxer.lastBuffer, 0);
        newBuffer.set(new Uint8Array(buffer), mpeg4Demuxer.lastBuffer.length);
        mpeg4Demuxer.lastBuffer = newBuffer;
        while (true) {
          if (mpeg4Demuxer.state === 'init') {
            let bf = false;
            while (mpeg4Demuxer.lastBuffer.length - mpeg4Demuxer.parsedOffset >= 4) {
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset] !== 0) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 1] !== 0) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 2] !== 1) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 3] !== 0xb6) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              // decoder.debug.log(mpeg4Demuxer.LOG_NAME, `current state is ${mpeg4Demuxer.state} -> findFirstStartCode`, mpeg4Demuxer.parsedOffset);
              mpeg4Demuxer.state = 'findFirstStartCode';
              mpeg4Demuxer.firstStartCodeOffset = mpeg4Demuxer.parsedOffset;
              mpeg4Demuxer.parsedOffset += 4;
              bf = true;
              break;
            }
            if (bf) {
              continue;
            } else {
              break;
            }
          } else if (mpeg4Demuxer.state === 'findFirstStartCode') {
            let bf = false;
            while (mpeg4Demuxer.lastBuffer.length - mpeg4Demuxer.parsedOffset >= 4) {
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset] !== 0) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 1] !== 0) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 2] !== 1) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              if (mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset + 3] !== 0xb6) {
                mpeg4Demuxer.parsedOffset++;
                continue;
              }
              // decoder.debug.log(mpeg4Demuxer.LOG_NAME, `current stats is ${mpeg4Demuxer.state} -> findSecondStartCode`, mpeg4Demuxer.parsedOffset);

              mpeg4Demuxer.state = 'findSecondStartCode';
              mpeg4Demuxer.secondStartCodeOffset = mpeg4Demuxer.parsedOffset;
              mpeg4Demuxer.parsedOffset += 4;
              bf = true;
              break;
            }
            if (bf) {
              continue;
            } else {
              break;
            }
          } else if (mpeg4Demuxer.state === 'findSecondStartCode') {
            if (mpeg4Demuxer.lastBuffer.length - mpeg4Demuxer.parsedOffset > 0) {
              let frameType = mpeg4Demuxer.lastBuffer[mpeg4Demuxer.parsedOffset] & 0xc0;
              //I帧
              let lastFrameEnd;
              if (frameType == 0) {
                lastFrameEnd = mpeg4Demuxer.secondStartCodeOffset - 14;
              } else {
                lastFrameEnd = mpeg4Demuxer.secondStartCodeOffset;
              }
              let lastFrame;
              let lastFrameType = mpeg4Demuxer.lastBuffer[mpeg4Demuxer.firstStartCodeOffset + 4] & 0xc0;
              let lastFrameIsIFrame = lastFrameType == 0;
              //I帧
              if (lastFrameIsIFrame) {
                if (mpeg4Demuxer.firstStartCodeOffset - 14 < 0) {
                  decoder.debug.warn(mpeg4Demuxer.LOG_NAME, 'firstStartCodeOffset -14 is', mpeg4Demuxer.firstStartCodeOffset - 14);
                  return;
                }
                if (!mpeg4Demuxer.hasInitVideoCodec) {
                  mpeg4Demuxer.hasInitVideoCodec = true;
                  decoder.debug.log(mpeg4Demuxer.LOG_NAME, 'setCodec');
                  videoDecoder.setCodec(VIDEO_ENC_CODE.mpeg4, '');
                }
                // extraData 直接放在I帧前面去解码。
                lastFrame = mpeg4Demuxer.lastBuffer.subarray(mpeg4Demuxer.firstStartCodeOffset - 14, lastFrameEnd);
              } else {
                lastFrame = mpeg4Demuxer.lastBuffer.subarray(mpeg4Demuxer.firstStartCodeOffset, lastFrameEnd);
              }
              let ts = mpeg4Demuxer.getNaluDts();
              if (mpeg4Demuxer.hasInitVideoCodec) {
                // decoder.debug.error(mpeg4Demuxer.LOG_NAME, ts, lastFrameIsIFrame ? 'I' : 'P', lastFrame.length)
                postMessage({
                  cmd: WORKER_CMD_TYPE.workerFetch,
                  type: EVENTS.streamVbps,
                  value: lastFrame.byteLength
                });
                postMessage({
                  cmd: WORKER_CMD_TYPE.workerFetch,
                  type: EVENTS.streamDts,
                  value: ts
                });
                videoDecoder.decode(lastFrame, lastFrameIsIFrame ? 1 : 0, ts);
              } else {
                decoder.debug.warn(mpeg4Demuxer.LOG_NAME, 'has not init video codec');
              }
              mpeg4Demuxer.lastBuffer = mpeg4Demuxer.lastBuffer.subarray(lastFrameEnd);
              if (frameType == 0) {
                mpeg4Demuxer.firstStartCodeOffset = 14;
              } else {
                mpeg4Demuxer.firstStartCodeOffset = 0;
              }
              mpeg4Demuxer.parsedOffset = mpeg4Demuxer.firstStartCodeOffset + 4;
              // decoder.debug.log(mpeg4Demuxer.LOG_NAME, `current stats is ${mpeg4Demuxer.state} -> findFirstStartCode`, mpeg4Demuxer.parsedOffset);
              mpeg4Demuxer.state = 'findFirstStartCode';
            } else {
              break;
            }
          }
        }
      },
      getNaluDts() {
        let resul = mpeg4Demuxer.localDts;
        mpeg4Demuxer.localDts = mpeg4Demuxer.localDts + 1000 / 25;
        return resul;
      }
    };
    let tsDemuxer = {
      TAG_NAME: 'worker TsLoaderV2',
      first_parse_: true,
      tsPacketSize: 0,
      syncOffset: 0,
      pmt_: null,
      config_: null,
      media_info_: new MediaInfo(),
      timescale_: 90,
      duration_: 0,
      pat_: {
        version_number: 0,
        network_pid: 0,
        program_map_pid: {}
      },
      current_program_: null,
      current_pmt_pid_: -1,
      program_pmt_map_: {},
      pes_slice_queues_: {},
      section_slice_queues_: {},
      video_metadata_: {
        vps: null,
        sps: null,
        pps: null,
        details: null
      },
      audio_metadata_: {
        codec: null,
        audio_object_type: null,
        sampling_freq_index: null,
        sampling_frequency: null,
        channel_config: null
      },
      last_pcr_: null,
      audio_last_sample_pts_: undefined,
      aac_last_incomplete_data_: null,
      has_video_: false,
      has_audio_: false,
      video_init_segment_dispatched_: false,
      audio_init_segment_dispatched_: false,
      video_metadata_changed_: false,
      audio_metadata_changed_: false,
      loas_previous_frame: null,
      video_track_: {
        type: 'video',
        id: 1,
        sequenceNumber: 0,
        samples: [],
        length: 0
      },
      audio_track_: {
        type: 'audio',
        id: 2,
        sequenceNumber: 0,
        samples: [],
        length: 0
      },
      _remainingPacketData: null,
      init() {},
      destroy() {
        tsDemuxer.media_info_ = null;
        tsDemuxer.pes_slice_queues_ = null;
        tsDemuxer.section_slice_queues_ = null;
        tsDemuxer.video_metadata_ = null;
        tsDemuxer.audio_metadata_ = null;
        tsDemuxer.aac_last_incomplete_data_ = null;
        tsDemuxer.video_track_ = null;
        tsDemuxer.audio_track_ = null;
        tsDemuxer._remainingPacketData = null;
      },
      probe(buffer) {
        let data = new Uint8Array(buffer);
        let sync_offset = -1;
        let ts_packet_size = 188;
        if (data.byteLength <= 3 * ts_packet_size) {
          return {
            needMoreData: true
          };
        }
        while (sync_offset === -1) {
          let scan_window = Math.min(1000, data.byteLength - 3 * ts_packet_size);
          for (let i = 0; i < scan_window;) {
            // sync_byte should all be 0x47
            if (data[i] === 0x47 && data[i + ts_packet_size] === 0x47 && data[i + 2 * ts_packet_size] === 0x47) {
              sync_offset = i;
              break;
            } else {
              i++;
            }
          }

          // find sync_offset failed in previous ts_packet_size
          if (sync_offset === -1) {
            if (ts_packet_size === 188) {
              // try 192 packet size (BDAV, etc.)
              ts_packet_size = 192;
            } else if (ts_packet_size === 192) {
              // try 204 packet size (European DVB, etc.)
              ts_packet_size = 204;
            } else {
              // 192, 204 also failed, exit
              break;
            }
          }
        }
        if (sync_offset === -1) {
          // both 188, 192, 204 failed, Non MPEG-TS
          return {
            match: false
          };
        }
        if (ts_packet_size === 192 && sync_offset >= 4) {
          // Log.v('TSDemuxer', `ts_packet_size = 192, m2ts mode`);
          sync_offset -= 4;
        }
        return {
          match: true,
          consumed: 0,
          ts_packet_size,
          sync_offset
        };
      },
      _initPmt() {
        return {
          program_number: 0,
          version_number: 0,
          pcr_pid: 0,
          // pid -> stream_type
          pid_stream_type: {},
          common_pids: {
            h264: undefined,
            h265: undefined,
            adts_aac: undefined,
            loas_aac: undefined,
            opus: undefined,
            ac3: undefined,
            eac3: undefined,
            mp3: undefined
          },
          pes_private_data_pids: {},
          timed_id3_pids: {},
          synchronous_klv_pids: {},
          asynchronous_klv_pids: {},
          scte_35_pids: {},
          smpte2038_pids: {}
        };
      },
      dispatch(arrayBuffer) {
        // 传入的是Uint8Array 但是这里需要ArrayBuffer

        if (tsDemuxer._remainingPacketData) {
          arrayBuffer = concatUint8Array(tsDemuxer._remainingPacketData, arrayBuffer);
          tsDemuxer._remainingPacketData = null;
        }
        let chunk = arrayBuffer.buffer;
        const offset = tsDemuxer.parseChunks(chunk);
        if (offset) {
          tsDemuxer._remainingPacketData = arrayBuffer.subarray(offset);
        } else {
          if (arrayBuffer.length < this.tsPacketSize) {
            tsDemuxer._remainingPacketData = arrayBuffer;
          }
        }
      },
      parseChunks(chunk) {
        //  偏移量
        let offset = 0;
        if (tsDemuxer.first_parse_) {
          tsDemuxer.first_parse_ = false;
          const probeData = tsDemuxer.probe(chunk);
          if (probeData.match) {
            tsDemuxer.tsPacketSize = probeData.ts_packet_size;
            tsDemuxer.syncOffset = probeData.sync_offset;
          }
          offset = tsDemuxer.syncOffset;
          decoder.debug.log(tsDemuxer.TAG_NAME, `isFirstDispatch and tsPacketSize = ${tsDemuxer.tsPacketSize}, syncOffset = ${tsDemuxer.syncOffset}`);
        }
        while (offset + tsDemuxer.tsPacketSize <= chunk.byteLength) {
          if (tsDemuxer.tsPacketSize === 192) {
            offset += 4;
          }
          const data = new Uint8Array(chunk, offset, 188);
          let sync_byte = data[0];
          if (sync_byte !== 0x47) {
            decoder.debug.warn(tsDemuxer.TAG_NAME, `sync_byte = ${sync_byte}, not 0x47`);
            break;
          }
          let payload_unit_start_indicator = (data[1] & 0x40) >>> 6;
          (data[1] & 0x20) >>> 5;
          let pid = (data[1] & 0x1F) << 8 | data[2];
          let adaptation_field_control = (data[3] & 0x30) >>> 4;
          let continuity_conunter = data[3] & 0x0F;
          let is_pcr_pid = tsDemuxer.pmt_ && tsDemuxer.pmt_.pcr_pid === pid ? true : false;
          let adaptation_field_info = {};
          let ts_payload_start_index = 4;
          if (adaptation_field_control == 0x02 || adaptation_field_control == 0x03) {
            let adaptation_field_length = data[4];
            if (adaptation_field_length > 0 && (is_pcr_pid || adaptation_field_control == 0x03)) {
              // Parse adaptation field
              adaptation_field_info.discontinuity_indicator = (data[5] & 0x80) >>> 7;
              adaptation_field_info.random_access_indicator = (data[5] & 0x40) >>> 6;
              adaptation_field_info.elementary_stream_priority_indicator = (data[5] & 0x20) >>> 5;
              let PCR_flag = (data[5] & 0x10) >>> 4;
              if (PCR_flag) {
                let pcr_base = data[6] << 25 | data[7] << 17 | data[8] << 9 | data[9] << 1 | data[10] >>> 7;
                let pcr_extension = (data[10] & 0x01) << 8 | data[11];
                let pcr = pcr_base * 300 + pcr_extension;
                tsDemuxer.last_pcr_ = pcr;
              }
            }
            if (adaptation_field_control == 0x02 || 5 + adaptation_field_length === 188) {
              // TS packet only has adaption field, jump to next
              offset += 188;
              if (tsDemuxer.tsPacketSize === 204) {
                // skip parity word (16 bytes) for RS encoded TS
                offset += 16;
              }
              continue;
            } else {
              // Point ts_payload_start_index to the start of payload
              ts_payload_start_index = 4 + 1 + adaptation_field_length;
            }
          }
          if (adaptation_field_control == 0x01 || adaptation_field_control == 0x03) {
            if (pid === 0 ||
            // PAT (pid === 0)
            pid === tsDemuxer.current_pmt_pid_ ||
            // PMT
            tsDemuxer.pmt_ != undefined && tsDemuxer.pmt_.pid_stream_type[pid] === TS_STREAM_TYPE.kSCTE35) {
              // SCTE35
              let ts_payload_length = 188 - ts_payload_start_index;
              tsDemuxer.handleSectionSlice(chunk, offset + ts_payload_start_index, ts_payload_length, {
                pid,
                payload_unit_start_indicator,
                continuity_conunter,
                random_access_indicator: adaptation_field_info.random_access_indicator
              });
            } else if (tsDemuxer.pmt_ != undefined && tsDemuxer.pmt_.pid_stream_type[pid] != undefined) {
              // PES
              let ts_payload_length = 188 - ts_payload_start_index;
              let stream_type = tsDemuxer.pmt_.pid_stream_type[pid];

              // process PES only for known common_pids
              if (pid === tsDemuxer.pmt_.common_pids.h264 || pid === tsDemuxer.pmt_.common_pids.h265 || pid === tsDemuxer.pmt_.common_pids.adts_aac || pid === tsDemuxer.pmt_.common_pids.loas_aac || pid === tsDemuxer.pmt_.common_pids.ac3 || pid === tsDemuxer.pmt_.common_pids.eac3 || pid === tsDemuxer.pmt_.common_pids.opus || pid === tsDemuxer.pmt_.common_pids.mp3 || tsDemuxer.pmt_.pes_private_data_pids[pid] === true || tsDemuxer.pmt_.timed_id3_pids[pid] === true || tsDemuxer.pmt_.synchronous_klv_pids[pid] === true || tsDemuxer.pmt_.asynchronous_klv_pids[pid] === true) {
                tsDemuxer.handlePESSlice(chunk, offset + ts_payload_start_index, ts_payload_length, {
                  pid,
                  stream_type,
                  payload_unit_start_indicator,
                  continuity_conunter,
                  random_access_indicator: adaptation_field_info.random_access_indicator
                });
              }
            }
          }
          offset += 188;
          if (tsDemuxer.tsPacketSize === 204) {
            // skip parity word (16 bytes) for RS encoded TS
            offset += 16;
          }
        }
        tsDemuxer.dispatchAudioVideoMediaSegment();
        return offset;
      },
      handleSectionSlice(buffer, offset, length, misc) {
        let data = new Uint8Array(buffer, offset, length);
        let slice_queue = tsDemuxer.section_slice_queues_[misc.pid];
        if (misc.payload_unit_start_indicator) {
          let pointer_field = data[0];
          if (slice_queue != undefined && slice_queue.total_length !== 0) {
            let remain_section = new Uint8Array(buffer, offset + 1, Math.min(length, pointer_field));
            slice_queue.slices.push(remain_section);
            slice_queue.total_length += remain_section.byteLength;
            if (slice_queue.total_length === slice_queue.expected_length) {
              tsDemuxer.emitSectionSlices(slice_queue, misc);
            } else {
              tsDemuxer.clearSlices(slice_queue, misc);
            }
          }
          for (let i = 1 + pointer_field; i < data.byteLength;) {
            let table_id = data[i + 0];
            if (table_id === 0xFF) {
              // decoder.debug.log(tsDemuxer.TAG_NAME, `handleSectionSlice(): table_id is 0xFF, skip`);
              break;
            }
            let section_length = (data[i + 1] & 0x0F) << 8 | data[i + 2];
            tsDemuxer.section_slice_queues_[misc.pid] = new SliceQueue();
            slice_queue = tsDemuxer.section_slice_queues_[misc.pid];
            slice_queue.expected_length = section_length + 3;
            slice_queue.random_access_indicator = misc.random_access_indicator;
            let remain_section = new Uint8Array(buffer, offset + i, Math.min(length - i, slice_queue.expected_length - slice_queue.total_length));
            slice_queue.slices.push(remain_section);
            slice_queue.total_length += remain_section.byteLength;
            if (slice_queue.total_length === slice_queue.expected_length) {
              tsDemuxer.emitSectionSlices(slice_queue, misc);
            } else if (slice_queue.total_length >= slice_queue.expected_length) {
              tsDemuxer.clearSlices(slice_queue, misc);
            }
            i += remain_section.byteLength;
          }
        } else if (slice_queue != undefined && slice_queue.total_length !== 0) {
          let remain_section = new Uint8Array(buffer, offset, Math.min(length, slice_queue.expected_length - slice_queue.total_length));
          slice_queue.slices.push(remain_section);
          slice_queue.total_length += remain_section.byteLength;
          if (slice_queue.total_length === slice_queue.expected_length) {
            tsDemuxer.emitSectionSlices(slice_queue, misc);
          } else if (slice_queue.total_length >= slice_queue.expected_length) {
            tsDemuxer.clearSlices(slice_queue, misc);
          }
        }
      },
      handlePESSlice(buffer, offset, length, misc) {
        let data = new Uint8Array(buffer, offset, length);
        let packet_start_code_prefix = data[0] << 16 | data[1] << 8 | data[2];
        data[3];
        let PES_packet_length = data[4] << 8 | data[5];
        //  start 开始阶段
        if (misc.payload_unit_start_indicator) {
          if (packet_start_code_prefix !== 1) {
            decoder.debug.warn(tsDemuxer.TAG_NAME, `handlePESSlice: packet_start_code_prefix should be 1 but with value ${packet_start_code_prefix}`);
            return;
          }

          // handle queued PES slices:
          // Merge into a big Uint8Array then call parsePES()
          let slice_queue = tsDemuxer.pes_slice_queues_[misc.pid];
          if (slice_queue) {
            if (slice_queue.expected_length === 0 || slice_queue.expected_length === slice_queue.total_length) {
              tsDemuxer.emitPESSlices(slice_queue, misc);
            } else {
              tsDemuxer.clearSlices(slice_queue, misc);
            }
          }

          // Make a new PES queue for new PES slices
          tsDemuxer.pes_slice_queues_[misc.pid] = new SliceQueue();
          tsDemuxer.pes_slice_queues_[misc.pid].random_access_indicator = misc.random_access_indicator;
        }
        if (tsDemuxer.pes_slice_queues_[misc.pid] == undefined) {
          // ignore PES slices without [PES slice that has payload_unit_start_indicator]
          return;
        }

        // push subsequent PES slices into pes_queue
        let slice_queue = tsDemuxer.pes_slice_queues_[misc.pid];
        slice_queue.slices.push(data);
        if (misc.payload_unit_start_indicator) {
          slice_queue.expected_length = PES_packet_length === 0 ? 0 : PES_packet_length + 6;
        }
        slice_queue.total_length += data.byteLength;
        if (slice_queue.expected_length > 0 && slice_queue.expected_length === slice_queue.total_length) {
          tsDemuxer.emitPESSlices(slice_queue, misc);
        } else if (slice_queue.expected_length > 0 && slice_queue.expected_length < slice_queue.total_length) {
          tsDemuxer.clearSlices(slice_queue, misc);
        }
      },
      emitSectionSlices(slice_queue, misc) {
        let data = new Uint8Array(slice_queue.total_length);
        for (let i = 0, offset = 0; i < slice_queue.slices.length; i++) {
          let slice = slice_queue.slices[i];
          data.set(slice, offset);
          offset += slice.byteLength;
        }
        slice_queue.slices = [];
        slice_queue.expected_length = -1;
        slice_queue.total_length = 0;
        let section_data = {};
        section_data.pid = misc.pid;
        section_data.data = data;
        section_data.file_position = slice_queue.file_position;
        section_data.random_access_indicator = slice_queue.random_access_indicator;
        tsDemuxer.parseSection(section_data);
      },
      emitPESSlices(slice_queue, misc) {
        let data = new Uint8Array(slice_queue.total_length);
        for (let i = 0, offset = 0; i < slice_queue.slices.length; i++) {
          let slice = slice_queue.slices[i];
          data.set(slice, offset);
          offset += slice.byteLength;
        }
        slice_queue.slices = [];
        slice_queue.expected_length = -1;
        slice_queue.total_length = 0;
        let pes_data = new PESData();
        pes_data.pid = misc.pid;
        pes_data.data = data;
        pes_data.stream_type = misc.stream_type;
        pes_data.random_access_indicator = slice_queue.random_access_indicator;
        tsDemuxer.parsePES(pes_data);
      },
      clearSlices(slice_queue) {
        slice_queue.slices = [];
        slice_queue.expected_length = -1;
        slice_queue.total_length = 0;
      },
      parseSection(section_data) {
        let data = section_data.data;
        let pid = section_data.pid;
        if (pid === 0x00) {
          tsDemuxer.parsePAT(data);
        } else if (pid === tsDemuxer.current_pmt_pid_) {
          tsDemuxer.parsePMT(data);
        } else if (tsDemuxer.pmt_ != undefined && tsDemuxer.pmt_.scte_35_pids[pid]) ;
      },
      parsePES(pes_data) {
        let data = pes_data.data;
        let packet_start_code_prefix = data[0] << 16 | data[1] << 8 | data[2];
        let stream_id = data[3];
        let PES_packet_length = data[4] << 8 | data[5];
        if (packet_start_code_prefix !== 1) {
          decoder.debug.error(tsDemuxer.TAG_NAME, `parsePES: packet_start_code_prefix should be 1 but with value ${packet_start_code_prefix}`);
          return;
        }
        if (stream_id !== 0xBC // program_stream_map
        && stream_id !== 0xBE // padding_stream
        && stream_id !== 0xBF // private_stream_2
        && stream_id !== 0xF0 // ECM
        && stream_id !== 0xF1 // EMM
        && stream_id !== 0xFF // program_stream_directory
        && stream_id !== 0xF2 // DSMCC
        && stream_id !== 0xF8) {
          (data[6] & 0x30) >>> 4;
          let PTS_DTS_flags = (data[7] & 0xC0) >>> 6;
          let PES_header_data_length = data[8];
          let pts;
          let dts;
          if (PTS_DTS_flags === 0x02 || PTS_DTS_flags === 0x03) {
            pts = (data[9] & 0x0E) * 536870912 +
            // 1 << 29
            (data[10] & 0xFF) * 4194304 +
            // 1 << 22
            (data[11] & 0xFE) * 16384 +
            // 1 << 14
            (data[12] & 0xFF) * 128 +
            // 1 << 7
            (data[13] & 0xFE) / 2;
            if (PTS_DTS_flags === 0x03) {
              dts = (data[14] & 0x0E) * 536870912 +
              // 1 << 29
              (data[15] & 0xFF) * 4194304 +
              // 1 << 22
              (data[16] & 0xFE) * 16384 +
              // 1 << 14
              (data[17] & 0xFF) * 128 +
              // 1 << 7
              (data[18] & 0xFE) / 2;
            } else {
              dts = pts;
            }
          }
          let payload_start_index = 6 + 3 + PES_header_data_length;
          let payload_length;
          if (PES_packet_length !== 0) {
            if (PES_packet_length < 3 + PES_header_data_length) {
              decoder.debug.warn(tsDemuxer.TAG_NAME, `Malformed PES: PES_packet_length < 3 + PES_header_data_length`);
              return;
            }
            payload_length = PES_packet_length - 3 - PES_header_data_length;
          } else {
            // PES_packet_length === 0
            payload_length = data.byteLength - payload_start_index;
          }
          let payload = data.subarray(payload_start_index, payload_start_index + payload_length);
          switch (pes_data.stream_type) {
            case TS_STREAM_TYPE.kMPEG1Audio:
            case TS_STREAM_TYPE.kMPEG2Audio:
              tsDemuxer.parseMP3Payload(payload, pts);
              break;
            case TS_STREAM_TYPE.kPESPrivateData:
              if (tsDemuxer.pmt_.common_pids.opus === pes_data.pid) ; else if (tsDemuxer.pmt_.common_pids.ac3 === pes_data.pid) ; else if (tsDemuxer.pmt_.common_pids.eac3 === pes_data.pid) ; else if (tsDemuxer.pmt_.asynchronous_klv_pids[pes_data.pid]) {
                tsDemuxer.parseAsynchronousKLVMetadataPayload(payload, pes_data.pid, stream_id);
              } else if (tsDemuxer.pmt_.smpte2038_pids[pes_data.pid]) {
                tsDemuxer.parseSMPTE2038MetadataPayload(payload, pts, dts, pes_data.pid, stream_id);
              } else {
                tsDemuxer.parsePESPrivateDataPayload(payload, pts, dts, pes_data.pid, stream_id);
              }
              break;
            case TS_STREAM_TYPE.kADTSAAC:
              tsDemuxer.parseADTSAACPayload(payload, pts);
              break;
            case TS_STREAM_TYPE.kLOASAAC:
              tsDemuxer.parseLOASAACPayload(payload, pts);
              break;
            case TS_STREAM_TYPE.kAC3:
              break;
            case TS_STREAM_TYPE.kEAC3:
              break;
            case TS_STREAM_TYPE.kMetadata:
              if (tsDemuxer.pmt_.timed_id3_pids[pes_data.pid]) {
                tsDemuxer.parseTimedID3MetadataPayload(payload, pts, dts, pes_data.pid, stream_id);
              } else if (tsDemuxer.pmt_.synchronous_klv_pids[pes_data.pid]) {
                tsDemuxer.parseSynchronousKLVMetadataPayload(payload, pts, dts, pes_data.pid, stream_id);
              }
              break;
            case TS_STREAM_TYPE.kH264:
              tsDemuxer.parseH264Payload(payload, pts, dts, pes_data.random_access_indicator);
              break;
            case TS_STREAM_TYPE.kH265:
              tsDemuxer.parseH265Payload(payload, pts, dts, pes_data.random_access_indicator);
              break;
          }
        } else if (stream_id === 0xBC // program_stream_map
        || stream_id === 0xBF // private_stream_2
        || stream_id === 0xF0 // ECM
        || stream_id === 0xF1 // EMM
        || stream_id === 0xFF // program_stream_directory
        || stream_id === 0xF2 // DSMCC_stream
        || stream_id === 0xF8) {
          // ITU-T Rec. H.222.1 type E stream
          if (pes_data.stream_type === TS_STREAM_TYPE.kPESPrivateData) {
            let payload_start_index = 6;
            let payload_length;
            if (PES_packet_length !== 0) {
              payload_length = PES_packet_length;
            } else {
              // PES_packet_length === 0
              payload_length = data.byteLength - payload_start_index;
            }
            let payload = data.subarray(payload_start_index, payload_start_index + payload_length);
            tsDemuxer.parsePESPrivateDataPayload(payload, undefined, undefined, pes_data.pid, stream_id);
          }
        }
      },
      parsePAT(data) {
        let table_id = data[0];
        if (table_id !== 0x00) {
          Log.e(tsDemuxer.TAG, `parsePAT: table_id ${table_id} is not corresponded to PAT!`);
          return;
        }
        let section_length = (data[1] & 0x0F) << 8 | data[2];
        data[3] << 8 | data[4];
        let version_number = (data[5] & 0x3E) >>> 1;
        let current_next_indicator = data[5] & 0x01;
        let section_number = data[6];
        data[7];
        let pat = null;
        if (current_next_indicator === 1 && section_number === 0) {
          pat = {
            version_number: 0,
            network_pid: 0,
            program_pmt_pid: {}
          };
          pat.version_number = version_number;
        } else {
          pat = tsDemuxer.pat_;
          if (pat == undefined) {
            return;
          }
        }
        let program_start_index = 8;
        let program_bytes = section_length - 5 - 4; // section_length - (headers + crc)
        let first_program_number = -1;
        let first_pmt_pid = -1;
        for (let i = program_start_index; i < program_start_index + program_bytes; i += 4) {
          let program_number = data[i] << 8 | data[i + 1];
          let pid = (data[i + 2] & 0x1F) << 8 | data[i + 3];
          if (program_number === 0) {
            // network_PID
            pat.network_pid = pid;
          } else {
            // program_map_PID
            pat.program_pmt_pid[program_number] = pid;
            if (first_program_number === -1) {
              first_program_number = program_number;
            }
            if (first_pmt_pid === -1) {
              first_pmt_pid = pid;
            }
          }
        }

        // Currently we only deal with first appeared PMT pid
        if (current_next_indicator === 1 && section_number === 0) {
          if (tsDemuxer.pat_ == undefined) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Parsed first PAT: ${JSON.stringify(pat)}`);
          }
          tsDemuxer.pat_ = pat;
          tsDemuxer.current_program_ = first_program_number;
          tsDemuxer.current_pmt_pid_ = first_pmt_pid;
        }
      },
      parsePMT(data) {
        let table_id = data[0];
        if (table_id !== 0x02) {
          decoder.debug.error(tsDemuxer.TAG_NAME, `parsePMT: table_id ${table_id} is not corresponded to PMT!`);
          return;
        }
        let section_length = (data[1] & 0x0F) << 8 | data[2];
        let program_number = data[3] << 8 | data[4];
        let version_number = (data[5] & 0x3E) >>> 1;
        let current_next_indicator = data[5] & 0x01;
        let section_number = data[6];
        data[7];
        let pmt;
        if (current_next_indicator === 1 && section_number === 0) {
          pmt = tsDemuxer._initPmt();
          pmt.program_number = program_number;
          pmt.version_number = version_number;
          tsDemuxer.program_pmt_map_[program_number] = pmt;
        } else {
          pmt = tsDemuxer.program_pmt_map_[program_number];
          if (pmt == undefined) {
            return;
          }
        }
        pmt.pcr_pid = (data[8] & 0x1F) << 8 | data[9];
        let program_info_length = (data[10] & 0x0F) << 8 | data[11];
        let info_start_index = 12 + program_info_length;
        let info_bytes = section_length - 9 - program_info_length - 4;
        for (let i = info_start_index; i < info_start_index + info_bytes;) {
          let stream_type = data[i];
          let elementary_PID = (data[i + 1] & 0x1F) << 8 | data[i + 2];
          let ES_info_length = (data[i + 3] & 0x0F) << 8 | data[i + 4];
          pmt.pid_stream_type[elementary_PID] = stream_type;
          let already_has_video = pmt.common_pids.h264 || pmt.common_pids.h265;
          let already_has_audio = pmt.common_pids.adts_aac || pmt.common_pids.loas_aac || pmt.common_pids.ac3 || pmt.common_pids.eac3 || pmt.common_pids.opus || pmt.common_pids.mp3;
          if (stream_type === TS_STREAM_TYPE.kH264 && !already_has_video) {
            pmt.common_pids.h264 = elementary_PID;
          } else if (stream_type === TS_STREAM_TYPE.kH265 && !already_has_video) {
            pmt.common_pids.h265 = elementary_PID;
          } else if (stream_type === TS_STREAM_TYPE.kADTSAAC && !already_has_audio) {
            pmt.common_pids.adts_aac = elementary_PID;
          } else if (stream_type === TS_STREAM_TYPE.kLOASAAC && !already_has_audio) {
            pmt.common_pids.loas_aac = elementary_PID;
          } else if (stream_type === TS_STREAM_TYPE.kAC3 && !already_has_audio) {
            pmt.common_pids.ac3 = elementary_PID; // ATSC AC-3
          } else if (stream_type === TS_STREAM_TYPE.kEAC3 && !already_has_audio) {
            pmt.common_pids.eac3 = elementary_PID; // ATSC EAC-3
          } else if ((stream_type === TS_STREAM_TYPE.kMPEG1Audio || stream_type === TS_STREAM_TYPE.kMPEG2Audio) && !already_has_audio) {
            pmt.common_pids.mp3 = elementary_PID;
          } else if (stream_type === TS_STREAM_TYPE.kPESPrivateData) {
            pmt.pes_private_data_pids[elementary_PID] = true;
            if (ES_info_length > 0) {
              // parse descriptor for PES private data
              for (let offset = i + 5; offset < i + 5 + ES_info_length;) {
                let tag = data[offset + 0];
                let length = data[offset + 1];
                if (tag === 0x05) {
                  // Registration Descriptor
                  let registration = String.fromCharCode(...Array.from(data.subarray(offset + 2, offset + 2 + length)));
                  if (registration === 'VANC') {
                    pmt.smpte2038_pids[elementary_PID] = true;
                  } /* else if (registration === 'AC-3' && !already_has_audio) {
                    pmt.common_pids.ac3 = elementary_PID; // DVB AC-3 (FIXME: NEED VERIFY)
                    } */ /* else if (registration === 'EC-3' && !alrady_has_audio) {
                         pmt.common_pids.eac3 = elementary_PID; // DVB EAC-3 (FIXME: NEED VERIFY)
                         } */else if (registration === 'Opus') {
                    pmt.common_pids.opus = elementary_PID;
                  } else if (registration === 'KLVA') {
                    pmt.asynchronous_klv_pids[elementary_PID] = true;
                  }
                } else if (tag === 0x7F) {
                  // DVB extension descriptor
                  if (elementary_PID === pmt.common_pids.opus) {
                    let ext_desc_tag = data[offset + 2];
                    let channel_config_code = null;
                    if (ext_desc_tag === 0x80) {
                      // User defined (provisional Opus)
                      channel_config_code = data[offset + 3];
                    }
                    if (channel_config_code == null) {
                      Log.e(tsDemuxer.TAG, `Not Supported Opus channel count.`);
                      continue;
                    }
                    const meta = {
                      codec: 'opus',
                      channel_count: (channel_config_code & 0x0F) === 0 ? 2 : channel_config_code & 0x0F,
                      channel_config_code,
                      sample_rate: 48000
                    };
                    const sample = {
                      codec: 'opus',
                      meta
                    };
                    if (tsDemuxer.audio_init_segment_dispatched_ == false) {
                      tsDemuxer.audio_metadata_ = meta;
                      tsDemuxer.dispatchAudioInitSegment(sample);
                    } else if (tsDemuxer.detectAudioMetadataChange(sample)) {
                      // flush stashed frames before notify new AudioSpecificConfig
                      tsDemuxer.dispatchAudioMediaSegment();
                      // notify new AAC AudioSpecificConfig
                      tsDemuxer.dispatchAudioInitSegment(sample);
                    }
                  }
                }
                offset += 2 + length;
              }
              // provide descriptor for PES private data via callback
              data.subarray(i + 5, i + 5 + ES_info_length);
            }
          } else if (stream_type === TS_STREAM_TYPE.kMetadata) {
            if (ES_info_length > 0) {
              // parse descriptor for PES private data
              for (let offset = i + 5; offset < i + 5 + ES_info_length;) {
                let tag = data[offset + 0];
                let length = data[offset + 1];
                if (tag === 0x26) {
                  let metadata_application_format = data[offset + 2] << 8 | data[offset + 3] << 0;
                  let metadata_application_format_identifier = null;
                  if (metadata_application_format === 0xFFFF) {
                    metadata_application_format_identifier = String.fromCharCode(...Array.from(data.subarray(offset + 4, offset + 4 + 4)));
                  }
                  let metadata_format = data[offset + 4 + (metadata_application_format === 0xFFFF ? 4 : 0)];
                  let metadata_format_identifier = null;
                  if (metadata_format === 0xFF) {
                    let pad = 4 + (metadata_application_format === 0xFFFF ? 4 : 0) + 1;
                    metadata_format_identifier = String.fromCharCode(...Array.from(data.subarray(offset + pad, offset + pad + 4)));
                  }
                  if (metadata_application_format_identifier === 'ID3 ' && metadata_format_identifier === 'ID3 ') {
                    pmt.timed_id3_pids[elementary_PID] = true;
                  } else if (metadata_format_identifier === 'KLVA') {
                    pmt.synchronous_klv_pids[elementary_PID] = true;
                  }
                }
                offset += 2 + length;
              }
            }
          } else if (stream_type === TS_STREAM_TYPE.kSCTE35) {
            pmt.scte_35_pids[elementary_PID] = true;
          }
          i += 5 + ES_info_length;
        }
        if (program_number === tsDemuxer.current_program_) {
          if (tsDemuxer.pmt_ == undefined) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Parsed first PMT: ${JSON.stringify(pmt)}`);
          }
          tsDemuxer.pmt_ = pmt;
          if (pmt.common_pids.h264 || pmt.common_pids.h265) {
            tsDemuxer.has_video_ = true;
          }
          if (pmt.common_pids.adts_aac || pmt.common_pids.loas_aac || pmt.common_pids.ac3 || pmt.common_pids.opus || pmt.common_pids.mp3) {
            tsDemuxer.has_audio_ = true;
          }
        }
      },
      parseSCTE35(data) {
        // todo: 待解决
      },
      parseH264Payload(data, pts, dts, random_access_indicator) {
        let annexb_parser = new H264AnnexBParser(data);
        let nalu_payload = null;
        let payload = null;
        let units = [];
        let length = 0;
        let keyframe = false;
        while ((nalu_payload = annexb_parser.readNextNaluPayload()) != null) {
          let nalu_avc1 = new H264NaluAVC1(nalu_payload);
          if (nalu_avc1.type === H264_NAL_TYPE.kSliceSPS) {
            // Notice: parseSPS requires Nalu without startcode or length-header
            let details = SPSParser.parseSPS$2(nalu_payload.data);
            if (!tsDemuxer.video_init_segment_dispatched_) {
              tsDemuxer.video_metadata_.sps = nalu_avc1;
              tsDemuxer.video_metadata_.details = details;
            } else if (tsDemuxer.detectVideoMetadataChange(nalu_avc1, details) === true) {
              decoder.debug.log(tsDemuxer.TAG_NAME, `H264: Critical h264 metadata has been changed, attempt to re-generate InitSegment`);
              tsDemuxer.video_metadata_changed_ = true;
              tsDemuxer.video_metadata_ = {
                vps: undefined,
                sps: nalu_avc1,
                pps: undefined,
                details: details
              };
            }
          } else if (nalu_avc1.type === H264_NAL_TYPE.kSlicePPS) {
            if (!tsDemuxer.video_init_segment_dispatched_ || tsDemuxer.video_metadata_changed_) {
              tsDemuxer.video_metadata_.pps = nalu_avc1;
              if (tsDemuxer.video_metadata_.sps && tsDemuxer.video_metadata_.pps) {
                if (tsDemuxer.video_metadata_changed_) {
                  // flush stashed frames before changing codec metadata
                  tsDemuxer.dispatchVideoMediaSegment();
                }
                // notify new codec metadata (maybe changed)
                tsDemuxer.dispatchVideoInitSegment();
              }
            }
          } else if (nalu_avc1.type === H264_NAL_TYPE.kSliceIDR) {
            keyframe = true;
          } else if (nalu_avc1.type === H264_NAL_TYPE.kSliceNonIDR && random_access_indicator === 1) {
            // For open-gop stream, use random_access_indicator to identify keyframe
            keyframe = true;
          }

          // Push samples to remuxer only if initialization metadata has been dispatched
          if (tsDemuxer.video_init_segment_dispatched_) {
            units.push(nalu_avc1);
            length += nalu_avc1.data.byteLength;
          }
        }
        let pts_ms = Math.floor(pts / tsDemuxer.timescale_);
        let dts_ms = Math.floor(dts / tsDemuxer.timescale_);
        if (units.length) {
          let track = tsDemuxer.video_track_;
          // units 合并成一个 Uint8Array 赋值给 payload
          for (let i = 0; i < units.length; i++) {
            let unit = units[i];
            if (payload == null) {
              payload = unit.data;
            } else {
              let temp = new Uint8Array(payload.byteLength + unit.data.byteLength);
              temp.set(payload, 0);
              temp.set(unit.data, payload.byteLength);
              payload = temp;
            }
          }
          let avc_sample = {
            // units,
            length,
            isIFrame: keyframe,
            dts: dts_ms,
            pts: pts_ms,
            cts: pts_ms - dts_ms,
            payload,
            type: MEDIA_TYPE.video,
            isHevc: false
          };
          track.samples.push(avc_sample);
          // track.length += length;
          track.length = payload.byteLength;
        }
      },
      parseH265Payload(data, pts, dts, random_access_indicator) {
        let annexb_parser = new H265AnnexBParser(data);
        let nalu_payload = null;
        let payload = null;
        let units = [];
        let length = 0;
        let keyframe = false;
        while ((nalu_payload = annexb_parser.readNextNaluPayload()) != null) {
          let nalu_hvc1 = new H265NaluHVC1(nalu_payload);
          if (nalu_hvc1.type === H265_NAL_TYPE.kSliceVPS) {
            if (!tsDemuxer.video_init_segment_dispatched_) {
              let details = H265NaluParser.parseVPS(nalu_payload.data);
              tsDemuxer.video_metadata_.vps = nalu_hvc1;
              tsDemuxer.video_metadata_.details = {
                ...tsDemuxer.video_metadata_.details,
                ...details
              };
            }
          } else if (nalu_hvc1.type === H265_NAL_TYPE.kSliceSPS) {
            let details = H265NaluParser.parseSPS(nalu_payload.data);
            if (!tsDemuxer.video_init_segment_dispatched_) {
              tsDemuxer.video_metadata_.sps = nalu_hvc1;
              tsDemuxer.video_metadata_.details = {
                ...tsDemuxer.video_metadata_.details,
                ...details
              };
            } else if (tsDemuxer.detectVideoMetadataChange(nalu_hvc1, details) === true) {
              decoder.debug.log(tsDemuxer.TAG_NAME, `H265: Critical h265 metadata has been changed, attempt to re-generate InitSegment`);
              tsDemuxer.video_metadata_changed_ = true;
              tsDemuxer.video_metadata_ = {
                vps: undefined,
                sps: nalu_hvc1,
                pps: undefined,
                details: details
              };
            }
          } else if (nalu_hvc1.type === H265_NAL_TYPE.kSlicePPS) {
            if (!tsDemuxer.video_init_segment_dispatched_ || tsDemuxer.video_metadata_changed_) {
              let details = H265NaluParser.parsePPS(nalu_payload.data);
              tsDemuxer.video_metadata_.pps = nalu_hvc1;
              tsDemuxer.video_metadata_.details = {
                ...tsDemuxer.video_metadata_.details,
                ...details
              };
              if (tsDemuxer.video_metadata_.vps && tsDemuxer.video_metadata_.sps && tsDemuxer.video_metadata_.pps) {
                if (tsDemuxer.video_metadata_changed_) {
                  // flush stashed frames before changing codec metadata
                  tsDemuxer.dispatchVideoMediaSegment();
                }
                // notify new codec metadata (maybe changed)
                tsDemuxer.dispatchVideoInitSegment();
              }
            }
          } else if (nalu_hvc1.type === H265_NAL_TYPE.kSliceIDR_W_RADL || nalu_hvc1.type === H265_NAL_TYPE.kSliceIDR_N_LP || nalu_hvc1.type === H265_NAL_TYPE.kSliceCRA_NUT) {
            keyframe = true;
          }

          // Push samples to remuxer only if initialization metadata has been dispatched
          if (tsDemuxer.video_init_segment_dispatched_) {
            units.push(nalu_hvc1);
            length += nalu_hvc1.data.byteLength;
          }
        }
        let pts_ms = Math.floor(pts / tsDemuxer.timescale_);
        let dts_ms = Math.floor(dts / tsDemuxer.timescale_);
        if (units.length) {
          let track = tsDemuxer.video_track_;
          // units 合并成一个 Uint8Array 赋值给 payload
          for (let i = 0; i < units.length; i++) {
            let unit = units[i];
            if (payload == null) {
              payload = unit.data;
            } else {
              let temp = new Uint8Array(payload.byteLength + unit.data.byteLength);
              temp.set(payload, 0);
              temp.set(unit.data, payload.byteLength);
              payload = temp;
            }
          }
          let hvc_sample = {
            type: MEDIA_TYPE.video,
            // units,
            length,
            isIFrame: keyframe,
            dts: dts_ms,
            pts: pts_ms,
            cts: pts_ms - dts_ms,
            payload,
            isHevc: true
          };
          track.samples.push(hvc_sample);
          // track.length += length;
          track.length = payload.byteLength;
        }
      },
      detectVideoMetadataChange(new_sps, new_details) {
        if (new_details.codec_mimetype !== tsDemuxer.video_metadata_.details.codec_mimetype) {
          decoder.debug.log(tsDemuxer.TAG_NAME, `Video: Codec mimeType changed from ` + `${tsDemuxer.video_metadata_.details.codec_mimetype} to ${new_details.codec_mimetype}`);
          return true;
        }
        if (new_details.codec_size.width !== tsDemuxer.video_metadata_.details.codec_size.width || new_details.codec_size.height !== tsDemuxer.video_metadata_.details.codec_size.height) {
          let old_size = tsDemuxer.video_metadata_.details.codec_size;
          let new_size = new_details.codec_size;
          decoder.debug.log(tsDemuxer.TAG_NAME, `Video: Coded Resolution changed from ` + `${old_size.width}x${old_size.height} to ${new_size.width}x${new_size.height}`);
          return true;
        }
        if (new_details.present_size.width !== tsDemuxer.video_metadata_.details.present_size.width) {
          decoder.debug.log(tsDemuxer.TAG_NAME, `Video: Present resolution width changed from ` + `${tsDemuxer.video_metadata_.details.present_size.width} to ${new_details.present_size.width}`);
          return true;
        }
        return false;
      },
      isInitSegmentDispatched() {
        if (tsDemuxer.has_video_ && tsDemuxer.has_audio_) {
          // both video & audio
          return tsDemuxer.video_init_segment_dispatched_ && tsDemuxer.audio_init_segment_dispatched_;
        }
        if (tsDemuxer.has_video_ && !tsDemuxer.has_audio_) {
          // video only
          return tsDemuxer.video_init_segment_dispatched_;
        }
        if (!tsDemuxer.has_video_ && tsDemuxer.has_audio_) {
          // audio only
          return tsDemuxer.audio_init_segment_dispatched_;
        }
        return false;
      },
      dispatchVideoInitSegment() {
        let details = tsDemuxer.video_metadata_.details;
        let meta = {};
        meta.type = 'video';
        meta.id = tsDemuxer.video_track_.id;
        meta.timescale = 1000;
        meta.duration = tsDemuxer.duration_;
        meta.codecWidth = details.codec_size.width;
        meta.codecHeight = details.codec_size.height;
        meta.presentWidth = details.present_size.width;
        meta.presentHeight = details.present_size.height;
        meta.profile = details.profile_string;
        meta.level = details.level_string;
        meta.bitDepth = details.bit_depth;
        meta.chromaFormat = details.chroma_format;
        meta.sarRatio = details.sar_ratio;
        meta.frameRate = details.frame_rate;
        let fps_den = meta.frameRate.fps_den;
        let fps_num = meta.frameRate.fps_num;
        meta.refSampleDuration = 1000 * (fps_den / fps_num);
        meta.codec = details.codec_mimetype;
        //  hevc
        if (tsDemuxer.video_metadata_.vps) {
          let vps_without_header = tsDemuxer.video_metadata_.vps.data.subarray(4);
          let sps_without_header = tsDemuxer.video_metadata_.sps.data.subarray(4);
          let pps_without_header = tsDemuxer.video_metadata_.pps.data.subarray(4);
          meta.hvcc = hevcEncoderConfigurationRecord$2({
            vps: vps_without_header,
            sps: sps_without_header,
            pps: pps_without_header
          });
          if (tsDemuxer.video_init_segment_dispatched_ == false) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Generated first HEVCDecoderConfigurationRecord for mimeType: ${meta.codec}`);
          }
          if (meta.hvcc) {
            decoder.decodeVideo(meta.hvcc, 0, true, 0);
          }
        } else {
          // avc
          let sps_without_header = tsDemuxer.video_metadata_.sps.data.subarray(4);
          let pps_without_header = tsDemuxer.video_metadata_.pps.data.subarray(4);
          meta.avcc = avcEncoderConfigurationRecord$2({
            sps: sps_without_header,
            pps: pps_without_header
          });
          if (tsDemuxer.video_init_segment_dispatched_ == false) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Generated first AVCDecoderConfigurationRecord for mimeType: ${meta.codec}`);
          }
          if (meta.avcc) {
            decoder.decodeVideo(meta.avcc, 0, true, 0);
          }
        }
        // tsDemuxer.onTrackMetadata('video', meta);
        tsDemuxer.video_init_segment_dispatched_ = true;
        tsDemuxer.video_metadata_changed_ = false;

        // notify new MediaInfo
        let mi = tsDemuxer.media_info_;
        mi.hasVideo = true;
        mi.width = meta.codecWidth;
        mi.height = meta.codecHeight;
        mi.fps = meta.frameRate.fps;
        mi.profile = meta.profile;
        mi.level = meta.level;
        mi.refFrames = details.ref_frames;
        mi.chromaFormat = details.chroma_format_string;
        mi.sarNum = meta.sarRatio.width;
        mi.sarDen = meta.sarRatio.height;
        mi.videoCodec = meta.codec;
        if (mi.hasAudio && mi.audioCodec) {
          mi.mimeType = `video/mp2t; codecs="${mi.videoCodec},${mi.audioCodec}"`;
        } else {
          mi.mimeType = `video/mp2t; codecs="${mi.videoCodec}"`;
        }
      },
      dispatchVideoMediaSegment() {
        if (tsDemuxer.isInitSegmentDispatched()) {
          if (tsDemuxer.video_track_.length) {
            tsDemuxer._preDoDecode();
          }
        }
      },
      dispatchAudioMediaSegment() {
        if (tsDemuxer.isInitSegmentDispatched()) {
          if (tsDemuxer.audio_track_.length) {
            // tsDemuxer.onDataAvailable(tsDemuxer.audio_track_, null);
            tsDemuxer._preDoDecode();
          }
        }
      },
      dispatchAudioVideoMediaSegment() {
        if (tsDemuxer.isInitSegmentDispatched()) {
          if (tsDemuxer.audio_track_.length || tsDemuxer.video_track_.length) {
            tsDemuxer._preDoDecode();
          }
        }
      },
      parseADTSAACPayload(data, pts) {
        if (tsDemuxer.has_video_ && !tsDemuxer.video_init_segment_dispatched_) {
          // If first video IDR frame hasn't been detected,
          // Wait for first IDR frame and video init segment being dispatched
          return;
        }
        if (tsDemuxer.aac_last_incomplete_data_) {
          let buf = new Uint8Array(data.byteLength + tsDemuxer.aac_last_incomplete_data_.byteLength);
          buf.set(tsDemuxer.aac_last_incomplete_data_, 0);
          buf.set(data, tsDemuxer.aac_last_incomplete_data_.byteLength);
          data = buf;
        }
        let ref_sample_duration;
        let base_pts_ms;
        if (pts != undefined) {
          base_pts_ms = pts / tsDemuxer.timescale_;
        }
        if (tsDemuxer.audio_metadata_.codec === 'aac') {
          if (pts == undefined && tsDemuxer.audio_last_sample_pts_ != undefined) {
            ref_sample_duration = 1024 / tsDemuxer.audio_metadata_.sampling_frequency * 1000;
            base_pts_ms = tsDemuxer.audio_last_sample_pts_ + ref_sample_duration;
          } else if (pts == undefined) {
            decoder.debug.warn(tsDemuxer.TAG_NAME, `AAC: Unknown pts`);
            return;
          }
          if (tsDemuxer.aac_last_incomplete_data_ && tsDemuxer.audio_last_sample_pts_) {
            ref_sample_duration = 1024 / tsDemuxer.audio_metadata_.sampling_frequency * 1000;
            let new_pts_ms = tsDemuxer.audio_last_sample_pts_ + ref_sample_duration;
            if (Math.abs(new_pts_ms - base_pts_ms) > 1) {
              decoder.debug.warn(tsDemuxer.TAG_NAME, `AAC: Detected pts overlapped, ` + `expected: ${new_pts_ms}ms, PES pts: ${base_pts_ms}ms`);
              base_pts_ms = new_pts_ms;
            }
          }
        }
        let adts_parser = new AACADTSParser(data);
        let aac_frame = null;
        let sample_pts_ms = base_pts_ms;
        let last_sample_pts_ms;
        while ((aac_frame = adts_parser.readNextAACFrame()) != null) {
          ref_sample_duration = 1024 / aac_frame.sampling_frequency * 1000;
          const audio_sample = {
            codec: 'aac',
            data: aac_frame
          };
          if (tsDemuxer.audio_init_segment_dispatched_ == false) {
            tsDemuxer.audio_metadata_ = {
              codec: 'aac',
              audio_object_type: aac_frame.audio_object_type,
              sampling_freq_index: aac_frame.sampling_freq_index,
              sampling_frequency: aac_frame.sampling_frequency,
              channel_config: aac_frame.channel_config
            };
            tsDemuxer.dispatchAudioInitSegment(audio_sample);
          } else if (tsDemuxer.detectAudioMetadataChange(audio_sample)) {
            // flush stashed frames before notify new AudioSpecificConfig
            tsDemuxer.dispatchAudioMediaSegment();
            // notify new AAC AudioSpecificConfig
            tsDemuxer.dispatchAudioInitSegment(audio_sample);
          }
          last_sample_pts_ms = sample_pts_ms;
          let sample_pts_ms_int = Math.floor(sample_pts_ms);
          const arrayBuffer = new Uint8Array(aac_frame.data.length + 2);
          arrayBuffer.set([0xAF, 0x01], 0);
          arrayBuffer.set(aac_frame.data, 2);
          let aac_sample = {
            // unit: aac_frame.data,
            payload: arrayBuffer,
            length: arrayBuffer.byteLength,
            pts: sample_pts_ms_int,
            dts: sample_pts_ms_int,
            type: MEDIA_TYPE.audio
          };
          tsDemuxer.audio_track_.samples.push(aac_sample);
          tsDemuxer.audio_track_.length += arrayBuffer.byteLength;
          sample_pts_ms += ref_sample_duration;
        }
        if (adts_parser.hasIncompleteData()) {
          tsDemuxer.aac_last_incomplete_data_ = adts_parser.getIncompleteData();
        }
        if (last_sample_pts_ms) {
          tsDemuxer.audio_last_sample_pts_ = last_sample_pts_ms;
        }
      },
      parseLOASAACPayload(data, pts) {
        if (tsDemuxer.has_video_ && !tsDemuxer.video_init_segment_dispatched_) {
          // If first video IDR frame hasn't been detected,
          // Wait for first IDR frame and video init segment being dispatched
          return;
        }
        if (tsDemuxer.aac_last_incomplete_data_) {
          let buf = new Uint8Array(data.byteLength + tsDemuxer.aac_last_incomplete_data_.byteLength);
          buf.set(tsDemuxer.aac_last_incomplete_data_, 0);
          buf.set(data, tsDemuxer.aac_last_incomplete_data_.byteLength);
          data = buf;
        }
        let ref_sample_duration;
        let base_pts_ms;
        if (pts != undefined) {
          base_pts_ms = pts / tsDemuxer.timescale_;
        }
        if (tsDemuxer.audio_metadata_.codec === 'aac') {
          if (pts == undefined && tsDemuxer.audio_last_sample_pts_ != undefined) {
            ref_sample_duration = 1024 / tsDemuxer.audio_metadata_.sampling_frequency * 1000;
            base_pts_ms = tsDemuxer.audio_last_sample_pts_ + ref_sample_duration;
          } else if (pts == undefined) {
            decoder.debug.warn(tsDemuxer.TAG_NAME, `AAC: Unknown pts`);
            return;
          }
          if (tsDemuxer.aac_last_incomplete_data_ && tsDemuxer.audio_last_sample_pts_) {
            ref_sample_duration = 1024 / tsDemuxer.audio_metadata_.sampling_frequency * 1000;
            let new_pts_ms = tsDemuxer.audio_last_sample_pts_ + ref_sample_duration;
            if (Math.abs(new_pts_ms - base_pts_ms) > 1) {
              decoder.debug.warn(tsDemuxer.TAG, `AAC: Detected pts overlapped, ` + `expected: ${new_pts_ms}ms, PES pts: ${base_pts_ms}ms`);
              base_pts_ms = new_pts_ms;
            }
          }
        }
        let loas_parser = new AACLOASParser(data);
        let aac_frame = null;
        let sample_pts_ms = base_pts_ms;
        let last_sample_pts_ms;
        while ((aac_frame = loas_parser.readNextAACFrame(tsDemuxer.loas_previous_frame ?? undefined)) != null) {
          tsDemuxer.loas_previous_frame = aac_frame;
          ref_sample_duration = 1024 / aac_frame.sampling_frequency * 1000;
          const audio_sample = {
            codec: 'aac',
            data: aac_frame
          };
          if (tsDemuxer.audio_init_segment_dispatched_ == false) {
            tsDemuxer.audio_metadata_ = {
              codec: 'aac',
              audio_object_type: aac_frame.audio_object_type,
              sampling_freq_index: aac_frame.sampling_freq_index,
              sampling_frequency: aac_frame.sampling_frequency,
              channel_config: aac_frame.channel_config
            };
            tsDemuxer.dispatchAudioInitSegment(audio_sample);
          } else if (tsDemuxer.detectAudioMetadataChange(audio_sample)) {
            // flush stashed frames before notify new AudioSpecificConfig
            tsDemuxer.dispatchAudioMediaSegment();
            // notify new AAC AudioSpecificConfig
            tsDemuxer.dispatchAudioInitSegment(audio_sample);
          }
          last_sample_pts_ms = sample_pts_ms;
          let sample_pts_ms_int = Math.floor(sample_pts_ms);
          const arrayBuffer = new Uint8Array(aac_frame.data.length + 2);
          arrayBuffer.set([0xAF, 0x01], 0);
          arrayBuffer.set(aac_frame.data, 2);
          let aac_sample = {
            // unit: aac_frame.data,
            payload: arrayBuffer,
            length: arrayBuffer.byteLength,
            pts: sample_pts_ms_int,
            dts: sample_pts_ms_int,
            type: MEDIA_TYPE.audio
          };
          tsDemuxer.audio_track_.samples.push(aac_sample);
          tsDemuxer.audio_track_.length += arrayBuffer.byteLength;
          sample_pts_ms += ref_sample_duration;
        }
        if (loas_parser.hasIncompleteData()) {
          tsDemuxer.aac_last_incomplete_data_ = loas_parser.getIncompleteData();
        }
        if (last_sample_pts_ms) {
          tsDemuxer.audio_last_sample_pts_ = last_sample_pts_ms;
        }
      },
      parseAC3Payload(data, pts) {
        // todo: 待开发
      },
      parseEAC3Payload(data, pts) {
        // todo: 待开发
      },
      parseOpusPayload(data, pts) {
        // todo: 待开发
      },
      parseMP3Payload(data, pts) {
        if (tsDemuxer.has_video_ && !tsDemuxer.video_init_segment_dispatched_) {
          // If first video IDR frame hasn't been detected,
          // Wait for first IDR frame and video init segment being dispatched
          return;
        }
        let _mpegAudioV10SampleRateTable = [44100, 48000, 32000, 0];
        let _mpegAudioV20SampleRateTable = [22050, 24000, 16000, 0];
        let _mpegAudioV25SampleRateTable = [11025, 12000, 8000, 0];
        let ver = data[1] >>> 3 & 0x03;
        let layer = (data[1] & 0x06) >> 1;
        (data[2] & 0xF0) >>> 4;
        let sampling_freq_index = (data[2] & 0x0C) >>> 2;
        let channel_mode = data[3] >>> 6 & 0x03;
        let channel_count = channel_mode !== 3 ? 2 : 1;
        let sample_rate = 0;
        let object_type = 34; // Layer-3, listed in MPEG-4 Audio Object Types
        switch (ver) {
          case 0:
            // MPEG 2.5
            sample_rate = _mpegAudioV25SampleRateTable[sampling_freq_index];
            break;
          case 2:
            // MPEG 2
            sample_rate = _mpegAudioV20SampleRateTable[sampling_freq_index];
            break;
          case 3:
            // MPEG 1
            sample_rate = _mpegAudioV10SampleRateTable[sampling_freq_index];
            break;
        }
        switch (layer) {
          case 1:
            // Layer 3
            object_type = 34;
            break;
          case 2:
            // Layer 2
            object_type = 33;
            break;
          case 3:
            // Layer 1
            object_type = 32;
            break;
        }
        const sample = {};
        sample.object_type = object_type;
        sample.sample_rate = sample_rate;
        sample.channel_count = channel_count;
        sample.data = data;
        const audio_sample = {
          codec: 'mp3',
          data: sample
        };
        if (tsDemuxer.audio_init_segment_dispatched_ == false) {
          tsDemuxer.audio_metadata_ = {
            codec: 'mp3',
            object_type,
            sample_rate,
            channel_count
          };
          tsDemuxer.dispatchAudioInitSegment(audio_sample);
        } else if (tsDemuxer.detectAudioMetadataChange(audio_sample)) {
          // flush stashed frames before notify new AudioSpecificConfig
          tsDemuxer.dispatchAudioMediaSegment();
          // notify new AAC AudioSpecificConfig
          tsDemuxer.dispatchAudioInitSegment(audio_sample);
        }
        let mp3_sample = {
          // unit: data,
          payload: data,
          length: data.byteLength,
          pts: pts / tsDemuxer.timescale_,
          dts: pts / tsDemuxer.timescale_,
          type: MEDIA_TYPE.audio
        };
        tsDemuxer.audio_track_.samples.push(mp3_sample);
        tsDemuxer.audio_track_.length += data.byteLength;
      },
      detectAudioMetadataChange(sample) {
        if (sample.codec !== tsDemuxer.audio_metadata_.codec) {
          decoder.debug.log(tsDemuxer.TAG_NAME, `Audio: Audio Codecs changed from ` + `${tsDemuxer.audio_metadata_.codec} to ${sample.codec}`);
          return true;
        }
        if (sample.codec === 'aac' && tsDemuxer.audio_metadata_.codec === 'aac') {
          const frame = sample.data;
          if (frame.audio_object_type !== tsDemuxer.audio_metadata_.audio_object_type) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AAC: AudioObjectType changed from ` + `${tsDemuxer.audio_metadata_.audio_object_type} to ${frame.audio_object_type}`);
            return true;
          }
          if (frame.sampling_freq_index !== tsDemuxer.audio_metadata_.sampling_freq_index) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AAC: SamplingFrequencyIndex changed from ` + `${tsDemuxer.audio_metadata_.sampling_freq_index} to ${frame.sampling_freq_index}`);
            return true;
          }
          if (frame.channel_config !== tsDemuxer.audio_metadata_.channel_config) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AAC: Channel configuration changed from ` + `${tsDemuxer.audio_metadata_.channel_config} to ${frame.channel_config}`);
            return true;
          }
        } else if (sample.codec === 'ac-3' && tsDemuxer.audio_metadata_.codec === 'ac-3') {
          const frame = sample.data;
          if (frame.sampling_frequency !== tsDemuxer.audio_metadata_.sampling_frequency) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AC3: Sampling Frequency changed from ` + `${tsDemuxer.audio_metadata_.sampling_frequency} to ${frame.sampling_frequency}`);
            return true;
          }
          if (frame.bit_stream_identification !== tsDemuxer.audio_metadata_.bit_stream_identification) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AC3: Bit Stream Identification changed from ` + `${tsDemuxer.audio_metadata_.bit_stream_identification} to ${frame.bit_stream_identification}`);
            return true;
          }
          if (frame.bit_stream_mode !== tsDemuxer.audio_metadata_.bit_stream_mode) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AC3: BitStream Mode changed from ` + `${tsDemuxer.audio_metadata_.bit_stream_mode} to ${frame.bit_stream_mode}`);
            return true;
          }
          if (frame.channel_mode !== tsDemuxer.audio_metadata_.channel_mode) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AC3: Channel Mode changed from ` + `${tsDemuxer.audio_metadata_.channel_mode} to ${frame.channel_mode}`);
            return true;
          }
          if (frame.low_frequency_effects_channel_on !== tsDemuxer.audio_metadata_.low_frequency_effects_channel_on) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `AC3: Low Frequency Effects Channel On changed from ` + `${tsDemuxer.audio_metadata_.low_frequency_effects_channel_on} to ${frame.low_frequency_effects_channel_on}`);
            return true;
          }
        } else if (sample.codec === 'opus' && tsDemuxer.audio_metadata_.codec === 'opus') {
          const data = sample.meta;
          if (data.sample_rate !== tsDemuxer.audio_metadata_.sample_rate) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Opus: SamplingFrequencyIndex changed from ` + `${tsDemuxer.audio_metadata_.sample_rate} to ${data.sample_rate}`);
            return true;
          }
          if (data.channel_count !== tsDemuxer.audio_metadata_.channel_count) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `Opus: Channel count changed from ` + `${tsDemuxer.audio_metadata_.channel_count} to ${data.channel_count}`);
            return true;
          }
        } else if (sample.codec === 'mp3' && tsDemuxer.audio_metadata_.codec === 'mp3') {
          const data = sample.data;
          if (data.object_type !== tsDemuxer.audio_metadata_.object_type) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `MP3: AudioObjectType changed from ` + `${tsDemuxer.audio_metadata_.object_type} to ${data.object_type}`);
            return true;
          }
          if (data.sample_rate !== tsDemuxer.audio_metadata_.sample_rate) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `MP3: SamplingFrequencyIndex changed from ` + `${tsDemuxer.audio_metadata_.sample_rate} to ${data.sample_rate}`);
            return true;
          }
          if (data.channel_count !== tsDemuxer.audio_metadata_.channel_count) {
            decoder.debug.log(tsDemuxer.TAG_NAME, `MP3: Channel count changed from ` + `${tsDemuxer.audio_metadata_.channel_count} to ${data.channel_count}`);
            return true;
          }
        }
        return false;
      },
      dispatchAudioInitSegment(sample) {
        let meta = {};
        meta.type = 'audio';
        meta.id = tsDemuxer.audio_track_.id;
        meta.timescale = 1000;
        meta.duration = tsDemuxer.duration_;
        if (tsDemuxer.audio_metadata_.codec === 'aac') {
          let aac_frame = sample.codec === 'aac' ? sample.data : null;
          let audio_specific_config = new AudioSpecificConfig(aac_frame);
          meta.audioSampleRate = audio_specific_config.sampling_rate;
          meta.audioSampleRateIndex = audio_specific_config.sampling_index;
          meta.channelCount = audio_specific_config.channel_count;
          meta.codec = audio_specific_config.codec_mimetype;
          meta.originalCodec = audio_specific_config.original_codec_mimetype;
          meta.config = audio_specific_config.config;
          meta.refSampleDuration = 1024 / meta.audioSampleRate * meta.timescale;
          const aacADTSHeader = aacEncoderConfigurationRecordV2({
            profile: decoder._opt.mseDecodeAudio ? audio_specific_config.object_type : audio_specific_config.original_object_type,
            sampleRate: meta.audioSampleRateIndex,
            channel: meta.channelCount
          });
          decoder.decodeAudio(aacADTSHeader, 0);
        } else if (tsDemuxer.audio_metadata_.codec === 'ac-3') ; else if (tsDemuxer.audio_metadata_.codec === 'ec-3') ; else if (tsDemuxer.audio_metadata_.codec === 'opus') ; else if (tsDemuxer.audio_metadata_.codec === 'mp3') {
          meta.audioSampleRate = tsDemuxer.audio_metadata_.sample_rate;
          meta.channelCount = tsDemuxer.audio_metadata_.channel_count;
          meta.codec = 'mp3';
          meta.originalCodec = 'mp3';
          meta.config = undefined;
        }
        if (tsDemuxer.audio_init_segment_dispatched_ == false) {
          decoder.debug.log(tsDemuxer.TAG_NAME, `Generated first AudioSpecificConfig for mimeType: ${meta.codec}`);
        }

        // todo:待开发
        // tsDemuxer.onTrackMetadata('audio', meta);
        // console.error('audio', meta);

        tsDemuxer.audio_init_segment_dispatched_ = true;
        tsDemuxer.video_metadata_changed_ = false;

        // notify new MediaInfo
        let mi = tsDemuxer.media_info_;
        mi.hasAudio = true;
        mi.audioCodec = meta.originalCodec;
        mi.audioSampleRate = meta.audioSampleRate;
        mi.audioChannelCount = meta.channelCount;
        if (mi.hasVideo && mi.videoCodec) {
          mi.mimeType = `video/mp2t; codecs="${mi.videoCodec},${mi.audioCodec}"`;
        } else {
          mi.mimeType = `video/mp2t; codecs="${mi.audioCodec}"`;
        }

        // todo 待完成
        // console.error('todo:dispatchAudioInitSegment', mi, mi.isComplete());
      },

      dispatchPESPrivateDataDescriptor(pid, stream_type, descriptor) {

        // todo: 待解决
      },

      parsePESPrivateDataPayload(data, pts, dts, pid, stream_id) {
        let private_data = new PESPrivateData();
        private_data.pid = pid;
        private_data.stream_id = stream_id;
        private_data.len = data.byteLength;
        private_data.data = data;
        if (pts != undefined) {
          let pts_ms = Math.floor(pts / tsDemuxer.timescale_);
          private_data.pts = pts_ms;
        } else {
          private_data.nearest_pts = tsDemuxer.getNearestTimestampMilliseconds();
        }
        if (dts != undefined) {
          let dts_ms = Math.floor(dts / tsDemuxer.timescale_);
          private_data.dts = dts_ms;
        }

        //  todo:待解决
        // console.error('todo ：parsePESPrivateDataPayload', private_data);
      },

      parseTimedID3MetadataPayload(data, pts, dts, pid, stream_id) {
        //      todo 待开发
        decoder.debug.log(tsDemuxer.TAG_NAME, `Timed ID3 Metadata: pid=${pid}, pts=${pts}, dts=${dts}, stream_id=${stream_id}`);
      },
      parseSynchronousKLVMetadataPayload(data, pts, dts, pid, stream_id) {
        decoder.debug.log(tsDemuxer.TAG_NAME, `Synchronous KLV Metadata: pid=${pid}, pts=${pts}, dts=${dts}, stream_id=${stream_id}`);
      },
      parseAsynchronousKLVMetadataPayload(data, pid, stream_id) {
        // todo: 待开发
        decoder.debug.log(tsDemuxer.TAG_NAME, `Asynchronous KLV Metadata: pid=${pid}, stream_id=${stream_id}`);
      },
      parseSMPTE2038MetadataPayload(data, pts, dts, pid, stream_id) {
        // todo: 待开发
        decoder.debug.log(tsDemuxer.TAG_NAME, `SMPTE 2038 Metadata: pid=${pid}, pts=${pts}, dts=${dts}, stream_id=${stream_id}`);
      },
      getNearestTimestampMilliseconds() {
        // Prefer using last audio sample pts if audio track exists
        if (tsDemuxer.audio_last_sample_pts_ != undefined) {
          return Math.floor(tsDemuxer.audio_last_sample_pts_);
        } else if (tsDemuxer.last_pcr_ != undefined) {
          // Fallback to PCR time if audio track doesn't exist
          const pcr_time_ms = Math.floor(tsDemuxer.last_pcr_ / 300 / tsDemuxer.timescale_);
          return pcr_time_ms;
        }
        return undefined;
      },
      //
      _preDoDecode() {
        const videoTrack = tsDemuxer.video_track_;
        const audioTrack = tsDemuxer.audio_track_;
        let allSampleList = videoTrack.samples;
        if (audioTrack.samples.length > 0) {
          allSampleList = videoTrack.samples.concat(audioTrack.samples);
          allSampleList = allSampleList.sort((a, b) => {
            return a.dts - b.dts;
          });
        }
        allSampleList.forEach(sample => {
          const arrayBuffer = new Uint8Array(sample.payload);
          delete sample.payload;
          if (sample.type === MEDIA_TYPE.video) {
            tsDemuxer._doDecodeVideo({
              ...sample,
              payload: arrayBuffer
            });
          } else if (sample.type === MEDIA_TYPE.audio) {
            tsDemuxer._doDecodeAudio({
              ...sample,
              payload: arrayBuffer
            });
          }
        });
        videoTrack.samples = [];
        videoTrack.length = 0;
        audioTrack.samples = [];
        audioTrack.length = 0;
      },
      _doDecodeVideo(sample) {
        const uint8Array = new Uint8Array(sample.payload);
        let packet = null;
        if (sample.isHevc) {
          //  add 5 header
          packet = hevcEncoderNalePacketNotLength(uint8Array, sample.isIFrame);
        } else {
          packet = avcEncoderNalePacketNotLength(uint8Array, sample.isIFrame);
        }
        if (sample.isIFrame) {
          decoder.calcIframeIntervalTimestamp(sample.dts);
        }
        let payloadBuffer = decoder.cryptoPayload(packet, sample.isIFrame);
        decoder.decode(payloadBuffer, {
          type: MEDIA_TYPE.video,
          ts: sample.dts,
          isIFrame: sample.isIFrame,
          cts: sample.cts
        });
      },
      _doDecodeAudio(sample) {
        const uint8Array = new Uint8Array(sample.payload);
        let payloadBuffer = uint8Array;
        if (isTrue(decoder._opt.m7sCryptoAudio)) {
          payloadBuffer = decoder.cryptoPayloadAudio(uint8Array);
        }
        decoder.decode(payloadBuffer, {
          type: MEDIA_TYPE.audio,
          ts: sample.dts,
          isIFrame: false,
          cts: 0
        });
      }
    };
    let mseDecoder = null;
    if (supportMSEForWorker()) {
      mseDecoder = {
        TAG_NAME: 'worker MediaSource',
        _resetInIt() {
          mseDecoder.isAvc = null; //
          mseDecoder.isAAC = null; //
          mseDecoder.videoInfo = {};
          mseDecoder.videoMeta = {};
          mseDecoder.audioMeta = {};
          mseDecoder.sourceBuffer = null;
          mseDecoder.audioSourceBuffer = null;
          mseDecoder.hasInit = false;
          mseDecoder.hasAudioInit = false;
          mseDecoder.isAudioInitInfo = false;
          mseDecoder.videoMimeType = '';
          mseDecoder.audioMimeType = '';
          mseDecoder.cacheTrack = {};
          mseDecoder.cacheAudioTrack = {};
          mseDecoder.timeInit = false;
          mseDecoder.sequenceNumber = 0;
          mseDecoder.audioSequenceNumber = 0;
          mseDecoder.firstRenderTime = null;
          mseDecoder.firstAudioTime = null; // 暂时不用
          mseDecoder.mediaSourceAppendBufferFull = false;
          mseDecoder.mediaSourceAppendBufferError = false;
          mseDecoder.mediaSourceAddSourceBufferError = false;
          mseDecoder.mediaSourceBufferError = false;
          mseDecoder.mediaSourceError = false;
          mseDecoder.prevTimestamp = null;
          mseDecoder.decodeDiffTimestamp = null;
          mseDecoder.prevDts = null;
          mseDecoder.prevAudioDts = null;
          mseDecoder.prevPayloadBufferSize = 0;
          mseDecoder.isWidthOrHeightChanged = false;
          mseDecoder.prevTs = null;
          mseDecoder.prevAudioTs = null;
          mseDecoder.eventListenList = [];
          mseDecoder.pendingRemoveRanges = [];
          mseDecoder.pendingSegments = [];
          mseDecoder.pendingAudioRemoveRanges = [];
          mseDecoder.pendingAudioSegments = [];
          mseDecoder.supportVideoFrameCallbackHandle = null;
          mseDecoder.audioSourceBufferCheckTimeout = null;
          mseDecoder.audioSourceNoDataCheckTimeout = null;
          mseDecoder.hasPendingEos = false;
          mseDecoder.$video = {
            currentTime: 0,
            readyState: 0
          };
        },
        init() {
          mseDecoder.events = new Events();
          mseDecoder._resetInIt();
          mseDecoder.mediaSource = new self.MediaSource();
          mseDecoder.isDecodeFirstIIframe = isFalse(decoder._opt.checkFirstIFrame) ? true : false;
          mseDecoder._bindMediaSourceEvents();
          // playback support
          // visible change的问题。
        },

        destroy() {
          mseDecoder.stop();
          mseDecoder._clearAudioSourceBufferCheckTimeout();
          if (mseDecoder.eventListenList && mseDecoder.eventListenList.length) {
            mseDecoder.eventListenList.forEach(item => item());
            mseDecoder.eventListenList = [];
          }
          mseDecoder._resetInIt();
        },
        getState() {
          return mseDecoder.mediaSource && mseDecoder.mediaSource.readyState;
        },
        isStateOpen() {
          return mseDecoder.getState() === MEDIA_SOURCE_STATE.open;
        },
        isStateClosed() {
          return mseDecoder.getState() === MEDIA_SOURCE_STATE.closed;
        },
        isStateEnded() {
          return mseDecoder.getState() === MEDIA_SOURCE_STATE.ended;
        },
        _bindMediaSourceEvents() {
          const {
            proxy
          } = mseDecoder.events;
          // 当 "closed" to "open" 或者 "ended" to "open" 时触发。
          const sourceOpenProxyDestroy = proxy(mseDecoder.mediaSource, MEDIA_SOURCE_EVENTS.sourceOpen, () => {
            decoder.debug.log(mseDecoder.TAG_NAME, 'sourceOpen');
            mseDecoder._onMediaSourceSourceOpen();
          });

          //当 "open" to "closed" 或者 "ended" to "closed" 时触发。
          const sourceCloseProxyDestroy = proxy(mseDecoder.mediaSource, MEDIA_SOURCE_EVENTS.sourceClose, () => {
            decoder.debug.log(mseDecoder.TAG_NAME, 'sourceClose');
          });

          // 当 "open" to "ended" 时触发
          const sourceendedProxyDestroy = proxy(mseDecoder.mediaSource, MEDIA_SOURCE_EVENTS.sourceended, () => {
            decoder.debug.log(mseDecoder.TAG_NAME, 'sourceended');
          });
          mseDecoder.eventListenList.push(sourceOpenProxyDestroy, sourceCloseProxyDestroy, sourceendedProxyDestroy);
        },
        _onMediaSourceSourceOpen() {
          // 1. remove evnet listener
          // 2. check _pendingSourceBufferInit list
          // 3. do Append Segments

          if (!mseDecoder.sourceBuffer) {
            decoder.debug.log(mseDecoder.TAG_NAME, 'onMediaSourceSourceOpen() sourceBuffer is null and next init');
            mseDecoder._initSourceBuffer();
          }
          if (!mseDecoder.audioSourceBuffer) {
            decoder.debug.log(mseDecoder.TAG_NAME, 'onMediaSourceSourceOpen() audioSourceBuffer is null and next init');
            mseDecoder._initAudioSourceBuffer();
          }

          //  append immediately only if init segment in subsequence
          if (mseDecoder._hasPendingSegments()) {
            mseDecoder._doAppendSegments();
          }
        },
        decodeVideo(payload, ts, isIframe, cts) {
          if (decoder.isDestroyed) {
            decoder.debug.warn(mseDecoder.TAG_NAME, 'decodeVideo() and decoder is destroyed');
            return;
          }
          if (isFalse(mseDecoder.hasInit)) {
            if (isIframe && payload[1] === AVC_PACKET_TYPE.sequenceHeader) {
              const videoCodec = payload[0] & 0x0F;
              // windows 下面的 360 浏览器是支持 mse 解码播放的。
              // edge 也是支持 mse 解码播放的。
              if (videoCodec === VIDEO_ENC_CODE.h265 && isFalse(supportMSEDecodeHevc())) {
                mseDecoder.emitError(EVENTS_ERROR.mediaSourceH265NotSupport);
                return;
              }
              mseDecoder.videoInfo.codec = videoCodec;
              postMessage({
                cmd: WORKER_CMD_TYPE.videoCode,
                code: videoCodec
              });
              const payloadNew = new Uint8Array(payload);
              postMessage({
                cmd: WORKER_CMD_TYPE.videoCodec,
                buffer: payloadNew,
                codecId: videoCodec
              }, [payloadNew.buffer]);
              mseDecoder.hasInit = mseDecoder._decodeConfigurationRecord(payload, ts, isIframe, videoCodec);
            } else {
              decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo has not init , isIframe is ${isIframe} , payload is ${payload[1]}`);
            }
          } else {
            if (!mseDecoder.isDecodeFirstIIframe && isIframe) {
              mseDecoder.isDecodeFirstIIframe = true;
            }
            if (mseDecoder.isDecodeFirstIIframe) {
              //  check video width or height is changed
              if (isIframe && payload[1] === 0) {
                const videoCodec = payload[0] & 0x0F;
                let config = {};
                if (videoCodec === VIDEO_ENC_CODE.h264) {
                  let data = payload.slice(5);
                  config = parseAVCDecoderConfigurationRecord(data);
                } else if (videoCodec === VIDEO_ENC_CODE.h265) {
                  config = parseHEVCDecoderConfigurationRecord$2(payload);
                }
                const videoInfo = mseDecoder.videoInfo;
                if (videoInfo && videoInfo.codecWidth && videoInfo.codecWidth && config && config.codecWidth && config.codecHeight && (config.codecWidth !== videoInfo.codecWidth || config.codecHeight !== videoInfo.codecWidth)) {
                  decoder.debug.warn(mseDecoder.TAG_NAME, `
                                decodeVideo: video width or height is changed,
                                old width is ${videoInfo.codecWidth}, old height is ${videoInfo.codecWidth},
                                new width is ${config.codecWidth}, new height is ${config.codecHeight},
                                and emit change event`);
                  mseDecoder.isWidthOrHeightChanged = true;
                  mseDecoder.emitError(EVENTS_ERROR.mseWidthOrHeightChange);
                }
              }
              if (mseDecoder.isWidthOrHeightChanged) {
                decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo: video width or height is changed, and return`);
                return;
              }
              if (isVideoSequenceHeader(payload)) {
                decoder.debug.warn(mseDecoder.TAG_NAME, 'decodeVideo and payload is video sequence header so drop this frame');
                return;
              }
              if (payload.byteLength < VIDEO_PAYLOAD_MIN_SIZE) {
                decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo and payload is too small , payload length is ${payload.byteLength}`);
                return;
              }
              let dts = ts;
              //  just for player
              if (decoder.isPlayer) {
                if (mseDecoder.firstRenderTime === null) {
                  mseDecoder.firstRenderTime = ts;
                  // 需要post到主线程
                  postMessage({
                    cmd: WORKER_CMD_TYPE.mseFirstRenderTime,
                    value: mseDecoder.firstRenderTime
                  });
                }
                dts = ts - mseDecoder.firstRenderTime;
                if (dts < 0) {
                  decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo
                                 local dts is < 0 , ts is ${ts} and prevTs is ${mseDecoder.prevTs},
                                 firstRenderTime is ${mseDecoder.firstRenderTime} and mseCorrectTimeDuration is ${decoder._opt.mseCorrectTimeDuration}`);
                  if (mseDecoder.prevDts === null) {
                    dts = 0;
                  } else {
                    dts = mseDecoder.prevDts + decoder._opt.mseCorrectTimeDuration;
                  }
                  if (mseDecoder._checkTsIsMaxDiff(ts)) {
                    decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo is max diff , ts is ${ts} and prevTs is ${mseDecoder.prevTs}, diff is ${mseDecoder.prevTs - ts}`);
                    mseDecoder.emitError(EVENTS_ERROR.mediaSourceTsIsMaxDiff);
                    return;
                  }
                }
                if (mseDecoder.prevDts !== null && dts <= mseDecoder.prevDts) {
                  decoder.debug.warn(mseDecoder.TAG_NAME, `
                                decodeVideo dts is less than(or equal) prev dts ,
                                dts is ${dts} and prev dts is ${mseDecoder.prevDts} ，
                                and now ts is ${ts} and prev ts is ${mseDecoder.prevTs} ，
                                and diff is ${ts - mseDecoder.prevTs} and firstRenderTime is ${mseDecoder.firstRenderTime} and isIframe is ${isIframe}，
                                and mseCorrectTimeDuration is ${decoder._opt.mseCorrectTimeDuration},
                                and prevPayloadBufferSize is ${mseDecoder.prevPayloadBufferSize} and payload size is ${payload.byteLength}`);
                  if (dts === mseDecoder.prevDts) {
                    if (mseDecoder.prevPayloadBufferSize === payload.byteLength) {
                      decoder.debug.warn(mseDecoder.TAG_NAME, 'decodeVideo dts is equal to prev dts and payload size is equal to prev payload size so drop this frame');
                      return;
                    }
                  }
                  dts = mseDecoder.prevDts + decoder._opt.mseCorrectTimeDuration;
                  if (mseDecoder._checkTsIsMaxDiff(ts)) {
                    decoder.debug.warn(mseDecoder.TAG_NAME, `decodeVideo is max diff , ts is ${ts} and prevTs is ${mseDecoder.prevTs}, diff is ${mseDecoder.prevTs - ts} and emit replay`);
                    mseDecoder.emitError(EVENTS_ERROR.mediaSourceTsIsMaxDiff);
                    return;
                  }
                }
              }
              if (decoder.isPlayer) {
                mseDecoder._decodeVideo(payload, dts, isIframe, cts, ts);
              } else if (decoder.isPlayback) ;
              mseDecoder.prevDts = dts;
              mseDecoder.prevPayloadBufferSize = payload.byteLength;
              mseDecoder.prevTs = ts;
            } else {
              decoder.debug.log(mseDecoder.TAG_NAME, 'decodeVideo first frame is not iFrame');
            }
          }
        },
        decodeAudio(payload, ts) {
          if (decoder.isDestroyed) {
            decoder.debug.warn(mseDecoder.TAG_NAME, 'decodeAudio() and decoder is destroyed');
            return;
          }
          if (isFalse(mseDecoder.hasAudioInit)) {
            mseDecoder.hasAudioInit = mseDecoder._decodeAudioConfigurationRecord(payload, ts);
          } else {
            let dts = ts;
            // check is aac sequence header
            if (isAacCodecPacket(payload)) {
              decoder.debug.log(mseDecoder.TAG_NAME, 'decodeAudio and has already initialized and payload is aac codec packet so drop this frame');
              return;
            }
            mseDecoder._clearAudioNoDataCheckTimeout();
            if (decoder.isPlayer) {
              if (mseDecoder.firstAudioTime === null) {
                mseDecoder.firstAudioTime = ts;
                if (mseDecoder.firstRenderTime !== null && mseDecoder.prevTs !== null) {
                  // If the video has been played for more than 300ms, this is the audio data,
                  // it is necessary to reduce the start time of the video difference (prevTs - firstRenderTime).
                  const diff = Math.abs(mseDecoder.firstRenderTime - mseDecoder.prevTs);
                  if (diff > 300) {
                    mseDecoder.firstAudioTime -= diff;
                    decoder.debug.warn(mseDecoder.TAG_NAME, `video
                                    firstAudioTime is ${mseDecoder.firstRenderTime} and current time is ${mseDecoder.prevTs}
                                    play time is ${diff} and firstAudioTime ${ts} - ${diff} = ${mseDecoder.firstAudioTime}`);
                  }
                }
              }
              dts = ts - mseDecoder.firstAudioTime;
              if (dts < 0) {
                decoder.debug.warn(mseDecoder.TAG_NAME, `decodeAudio
                             local dts is < 0 , ts is ${ts} and prevTs is ${mseDecoder.prevAudioTs},
                             firstAudioTime is ${mseDecoder.firstAudioTime}`);
                if (mseDecoder.prevAudioDts === null) {
                  dts = 0;
                } else {
                  dts = mseDecoder.prevAudioDts + decoder._opt.mseCorrectAudioTimeDuration;
                }
              }
              if (mseDecoder.prevAudioTs !== null && dts <= mseDecoder.prevAudioDts) {
                decoder.debug.warn(mseDecoder.TAG_NAME, `
                            decodeAudio dts is less than(or equal) prev dts ,
                            dts is ${dts} and prev dts is ${mseDecoder.prevAudioDts} ，
                            and now ts is ${ts} and prev ts is ${mseDecoder.prevAudioTs} ，
                            and diff is ${ts - mseDecoder.prevAudioTs}`);
                dts = mseDecoder.prevAudioDts + decoder._opt.mseCorrectAudioTimeDuration; // ms;
              }
            }

            if (decoder.isPlayer) {
              mseDecoder._decodeAudio(payload, dts, ts);
            } else if (decoder.isPlayback) ;
            mseDecoder.prevAudioTs = ts;
            mseDecoder.prevAudioDts = dts;
          }
        },
        _checkTsIsMaxDiff(ts) {
          return mseDecoder.prevTs > 0 && ts < mseDecoder.prevTs && mseDecoder.prevTs - ts > FRAME_TS_MAX_DIFF;
        },
        _decodeConfigurationRecord(payload, ts, isIframe, videoCodec) {
          let data = payload.slice(5);
          let config = {};
          if (videoCodec === VIDEO_ENC_CODE.h264) {
            config = parseAVCDecoderConfigurationRecord(data);
            // config = parseAVCDecoderConfigurationRecord$2(payload)
          } else if (videoCodec === VIDEO_ENC_CODE.h265) {
            // config = parseHEVCDecoderConfigurationRecord(data);
            // config = parseHEVCDecoderConfigurationRecord$2(payload);
            config = parseHEVCDecoderConfigurationRecord$4(data);
          }
          //  init video info
          mseDecoder.videoInfo.width = config.codecWidth;
          mseDecoder.videoInfo.height = config.codecHeight;
          if (config.codecWidth === 0 && config.codecHeight === 0) {
            decoder.debug.warn(mseDecoder.TAG_NAME, '_decodeConfigurationRecord error', JSON.stringify(config));
            mseDecoder.emitError(EVENTS_ERROR.mediaSourceDecoderConfigurationError);
            return false;
          }
          const metaData = {
            id: AV_TRACK_ID.video,
            // video tag data
            type: 'video',
            timescale: 1000,
            duration: 0,
            avcc: data,
            codecWidth: config.codecWidth,
            codecHeight: config.codecHeight,
            videoType: config.videoType
          };
          // ftyp
          const metaBox = MP4.generateInitSegment(metaData);
          mseDecoder.isAvc = videoCodec === VIDEO_ENC_CODE.h264;
          let codec = config.codec;
          if (codec) {
            mseDecoder.videoMimeType = `video/mp4; codecs="${config.codec}"`;
          } else {
            mseDecoder.videoMimeType = mseDecoder.isAvc ? MP4_CODECS.avc : MP4_CODECS.hev;
          }
          postMessage({
            cmd: WORKER_CMD_TYPE.initVideo,
            w: config.codecWidth,
            h: config.codecHeight
          });
          mseDecoder._initSourceBuffer();
          mseDecoder.appendBuffer(metaBox.buffer);
          mseDecoder.sequenceNumber = 0;
          mseDecoder.cacheTrack = {};
          mseDecoder.timeInit = false;
          return true;
        },
        _decodeAudioConfigurationRecord(payload, ts) {
          const codecId = payload[0] >> 4;
          const size = payload[0] >> 1 & 0x01;
          const isMp3 = codecId === AUDIO_ENC_CODE.MP3;
          const isAAC = codecId === AUDIO_ENC_CODE.AAC;
          if (isFalse(isAAC || isMp3)) {
            //  inner error, not emit error event。
            // inner change audio engine
            decoder.debug.warn(mseDecoder.TAG_NAME, `_decodeAudioConfigurationRecord audio codec is not support , codecId is ${codecId} ant auto wasm decode`);
            mseDecoder.emitError(EVENTS_ERROR.mediaSourceAudioG711NotSupport);
            return false;
          }
          const metaData = {
            id: AV_TRACK_ID.audio,
            type: 'audio',
            timescale: 1000
          };
          let metaInfo = {};
          if (isAacCodecPacket(payload)) {
            const extraData = payload.slice(2);
            metaInfo = parseAACAudioSpecificConfig(extraData);
            if (metaInfo) {
              metaData.audioSampleRate = metaInfo.sampleRate;
              metaData.channelCount = metaInfo.channelCount;
              metaData.config = metaInfo.config;
              metaData.refSampleDuration = 1024 / metaData.audioSampleRate * metaData.timescale;
            } else {
              return false;
            }
          } else if (isMp3) {
            // mp3
            // mp3 没有extradata信息，这里的extradata 就是第一帧mp3
            metaInfo = parseMp3AudioSpecificConfig(payload);
            if (metaInfo) {
              metaData.audioSampleRate = metaInfo.samplingRate;
              metaData.channelCount = metaInfo.channelCount;
              metaData.refSampleDuration = 1152 / metaData.audioSampleRate * metaData.timescale;
            } else {
              return false;
            }
          } else {
            return false;
          }
          metaData.codec = metaInfo.codec;
          metaData.duration = 0;
          let container = 'mp4';
          let codec = metaInfo.codec;
          let metaBox = null;
          if (isMp3 && isFalse(isFirefox())) {
            // 'audio/mpeg' for MP3 audio track
            container = 'mpeg';
            codec = '';
            metaBox = new Uint8Array();
          } else {
            // 'audio/mp4, codecs="codec"'
            metaBox = MP4.generateInitSegment(metaData);
          }
          // console.error('metaData', metaData);
          // console.error('metaBox', metaBox);
          let mimeType = `${metaData.type}/${container}`;
          if (codec && codec.length > 0) {
            mimeType += `;codecs=${codec}`;
          }
          if (isFalse(mseDecoder.isAudioInitInfo)) {
            if (codecId === AUDIO_ENC_CODE.AAC) {
              audioDepth = size ? 16 : 8;
            } else {
              audioDepth = size === 0 ? 8 : 16;
            }
            postMessage({
              cmd: WORKER_CMD_TYPE.audioCode,
              code: codecId
            });
            postMessage({
              cmd: WORKER_CMD_TYPE.initAudio,
              sampleRate: metaData.audioSampleRate,
              channels: metaData.channelCount,
              depth: audioDepth
            });
            mseDecoder.isAudioInitInfo = true;
          }
          mseDecoder.audioMimeType = mimeType;
          mseDecoder.isAAC = isAAC;
          // decoder.debug.log(mseDecoder.TAG_NAME, `_decodeAudioConfigurationRecord mimeType is ${mimeType} and isAAC is ${isAAC}`);
          mseDecoder._initAudioSourceBuffer();
          mseDecoder.appendAudioBuffer(metaBox.buffer);
          return true;
        },
        _initSourceBuffer() {
          const {
            proxy
          } = mseDecoder.events;
          if (mseDecoder.sourceBuffer === null && mseDecoder.mediaSource !== null && mseDecoder.isStateOpen() && mseDecoder.videoMimeType) {
            try {
              mseDecoder.sourceBuffer = mseDecoder.mediaSource.addSourceBuffer(mseDecoder.videoMimeType);
              decoder.debug.log(mseDecoder.TAG_NAME, '_initSourceBuffer() mseDecoder.mediaSource.addSourceBuffer()', mseDecoder.videoMimeType);
            } catch (e) {
              decoder.debug.error(mseDecoder.TAG_NAME, 'appendBuffer() mseDecoder.mediaSource.addSourceBuffer()', e.code, e);
              //  need throw error and change to use wasm play
              mseDecoder.emitError(EVENTS_ERROR.mseAddSourceBufferError, e.code);
              mseDecoder.mediaSourceAddSourceBufferError = true;
              return;
            }
            if (mseDecoder.sourceBuffer) {
              const sourceBufferErrorProxyDestroy = proxy(mseDecoder.sourceBuffer, 'error', error => {
                mseDecoder.mediaSourceBufferError = true;
                decoder.debug.error(mseDecoder.TAG_NAME, 'mseSourceBufferError mseDecoder.sourceBuffer', error);
                mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, error.code);
              });
              const updateendProxyDestroy = proxy(mseDecoder.sourceBuffer, 'updateend', () => {
                if (mseDecoder._hasPendingRemoveRanges()) {
                  // debug.log(mseDecoder.TAG_NAME, 'mseDecoder.sourceBuffer updateend and has pending remove ranges');
                  mseDecoder._doRemoveRanges();
                } else if (mseDecoder._hasPendingSegments()) {
                  // debug.log(mseDecoder.TAG_NAME, 'mseDecoder.sourceBuffer updateend and has pending segments');
                  mseDecoder._doAppendSegments();
                } else if (mseDecoder.hasPendingEos) {
                  decoder.debug.log(mseDecoder.TAG_NAME, 'videoSourceBuffer updateend and hasPendingEos is true, next endOfStream()');
                  mseDecoder.endOfStream();
                }
              });
              mseDecoder.eventListenList.push(sourceBufferErrorProxyDestroy, updateendProxyDestroy);
            }
          } else {
            decoder.debug.log(mseDecoder.TAG_NAME, `_initSourceBuffer and mseDecoder.isStateOpen is ${mseDecoder.isStateOpen()} and mseDecoder.isAvc === null is ${mseDecoder.isAvc === null}`);
          }
        },
        _initAudioSourceBuffer() {
          const {
            proxy
          } = mseDecoder.events;
          if (mseDecoder.audioSourceBuffer === null && mseDecoder.mediaSource !== null && mseDecoder.isStateOpen() && mseDecoder.audioMimeType) {
            try {
              mseDecoder.audioSourceBuffer = mseDecoder.mediaSource.addSourceBuffer(mseDecoder.audioMimeType);
              mseDecoder._clearAudioSourceBufferCheckTimeout();
              decoder.debug.log(mseDecoder.TAG_NAME, '_initAudioSourceBuffer() mseDecoder.mediaSource.addSourceBuffer()', mseDecoder.audioMimeType);
            } catch (e) {
              decoder.debug.error(mseDecoder.TAG_NAME, 'appendAudioBuffer() mseDecoder.mediaSource.addSourceBuffer()', e.code, e);
              //  need throw error and change to use wasm play
              mseDecoder.emitError(EVENTS_ERROR.mseAddSourceBufferError, e.code);
              mseDecoder.mediaSourceAddSourceBufferError = true;
              return;
            }
            if (mseDecoder.audioSourceBuffer) {
              const sourceBufferErrorProxyDestroy = proxy(mseDecoder.audioSourceBuffer, 'error', error => {
                mseDecoder.mediaSourceBufferError = true;
                decoder.debug.error(mseDecoder.TAG_NAME, 'mseSourceBufferError mseDecoder.audioSourceBuffer', error);
                mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, error.code);
              });
              const updateendProxyDestroy = proxy(mseDecoder.audioSourceBuffer, 'updateend', () => {
                if (mseDecoder._hasPendingRemoveRanges()) {
                  // debug.log(mseDecoder.TAG_NAME, 'mseDecoder.audioSourceBuffer updateend and has pending remove ranges');
                  mseDecoder._doRemoveRanges();
                } else if (mseDecoder._hasPendingSegments()) {
                  // debug.log(mseDecoder.TAG_NAME, 'mseDecoder.audioSourceBuffer updateend and has pending segments');
                  mseDecoder._doAppendSegments();
                } else if (mseDecoder.hasPendingEos) {
                  decoder.debug.log(mseDecoder.TAG_NAME, 'audioSourceBuffer updateend and hasPendingEos is true, next endOfStream()');
                  mseDecoder.endOfStream();
                }
              });
              mseDecoder.eventListenList.push(sourceBufferErrorProxyDestroy, updateendProxyDestroy);
              if (mseDecoder.audioSourceNoDataCheckTimeout === null) {
                mseDecoder.audioSourceNoDataCheckTimeout = setTimeout(() => {
                  mseDecoder._clearAudioNoDataCheckTimeout();
                  mseDecoder.emitError(EVENTS_ERROR.mediaSourceAudioNoDataTimeout);
                }, 1000);
              }
            }
          } else {
            decoder.debug.log(mseDecoder.TAG_NAME, `_initAudioSourceBuffer and mseDecoder.isStateOpen is ${mseDecoder.isStateOpen()} and mseDecoder.audioMimeType is ${mseDecoder.audioMimeType}`);
          }
        },
        _decodeVideo(payload, dts, isIframe, cts, ts) {
          let arrayBuffer = payload.slice(5);
          let bytes = arrayBuffer.byteLength;
          if (bytes === 0) {
            decoder.debug.warn(mseDecoder.TAG_NAME, '_decodeVideo payload bytes is 0 and return');
            return;
          }
          let nowTime = new Date().getTime();
          let isFirst = false;
          if (!mseDecoder.prevTimestamp) {
            mseDecoder.prevTimestamp = nowTime;
            isFirst = true;
          }
          const diffTime = nowTime - mseDecoder.prevTimestamp;
          mseDecoder.decodeDiffTimestamp = diffTime;
          if (diffTime > 500 && !isFirst && decoder.isPlayer) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `_decodeVideo now time is ${nowTime} and prev time is ${mseDecoder.prevTimestamp}, diff time is ${diffTime} ms`);
          }
          if (mseDecoder.cacheTrack.id && dts >= mseDecoder.cacheTrack.dts) {
            // 需要额外加8个size
            let mdatBytes = 8 + mseDecoder.cacheTrack.size;
            let mdatbox = new Uint8Array(mdatBytes);
            mdatbox[0] = mdatBytes >>> 24 & 255;
            mdatbox[1] = mdatBytes >>> 16 & 255;
            mdatbox[2] = mdatBytes >>> 8 & 255;
            mdatbox[3] = mdatBytes & 255;
            // mdat box用来存储视频碎片数据，
            mdatbox.set(MP4.types.mdat, 4);
            mdatbox.set(mseDecoder.cacheTrack.data, 8);
            mseDecoder.cacheTrack.duration = dts - mseDecoder.cacheTrack.dts;
            // moof
            // moof box仅在流式MP4中使用，用于将多个sample组合成一个fragment。
            // moof 用来描述mdat

            let moofbox = MP4.moof(mseDecoder.cacheTrack, mseDecoder.cacheTrack.dts);
            // 用完清空数据。
            mseDecoder.cacheTrack = {};
            let result = new Uint8Array(moofbox.byteLength + mdatbox.byteLength);
            result.set(moofbox, 0);
            result.set(mdatbox, moofbox.byteLength);
            // appendBuffer
            mseDecoder.appendBuffer(result.buffer);
          } else {
            decoder.debug.log(mseDecoder.TAG_NAME, `timeInit set false , cacheTrack = {} now dts is ${dts}, and ts is ${ts} cacheTrack dts is ${mseDecoder.cacheTrack && mseDecoder.cacheTrack.dts}`);
            mseDecoder.timeInit = false;
            mseDecoder.cacheTrack = {};
          }
          if (!mseDecoder.cacheTrack) {
            mseDecoder.cacheTrack = {};
          }
          mseDecoder.cacheTrack.id = AV_TRACK_ID.video;
          mseDecoder.cacheTrack.sequenceNumber = ++mseDecoder.sequenceNumber;
          mseDecoder.cacheTrack.size = bytes;
          mseDecoder.cacheTrack.dts = dts;
          mseDecoder.cacheTrack.cts = cts;
          mseDecoder.cacheTrack.isKeyframe = isIframe;
          mseDecoder.cacheTrack.data = arrayBuffer;
          //
          mseDecoder.cacheTrack.flags = {
            isLeading: 0,
            dependsOn: isIframe ? 2 : 1,
            isDependedOn: isIframe ? 1 : 0,
            hasRedundancy: 0,
            isNonSync: isIframe ? 0 : 1
          };
          mseDecoder.prevTimestamp = new Date().getTime();
        },
        _decodeAudio(payload, dts, ts) {
          let arrayBuffer = mseDecoder.isAAC ? payload.slice(2) : payload.slice(1);
          let bytes = arrayBuffer.byteLength;
          if (mseDecoder.cacheAudioTrack.id && dts >= mseDecoder.cacheAudioTrack.dts) {
            // 需要额外加8个size
            let mdatBytes = 8 + mseDecoder.cacheAudioTrack.size;
            let mdatbox = new Uint8Array(mdatBytes);
            mdatbox[0] = mdatBytes >>> 24 & 255;
            mdatbox[1] = mdatBytes >>> 16 & 255;
            mdatbox[2] = mdatBytes >>> 8 & 255;
            mdatbox[3] = mdatBytes & 255;
            // mdat box用来存储视频碎片数据，
            mdatbox.set(MP4.types.mdat, 4);
            mdatbox.set(mseDecoder.cacheAudioTrack.data, 8);
            mseDecoder.cacheAudioTrack.duration = dts - mseDecoder.cacheAudioTrack.dts;
            // moof
            // moof box仅在流式MP4中使用，用于将多个sample组合成一个fragment。
            // moof 用来描述mdat
            let moofbox = MP4.moof(mseDecoder.cacheAudioTrack, mseDecoder.cacheAudioTrack.dts);
            // 用完清空数据。
            mseDecoder.cacheAudioTrack = {};
            let result = new Uint8Array(moofbox.byteLength + mdatbox.byteLength);
            result.set(moofbox, 0);
            result.set(mdatbox, moofbox.byteLength);
            mseDecoder.appendAudioBuffer(result.buffer);
          } else {
            mseDecoder.cacheAudioTrack = {};
          }
          if (!mseDecoder.cacheAudioTrack) {
            mseDecoder.cacheAudioTrack = {};
          }
          mseDecoder.cacheAudioTrack.id = AV_TRACK_ID.audio;
          mseDecoder.cacheAudioTrack.sequenceNumber = ++mseDecoder.audioSequenceNumber;
          mseDecoder.cacheAudioTrack.size = bytes;
          mseDecoder.cacheAudioTrack.dts = dts;
          mseDecoder.cacheAudioTrack.cts = 0;
          mseDecoder.cacheAudioTrack.data = arrayBuffer;
          mseDecoder.cacheAudioTrack.flags = {
            isLeading: 0,
            dependsOn: 1,
            isDependedOn: 0,
            hasRedundancy: 0
          };
        },
        appendBuffer(buffer) {
          if (decoder.isDestroyed) {
            decoder.debug.warn(mseDecoder.TAG_NAME, 'appendBuffer() player is destroyed');
            return;
          }
          if (mseDecoder.mediaSourceAddSourceBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAddSourceBufferError is true`);
            return;
          }
          if (mseDecoder.mediaSourceAppendBufferFull) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAppendBufferFull is true`);
            return;
          }
          if (mseDecoder.mediaSourceAppendBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAppendBufferError is true`);
            return;
          }
          if (mseDecoder.mediaSourceBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceBufferError is true`);
            return;
          }
          mseDecoder.pendingSegments.push(buffer);
          if (mseDecoder.sourceBuffer) {
            if (decoder._opt.mseAutoCleanupSourceBuffer && mseDecoder._needCleanupSourceBuffer()) {
              mseDecoder._doCleanUpSourceBuffer();
            }
            if (isFalse(mseDecoder.getSourceBufferUpdating()) && mseDecoder.isStateOpen() && isFalse(mseDecoder._hasPendingRemoveRanges())) {
              mseDecoder._doAppendSegments();
              return;
            }
          }
          if (mseDecoder.isStateClosed()) {
            mseDecoder.mediaSourceBufferError = true;
            mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, 'mediaSource is not attached to video or mediaSource is closed');
          } else if (mseDecoder.isStateEnded()) {
            mseDecoder.mediaSourceBufferError = true;
            mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, 'mediaSource is end');
          } else {
            if (mseDecoder._hasPendingRemoveRanges()) {
              decoder.debug.log(mseDecoder.TAG_NAME, `video has pending remove ranges and video length is ${mseDecoder.pendingRemoveRanges.length}, audio length is ${mseDecoder.pendingAudioRemoveRanges.length}`);
            }
          }
        },
        appendAudioBuffer(buffer) {
          if (decoder.isDestroyed) {
            decoder.debug.warn(mseDecoder.TAG_NAME, 'appendAudioBuffer() player is destroyed');
            return;
          }
          if (mseDecoder.mediaSourceAddSourceBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAddSourceBufferError is true`);
            return;
          }
          if (mseDecoder.mediaSourceAppendBufferFull) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAppendBufferFull is true`);
            return;
          }
          if (mseDecoder.mediaSourceAppendBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceAppendBufferError is true`);
            return;
          }
          if (mseDecoder.mediaSourceBufferError) {
            decoder.debug.warn(mseDecoder.TAG_NAME, `mseDecoder.mediaSourceBufferError is true`);
            return;
          }
          mseDecoder.pendingAudioSegments.push(buffer);
          if (mseDecoder.audioSourceBuffer) {
            if (decoder._opt.mseAutoCleanupSourceBuffer && mseDecoder._needCleanupSourceBuffer()) {
              mseDecoder._doCleanUpSourceBuffer();
            }
            if (isFalse(mseDecoder.getAudioSourceBufferUpdating()) && mseDecoder.isStateOpen() && isFalse(mseDecoder._hasPendingRemoveRanges())) {
              mseDecoder._doAppendSegments();
              return;
            }
          }
          if (mseDecoder.isStateClosed()) {
            mseDecoder.mediaSourceBufferError = true;
            mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, 'mediaSource is not attached to video or mediaSource is closed');
          } else if (mseDecoder.isStateEnded()) {
            mseDecoder.mediaSourceBufferError = true;
            mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, 'mediaSource is end');
          } else {
            if (mseDecoder._hasPendingRemoveRanges()) {
              decoder.debug.log(mseDecoder.TAG_NAME, `audio has pending remove ranges and video length is ${mseDecoder.pendingRemoveRanges.length}, audio length is ${mseDecoder.pendingAudioRemoveRanges.length}`);
            }
          }
        },
        getSourceBufferUpdating() {
          return mseDecoder.sourceBuffer && mseDecoder.sourceBuffer.updating;
        },
        getAudioSourceBufferUpdating() {
          return mseDecoder.audioSourceBuffer && mseDecoder.audioSourceBuffer.updating;
        },
        stop() {
          //  abort source buffer
          mseDecoder.abortSourceBuffer();
          //  remove source buffer
          mseDecoder.removeSourceBuffer();
          //  end of stream
          //  maybe throw error: DEMUXER_ERROR_COULD_NOT_OPEN: MediaSource endOfStream before demuxer initialization
          //  completes (before HAVE_METADATA) is treated as an error.
          //  This may also occur as consequence of other MediaSource errors before HAVE_METADATA
          // mseDecoder.endOfStream();
        },

        clearUpAllSourceBuffer() {
          if (mseDecoder.sourceBuffer) {
            const buffered = mseDecoder.sourceBuffer.buffered;
            for (let i = 0; i < buffered.length; i++) {
              let start = buffered.start(i);
              let end = buffered.end(i);
              mseDecoder.pendingRemoveRanges.push({
                start: start,
                end: end
              });
            }
            if (isFalse(mseDecoder.getSourceBufferUpdating())) {
              mseDecoder._doRemoveRanges();
            }
          }
          if (mseDecoder.audioSourceBuffer) {
            const buffered = mseDecoder.audioSourceBuffer.buffered;
            for (let i = 0; i < buffered.length; i++) {
              let start = buffered.start(i);
              let end = buffered.end(i);
              mseDecoder.pendingAudioRemoveRanges.push({
                start: start,
                end: end
              });
            }
            if (isFalse(mseDecoder.getAudioSourceBufferUpdating())) {
              mseDecoder._doRemoveRanges();
            }
          }
        },
        endOfStream() {
          if (mseDecoder.isStateOpen()) {
            if (mseDecoder.getSourceBufferUpdating() || mseDecoder.getAudioSourceBufferUpdating()) {
              decoder.debug.log(mseDecoder.TAG_NAME, 'endOfStream() has pending eos');
              mseDecoder.hasPendingEos = true;
            } else {
              mseDecoder.hasPendingEos = false;
              try {
                decoder.debug.log(mseDecoder.TAG_NAME, 'endOfStream()');
                mseDecoder.mediaSource.endOfStream();
              } catch (e) {
                decoder.debug.warn(mseDecoder.TAG_NAME, 'endOfStream() error', e);
              }
            }
          }
        },
        abortSourceBuffer() {
          if (mseDecoder.isStateOpen) {
            if (mseDecoder.sourceBuffer) {
              try {
                decoder.debug.log(mseDecoder.TAG_NAME, 'abortSourceBuffer() abort sourceBuffer');
                mseDecoder.sourceBuffer.abort();
              } catch (e) {}
            }
            if (mseDecoder.audioSourceBuffer) {
              try {
                decoder.debug.log(mseDecoder.TAG_NAME, 'abortSourceBuffer() abort audioSourceBuffer');
                mseDecoder.audioSourceBuffer.abort();
              } catch (e) {}
            }
          }
          mseDecoder.sourceBuffer = null;
          mseDecoder.audioSourceBuffer = null;
        },
        removeSourceBuffer() {
          if (!mseDecoder.isStateClosed() && mseDecoder.mediaSource) {
            //  video
            if (mseDecoder.sourceBuffer) {
              try {
                decoder.debug.log(mseDecoder.TAG_NAME, 'removeSourceBuffer() sourceBuffer');
                mseDecoder.mediaSource.removeSourceBuffer(mseDecoder.sourceBuffer);
              } catch (e) {
                decoder.debug.warn(mseDecoder.TAG_NAME, 'removeSourceBuffer() sourceBuffer error', e);
              }
            }

            //  audio
            if (mseDecoder.audioSourceBuffer) {
              try {
                decoder.debug.log(mseDecoder.TAG_NAME, 'removeSourceBuffer() audioSourceBuffer');
                mseDecoder.mediaSource.removeSourceBuffer(mseDecoder.audioSourceBuffer);
              } catch (e) {
                decoder.debug.warn(mseDecoder.TAG_NAME, 'removeSourceBuffer() audioSourceBuffer error', e);
              }
            }
          }
        },
        _hasPendingSegments() {
          return mseDecoder.pendingSegments.length > 0 || mseDecoder.pendingAudioSegments.length > 0;
        },
        //  pending
        getPendingSegmentsLength() {
          return mseDecoder.pendingSegments.length;
        },
        _handleUpdatePlaybackRate() {
          //  todo: 待定
          // const videoBuffer = decoder._opt.videoBuffer;
          // const videoBufferDelay = decoder._opt.videoBufferDelay;
          // let maxDelay = (videoBuffer + videoBufferDelay) / 1000;
        },
        _doAppendSegments() {
          if (mseDecoder.isStateClosed() || mseDecoder.isStateEnded()) {
            return;
          }
          if (mseDecoder.needInitAudio() && mseDecoder.audioSourceBuffer === null) {
            decoder.debug.log(mseDecoder.TAG_NAME, '_doAppendSegments() audioSourceBuffer is null and need init audio source buffer');
            if (mseDecoder.audioSourceBufferCheckTimeout === null) {
              mseDecoder.audioSourceBufferCheckTimeout = setTimeout(() => {
                mseDecoder._clearAudioSourceBufferCheckTimeout();
                mseDecoder.emitError(EVENTS_ERROR.mediaSourceAudioInitTimeout);
              }, 1000);
            }
            return;
          }
          if (isFalse(mseDecoder.getSourceBufferUpdating())) {
            //  video
            if (mseDecoder.pendingSegments.length > 0) {
              const segment = mseDecoder.pendingSegments.shift();
              try {
                mseDecoder.sourceBuffer.appendBuffer(segment);
              } catch (e) {
                decoder.debug.error(mseDecoder.TAG_NAME, 'mseDecoder.sourceBuffer.appendBuffer()', e.code, e);
                if (e.code === 22) {
                  // QuotaExceededError
                  // The SourceBuffer is full, and cannot free space to append additional buffers
                  mseDecoder.stop();
                  mseDecoder.mediaSourceAppendBufferFull = true;
                  mseDecoder.emitError(EVENTS_ERROR.mediaSourceFull);
                } else if (e.code === 11) {
                  //     Failed to execute 'appendBuffer' on 'SourceBuffer': The HTMLMediaElement.error attribute is not null.
                  mseDecoder.stop();
                  mseDecoder.mediaSourceAppendBufferError = true;
                  mseDecoder.emitError(EVENTS_ERROR.mediaSourceAppendBufferError);
                } else {
                  mseDecoder.stop();
                  mseDecoder.mediaSourceBufferError = true;
                  mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, e.code);
                }
              }
            }
          }
          if (isFalse(mseDecoder.getAudioSourceBufferUpdating())) {
            //  audio
            if (mseDecoder.pendingAudioSegments.length > 0) {
              const segment = mseDecoder.pendingAudioSegments.shift();
              try {
                mseDecoder.audioSourceBuffer.appendBuffer(segment);
              } catch (e) {
                decoder.debug.error(mseDecoder.TAG_NAME, 'mseDecoder.audioSourceBuffer.appendBuffer()', e.code, e);
                if (e.code === 22) {
                  // QuotaExceededError
                  // The SourceBuffer is full, and cannot free space to append additional buffers
                  mseDecoder.stop();
                  mseDecoder.mediaSourceAppendBufferFull = true;
                  mseDecoder.emitError(EVENTS_ERROR.mediaSourceFull);
                } else if (e.code === 11) {
                  //     Failed to execute 'appendBuffer' on 'SourceBuffer': The HTMLMediaElement.error attribute is not null.
                  mseDecoder.stop();
                  mseDecoder.mediaSourceAppendBufferError = true;
                  mseDecoder.emitError(EVENTS_ERROR.mediaSourceAppendBufferError);
                } else {
                  mseDecoder.stop();
                  mseDecoder.mediaSourceBufferError = true;
                  mseDecoder.emitError(EVENTS_ERROR.mseSourceBufferError, e.code);
                }
              }
            }
          }
        },
        _doCleanUpSourceBuffer() {
          const currentTime = mseDecoder.$video.currentTime;
          //  video
          if (mseDecoder.sourceBuffer) {
            const buffered = mseDecoder.sourceBuffer.buffered;
            let doRemove = false;
            for (let i = 0; i < buffered.length; i++) {
              let start = buffered.start(i);
              let end = buffered.end(i);
              if (start <= currentTime && currentTime < end + 3) {
                // padding 3 seconds
                if (currentTime - start >= decoder._opt.mseAutoCleanupMaxBackwardDuration) {
                  doRemove = true;
                  let removeEnd = currentTime - decoder._opt.mseAutoCleanupMinBackwardDuration;
                  mseDecoder.pendingRemoveRanges.push({
                    start: start,
                    end: removeEnd
                  });
                }
              } else if (end < currentTime) {
                doRemove = true;
                mseDecoder.pendingRemoveRanges.push({
                  start: start,
                  end: end
                });
              }
            }
            if (doRemove && isFalse(mseDecoder.getSourceBufferUpdating())) {
              mseDecoder._doRemoveRanges();
            }
          }

          //  audio
          if (mseDecoder.audioSourceBuffer) {
            const buffered = mseDecoder.audioSourceBuffer.buffered;
            let doRemove = false;
            for (let i = 0; i < buffered.length; i++) {
              let start = buffered.start(i);
              let end = buffered.end(i);
              if (start <= currentTime && currentTime < end + 3) {
                // padding 3 seconds
                if (currentTime - start >= decoder._opt.mseAutoCleanupMaxBackwardDuration) {
                  doRemove = true;
                  let removeEnd = currentTime - decoder._opt.mseAutoCleanupMinBackwardDuration;
                  mseDecoder.pendingAudioRemoveRanges.push({
                    start: start,
                    end: removeEnd
                  });
                }
              } else if (end < currentTime) {
                doRemove = true;
                mseDecoder.pendingAudioRemoveRanges.push({
                  start: start,
                  end: end
                });
              }
            }
            if (doRemove && isFalse(mseDecoder.getAudioSourceBufferUpdating())) {
              mseDecoder._doRemoveRanges();
            }
          }
        },
        _hasPendingRemoveRanges() {
          return mseDecoder.pendingRemoveRanges.length > 0 || mseDecoder.pendingAudioRemoveRanges.length > 0;
        },
        needInitAudio() {
          return decoder._opt.hasAudio && decoder._opt.mseDecodeAudio;
        },
        _doRemoveRanges() {
          if (mseDecoder.sourceBuffer && isFalse(mseDecoder.getSourceBufferUpdating())) {
            let ranges = mseDecoder.pendingRemoveRanges;
            while (ranges.length && isFalse(mseDecoder.getSourceBufferUpdating())) {
              let range = ranges.shift();
              try {
                mseDecoder.sourceBuffer.remove(range.start, range.end);
              } catch (e) {
                decoder.debug.warn(mseDecoder.TAG_NAME, '_doRemoveRanges() sourceBuffer error', e);
              }
            }
          }
          if (mseDecoder.audioSourceBuffer && isFalse(mseDecoder.getAudioSourceBufferUpdating())) {
            let ranges = mseDecoder.pendingAudioRemoveRanges;
            while (ranges.length && isFalse(mseDecoder.getAudioSourceBufferUpdating())) {
              let range = ranges.shift();
              try {
                mseDecoder.audioSourceBuffer.remove(range.start, range.end);
              } catch (e) {
                decoder.debug.warn(mseDecoder.TAG_NAME, '_doRemoveRanges() audioSourceBuffer error', e);
              }
            }
          }
        },
        _getPlaybackRate() {},
        _needCleanupSourceBuffer() {
          if (isFalse(decoder._opt.mseAutoCleanupSourceBuffer)) {
            return false;
          }
          const currentTime = mseDecoder.$video.currentTime;
          if (mseDecoder.sourceBuffer) {
            let buffered = mseDecoder.sourceBuffer.buffered;
            if (buffered.length >= 1) {
              if (currentTime - buffered.start(0) >= decoder._opt.mseAutoCleanupMaxBackwardDuration) {
                return true;
              }
            }
          }
          if (mseDecoder.audioSourceBuffer) {
            let buffered = mseDecoder.audioSourceBuffer.buffered;
            if (buffered.length >= 1) {
              if (currentTime - buffered.start(0) >= decoder._opt.mseAutoCleanupMaxBackwardDuration) {
                return true;
              }
            }
          }
          return false;
        },
        _clearAudioSourceBufferCheckTimeout() {
          if (mseDecoder.audioSourceBufferCheckTimeout) {
            clearTimeout(mseDecoder.audioSourceBufferCheckTimeout);
            mseDecoder.audioSourceBufferCheckTimeout = null;
          }
        },
        _clearAudioNoDataCheckTimeout() {
          if (mseDecoder.audioSourceNoDataCheckTimeout) {
            clearTimeout(mseDecoder.audioSourceNoDataCheckTimeout);
            mseDecoder.audioSourceNoDataCheckTimeout = null;
          }
        },
        getHandle() {
          return mseDecoder.mediaSource.handle;
        },
        emitError(error) {
          let msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
          postMessage({
            cmd: WORKER_CMD_TYPE.mseError,
            value: error,
            msg
          });
        }
      };
    }
    let decoder = {
      isPlayer: true,
      isPlayback: false,
      dropping: false,
      isPushDropping: false,
      isWorkerFetch: false,
      // 是否在worker中fetch
      isDestroyed: false,
      fetchStatus: LOADER_STATUS.idle,
      _opt: getDefaultOpt(),
      mp3Demuxer: null,
      delay: -1,
      pushLatestDelay: -1,
      firstTimestamp: null,
      startTimestamp: null,
      preDelayTimestamp: null,
      stopId: null,
      streamFps: null,
      streamAudioFps: null,
      streamVideoFps: null,
      writableStream: null,
      networkDelay: 0,
      webglObj: null,
      startStreamRateAndStatsInterval: function () {
        // decoder.debug.log('worker', 'startStreamRateAndStatsInterval');
        decoder.stopStreamRateAndStatsInterval();
        streamRateAndStatsInterval = setInterval(() => {
          streamRate && streamRate(0);
          const streamStats = JSON.stringify({
            demuxBufferDelay: decoder.getVideoBufferLength(),
            audioDemuxBufferDelay: decoder.getAudioBufferLength(),
            flvBufferByteLength: decoder.getFlvBufferLength(),
            netBuf: decoder.networkDelay || 0,
            pushLatestDelay: decoder.pushLatestDelay || 0,
            latestDelay: decoder.delay,
            isStreamTsMoreThanLocal: isStreamTimeDiffMoreThanLocalTimeDiff
          });
          postMessage({
            cmd: WORKER_CMD_TYPE.workerFetch,
            type: EVENTS.streamStats,
            value: streamStats
          });
        }, 1000);
      },
      stopStreamRateAndStatsInterval: function () {
        // decoder.debug.log('worker', `stopStreamRateAndStatsInterval`);
        if (streamRateAndStatsInterval) {
          clearInterval(streamRateAndStatsInterval);
          streamRateAndStatsInterval = null;
        }
      },
      useOffscreen: function () {
        return decoder._opt.useOffscreen && typeof OffscreenCanvas != 'undefined';
      },
      getDelay: function (timestamp, type) {
        if (!timestamp || decoder._opt.hasVideo && !isVideoFirstIFrame) {
          return -1;
        }
        //
        if (type === MEDIA_TYPE.audio) {
          return decoder.delay;
        }
        if (decoder.preDelayTimestamp && decoder.preDelayTimestamp > timestamp) {
          if (decoder.preDelayTimestamp - timestamp > 1000) {
            decoder.debug.warn('worker', `getDelay() and preDelayTimestamp is ${decoder.preDelayTimestamp} > timestamp is ${timestamp} more than ${decoder.preDelayTimestamp - timestamp}ms and return ${decoder.delay}`);
          }
          decoder.preDelayTimestamp = timestamp;
          return decoder.delay;
        }
        if (!decoder.firstTimestamp) {
          decoder.firstTimestamp = timestamp;
          decoder.startTimestamp = Date.now();
          decoder.delay = -1;
        } else {
          if (timestamp) {
            const localTimestamp = Date.now() - decoder.startTimestamp;
            const timeTimestamp = timestamp - decoder.firstTimestamp;
            if (localTimestamp >= timeTimestamp) {
              isStreamTimeDiffMoreThanLocalTimeDiff = false;
              decoder.delay = localTimestamp - timeTimestamp;
            } else {
              // if stream ts more than local ts, support stream rate is more than 1 rate
              isStreamTimeDiffMoreThanLocalTimeDiff = true;
              decoder.delay = timeTimestamp - localTimestamp;
            }
          }
        }
        decoder.preDelayTimestamp = timestamp;
        return decoder.delay;
      },
      getDelayNotUpdateDelay: function (timestamp, type) {
        if (!timestamp || decoder._opt.hasVideo && !isVideoFirstIFrame) {
          return -1;
        }
        if (type === MEDIA_TYPE.audio) {
          return decoder.pushLatestDelay;
        }
        if (decoder.preDelayTimestamp && decoder.preDelayTimestamp - timestamp > 1000) {
          decoder.debug.warn('worker', `getDelayNotUpdateDelay() and preDelayTimestamp is ${decoder.preDelayTimestamp} > timestamp is ${timestamp} more than ${decoder.preDelayTimestamp - timestamp}ms and return -1`);
          return -1;
        }
        if (!decoder.firstTimestamp) {
          return -1;
        } else {
          let delay = -1;
          if (timestamp) {
            const localTimestamp = Date.now() - decoder.startTimestamp;
            const timeTimestamp = timestamp - decoder.firstTimestamp;
            if (localTimestamp >= timeTimestamp) {
              isStreamTimeDiffMoreThanLocalTimeDiff = false;
              delay = localTimestamp - timeTimestamp;
            } else {
              isStreamTimeDiffMoreThanLocalTimeDiff = true;
              delay = timeTimestamp - localTimestamp;
            }
          }
          return delay;
        }
      },
      resetDelay: function () {
        decoder.firstTimestamp = null;
        decoder.startTimestamp = null;
        decoder.delay = -1;
        decoder.dropping = false;
      },
      resetAllDelay: function () {
        decoder.resetDelay();
        decoder.preDelayTimestamp = null;
      },
      doDecode: function (data) {
        if (decoder._opt.isEmitSEI && data.type === MEDIA_TYPE.video && decoder.isWorkerFetch) {
          decoder.findSei(data.payload, data.ts);
        }
        if (decoder.isPlayUseMSEAndDecoderInWorker()) {
          if (data.type === MEDIA_TYPE.audio) {
            if (decoder._opt.mseDecodeAudio) {
              mseDecoder.decodeAudio(data.payload, data.ts);
            } else {
              data.decoder.decode(data.payload, data.ts);
            }
          } else if (data.type === MEDIA_TYPE.video) {
            mseDecoder.decodeVideo(data.payload, data.ts, data.isIFrame, data.cts);
          }
        } else if (decoder._opt.useWCS && decoder.useOffscreen() && data.type === MEDIA_TYPE.video && wcsVideoDecoder.decode) {
          wcsVideoDecoder.decode(data.payload, data.ts, data.cts);
        } else {
          data.decoder.decode(data.payload, data.ts, data.isIFrame, data.cts);
        }
      },
      decodeNext(data) {
        if (bufferList.length === 0) {
          return;
        }
        const ts = data.ts;
        const nextData = bufferList[0];
        //  this frame is video seq header.
        const isSqeHeader = data.type === MEDIA_TYPE.video && isVideoSequenceHeader(data.payload);
        // just for hard decode。if use soft decode, not need to do this
        if (isFalse(forHardDecode)) {
          // wasm decode 软解码
          if (isSqeHeader) {
            decoder.debug.log('worker', `decode data type is ${data.type} and
                ts is ${ts} next data type is ${nextData.type} ts is ${nextData.ts}
                isVideoSqeHeader is ${isSqeHeader}`);
            bufferList.shift();
            decoder.doDecode(nextData);
          }
        } else {
          //  hard decode 硬解码
          //  next is is less than DEMUX_LOOP_INTERVAL_TIMES
          const diff = nextData.ts - ts;
          //  this frame is video  and next frame is audio frame
          const isVideoAndNextAudio = nextData.type === MEDIA_TYPE.audio && data.type === MEDIA_TYPE.video;
          if (diff <= DEMUX_LOOP_INTERVAL_TIMES || isVideoAndNextAudio || isSqeHeader) {
            decoder.debug.log('worker', `decode data type is ${data.type} and
                ts is ${ts} next data type is ${nextData.type} ts is ${nextData.ts}
                diff is ${diff} and isVideoAndNextAudio is ${isVideoAndNextAudio} and isVideoSqeHeader is ${isSqeHeader}`);
            bufferList.shift();
            decoder.doDecode(nextData);
          }
        }
      },
      init: function () {
        decoder.debug.log('worker', 'init and opt is', JSON.stringify(decoder._opt));
        const isPlayer = decoder._opt.playType === PLAY_TYPE.player;
        const isPlayback = decoder._opt.playType === PLAY_TYPE.playbackTF;
        nakedFlowDemuxer.init();
        decoder.isPlayer = isPlayer;
        decoder.isPlayback = isPlayback;
        if (decoder.isPlayUseMSEAndDecoderInWorker() && mseDecoder) {
          mseDecoder.init();
        }
        // player || (playback && not cache before decode for fps render)
        if (!decoder.isPlaybackCacheBeforeDecodeForFpsRender()) {
          decoder.debug.log('worker', 'setInterval()');
          const maxDelay = decoder._opt.videoBuffer + decoder._opt.videoBufferDelay;
          // default loop
          const loop = () => {
            let data = null;
            if (bufferList.length) {
              if (decoder.isPushDropping) {
                decoder.debug.warn('worker', `loop() isPushDropping is true and bufferList length is ${bufferList.length}`);
                return;
              }
              if (decoder.dropping) {
                // // dropping
                data = bufferList.shift();
                decoder.debug.warn('worker', `loop() dropBuffer is dropping and isIFrame ${data.isIFrame} and delay is ${decoder.delay} and bufferlist is ${bufferList.length}`);
                //
                while (!data.isIFrame && bufferList.length) {
                  // decoder.debug.log('worker', 'loop is dropping = true, isIFrame is', data.isIFrame);
                  // dropping
                  data = bufferList.shift();
                }
                const tempDelay = decoder.getDelayNotUpdateDelay(data.ts, data.type);
                if (data.isIFrame && tempDelay <= decoder.getNotDroppingDelayTs()) {
                  decoder.debug.log('worker', 'loop() is dropping = false, is iFrame');
                  decoder.dropping = false;
                  decoder.doDecode(data);
                  decoder.decodeNext(data);
                }
              } else {
                if (decoder.isPlayback || decoder.isPlayUseMSE() || decoder._opt.videoBuffer === 0) {
                  // 持续解码
                  while (bufferList.length) {
                    data = bufferList.shift();
                    decoder.doDecode(data);
                  }
                } else {
                  data = bufferList[0];
                  if (decoder.getDelay(data.ts, data.type) === -1) {
                    decoder.debug.log('worker', 'loop() common dumex delay is -1 ,data.ts is', data.ts);
                    bufferList.shift();
                    decoder.doDecode(data);
                    decoder.decodeNext(data);
                  } else if (decoder.delay > maxDelay && isPlayer) {
                    if (decoder.hasIframeInBufferList()) {
                      decoder.debug.log('worker', `delay is ${decoder.delay} > maxDelay ${maxDelay}, set dropping is true`);
                      decoder.resetAllDelay();
                      decoder.dropping = true;
                      postMessage({
                        cmd: WORKER_CMD_TYPE.isDropping
                      });
                    } else {
                      bufferList.shift();
                      decoder.doDecode(data);
                      decoder.decodeNext(data);
                    }
                  } else {
                    // 持续解码
                    while (bufferList.length) {
                      data = bufferList[0];
                      if (decoder.getDelay(data.ts, data.type) > decoder._opt.videoBuffer) {
                        bufferList.shift();
                        decoder.doDecode(data);
                      } else {
                        if (decoder.delay < 0) {
                          decoder.debug.warn('worker', `loop() do not decode and delay is ${decoder.delay}, bufferList is ${bufferList.length}`);
                        }
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              if (decoder.delay !== -1) {
                decoder.debug.log('worker', 'loop() bufferList is empty and reset delay');
              }
              decoder.resetAllDelay();
            }
          };
          decoder.stopId = setInterval(() => {
            let nowTime = new Date().getTime();
            if (!preLoopTimestamp) {
              preLoopTimestamp = nowTime;
            }
            const diffTime = nowTime - preLoopTimestamp;
            if (diffTime > 100) {
              decoder.debug.warn('worker', `loop demux diff time is ${diffTime}`);
            }
            loop();
            preLoopTimestamp = new Date().getTime();
          }, DEMUX_LOOP_INTERVAL_TIMES);
        } else {
          decoder.debug.log('worker', 'playback and playbackIsCacheBeforeDecodeForFpsRender is true');
        }
        // if not check first frame is iframe, will set isVideoFirstIFrame = true
        if (isFalse(decoder._opt.checkFirstIFrame)) {
          isVideoFirstIFrame = true;
        }

        //
        if (decoder.isPlayUseMSEAndDecoderInWorker() && mseDecoder) {
          const mseHandle = mseDecoder.getHandle();
          if (mseHandle) {
            postMessage({
              cmd: WORKER_CMD_TYPE.mseHandle,
              mseHandle
            }, [mseHandle]);
          }
        }
      },
      playbackCacheLoop: function () {
        if (decoder.stopId) {
          clearInterval(decoder.stopId);
          decoder.stopId = null;
        }
        const loop = () => {
          let data = null;
          if (bufferList.length) {
            data = bufferList.shift();
            decoder.doDecode(data);
          }
        };
        loop();
        const fragDuration = Math.ceil(1000 / (decoder.streamFps * decoder._opt.playbackRate));
        decoder.debug.log('worker', `playbackCacheLoop fragDuration is ${fragDuration}, streamFps is ${decoder.streamFps}, streamAudioFps is ${decoder.streamAudioFps} ,streamVideoFps is ${decoder.streamVideoFps} playbackRate is ${decoder._opt.playbackRate}`);
        decoder.stopId = setInterval(loop, fragDuration);
      },
      close: function () {
        decoder.debug.log('worker', 'close');
        decoder.isDestroyed = true;
        abort();
        if (socket && (socket.readyState === 1 || socket.readyState === 2)) {
          requestAbort = true;
          // CONNECTING || OPEN
          socket.close(1000, 'Client disconnecting');
        } else {
          if (socket) {
            decoder.debug.log('worker', `close() and socket.readyState is ${socket.readyState}`);
          }
        }
        socket = null;
        decoder.stopStreamRateAndStatsInterval();
        if (decoder.stopId) {
          clearInterval(decoder.stopId);
          decoder.stopId = null;
        }
        if (decoder.mp3Demuxer) {
          decoder.mp3Demuxer.destroy();
          decoder.mp3Demuxer = null;
        }
        if (decoder.writableStream && isFalse(decoder.writableStream.locked)) {
          decoder.writableStream.close().catch(e => {
            // ignore
            // The stream you are trying to close is locked.
            decoder.debug.log('worker', `close() and writableStream.close() error`, e);
          });
        }
        decoder.writableStream = null;
        if (audioDecoder) {
          try {
            audioDecoder.clear && audioDecoder.clear();
            audioDecoder = null;
          } catch (e) {
            decoder.debug.warn('worker', `close() and audioDecoder.clear error`, e);
          }
        }
        if (videoDecoder) {
          try {
            videoDecoder.clear && videoDecoder.clear();
            videoDecoder = null;
          } catch (e) {
            decoder.debug.warn('worker', `close() and videoDecoder.clear error`, e);
          }
        }
        streamRate = null;
        preLoopTimestamp = null;
        isStreamTimeDiffMoreThanLocalTimeDiff = false;
        // lastDecodeVideoFrameTimestamp = 0;
        // lastDecodeVideoFrameLocalTimestamp = 0;
        // lastDecodeAudioFrameTimestamp = 0;
        // newDecodedVideoFrameTimestamp = 0;
        // newDecodedVideoFrameLocalTimestamp = 0;
        // newDecodedAudioFrameTimestamp = 0;
        if (wcsVideoDecoder) {
          if (wcsVideoDecoder.reset) {
            wcsVideoDecoder.reset();
          }
          wcsVideoDecoder = null;
        }
        if (mseDecoder) {
          mseDecoder.destroy();
          mseDecoder = null;
        }
        decoder.firstTimestamp = null;
        decoder.startTimestamp = null;
        decoder.networkDelay = 0;
        decoder.streamFps = null; // audio + video all fps
        decoder.streamAudioFps = null; //
        decoder.streamVideoFps = null;
        decoder.delay = -1;
        decoder.pushLatestDelay = -1;
        decoder.preDelayTimestamp = null;
        decoder.dropping = false;
        decoder.isPushDropping = false;
        decoder.isPlayer = true;
        decoder.isPlayback = false;
        decoder.isWorkerFetch = false;
        decoder._opt = getDefaultOpt();
        if (decoder.webglObj) {
          decoder.webglObj.destroy();
          decoder.offscreenCanvas.removeEventListener('webglcontextlost', decoder.onOffscreenCanvasWebglContextLost);
          decoder.offscreenCanvas.removeEventListener('webglcontextrestored', decoder.onOffscreenCanvasWebglContextRestored);
          decoder.offscreenCanvas = null;
          decoder.offscreenCanvasGL = null;
          decoder.offscreenCanvasCtx = null;
        }
        bufferList = [];
        tempAudioBuffer = [];
        input = null;
        videoWidth = null;
        videoHeight = null;
        hasInitVideoCodec = false;
        hasInitAudioCodec = false;
        isVideoFirstIFrame = false;
        isWebglContextLost = false;
        isWidthOrHeightChanged = false;
        isSimdDecodeError = false;
        isHevc = null;
        nalUnitSize = null;
        audioOutputArray = [];
        audioRemain = 0;
        audioChannels = 0;
        bufferStartDts = null;
        bufferStartLocalTs = null;
        preIframeTs = null;
        preTimestamp = null;
        audioDepth = null;
        preTimestampDuration = 0;
        prevPayloadBufferSize = 0;
        wasmDecodeErrorStartTime = null;
        iframeIntervalTimestamp = null;
        decoder.fetchStatus = LOADER_STATUS.idle;
        nakedFlowDemuxer.destroy();
        fmp4Demuxer.destroy();
        mpeg4Demuxer.destroy();
        tsDemuxer.destroy();
        postMessage({
          cmd: WORKER_CMD_TYPE.closeEnd
        });
      },
      pushBuffer: function (bufferData, options) {
        if (options.type === MEDIA_TYPE.audio && isAacCodecPacket(bufferData)) {
          decoder.debug.log('worker', `pushBuffer audio ts is ${options.ts}, isAacCodecPacket is true`);
          if (decoder._opt.isRecordTypeFlv) {
            const bufferDataCopy = new Uint8Array(bufferData);
            postMessage({
              cmd: WORKER_CMD_TYPE.aacSequenceHeader,
              buffer: bufferDataCopy
            }, [bufferDataCopy.buffer]);
          }
          decoder.decodeAudio(bufferData, options.ts);
          return;
        }
        if (options.type === MEDIA_TYPE.video && options.isIFrame && isVideoSequenceHeader(bufferData)) {
          decoder.debug.log('worker', `pushBuffer video ts is ${options.ts}, isVideoSequenceHeader is true`);
          if (decoder._opt.isRecordTypeFlv) {
            const bufferDataCopy = new Uint8Array(bufferData);
            postMessage({
              cmd: WORKER_CMD_TYPE.videoSequenceHeader,
              buffer: bufferDataCopy
            }, [bufferDataCopy.buffer]);
          }
          decoder.decodeVideo(bufferData, options.ts, options.isIFrame, options.cts);
          return;
        }

        //  recording
        if (decoder._opt.isRecording) {
          if (decoder._opt.isRecordTypeFlv) {
            const payloadCopy = new Uint8Array(bufferData);
            postMessage({
              cmd: WORKER_CMD_TYPE.flvBufferData,
              type: options.type,
              buffer: payloadCopy,
              ts: options.ts
            }, [payloadCopy.buffer]);
          } else if (decoder._opt.recordType === FILE_SUFFIX.mp4) {
            if (options.type === MEDIA_TYPE.video) {
              const payloadCopy = new Uint8Array(bufferData);
              // remove video tag header(1) + CompositionTime(4)
              const buffer = payloadCopy.slice(5);
              postMessage({
                cmd: WORKER_CMD_TYPE.videoNalu,
                buffer: buffer,
                isIFrame: options.isIFrame,
                ts: options.ts,
                cts: options.cts
              }, [buffer.buffer]);
            } else if (options.type === MEDIA_TYPE.audio && decoder._opt.isWasmMp4) {
              const payloadCopy = new Uint8Array(bufferData);
              const buffer = isAAC(payloadCopy) ? payloadCopy.slice(2) : payloadCopy.slice(1);
              postMessage({
                cmd: WORKER_CMD_TYPE.audioNalu,
                buffer: buffer,
                ts: options.ts
              }, [buffer.buffer]);
            }
          }
        }
        if (decoder.isPlayer && preTimestampDuration > 0 && preTimestamp > 0 && options.type === MEDIA_TYPE.video) {
          const diff = options.ts - preTimestamp;
          const maxDiff = preTimestampDuration + preTimestampDuration / 2;
          if (diff > maxDiff) {
            decoder.debug.log('worker', `pushBuffer video
                    ts is ${options.ts}, preTimestamp is ${preTimestamp},
                    diff is ${diff} and preTimestampDuration is ${preTimestampDuration} and maxDiff is ${maxDiff}
                    maybe trigger black screen or flower screen
                    `);
          }
        }
        if (decoder.isPlayer && preTimestamp > 0 && options.type === MEDIA_TYPE.video && options.ts < preTimestamp && preTimestamp - options.ts > FRAME_TS_MAX_DIFF) {
          decoder.debug.warn('worker', `pushBuffer,
                preTimestamp is ${preTimestamp}, options.ts is ${options.ts},
                diff is ${preTimestamp - options.ts} more than ${FRAME_TS_MAX_DIFF},
                and resetAllDelay`);
          decoder.resetAllDelay();
          preTimestamp = null;
          preTimestampDuration = 0;
        }
        if (decoder.isPlayer && preTimestamp > 0 && options.ts <= preTimestamp && options.type === MEDIA_TYPE.video) {
          decoder.debug.warn('worker', `pushBuffer() and isIFrame is ${options.isIFrame} and,
                options.ts is ${options.ts} less than (or equal) preTimestamp is ${preTimestamp} and
                payloadBufferSize is ${bufferData.byteLength} and prevPayloadBufferSize is ${prevPayloadBufferSize}`);
          if (decoder._opt.isDropSameTimestampGop && isFalse(options.isIFrame) &&
          // 非i帧数据
          isVideoFirstIFrame) {
            const hasIframe = decoder.hasIframeInBufferList();
            const isNotPushDropping = isFalse(decoder.isPushDropping);
            decoder.debug.log('worker', `pushBuffer, isDropSameTimestampGop is true and
                    hasIframe is ${hasIframe} and isNotPushDropping is ${isNotPushDropping} and next dropBuffer`);
            if (hasIframe && isNotPushDropping) {
              decoder.dropBuffer$2();
            } else {
              // 全部扔掉，并且等待i帧出现。
              decoder.clearBuffer(true);
              // waiting for i frame(for hard decode)
              if (isTrue(decoder._opt.checkFirstIFrame) && isTrue(forHardDecode)) {
                if (decoder.isPlayUseMSEAndDecoderInWorker()) {
                  mseDecoder.isDecodeFirstIIframe = false;
                } else {
                  postMessage({
                    cmd: WORKER_CMD_TYPE.checkFirstIFrame
                  });
                }
              }
            }
            return;
          }
        }

        // decoder.debug.error('worker', `pushBuffer and type is ${options.type}, isIframe is ${options.isIFrame}, ts is ${options.ts}`);

        if (decoder.isPlayer && isVideoFirstIFrame) {
          const maxDelay = decoder._opt.videoBuffer + decoder._opt.videoBufferDelay;
          const pushLatestDelay = decoder.getDelayNotUpdateDelay(options.ts, options.type);
          // update push latest delay
          decoder.pushLatestDelay = pushLatestDelay;
          if (pushLatestDelay > maxDelay && decoder.delay < maxDelay && decoder.delay > 0) {
            if (decoder.hasIframeInBufferList() && decoder.isPushDropping === false) {
              decoder.debug.log('worker', `pushBuffer(), pushLatestDelay is ${pushLatestDelay} more than ${maxDelay} and decoder.delay is ${decoder.delay} and has iIframe and next decoder.dropBuffer$2()`);
              decoder.dropBuffer$2();
            }
          }
        }
        if (decoder.isPlayer && options.type === MEDIA_TYPE.video) {
          if (preTimestamp > 0) {
            preTimestampDuration = options.ts - preTimestamp;
          }
          prevPayloadBufferSize = bufferData.byteLength;
          preTimestamp = options.ts;
        }
        // 音频
        if (options.type === MEDIA_TYPE.audio) {
          bufferList.push({
            ts: options.ts,
            payload: bufferData,
            decoder: {
              decode: decoder.decodeAudio
            },
            type: MEDIA_TYPE.audio,
            isIFrame: false
          });
        } else if (options.type === MEDIA_TYPE.video) {
          bufferList.push({
            ts: options.ts,
            cts: options.cts,
            payload: bufferData,
            decoder: {
              decode: decoder.decodeVideo
            },
            type: MEDIA_TYPE.video,
            isIFrame: options.isIFrame
          });
        }
        if (decoder.isPlaybackCacheBeforeDecodeForFpsRender()) {
          if (isEmpty(decoder.streamVideoFps) || isEmpty(decoder.streamAudioFps)) {
            let streamVideoFps = decoder.streamVideoFps;
            let streamAudioFps = decoder.streamAudioFps;
            if (isEmpty(decoder.streamVideoFps)) {
              streamVideoFps = calcStreamFpsByBufferList(bufferList, MEDIA_TYPE.video);
              if (streamVideoFps) {
                decoder.streamVideoFps = streamVideoFps;
                postMessage({
                  cmd: WORKER_CMD_TYPE.playbackStreamVideoFps,
                  value: decoder.streamVideoFps
                });
                if (streamAudioFps) {
                  decoder.streamFps = streamVideoFps + streamAudioFps;
                } else {
                  decoder.streamFps = streamVideoFps;
                }
                //
                if (isFalse(decoder._opt.hasAudio)) {
                  decoder.debug.log('worker', `playbackCacheBeforeDecodeForFpsRender, _opt.hasAudio is false and set streamAudioFps is 0`);
                  decoder.streamAudioFps = 0;
                }
                decoder.playbackCacheLoop();
              }
            }
            if (isEmpty(decoder.streamAudioFps)) {
              streamAudioFps = calcStreamFpsByBufferList(bufferList, MEDIA_TYPE.audio);
              if (streamAudioFps) {
                decoder.streamAudioFps = streamAudioFps;
                if (streamVideoFps) {
                  decoder.streamFps = streamVideoFps + streamAudioFps;
                } else {
                  decoder.streamFps = streamAudioFps;
                }
                decoder.playbackCacheLoop();
              }
            }
            if (isEmpty(decoder.streamVideoFps) && isEmpty(decoder.streamAudioFps)) {
              const tsList = bufferList.map(item => {
                return {
                  type: item.type,
                  ts: item.ts
                };
              });
              decoder.debug.log('worker', `playbackCacheBeforeDecodeForFpsRender, calc streamAudioFps is ${streamAudioFps}, streamVideoFps is ${streamVideoFps}, bufferListLength  is ${bufferList.length}, and ts list is ${JSON.stringify(tsList)}`);
            }

            // 这边需要都个兜底，如果按照25fps的来计算
            const hasAudio = decoder.getAudioBufferLength() > 0;
            //  测试发现
            const maxBufferLength = hasAudio ? 60 : 40;
            if (bufferList.length >= maxBufferLength) {
              decoder.debug.warn('worker', `playbackCacheBeforeDecodeForFpsRender, bufferListLength  is ${bufferList.length} more than ${maxBufferLength}, and hasAudio is ${hasAudio} an set streamFps is 25`);
              decoder.streamVideoFps = 25;
              postMessage({
                cmd: WORKER_CMD_TYPE.playbackStreamVideoFps,
                value: decoder.streamVideoFps
              });
              if (hasAudio) {
                decoder.streamAudioFps = 25;
                decoder.streamFps = decoder.streamVideoFps + decoder.streamAudioFps;
              } else {
                decoder.streamFps = decoder.streamVideoFps;
              }
              decoder.playbackCacheLoop();
            }
          }
        }
      },
      // video buffer length
      getVideoBufferLength() {
        let result = 0;
        bufferList.forEach(item => {
          if (item.type === MEDIA_TYPE.video) {
            result += 1;
          }
        });
        return result;
      },
      hasIframeInBufferList() {
        return bufferList.some(item => {
          return item.type === MEDIA_TYPE.video && item.isIFrame;
        });
      },
      isAllIframeInBufferList() {
        const videoBufferLength = decoder.getVideoBufferLength();
        let iFrameLength = 0;
        bufferList.forEach(item => {
          if (item.type === MEDIA_TYPE.video && item.isIFrame) {
            iFrameLength += 1;
          }
        });
        return videoBufferLength === iFrameLength;
      },
      getNotDroppingDelayTs() {
        return decoder._opt.videoBuffer + decoder._opt.videoBufferDelay / 2;
      },
      getAudioBufferLength() {
        let result = 0;
        bufferList.forEach(item => {
          if (item.type === MEDIA_TYPE.audio) {
            result += 1;
          }
        });
        return result;
      },
      getFlvBufferLength() {
        let result = 0;
        if (input && input.buffer) {
          result = input.buffer.byteLength;
        }
        if (decoder._opt.isNakedFlow) {
          if (nakedFlowDemuxer.lastBuf) {
            result = nakedFlowDemuxer.lastBuf.byteLength;
          }
        }
        return result;
      },
      fetchStream: function (url, options) {
        decoder.debug.log('worker', 'fetchStream, url is ' + url, 'options:', JSON.stringify(options));
        decoder.isWorkerFetch = true;
        if (options.isFlv) {
          decoder._opt.isFlv = true;
        } else if (options.isFmp4) {
          decoder._opt.isFmp4 = true;
        } else if (options.isMpeg4) {
          decoder._opt.isMpeg4 = true;
        } else if (options.isNakedFlow) {
          decoder._opt.isNakedFlow = true;
        } else if (options.isTs) {
          decoder._opt.isTs = true;
        }
        streamRate = calculationRate(rate => {
          postMessage({
            cmd: WORKER_CMD_TYPE.workerFetch,
            type: EVENTS.streamRate,
            value: rate
          });
        });
        decoder.startStreamRateAndStatsInterval();
        if (options.isFmp4) {
          fmp4Demuxer.listenMp4Box();
          if (decoder._opt.isFmp4Private) {
            fmp4Demuxer.initTransportDescarmber();
          }
        }
        if (options.protocol === PLAYER_PLAY_PROTOCOL.fetch) {
          input = new OPut(decoder.demuxFlv());
          fetch(url, {
            signal: abortController.signal
          }).then(res => {
            if (isTrue(requestAbort)) {
              decoder.debug.log('worker', `request abort and run res.body.cancel()`);
              decoder.fetchStatus = LOADER_STATUS.idle;
              res.body.cancel();
              return;
            }
            if (!isFetchSuccess(res)) {
              decoder.debug.warn('worker', `fetch response status is ${res.status} and ok is ${res.ok} and emit error and next abort()`);
              abort();
              postMessage({
                cmd: WORKER_CMD_TYPE.workerFetch,
                type: EVENTS_ERROR.fetchError,
                value: `fetch response status is ${res.status} and ok is ${res.ok}`
              });
              return;
            }
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamSuccess
            });
            if (supportWritableStream()) {
              decoder.writableStream = new WritableStream({
                write: value => {
                  if (abortController && abortController.signal && abortController.signal.aborted) {
                    decoder.debug.log('worker', `writableStream write() and abortController.signal.aborted is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  if (isTrue(requestAbort)) {
                    decoder.debug.log('worker', `writableStream write() and requestAbort is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  decoder.fetchStatus = LOADER_STATUS.buffering;
                  streamRate(value.byteLength);
                  if (options.isFlv) {
                    input.write(value);
                  } else if (options.isFmp4) {
                    decoder.demuxFmp4(value);
                  } else if (options.isMpeg4) {
                    decoder.demuxMpeg4(value);
                  } else if (options.isTs) {
                    decoder.demuxTs(value);
                  }
                },
                close: () => {
                  decoder.fetchStatus = LOADER_STATUS.complete;
                  input = null;
                  abort();
                  postMessage({
                    cmd: WORKER_CMD_TYPE.workerFetch,
                    type: EVENTS.streamEnd,
                    value: PLAYER_STREAM_TYPE.fetch,
                    msg: 'fetch done'
                  });
                },
                abort: e => {
                  if (abortController && abortController.signal && abortController.signal.aborted) {
                    decoder.debug.log('worker', `writableStream abort() and abortController.signal.aborted is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  input = null;
                  if (e.name === FETCH_ERROR.abort) {
                    return;
                  }
                  abort();
                  postMessage({
                    cmd: WORKER_CMD_TYPE.workerFetch,
                    type: EVENTS_ERROR.fetchError,
                    value: e.toString()
                  });
                }
              });
              res.body.pipeTo(decoder.writableStream);
            } else {
              const reader = res.body.getReader();
              const fetchNext = () => {
                reader.read().then(_ref => {
                  let {
                    done,
                    value
                  } = _ref;
                  if (done) {
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    input = null;
                    abort();
                    postMessage({
                      cmd: WORKER_CMD_TYPE.workerFetch,
                      type: EVENTS.streamEnd,
                      value: PLAYER_STREAM_TYPE.fetch,
                      msg: 'fetch done'
                    });
                    return;
                  }
                  if (abortController && abortController.signal && abortController.signal.aborted) {
                    decoder.debug.log('worker', `fetchNext().then() and abortController.signal.aborted is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  if (isTrue(requestAbort)) {
                    decoder.debug.log('worker', `fetchNext().then() and requestAbort is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  decoder.fetchStatus = LOADER_STATUS.buffering;
                  streamRate(value.byteLength);
                  if (options.isFlv) {
                    input.write(value);
                  } else if (options.isFmp4) {
                    decoder.demuxFmp4(value);
                  } else if (options.isMpeg4) {
                    decoder.demuxMpeg4(value);
                  }
                  fetchNext();
                }).catch(e => {
                  if (abortController && abortController.signal && abortController.signal.aborted) {
                    decoder.debug.log('worker', `fetchNext().catch() and abortController.signal.aborted is true so return`);
                    decoder.fetchStatus = LOADER_STATUS.complete;
                    return;
                  }
                  input = null;
                  if (e.name === FETCH_ERROR.abort) {
                    return;
                  }
                  abort();
                  postMessage({
                    cmd: WORKER_CMD_TYPE.workerFetch,
                    type: EVENTS_ERROR.fetchError,
                    value: e.toString()
                  });
                });
              };
              fetchNext();
            }
          }).catch(e => {
            if (abortController && abortController.signal && abortController.signal.aborted) {
              decoder.debug.log('worker', `fetch().catch() and abortController.signal.aborted is true so return`);
              return;
            }
            if (e.name === FETCH_ERROR.abort) {
              return;
            }
            abort();
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS_ERROR.fetchError,
              value: e.toString()
            });
            input = null;
          });
        } else if (options.protocol === PLAYER_PLAY_PROTOCOL.websocket) {
          if (options.isFlv) {
            input = new OPut(decoder.demuxFlv());
          }
          socket = new WebSocket(url);
          socket.binaryType = 'arraybuffer';
          socket.onopen = () => {
            decoder.debug.log('worker', 'fetchStream, WebsocketStream  socket open');
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamSuccess
            });
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.websocketOpen
            });
          };
          socket.onclose = event => {
            decoder.debug.log('worker', `fetchStream, WebsocketStream socket close and code is ${event.code}`);
            // closed_abnormally
            if (event.code === 1006) {
              decoder.debug.error('worker', `fetchStream, WebsocketStream socket close abnormally and code is ${event.code}`);
            }
            if (isTrue(requestAbort)) {
              decoder.debug.log('worker', `fetchStream, WebsocketStream socket close and requestAbort is true so return`);
              return;
            }
            input = null;
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamEnd,
              value: PLAYER_STREAM_TYPE.websocket,
              msg: event.code
            });
          };
          socket.onerror = error => {
            decoder.debug.error('worker', 'fetchStream, WebsocketStream socket error', error);
            input = null;
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS_ERROR.websocketError,
              value: error.isTrusted ? 'websocket user aborted' : 'websocket error'
            });
          };
          socket.onmessage = event => {
            streamRate(event.data.byteLength);
            // decoder.debug.log('worker',` socket on message isFlv is ${options.isFlv}`);

            if (options.isFlv) {
              input.write(event.data);
              // decoder.debug.log('worker',` input.bufferList.length is ${input.buffer.length},byteLength is ${input.buffer.byteLength}`);
            } else if (options.isFmp4) {
              decoder.demuxFmp4(event.data);
            } else if (options.isMpeg4) {
              decoder.demuxMpeg4(event.data);
            } else if (decoder._opt.isNakedFlow) {
              decoder.demuxNakedFlow(event.data);
            } else {
              decoder.demuxM7s(event.data);
            }
          };
        }
      },
      demuxFlv: function* () {
        yield 9;
        const tmp = new ArrayBuffer(4);
        const tmp8 = new Uint8Array(tmp);
        const tmp32 = new Uint32Array(tmp);
        while (true) {
          tmp8[3] = 0;
          const t = yield 15;
          const type = t[4];
          tmp8[0] = t[7];
          tmp8[1] = t[6];
          tmp8[2] = t[5];
          const length = tmp32[0];
          tmp8[0] = t[10];
          tmp8[1] = t[9];
          tmp8[2] = t[8];
          tmp8[3] = t[11];
          let ts = tmp32[0];
          const payload = (yield length).slice();
          switch (type) {
            case FLV_MEDIA_TYPE.audio:
              if (payload.byteLength > 0) {
                let payloadBuffer = payload;
                if (isTrue(decoder._opt.m7sCryptoAudio)) {
                  payloadBuffer = decoder.cryptoPayloadAudio(payload);
                }
                decoder.decode(payloadBuffer, {
                  type: MEDIA_TYPE.audio,
                  ts
                });
              } else {
                decoder.debug.warn('worker', `demuxFlv() type is audio and payload.byteLength is ${payload.byteLength} and return`);
              }
              break;
            case FLV_MEDIA_TYPE.video:
              if (payload.byteLength >= 6) {
                const flags = payload[0];
                if (decoder._isEnhancedH265Header(flags)) {
                  decoder._decodeEnhancedH265Video(payload, ts);
                } else {
                  //  video codec id
                  payload[0] & 0x0F;
                  //  is i frame
                  let isIFrame = payload[0] >> 4 === VIDEO_FRAME_TYPE.keyFrame;
                  if (isIFrame && isVideoSequenceHeader(payload) && isHevc === null) {
                    const videoCodec = payload[0] & 0x0F;
                    isHevc = videoCodec === VIDEO_ENC_CODE.h265;
                    nalUnitSize = getUnitSizeFromVideoSequenceHeader(payload, isHevc);
                    decoder.debug.log('worker', `demuxFlv() isVideoSequenceHeader is true and isHevc is ${isHevc} and nalUnitSize is ${nalUnitSize}`);
                  }
                  if (isIFrame) {
                    decoder.calcIframeIntervalTimestamp(ts);
                  }

                  // just for player
                  if (decoder.isPlayer) {
                    decoder.calcNetworkDelay(ts);
                  }
                  tmp32[0] = payload[4];
                  tmp32[1] = payload[3];
                  tmp32[2] = payload[2];
                  tmp32[3] = 0;
                  let cts = tmp32[0];
                  let payloadBuffer = decoder.cryptoPayload(payload, isIFrame);
                  decoder.decode(payloadBuffer, {
                    type: MEDIA_TYPE.video,
                    ts,
                    isIFrame,
                    cts
                  });
                }
              } else {
                decoder.debug.warn('worker', `demuxFlv() type is video and payload.byteLength is ${payload.byteLength} and return`);
              }
              break;
            case FLV_MEDIA_TYPE.scriptData:
              postMessage({
                cmd: WORKER_CMD_TYPE.flvScriptData,
                buffer: payload
              }, [payload.buffer]);
              break;
            default:
              decoder.debug.log('worker', `demuxFlv() type is ${type}`);
              break;
          }
        }
      },
      decode: function (payload, options) {
        if (options.type === MEDIA_TYPE.audio) {
          if (decoder._opt.hasAudio) {
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamAbps,
              value: payload.byteLength
            });
            if (decoder.isPlayer) {
              decoder.pushBuffer(payload, {
                type: options.type,
                ts: options.ts,
                cts: options.cts
              });
            } else if (decoder.isPlayback) {
              if (decoder.isPlaybackOnlyDecodeIFrame()) ; else {
                if (decoder.isPlaybackCacheBeforeDecodeForFpsRender()) {
                  decoder.pushBuffer(payload, {
                    type: options.type,
                    ts: options.ts,
                    cts: options.cts
                  });
                } else {
                  // for 1 rate
                  decoder.pushBuffer(payload, {
                    type: options.type,
                    ts: options.ts,
                    cts: options.cts
                  });
                }
              }
            }
          }
        } else if (options.type === MEDIA_TYPE.video) {
          if (decoder._opt.hasVideo) {
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamVbps,
              value: payload.byteLength
            });
            postMessage({
              cmd: WORKER_CMD_TYPE.workerFetch,
              type: EVENTS.streamDts,
              value: options.ts
            });
            if (decoder.isPlayer) {
              // decoder.debug.log('worker','fetchStream, decode video isIFrame is', options.isIFrame);
              decoder.pushBuffer(payload, {
                type: options.type,
                ts: options.ts,
                isIFrame: options.isIFrame,
                cts: options.cts
              });
            } else if (decoder.isPlayback) {
              if (decoder.isPlaybackOnlyDecodeIFrame()) {
                if (options.isIFrame) {
                  decoder.pushBuffer(payload, {
                    type: options.type,
                    ts: options.ts,
                    cts: options.cts,
                    isIFrame: options.isIFrame
                  });
                }
              } else {
                if (decoder.isPlaybackCacheBeforeDecodeForFpsRender()) {
                  decoder.pushBuffer(payload, {
                    type: options.type,
                    ts: options.ts,
                    cts: options.cts,
                    isIFrame: options.isIFrame
                  });
                } else {
                  decoder.pushBuffer(payload, {
                    type: options.type,
                    ts: options.ts,
                    cts: options.cts,
                    isIFrame: options.isIFrame
                  });
                }
              }
            }
          }
        }
      },
      cryptoPayload: function (payload, isIFrame) {
        let payloadBuffer = payload;
        if (decoder._opt.isM7sCrypto) {
          if (decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength > 0 && decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength > 0) {
            payloadBuffer = aes256ctrDecrypt(payload, decoder._opt.cryptoKey, decoder._opt.cryptoIV, isHevc);
          } else {
            decoder.debug.error('worker', `isM7sCrypto cryptoKey.length is ${decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength} or cryptoIV.length is ${decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength} null`);
          }
        } else if (decoder._opt.isSm4Crypto) {
          if (decoder._opt.sm4CryptoKey && isIFrame) {
            payloadBuffer = sm4Decrypt(payload, decoder._opt.sm4CryptoKey);
          } else {
            if (!decoder._opt.sm4CryptoKey) {
              decoder.debug.error('worker', `isSm4Crypto opt.sm4CryptoKey is null`);
            }
          }
        } else if (decoder._opt.isXorCrypto) {
          if (decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength > 0 && decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength > 0) {
            payloadBuffer = xorDecrypt(payload, decoder._opt.cryptoKey, decoder._opt.cryptoIV, isHevc);
          } else {
            decoder.debug.error('worker', `isXorCrypto cryptoKey.length is ${decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength} or cryptoIV.length is ${decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength} null`);
          }
        }
        return payloadBuffer;
      },
      cryptoPayloadAudio: function (payload) {
        let payloadBuffer = payload;
        if (decoder._opt.isM7sCrypto) {
          if (decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength > 0 && decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength > 0) {
            const codecId = payload[0] >> 4;
            if (codecId === AUDIO_ENC_CODE.AAC) {
              payloadBuffer = aes256ctrDecryptAacAudio(payload, decoder._opt.cryptoKey, decoder._opt.cryptoIV);
            }
          } else {
            decoder.debug.error('worker', `isM7sCrypto cryptoKey.length is ${decoder._opt.cryptoKey && decoder._opt.cryptoKey.byteLength} or cryptoIV.length is ${decoder._opt.cryptoIV && decoder._opt.cryptoIV.byteLength} null`);
          }
        }
        return payloadBuffer;
      },
      setCodecAudio: function (payload, ts) {
        const codecId = payload[0] >> 4;
        const size = payload[0] >> 1 & 0x01;
        //
        if (codecId === AUDIO_ENC_CODE.AAC) {
          audioDepth = size ? 16 : 8;
        } else {
          audioDepth = size === 0 ? 8 : 16;
        }
        if (!(audioDecoder && audioDecoder.setCodec)) {
          decoder.debug.error('worker', 'setCodecAudio: audioDecoder or audioDecoder.setCodec is null');
          return;
        }
        if (isAacCodecPacket(payload) || codecId === AUDIO_ENC_CODE.ALAW || codecId === AUDIO_ENC_CODE.MULAW || codecId === AUDIO_ENC_CODE.MP3) {
          decoder.debug.log('worker', `setCodecAudio: init audio codec, codeId is ${codecId}`);
          //  remove audio tag header
          const extraData = codecId === AUDIO_ENC_CODE.AAC ? payload.slice(2) : new Uint8Array(0);
          audioDecoder.setCodec(codecId, decoder._opt.sampleRate, extraData);
          if (codecId === AUDIO_ENC_CODE.AAC) {
            postMessage({
              cmd: WORKER_CMD_TYPE.audioAACSequenceHeader,
              buffer: extraData
            }, [extraData.buffer]);
          }
          hasInitAudioCodec = true;
          //  非aac的，需要解码一下
          if (codecId !== AUDIO_ENC_CODE.AAC) {
            if (codecId === AUDIO_ENC_CODE.MP3) {
              if (!decoder.mp3Demuxer) {
                decoder.mp3Demuxer = new Mp3FrameParseLoader(decoder);
                decoder.mp3Demuxer.on('data', (audioBuffer, audioTs) => {
                  audioDecoder.decode(audioBuffer, audioTs);
                });
              }
              decoder.mp3Demuxer.dispatch(payload.slice(1), ts);
            } else {
              audioDecoder.decode(payload.slice(1), ts);
            }
          }
        } else {
          decoder.debug.warn('worker', 'setCodecAudio: hasInitAudioCodec is false, codecId is ', codecId);
        }
      },
      decodeAudio: function (payload, ts) {
        if (decoder.isDestroyed) {
          decoder.debug.log('worker', 'decodeAudio, decoder is destroyed and return');
          return;
        }
        if (decoder.isPlayUseMSEAndDecoderInWorkerAndMseDecodeAudio()) {
          mseDecoder.decodeAudio(payload, ts);
          return;
        }
        if (isTrue(forHardDecode) && isTrue(decoder._opt.mseDecodeAudio)) {
          postMessage({
            cmd: WORKER_CMD_TYPE.audioPayload,
            payload,
            ts,
            cts: ts
          }, [payload.buffer]);
        } else {
          const codecId = payload[0] >> 4;
          if (!hasInitAudioCodec) {
            decoder.setCodecAudio(payload, ts);
          } else {
            if (isAacCodecPacket(payload)) {
              decoder.debug.log('worker', 'decodeAudio and has already initialized and payload is aac codec packet so drop this frame');
              return;
            }

            // lastDecodeAudioFrameTimestamp = ts;
            //  remove audio tag header
            if (codecId === AUDIO_ENC_CODE.MP3) {
              decoder.mp3Demuxer.dispatch(payload.slice(1), ts);
            } else {
              audioDecoder.decode(codecId === AUDIO_ENC_CODE.AAC ? payload.slice(2) : payload.slice(1), ts);
            }
          }
        }
      },
      setCodecVideo: function (payload) {
        const codecId = payload[0] & 0x0F;
        if (!(videoDecoder && videoDecoder.setCodec)) {
          decoder.debug.error('worker', 'setCodecVideo: videoDecoder or videoDecoder.setCodec is null');
          return;
        }
        if (isVideoSequenceHeader(payload)) {
          if (codecId === VIDEO_ENC_CODE.h264 || codecId === VIDEO_ENC_CODE.h265) {
            decoder.debug.log('worker', `setCodecVideo: init video codec , codecId is ${codecId}`);
            const extraData = payload.slice(5);
            if (codecId === VIDEO_ENC_CODE.h264 && decoder._opt.useSIMD) {
              // need check width and height is more than 4080。
              const avcConfig = parseAVCDecoderConfigurationRecord(extraData);
              if (avcConfig.codecWidth > SIMD_H264_DECODE_MAX_WIDTH || avcConfig.codecHeight > SIMD_H264_DECODE_MAX_WIDTH) {
                postMessage({
                  cmd: WORKER_CMD_TYPE.simdH264DecodeVideoWidthIsTooLarge
                });
                decoder.debug.warn('worker', `setCodecVideo: SIMD H264 decode video width is too large, width is ${avcConfig.codecWidth}, height is ${avcConfig.codecHeight}`);
                return;
              }
            }
            const payloadNew = new Uint8Array(payload);
            hasInitVideoCodec = true;
            videoDecoder.setCodec(codecId, extraData);
            postMessage({
              cmd: WORKER_CMD_TYPE.videoCode,
              code: codecId
            });
            postMessage({
              cmd: WORKER_CMD_TYPE.videoCodec,
              buffer: payloadNew,
              codecId
            }, [payloadNew.buffer]);
          } else {
            decoder.debug.warn('worker', `setCodecVideo: hasInitVideoCodec is false, codecId is ${codecId} is not H264 or H265`);
          }
        } else {
          decoder.debug.warn('worker', `decodeVideo: hasInitVideoCodec is false, codecId is ${codecId} and frameType is ${payload[0] >> 4} and packetType is ${payload[1]}`);
        }
      },
      decodeVideo: function (payload, ts, isIFrame) {
        let cts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        if (decoder.isDestroyed) {
          decoder.debug.log('worker', 'decodeVideo, decoder is destroyed and return');
          return;
        }
        if (decoder.isPlayUseMSEAndDecoderInWorker()) {
          mseDecoder.decodeVideo(payload, ts, isIFrame, cts);
          return;
        }
        if (isTrue(forHardDecode)) {
          postMessage({
            cmd: WORKER_CMD_TYPE.videoPayload,
            payload,
            isIFrame,
            ts,
            cts,
            delay: decoder.delay
          }, [payload.buffer]);
        } else {
          if (!hasInitVideoCodec) {
            decoder.setCodecVideo(payload);
          } else {
            if (!isVideoFirstIFrame && isIFrame) {
              isVideoFirstIFrame = true;
            }
            if (isVideoFirstIFrame) {
              // check video width and height is changed
              if (isIFrame && isVideoSequenceHeader(payload)) {
                const codecId = payload[0] & 0x0F;
                let config = {};
                if (codecId === VIDEO_ENC_CODE.h264) {
                  let data = payload.slice(5);
                  config = parseAVCDecoderConfigurationRecord(data);
                } else if (codecId === VIDEO_ENC_CODE.h265) {
                  config = parseHEVCDecoderConfigurationRecord$2(payload);
                }
                if (config.codecWidth && config.codecHeight && videoWidth && videoHeight && (config.codecWidth !== videoWidth || config.codecHeight !== videoHeight)) {
                  decoder.debug.warn('worker', `
                            decodeVideo: video width or height is changed,
                            old width is ${videoWidth}, old height is ${videoHeight},
                            new width is ${config.codecWidth}, new height is ${config.codecHeight},
                            and emit change event`);
                  isWidthOrHeightChanged = true;
                  postMessage({
                    cmd: WORKER_CMD_TYPE.wasmWidthOrHeightChange
                  });
                }
              }
              if (isWidthOrHeightChanged) {
                decoder.debug.warn('worker', `decodeVideo: video width or height is changed, and return`);
                return;
              }
              if (isSimdDecodeError) {
                decoder.debug.warn('worker', `decodeVideo: simd decode error, and return`);
                return;
              }
              if (isVideoSequenceHeader(payload)) {
                decoder.debug.warn('worker', 'decodeVideo and payload is video sequence header so drop this frame');
                return;
              }
              if (payload.byteLength < VIDEO_PAYLOAD_MIN_SIZE) {
                decoder.debug.warn('worker', `decodeVideo and payload is too small , payload length is ${payload.byteLength}`);
                return;
              }

              //  remove video tag header(1) + CompositionTime(4)
              const buffer = payload.slice(5);
              // lastDecodeVideoFrameTimestamp = ts;
              // lastDecodeVideoFrameLocalTimestamp = now();
              videoDecoder.decode(buffer, isIFrame ? 1 : 0, ts);
            } else {
              decoder.debug.log('worker', 'decodeVideo first frame is not iFrame');
            }
          }
        }
      },
      clearBuffer: function () {
        let needClear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        decoder.debug.log('worker', `clearBuffer,bufferList length is ${bufferList.length}, need clear is ${needClear}`);
        if (needClear) {
          bufferList = [];
        }
        if (decoder.isPlayer) {
          decoder.resetAllDelay();
          if (isTrue(decoder._opt.checkFirstIFrame)) {
            decoder.dropping = true;
            postMessage({
              cmd: WORKER_CMD_TYPE.isDropping
            });
          }
        }

        //  check i frame (just for wasm decode)
        if (isTrue(decoder._opt.checkFirstIFrame) && isFalse(forHardDecode)) {
          isVideoFirstIFrame = false;
        }
      },
      dropBuffer$2: function () {
        if (bufferList.length > 0) {
          let iFrameIndex = bufferList.findIndex(bufferItem => {
            return isTrue(bufferItem.isIFrame) && bufferItem.type === MEDIA_TYPE.video;
          });
          if (decoder.isAllIframeInBufferList()) {
            for (let i = 0; i < bufferList.length; i++) {
              const bufferItem = bufferList[i];
              const tempDelay = decoder.getDelayNotUpdateDelay(bufferItem.ts, bufferItem.type);
              if (tempDelay >= decoder.getNotDroppingDelayTs()) {
                decoder.debug.log('worker', `dropBuffer$2() isAllIframeInBufferList() is true, and index is ${i} and tempDelay is ${tempDelay} and notDroppingDelayTs is ${decoder.getNotDroppingDelayTs()}`);
                iFrameIndex = i;
                break;
              }
            }
          }
          if (iFrameIndex >= 0) {
            decoder.isPushDropping = true;
            postMessage({
              cmd: WORKER_CMD_TYPE.isDropping
            });
            //  old bufferList length
            const bufferListLength = bufferList.length;
            bufferList = bufferList.slice(iFrameIndex);
            const iFrameItem = bufferList.shift();
            decoder.resetAllDelay();
            decoder.getDelay(iFrameItem.ts, iFrameItem.type);
            decoder.doDecode(iFrameItem);
            decoder.isPushDropping = false;
            decoder.debug.log('worker', `dropBuffer$2() iFrameIndex is ${iFrameIndex},and old bufferList length is ${bufferListLength} ,new bufferList is ${bufferList.length} and new delay is ${decoder.delay} `);
          } else {
            decoder.isPushDropping = false;
          }
        }
        if (bufferList.length === 0) {
          decoder.isPushDropping = false;
        }
      },
      demuxM7s: function (arrayBuffer) {
        const dv = new DataView(arrayBuffer);
        const ts = dv.getUint32(1, false);
        const type = dv.getUint8(0);
        const tmp = new ArrayBuffer(4);
        const tmp32 = new Uint32Array(tmp);
        // decoder.debug.log('worker', `demuxM7s , type is ${type}`);
        switch (type) {
          case MEDIA_TYPE.audio:
            decoder.decode(new Uint8Array(arrayBuffer, 5), {
              type: MEDIA_TYPE.audio,
              ts
            });
            break;
          case MEDIA_TYPE.video:
            if (dv.byteLength >= 5 + 6) {
              const payload = new Uint8Array(arrayBuffer, 5);
              const flag = payload[0];
              if (decoder._isEnhancedH265Header(flag)) {
                decoder._decodeEnhancedH265Video(payload, ts);
              } else {
                const isIFrame = dv.getUint8(5) >> 4 === 1;
                if (isIFrame) {
                  decoder.calcIframeIntervalTimestamp(ts);
                  if (isVideoSequenceHeader(payload) && isHevc === null) {
                    const videoCodec = payload[0] & 0x0F;
                    isHevc = videoCodec === VIDEO_ENC_CODE.h265;
                  }
                }
                if (decoder.isPlayer) {
                  decoder.calcNetworkDelay(ts);
                }
                tmp32[0] = payload[4];
                tmp32[1] = payload[3];
                tmp32[2] = payload[2];
                tmp32[3] = 0;
                let cts = tmp32[0];
                let payloadBuffer = decoder.cryptoPayload(payload, isIFrame);
                decoder.decode(payloadBuffer, {
                  type: MEDIA_TYPE.video,
                  ts,
                  isIFrame,
                  cts
                });
              }
            } else {
              decoder.debug.warn('worker', `demuxM7s() type is video and arrayBuffer length is ${arrayBuffer.byteLength} and return`);
            }
            break;
        }
      },
      demuxNakedFlow: function (arrayBuffer) {
        // decoder.debug.log('worker', `demuxNakedFlow, arrayBuffer length is ${arrayBuffer.byteLength}`);
        // console.log('demuxNakedFlow', arrayBuffer);
        nakedFlowDemuxer.dispatch(arrayBuffer);
      },
      demuxFmp4: function (arrayBuffer) {
        const buffer = new Uint8Array(arrayBuffer);
        fmp4Demuxer.dispatch(buffer);
      },
      demuxMpeg4: function (arrayBuffer) {
        mpeg4Demuxer.dispatch(arrayBuffer);
      },
      demuxTs: function (arrayBuffer) {
        tsDemuxer.dispatch(arrayBuffer);
      },
      _decodeEnhancedH265Video: function (payload, ts) {
        const flags = payload[0];
        const frameTypeEx = flags & 0x30;
        const packetEx = flags & 0x0F;
        const codecId = payload.slice(1, 5);
        const tmp = new ArrayBuffer(4);
        const tmp32 = new Uint32Array(tmp);
        const isAV1 = String.fromCharCode(codecId[0]) == 'a';
        isHevc = isFalse(isAV1);
        if (packetEx === PACKET_TYPE_EX.PACKET_TYPE_SEQ_START) {
          if (frameTypeEx === FRAME_TYPE_EX.FT_KEY) {
            // header video info
            const extraData = payload.slice(5);
            if (isAV1) ; else {
              const payloadBuffer = new Uint8Array(5 + extraData.length);
              payloadBuffer.set([0x1c, 0x00, 0x00, 0x00, 0x00], 0);
              payloadBuffer.set(extraData, 5);
              nalUnitSize = getUnitSizeFromVideoSequenceHeader(payload, isHevc);
              decoder.debug.log('worker', `demuxFlv() isVideoSequenceHeader(enhancedH265) is true and isHevc is ${isHevc} and nalUnitSize is ${nalUnitSize}`);
              decoder.decode(payloadBuffer, {
                type: MEDIA_TYPE.video,
                ts,
                isIFrame: true,
                cts: 0
              });
            }
          }
        } else if (packetEx === PACKET_TYPE_EX.PACKET_TYPE_FRAMES) {
          let payloadBuffer = payload;
          let cts = 0;
          const isIFrame = frameTypeEx === FRAME_TYPE_EX.FT_KEY;
          if (isIFrame) {
            decoder.calcIframeIntervalTimestamp(ts);
          }
          if (isAV1) ; else {
            // h265
            tmp32[0] = payload[4];
            tmp32[1] = payload[3];
            tmp32[2] = payload[2];
            tmp32[3] = 0;
            cts = tmp32[0];
            const data = payload.slice(8);
            payloadBuffer = hevcEncoderNalePacketNotLength(data, isIFrame);
            payloadBuffer = decoder.cryptoPayload(payloadBuffer, isIFrame);
            decoder.decode(payloadBuffer, {
              type: MEDIA_TYPE.video,
              ts,
              isIFrame,
              cts
            });
          }
        } else if (packetEx === PACKET_TYPE_EX.PACKET_TYPE_FRAMESX) {
          const isIFrame = frameTypeEx === FRAME_TYPE_EX.FT_KEY;
          if (isIFrame) {
            decoder.calcIframeIntervalTimestamp(ts);
          }
          const data = payload.slice(5);
          let payloadBuffer = hevcEncoderNalePacketNotLength(data, isIFrame);
          payloadBuffer = decoder.cryptoPayload(payloadBuffer, isIFrame);
          decoder.decode(payloadBuffer, {
            type: MEDIA_TYPE.video,
            ts,
            isIFrame,
            cts: 0
          });
        }
      },
      _isEnhancedH265Header: function (flags) {
        return (flags & FRAME_HEADER_EX) === FRAME_HEADER_EX;
      },
      findSei: function (payload, ts) {
        //  default is 4 ,maybe 3
        let size = 4;
        if (isNotEmpty(nalUnitSize)) {
          size = nalUnitSize;
        }
        const units = parseAvcC(payload.slice(5), size);
        units.forEach(unit => {
          const type = isHevc ? unit[0] >>> 1 & 0x3f : unit[0] & 0x1f;
          if (isHevc && (type === H265_NAL_TYPE.suffixSei || type === H265_NAL_TYPE.prefixSei) || isFalse(isHevc) && type === H264_NAL_TYPE.kSliceSEI) {
            postMessage({
              cmd: WORKER_CMD_TYPE.videoSEI,
              buffer: unit,
              ts
            }, [unit.buffer]);
          }
        });
      },
      calcNetworkDelay: function (dts) {
        if (!(isVideoFirstIFrame && dts > 0)) {
          return;
        }
        if (bufferStartDts === null) {
          bufferStartDts = dts;
          bufferStartLocalTs = now();
        } else {
          if (dts < bufferStartDts) {
            decoder.debug.warn('worker', `calcNetworkDelay, dts is ${dts} less than bufferStartDts is ${bufferStartDts}`);
            bufferStartDts = dts;
            bufferStartLocalTs = now();
          }
        }
        const diff1 = dts - bufferStartDts;
        const localDiff = now() - bufferStartLocalTs;
        const delay = localDiff > diff1 ? localDiff - diff1 : 0;
        decoder.networkDelay = delay;
        if (delay > decoder._opt.networkDelay && decoder._opt.playType === PLAY_TYPE.player) {
          decoder.debug.warn('worker', `calcNetworkDelay now dts:${dts}, start dts is ${bufferStartDts} vs start is ${diff1},local diff is ${localDiff} ,delay is ${delay}`);
          postMessage({
            cmd: WORKER_CMD_TYPE.workerFetch,
            type: EVENTS.networkDelayTimeout,
            value: delay
          });
        }
      },
      calcIframeIntervalTimestamp: function (ts) {
        if (preIframeTs === null) {
          preIframeTs = ts;
        } else {
          if (preIframeTs < ts) {
            iframeIntervalTimestamp = ts - preIframeTs;
            postMessage({
              cmd: WORKER_CMD_TYPE.iframeIntervalTs,
              value: iframeIntervalTimestamp
            });
            // post 到主线程里面去。
            preIframeTs = ts;
          }
        }
      },
      canVisibilityDecodeNotDrop: function () {
        return decoder._opt.visibility && videoWidth * videoHeight <= 1920 * 1080;
      },
      isPlaybackCacheBeforeDecodeForFpsRender: function () {
        return decoder.isPlayback && decoder._opt.playbackIsCacheBeforeDecodeForFpsRender;
      },
      isPlaybackOnlyDecodeIFrame: function () {
        return decoder._opt.playbackRate >= decoder._opt.playbackForwardMaxRateDecodeIFrame;
      },
      isPlayUseMSE: function () {
        return decoder.isPlayer && decoder._opt.useMSE && isTrue(forHardDecode);
      },
      isPlayUseMSEAndDecoderInWorker: function () {
        return decoder.isPlayUseMSE() && decoder._opt.mseDecoderUseWorker;
      },
      isPlayUseMSEAndDecoderInWorkerAndMseDecodeAudio: function () {
        return decoder.isPlayUseMSEAndDecoderInWorker() && decoder._opt.mseDecodeAudio;
      },
      playbackUpdatePlaybackRate: function () {
        decoder.clearBuffer(true);
      },
      onOffscreenCanvasWebglContextLost: function (event) {
        decoder.debug.error('worker', 'handleOffscreenCanvasWebglContextLost and next try to create webgl');
        event.preventDefault();
        isWebglContextLost = true;
        decoder.webglObj.destroy();
        decoder.webglObj = null;
        decoder.offscreenCanvasGL = null;
        setTimeout(() => {
          decoder.offscreenCanvasGL = decoder.offscreenCanvas.getContext("webgl");
          if (decoder.offscreenCanvasGL && decoder.offscreenCanvasGL.getContextAttributes().stencil) {
            decoder.webglObj = createWebGL(decoder.offscreenCanvasGL, decoder._opt.openWebglAlignment);
            isWebglContextLost = false;
          } else {
            decoder.debug.error('worker', 'handleOffscreenCanvasWebglContextLost, stencil is false');
            // todo: 通知主线程，webgl context lost
          }
        }, 500);
      },
      onOffscreenCanvasWebglContextRestored: function (event) {
        decoder.debug.log('worker', 'handleOffscreenCanvasWebglContextRestored');
        event.preventDefault();
      },
      videoInfo: function (videoCode, width, height) {
        postMessage({
          cmd: WORKER_CMD_TYPE.videoCode,
          code: videoCode
        });
        postMessage({
          cmd: WORKER_CMD_TYPE.initVideo,
          w: width,
          h: height
        });
        videoWidth = width;
        videoHeight = height;
        if (decoder.useOffscreen()) {
          decoder.offscreenCanvas = new OffscreenCanvas(width, height);
          decoder.offscreenCanvasGL = decoder.offscreenCanvas.getContext("webgl");
          decoder.webglObj = createWebGL(decoder.offscreenCanvasGL, decoder._opt.openWebglAlignment);
          // lost
          decoder.offscreenCanvas.addEventListener('webglcontextlost', decoder.onOffscreenCanvasWebglContextLost, false);
          // restored
          decoder.offscreenCanvas.addEventListener('webglcontextrestored', decoder.onOffscreenCanvasWebglContextRestored, false);
        }
      },
      audioInfo: function (audioCode, sampleRate, channels) {
        postMessage({
          cmd: WORKER_CMD_TYPE.audioCode,
          code: audioCode
        });
        postMessage({
          cmd: WORKER_CMD_TYPE.initAudio,
          sampleRate: sampleRate,
          channels: channels,
          depth: audioDepth
        });
        audioChannels = channels;
      },
      yuvData: function (yuv, ts) {
        if (decoder.isDestroyed) {
          decoder.debug.log('worker', 'yuvData, decoder is destroyed and return');
          return;
        }
        const size = videoWidth * videoHeight * 3 / 2;
        let out = ModuleVideo.HEAPU8.subarray(yuv, yuv + size);
        let data = new Uint8Array(out);
        wasmDecodeErrorStartTime = null;
        // newDecodedVideoFrameTimestamp = ts;
        // newDecodedVideoFrameLocalTimestamp = now();
        if (decoder.useOffscreen()) {
          try {
            if (isWebglContextLost) {
              return;
            }
            decoder.webglObj.renderYUV(videoWidth, videoHeight, data);
            let image_bitmap = decoder.offscreenCanvas.transferToImageBitmap();
            postMessage({
              cmd: WORKER_CMD_TYPE.render,
              buffer: image_bitmap,
              delay: decoder.delay,
              ts
            }, [image_bitmap]);
          } catch (e) {
            decoder.debug.error('worker', 'yuvData, transferToImageBitmap error is', e);
          }
        } else {
          postMessage({
            cmd: WORKER_CMD_TYPE.render,
            output: data,
            delay: decoder.delay,
            ts
          }, [data.buffer]);
        }
      },
      pcmData: function (data, len, ts) {
        if (decoder.isDestroyed) {
          decoder.debug.log('worker', 'pcmData, decoder is destroyed and return');
          return;
        }
        let frameCount = len;
        let origin = [];
        let start = 0;
        let audioBufferSize = decoder._opt.audioBufferSize;
        for (let channel = 0; channel < 2; channel++) {
          let fp = ModuleAudio.HEAPU32[(data >> 2) + channel] >> 2;
          origin[channel] = ModuleAudio.HEAPF32.subarray(fp, fp + frameCount);
        }
        if (audioRemain) {
          len = audioBufferSize - audioRemain;
          if (frameCount >= len) {
            audioOutputArray[0] = Float32Array.of(...tempAudioBuffer[0], ...origin[0].subarray(0, len));
            if (audioChannels == 2) {
              audioOutputArray[1] = Float32Array.of(...tempAudioBuffer[1], ...origin[1].subarray(0, len));
            }
            // newDecodedAudioFrameTimestamp = ts;
            postMessage({
              cmd: WORKER_CMD_TYPE.playAudio,
              buffer: audioOutputArray,
              ts
            }, audioOutputArray.map(x => x.buffer));
            start = len;
            frameCount -= len;
          } else {
            audioRemain += frameCount;
            tempAudioBuffer[0] = Float32Array.of(...tempAudioBuffer[0], ...origin[0]);
            if (audioChannels == 2) {
              tempAudioBuffer[1] = Float32Array.of(...tempAudioBuffer[1], ...origin[1]);
            }
            return;
          }
        }
        for (audioRemain = frameCount; audioRemain >= audioBufferSize; audioRemain -= audioBufferSize) {
          audioOutputArray[0] = origin[0].slice(start, start += audioBufferSize);
          if (audioChannels == 2) {
            audioOutputArray[1] = origin[1].slice(start - audioBufferSize, start);
          }
          // newDecodedAudioFrameTimestamp = ts;
          postMessage({
            cmd: WORKER_CMD_TYPE.playAudio,
            buffer: audioOutputArray,
            ts
          }, audioOutputArray.map(x => x.buffer));
        }
        if (audioRemain) {
          tempAudioBuffer[0] = origin[0].slice(start);
          if (audioChannels == 2) {
            tempAudioBuffer[1] = origin[1].slice(start);
          }
        }
      },
      errorInfo: function (error) {
        //  如果连续2个gop时间内一直报错，则认为是解码器出现了问题，需要重启
        if (wasmDecodeErrorStartTime === null) {
          wasmDecodeErrorStartTime = now();
        }
        const _now = now();
        const maxGopTimestamp = iframeIntervalTimestamp > 0 ? iframeIntervalTimestamp * 2 : 5000;
        const maxDiff = clamp(maxGopTimestamp, 1000, 5000);
        const diff = _now - wasmDecodeErrorStartTime;
        if (diff > maxDiff) {
          // 重置解码器
          decoder.debug.warn('worker', `errorInfo() emit simdDecodeError and
                iframeIntervalTimestamp is ${iframeIntervalTimestamp} and diff is ${diff} and maxDiff is ${maxDiff}
                and replay`);
          isSimdDecodeError = true;
          postMessage({
            cmd: WORKER_CMD_TYPE.simdDecodeError
          });
        }
      },
      sendWebsocketMessage: function (message) {
        if (socket) {
          if (socket.readyState === WEBSOCKET_STATUS_CODE.open) {
            socket.send(message);
          } else {
            decoder.debug.error('worker', 'socket is not open');
          }
        } else {
          decoder.debug.error('worker', 'socket is null');
        }
      },
      timeEnd: function () {},
      postStreamToMain(buffer, type) {
        postMessage({
          cmd: WORKER_CMD_TYPE.tempStream,
          type,
          buffer: buffer
        }, [buffer.buffer]);
      }
    };
    decoder.debug = new Debug(decoder);
    let audioDecoder = null;
    if (ModuleAudio.AudioDecoder) {
      audioDecoder = new ModuleAudio.AudioDecoder(decoder);
    }
    let videoDecoder = null;
    if (ModuleVideo.VideoDecoder) {
      videoDecoder = new ModuleVideo.VideoDecoder(decoder);
    }
    postMessage({
      cmd: WORKER_CMD_TYPE.init
    });
    self.onmessage = function (event) {
      let msg = event.data;
      switch (msg.cmd) {
        case WORKER_SEND_TYPE.init:
          try {
            decoder._opt = Object.assign(decoder._opt, JSON.parse(msg.opt));
          } catch (e) {}
          decoder.init();
          break;
        case WORKER_SEND_TYPE.decode:
          decoder.pushBuffer(msg.buffer, msg.options);
          break;
        case WORKER_SEND_TYPE.audioDecode:
          decoder.decodeAudio(msg.buffer, msg.ts);
          break;
        case WORKER_SEND_TYPE.videoDecode:
          decoder.decodeVideo(msg.buffer, msg.ts, msg.isIFrame);
          break;
        case WORKER_SEND_TYPE.clearBuffer:
          decoder.clearBuffer(msg.needClear);
          break;
        case WORKER_SEND_TYPE.fetchStream:
          decoder.fetchStream(msg.url, JSON.parse(msg.opt));
          break;
        case WORKER_SEND_TYPE.close:
          decoder.close();
          break;
        case WORKER_SEND_TYPE.updateConfig:
          decoder.debug.log('worker', 'updateConfig', msg.key, msg.value);
          decoder._opt[msg.key] = msg.value;
          if (msg.key === 'playbackRate') {
            decoder.playbackUpdatePlaybackRate();
            if (decoder.isPlaybackCacheBeforeDecodeForFpsRender()) {
              decoder.playbackCacheLoop();
            }
          }
          break;
        case WORKER_SEND_TYPE.sendWsMessage:
          decoder.sendWebsocketMessage(msg.message);
          break;
        case WORKER_SEND_TYPE.mseUpdateVideoTimestamp:
          mseDecoder.$video.currentTime = Number(msg.message);
          break;
      }
    };
  }

  workerPostRun({}, {}, true);

}));
//# sourceMappingURL=decoder-pro-hard-not-wasm.js.map
