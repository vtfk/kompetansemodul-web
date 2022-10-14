<script>
    import InitialsBadge from "./InitialsBadge.svelte";
    import Menu from "./Menu.svelte";
    import SearchBar from "./SearchBar.svelte";
    import { getPerson }  from '../lib/services/useApi'
    import { get } from 'svelte/store'
    import { searchParameter, displayedPage }  from '../lib/services/store'
    import Logo from "./Icons/Logo.svelte";
    import IconMenu from "./Icons/IconMenu.svelte";

    // Props
    export let name;
    export let initials;

    // State
    let showMenu = false;

    // Functions
    const changePage = (pageName) => {
        // window.history.replaceState(null, null, pageName)
        displayedPage.set(pageName)
        showMenu = false
        console.log(window.location.pathname)
    }

    let currentPage = get(displayedPage)
    displayedPage.subscribe(() => {
        currentPage = get(displayedPage)
    })

    const searchFunc = async (query) => {
        return await getPerson(query)
    }
    const searchCallback = searchRes => {
        console.log('we got ', searchRes)
    }
    const previewMapper = (input) => {
        return input.map(item => {
            const arbeidsforhold = item.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) ?? item.aktiveArbeidsforhold[0]
            return {
                first: item.navn,
                second: arbeidsforhold.stillingstittel,
                third: arbeidsforhold.arbeidssted.navn,
                onClick: () => {
                    searchParameter.set(item.ansattnummer)
                    displayedPage.set('person')
                }
            }
        })
    }

</script>

<div class="header">
    <div class="headerLeft">
        <SearchBar rounded={true} debounceMs={1000} showPreview={true} placeholder="Søk etter ansatt her" search={searchFunc} callback={searchCallback} previewMapper={previewMapper} />
    </div>
    <div class="headerRight">
        <div class="name">
            <p>{name}</p>
        </div>
        <div class="initials">
            <InitialsBadge initials={initials} />
        </div>
        <!--
        <div class="menu">
            <Menu />
        </div>
        -->
    </div>
</div>
<div class="mobileHeader">
    <div class="mobileNav">
        <div class="mobileLeft">
            <div class="logoContainer">
                <Logo />
            </div>
            &nbsp&nbsp&nbsp<strong>Kompetanse</strong>
        </div>
        <div class="mobileRight" on:click={() => {showMenu = !showMenu}}>
            <div class="menuButton">
                <IconMenu />
            </div>
            <div class="initials">
                <InitialsBadge initials={initials} />
            </div>
        </div>
    </div>
    <div class="mobileMenu{showMenu ? ' showMenu' : ''}">
        <div class="menuOption{currentPage === 'personalia' ? ' active' : ''}" on:click={() => {changePage('personalia')}}>Meg</div>
        <div class="menuOption{currentPage === 'person' ? ' active' : ''}" on:click={() => {changePage('person')}}>Finn ansatt</div>
        <div class="menuOption{currentPage === 'hjelp' ? ' active' : ''}" on:click={() => {changePage('hjelp')}}>Hjelp</div>
        <div class="menuOption">Logg ut</div>
        <div class="menuOption" on:click={() => {showMenu = false}}>Lukk meny</div>
    </div>
    <div class="mobileSearchBar">
        <SearchBar rounded={true} debounceMs={1000} showPreview={true} placeholder="Søk etter ansatt her" search={searchFunc} callback={searchCallback} previewMapper={previewMapper} />
    </div>
</div>

<style>
    .header {
        padding: 2rem 0;
        width: 100%;
        display: flex;
        margin-bottom: 1rem;
    }
    .headerLeft {
        display: flex;
        align-items: center;
        width: 60%;
    }
    .headerRight {
        display: flex;
        align-items: center;
        margin-left: auto;
    }
    .name {
        margin: 0px 4px;
    }
    .initials {
        margin: 0px 4px;
    }
    .mobileHeader {
        position: relative;
        left: -16px; /* right/left-padding of contentWrapper in App.Svelte */
        display: none;
        width: 100vw;
    }
    .mobileNav {
        display: flex;
        padding: 1rem 1.5rem;
        background-color: var(--varme-1);
    }
    .mobileSearchBar {
        margin: 1rem 1rem;
    }
    .mobileLeft {
        display: flex;
        align-items: center;
    }
    .mobileRight {
        display: flex;
        align-items: center;
        margin-left: auto;
    }
    .mobileRight:hover {
        cursor: pointer;
        background-color: #dcac89;
    }
    .logoContainer {
        width: 42px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .menuButton {
        display: flex;
        align-items: center;
        width: 40px;
        padding: 0.3rem;
    }
    .mobileMenu {
        display: none;
        background-color: #ebc6ac;
    }
    .mobileMenu.showMenu {
        display: block;
    }
    .menuOption {
        padding: 1rem;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid black;
        font-weight: bold;
    }
    .active, .menuOption:hover {
        background: #dcac89;
        cursor: pointer;
    }
    @media(max-width: 885px) {
        .header {
            display: none;
        }
        .mobileHeader {
            display: block;
        }
    }

</style>
