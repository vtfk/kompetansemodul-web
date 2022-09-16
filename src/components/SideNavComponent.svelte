<script>
    import SideNavItems from '../components/SideNav/SideNav-items.svelte';
    import SideNav from '../components/SideNav/SideNav.svelte'
    import IconStudents from '../assets/Icon/icon-students.svelte'
    import GiOrganigram from 'svelte-icons/gi/GiOrganigram.svelte'
    import IoMdHelpCircle from 'svelte-icons/io/IoMdHelpCircle.svelte'


    const updateUrl = (appendix) => {
        window.history.replaceState(null, null, appendix)
        // window.history.pushState(new XMLSerializer().serializeToString(document), "Title", appendix);
    }

</script>

<SideNav let:selectedItem>
    <SideNavItems value='personalia'>
    <button on:click={() => { {selectedItem}; updateUrl('personalia')} } >
        <div class="icon">
            <IconStudents/>
        </div>
        <p>Personalia</p>
    </button>
    </SideNavItems>
    <SideNavItems value='person'>
        <button on:click={() => { {selectedItem}; updateUrl('person')} } >
            <div class="icon">
                <IconStudents/>
            </div>
            <p>Personsøk</p>
        </button>
    </SideNavItems>
    <SideNavItems value='orgstruktur'>
        <button on:click={() => { {selectedItem}; updateUrl('orgstruktur')} } >
            <div class="icon">
                <GiOrganigram/>
            </div>
            <p>Organiasasjons Struktur</p>
        </button>
    </SideNavItems>
    <SideNavItems value='hjelp'>
        <button on:click={() => { {selectedItem}; updateUrl('hjelp')} } >
            <div class="icon">
                <IoMdHelpCircle/>
            </div>
            <p>Hjelp</p>
        </button>
    </SideNavItems>
</SideNav>



<style>
    p {
        font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
        padding: 0.25rem 0.25rem 0.25rem 0.5rem;
        text-decoration: none;
        font-size: 16px;
        color: #000000;
        display: block;
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
        all:unset
    }

    button:active {
        outline: #EBF6F9 0.01rem auto;
        width: 100%;
        height: 100%;
    }

    @media screen and (max-height: 600px) {
        p {font-size: 12px;}
    }


</style>