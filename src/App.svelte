<script>
  import Header from './lib/Header.svelte';
  import { Router, Link, Route } from 'svelte-navigator'; 
  import Login from './lib/Auth/Login.js'
  import SideNav from './lib/SideNav.svelte'
  import { onMount } from 'svelte';

  // let show_content = 'personalia'
  
  let user = Login()
  $: user
  
</script>

<main>
  <Router>
  {#if user === undefined}
    <main>
      <Header title='Kompetansemodul' avatar={'RE'} name={'Robin Ellingsen'}/>
      <SideNav />
    </main>
  {:else if user !== undefined}
    <main>
      <p>loading...</p>
    </main>
  {/if}
  </Router>
</main>

<style>
  p {
    font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    text-decoration: none;
    font-size: 16px;
  }
</style>
