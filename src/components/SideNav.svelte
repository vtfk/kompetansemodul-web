<script>
    import Logo from './Icons/Logo.svelte'
    import IconHelp from './Icons/IconHelp.svelte';
    import IconPerson from './Icons/IconPerson.svelte';
    import IconOrg from './Icons/IconOrg.svelte'
    import IconSearch from './Icons/IconSearch.svelte';

    import { displayedPage } from '../lib/services/store';

    const changePage = (pageName) => {
        window.history.replaceState(null, null, pageName)
        displayedPage.set(pageName)
        console.log(window.location.pathname)
        // window.history.pushState(new XMLSerializer().serializeToString(document), "Title", appendix);
    }
</script>

<div class=container>
    <div class="logoContainer">
        <Logo />
    </div>
    <div style="text-align: center; width: 100%;">
        <p style="padding: 0px;">Hallo</p>
    </div>
    <div class="sideNavItemsContainer">
        <div class="sideNavFlexHelper">
            <div class="sideNavItem">
                <button on:click={() => { changePage('personalia')} }>
                    <div class="icon">
                        <IconPerson />
                    </div>
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem disabled">
                <button class="disabled" on:click={() => { } }>
                    <div class="icon">
                        <IconSearch />
                    </div>
                    <p>Personsøk (ikke laget enda)</p>
                </button>
            </div>
            <div class="sideNavItem disabled">
                <button class="disabled" on:click={() => { } }>
                    <div class="icon">
                        <IconOrg />
                    </div>
                    <p>Organisasjon (ikke laget enda)</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('hjelp')} }>
                    <div class="icon">
                        <IconHelp />
                    </div>
                    <p>Hjælp!</p>
                </button>
            </div>
        </div>
    </div>
</div>


<style>

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .logoContainer {
        margin: 0px auto;
        padding-top: 36px;
        width: 3.5rem;
    }
    .sideNavItemsContainer {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0px;
        margin-bottom: 200px;
        width: 100%;
        text-align: center;
    }

    .sideNavFlexHelper {
        width: 100%;
    }

    .sideNavItem {
        width: 100%;
        margin: 16px auto;
        text-align: center;
    }

    .sideNavItem :hover {
        background: #dcac89;
        cursor: pointer;
    }

    .icon {
        color: #000000;
        width: 2rem;
        height: 2rem;
        margin: 1rem;
        margin-bottom: -1rem;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    button {
        all:unset;
        width: 100%;
    }

    button:active {
        outline: #dcac89 auto;
        width: 100%;
        height: 100%;
    }

    p {
        padding: 1.25rem 0.5rem;
        text-decoration: none;
        font-size: 16px;
        color: #000000;
        display: block;
    }
</style>