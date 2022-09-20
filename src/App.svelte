<script>
  import Header from './components/Header.svelte';
  import Login from './lib/Auth/Login.js'
  import { get } from 'svelte/store'
  import { displayedPage } from './lib/services/store';

  //Pages
  import Hjelp from './Pages/Hjelp.svelte';
  import Orgstruktur from './Pages/Orgstruktur.svelte';
  import Personalia from './Pages/Personalia.svelte';
  import Person from './Pages/Person.svelte';
  import SideNav from './components/SideNav.svelte';

  let page = get(displayedPage)
  displayedPage.subscribe(value => {
      page = value
  })

  const getInitials = name => {
    const split = name.split(' ')
    return `${split[0][0].toUpperCase()}${split[split.length - 1][0].toUpperCase()}`
  }
  
</script>

{#await Login()}
  Loading...
{:then response}
<div class="sidenavWrapper">
  <SideNav />
</div>
<div class="contentWrapper">
  <div class="content">
    <Header title='Kompetansemodul' initials={getInitials(response.name)} name={response.name} />
    { #if page === 'personalia'}
        <Personalia />
    { :else if page === 'person' }
        <Person />
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

<style>
  .sidenavWrapper, .contentWrapper {
    min-height: 100vh;
  }
  .sidenavWrapper {
    position: fixed;
    width: calc(var(--sidenavWidth) - 8px);
    background-color: var(--varme-1);
    top: 0;
    bottom: 0;
    left: 0;
  }
  .contentWrapper {
    margin-left: var(--sidenavWidth);
    width: calc(100vw - var(--sidenavWidth));
  }
  .content {
    position: relative;
    max-width: 1032px;
    margin: 0px auto;
  }
</style>
