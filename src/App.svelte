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
    <div class="main">
      <div class="content">
        <Header title='Kompetansemodul' avatar={getInitials(response.account.name)} name={response.account.name} />
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
    </div>
  {:catch error}
    <h1>Stapp oppi: {error}</h1>
  {/await}
  </Router>
</main>

<style>
  p {
    font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    text-decoration: none;
    font-size: 16px;
  }

  .main {
    /* margin-left: 11em; */
  }

  .content {
    background-color: #F8F6F0;
    /* width: 100vw; */
    height: 100vh;
}
</style>
