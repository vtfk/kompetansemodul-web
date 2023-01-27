<script>
    import { get } from 'svelte/store'
    import { environment } from '../../config'
    import { displayedPage } from '../lib/services/store';
    import Logo from './Icons/Logo.svelte'
    import IconHelp from './Icons/IconHelp.svelte';
    import IconPerson from './Icons/IconPerson.svelte';
    import IconSearch from './Icons/IconSearch.svelte';
    import { changePage } from '../lib/Helpers/changePage'
    import { adminRole } from '../../config'
    import IconSettings from './Icons/IconSettings.svelte';
    import IconClasses from './Icons/IconClasses.svelte';
    import IconOrg from './Icons/IconOrg.svelte';
    
    // Props
    export let roles = []

    let currentPage = get(displayedPage)
    displayedPage.subscribe(() => {
        currentPage = get(displayedPage)
    })
</script>

<div class=container>
    <div class="logoContainer">
        <Logo />
    </div>
    <div style="text-align: center; width: 100%;">
        <p style="padding: 0px;"><strong>Kompetanse</strong></p>
        {#if environment === 'test'}
            <p style="padding: 0px;"><strong>TEST</strong></p>
        {/if}
    </div>
    <div class="sideNavItemsContainer">
        <div class="sideNavFlexHelper">
            <div class="sideNavItem">
                <button on:click={() => { changePage('personalia')} } class={currentPage === 'personalia' ? 'siteNavItemActive' : ''}>
                    <div class="icon">
                        <IconPerson />
                    </div>
                    <p>Meg</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('minenhet', { setUnit: 'myUnit' }) } } class={`${currentPage === 'minenhet' ? ' siteNavItemActive' : ''}`}>
                    <div class="icon">
                        <IconClasses />
                    </div>
                    <p>Min enhet</p>
                </button>
            </div>
            <div class="sideNavItem">
                <button on:click={() => { changePage('person') } } class={`${currentPage === 'person' ? ' siteNavItemActive' : ''}`}>
                    <div class="icon">
                        <IconSearch />
                    </div>
                    <p>Finn ansatt</p>
                </button>
            </div>
            <!--
            <div class="sideNavItem">
                <button on:click={() => { changePage('organisasjon') } } class={`${currentPage === 'organisasjon' ? ' siteNavItemActive' : ''}`}>
                    <div class="icon">
                        <IconOrg />
                    </div>
                    <p>Organisasjon</p>
                </button>
            </div>
            -->
            {#if roles.includes(adminRole)}
                <div class="sideNavItem">
                    <button on:click={() => { changePage('admin')} } class={currentPage === 'admin' ? 'siteNavItemActive' : ''}>
                        <div class="icon">
                            <IconSettings />
                        </div>
                        <p>Admin</p>
                    </button>
                </div>
            {/if}
            <div class="sideNavItem">
                <button on:click={() => { changePage('hjelp')} } class={currentPage === 'hjelp' ? 'siteNavItemActive' : ''}>
                    <div class="icon">
                        <IconHelp />
                    </div>
                    <p>Hjelp</p>
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
        margin-bottom: 150px;
        width: 100%;
        text-align: center;
    }

    .sideNavFlexHelper {
        width: 100%;
    }

    .sideNavItem {
        width: 100%;
        margin: 0 auto;
        text-align: center;
    }

    .siteNavItemActive, .sideNavItem:hover {
        background: #dcac89;
    }

    .sideNavItem:hover {
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
