<script>
    import Logo from './Icons/Logo.svelte'
    import IconHelp from './Icons/IconHelp.svelte';
    import IconPerson from './Icons/IconPerson.svelte';
    import IconOrg from './Icons/IconOrg.svelte'

    import { displayedPage } from '../lib/services/store';

    const changePage = (pageName) => {
        window.history.replaceState(null, null, pageName)
        displayedPage.set(pageName)
        // window.history.pushState(new XMLSerializer().serializeToString(document), "Title", appendix);
    }
</script>

<div class=container>
    <div class="logoContainer">
        <Logo />
        <div style="text-align: center;">
            <p>Halla</p>
        </div>
    </div>
    <div class="sideNavItemsContainer">
        <div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('personalia')} }>
                    <IconPerson />
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('person')} }>
                    <IconPerson />
                    <p>Personsøk</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('organisasjon')} }>
                    <IconOrg />
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('hjelp')} }>
                    <IconHelp />
                    <p>Meg</p>
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
        padding: 36px 0px;
        width: calc(var(--baseUnit) * 6);
    }
    .sideNavItemsContainer {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 0px;
    }

    .sideNavItem {
        width: 100%;
        margin: 16px auto;
        text-align: center;
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

    button:active {
        outline: #EBF6F9 0.01rem auto;
        width: 100%;
        height: 100%;
    }

</style>