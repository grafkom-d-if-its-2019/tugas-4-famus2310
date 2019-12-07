precision mediump float;

varying vec3 fNormal;
varying vec3 fColor;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform vec3 diffuseColor;
uniform vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;
uniform int fFlag;

uniform sampler2D sampler0;

void main() {
  if (fFlag == 1) {
    gl_FragColor = vec4(fColor, 1.0);
  } else {
    vec3 diffuseDirection = normalize(diffusePosition - fPosition);
    float normalDotLight = max(dot(fNormal, diffuseDirection), 0.0);

    vec4 textureColor = texture2D(sampler0, fTexCoord);

    vec3 diffuse = diffuseColor * textureColor.rgb * normalDotLight;
    vec3 ambient = ambientColor * textureColor.rgb;

    gl_FragColor = vec4(diffuse + ambient, 1.0);
  }
}