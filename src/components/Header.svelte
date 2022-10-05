<script>
    import InitialsBadge from "./InitialsBadge.svelte";
    import Menu from "./Menu.svelte";
    import SearchBar from "./SearchBar.svelte";
    import { getPerson }  from '../lib/services/useApi'
    import { searchParameter, displayedPage }  from '../lib/services/store'

    // Props
    export let name;
    export let initials;

    // Functions
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

<div>
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
            <div class="menu">
                <Menu />
            </div>
        </div>
    </div>
</div>

<style>
    .header {
        padding: 2rem 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
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
    }
    .name {
        margin: 0px 4px;
    }

    .initials {
        margin: 0px 4px;
    }

    .menu {
        margin: 0px 16px
    }

</style>
