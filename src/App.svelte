<script>
  import Header from './lib/Header.svelte';
  import { Router, Link, Route } from 'svelte-navigator'; 
  import Login from './lib/Auth/Login.js'
  import SideNav from './lib/SideNav.svelte'
  import { get } from 'svelte/store'
  import { displayedPage } from './lib/services/store';

  //Pages
  import Hjelp from './lib/Pages/Hjelp.svelte';
  import Orgstruktur from './lib/Pages/Orgstruktur.svelte';
  import Personalia from './lib/Pages/Personalia.svelte';
  import login from './lib/Auth/Login';

  let page = get(displayedPage)
  displayedPage.subscribe(value => {
      page = value
  })

  const getInitials = name => {
    const split = name.split(' ')
    return `${split[0][0].toUpperCase()}${split[split.length - 1][0].toUpperCase()}`
  }
  
</script>

<main>
  <Router>
  {#await Login()}
    Loading...
  {:then response}
  <div class="header">
  <Header title='Kompetansemodul' avatar={getInitials(response.name)} name={response.name} />
  </div>
  <div class="content">
      <SideNav />
      { #if page === 'personalia'}
          <Personalia />
      { :else if page === 'orgstruktur' }
          <Orgstruktur />
      { :else if page === 'hjelp' }
          <Hjelp />
      { :else if page === '' }
          <h1>Ingenting</h1>
      {/if }
    </div>
  {:catch error}
    <h1>Stapp oppi: {error}</h1>
  {/await}
  </Router>
</main>

<style>
  h1{
    font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    text-decoration: none;
    font-size: 32px;
  }

  .header {
    margin-left: 11rem;
  }

  .content {
    background-color: #F8F6F0;
    margin-left: 11em;
    height: 100vh;
  }

  @media screen and (max-width: 1024px) {
    .content {
      margin-left: 8rem;
      margin-right: 3em;
    }

    .header {
      margin-left: 8rem;
    }
  }

  @media screen and (max-height: 600px) { 
    .content {
      margin-right: 17rem;
    }
  }
  </style>
