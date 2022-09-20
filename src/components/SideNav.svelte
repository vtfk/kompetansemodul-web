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
                    <div class="icon">
                        <IconPerson />
                    </div>
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('person')} }>
                    <div class="icon">
                        <IconPerson />
                    </div>
                    <p>Personsøk</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('organisasjon')} }>
                    <div class="icon">
                        <IconOrg />
                    </div>
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('hjelp')} }>
                    <div class="icon">
                        <IconHelp />
                    </div>
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
        width: calc(var(--baseUnit) * 19);
    }

    button:active {
        outline: #dcac89 auto;
        width: calc(var(--baseUnit) * 19);
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