<script>
  import Header from './lib/Header.svelte';
  import BaseStyle from './lib/components/BaseStyle.svelte';
  import Login from './lib/Auth/Login.js'
  import SideNav from './lib/SideNav.svelte'
  import { get } from 'svelte/store'
  import { displayedPage } from './lib/services/store';

  //Pages
  import Hjelp from './lib/Pages/Hjelp.svelte';
  import Orgstruktur from './lib/Pages/Orgstruktur.svelte';
  import Personalia from './lib/Pages/Personalia.svelte';
  import Person from './lib/Pages/Person.svelte';
  import login from './lib/Auth/Login';

  //Styling
  //import css from './lib/mixins/scalablePage.css'

  let page = get(displayedPage)
  displayedPage.subscribe(value => {
      page = value
  })

  const getInitials = name => {
    const split = name.split(' ')
    return `${split[0][0].toUpperCase()}${split[split.length - 1][0].toUpperCase()}`
  }
  
</script>

<BaseStyle>
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
  {:catch error}
    <h1>Stapp oppi: {error}</h1>
  {/await}
</BaseStyle>

<style>
  h1{
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
</style>
