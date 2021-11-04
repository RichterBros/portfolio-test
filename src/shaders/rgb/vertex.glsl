uniform sampler2D uTexture;
uniform vec2 uOffset;
uniform vec2 uCorners;
uniform vec2 uScale;
uniform vec2 uMouseTest;
varying vec2 vUv;
uniform float scaleX;
uniform float scaleY;
uniform float scaleZ;
float M_PI = 3.141529;
varying mat4 vPosition;


vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
  // position.x = - position.x + offset.x * 15.0 + (cos(uv.y * M_PI) * offset.x) * 5.0;
  position.x = position.x + offset.x * 5.0 + (sin(uv.y * M_PI) * offset.x) * 2.0;
  position.y = position.y + offset.y * 5.0 +(sin(uv.x * M_PI) * offset.y) * 2.0;
 
  
  
  
  return position;
}



void main(){
  vUv = uv;
  vec3 newPosition = deformationCurve(position, uv, uOffset);
   
   mat4 sPos = mat4(vec4(scaleX,0.0,0.0,0.0),
                       vec4(0.0,scaleY,0.0,0.0),
                       vec4(0.0,0.0,scaleZ,0.0),
                       vec4(0.0,0.0,0.0,1.0));
  
  // zoom lag corners effect
  vec4 defaultState = modelMatrix*vec4( position, 1.0 );
  vec4 fullScreenState = vec4( position, 1.0 );
  float cornersProgress = mix(uCorners.x,uCorners.y,uv.x);
  vec4 finalState = mix(defaultState,fullScreenState, cornersProgress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0) * sPos;

// newPosition.y += sin(uTime + modelPosition.y * 100.0) * 0.2;

}

