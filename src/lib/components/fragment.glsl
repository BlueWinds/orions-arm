uniform sampler2D pointTexture;
uniform float alphaTest;

void main() {
  gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

  if ( gl_FragColor.a < alphaTest ) discard;
}
