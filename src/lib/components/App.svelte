<script>
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import CSSRenderer from './CssRenderer.svelte'
</script>

<div id="css-renderer-target" />
<Canvas shadows={false}>
  <Scene />
  <CSSRenderer />
</Canvas>

<style>
  #css-renderer-target {
    position: absolute;
    pointer-events: none;
  }
</style>
