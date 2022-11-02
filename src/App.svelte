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
    return `${split[0][0].toUpperCase()} ${split[split.length - 1][0].toUpperCase()}`
  }
  
  const validateUsername = (upn) => {
    return upn.endsWith('@vtfk.no')
  }
  
</script>

  {#await Login()}
    Loading...
  {:then response}
    {#if response && response.username}
      {#if !validateUsername(response.username)}
      Kun VTFK-ansatte har tilgang på denne portalen. Ta kontakt med IT-service desk dersom du mener du skal ha tilgang.
      {:else}
        <div class="sidenavWrapper">
          <SideNav />
          </div>
        <div class="contentWrapper">
          <div class="content">
            <Header initials={getInitials(response.name)} name={response.name} />
              { #if page === 'personalia'}
                  <Personalia />
              { :else if page === 'person' }
                  <Person />
              { :else if page === 'organisasjon' }
                  <Orgstruktur />
              { :else if page === 'hjelp' }
                  <Hjelp />
              { :else if page === '' }
                  <h1>Velkommen skal du være, {response.name.split(' ')[0]}!</h1>
              {/if }
            </div>
        </div>
      {/if}
    {/if}
  {:catch error}
    <h1>App app app: {error}</h1>
  {/await}

<style>
  .sidenavWrapper, .contentWrapper {
    min-height: 100vh;
  }
  .sidenavWrapper {
    position: fixed;
    width: calc(var(--sidenavWidth));
    background-color: var(--varme-1);
    top: 0;
    bottom: 0;
    left: 0;
    overflow-y:auto;
    overflow-x:hidden;
  }
  .contentWrapper {
    margin-left: var(--sidenavWidth);
    width: calc(100vw - var(--sidenavWidth));
    padding: 0px 32px;
  }
  .content {
    position: relative;
    max-width: 1096px;
    margin: 0px auto;
  }
  @media(max-width: 885px) {
    .sidenavWrapper {
      display: none;
    }
    .contentWrapper {
      margin-left: 0;
      width: auto;
      padding: 0px 16px;
    }
  }
</style>
