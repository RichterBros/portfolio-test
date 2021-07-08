#include <fog_pars_fragment>


uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uFoamColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

varying vec2 vUv;
uniform vec2 u_resolution;



void main()
{
  
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  
  vec3 color = mix(uDepthColor, uSurfaceColor,  mixStrength);
  // vec3 color = uSurfaceColor;
  vec3 colorFoam = mix(uSurfaceColor, uFoamColor, mixStrength) * 0.8;
  gl_FragColor = vec4(colorFoam, 1.0) ;

  // vec2 st = gl_FragCoord.xy/u_resolution;
  //   float pct = 0.0;

  
  // pct = -distance(st,vec2(0.5)) + 5000.0 ;
  // vec3 color = vec3(pct);

	// gl_FragColor = vec4( color, 0.5 );
  #include <fog_fragment>

}