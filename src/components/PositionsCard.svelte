<script>
    import IconHelp from "./Icons/IconHelp.svelte";
    import InfoBox from "./InfoBox.svelte";

    import {getCountyValue} from "../lib/Helpers/countyFromZipCode"

    export let title = 'Ansattinformasjon'
    export let backgroundColor = '--catSkillWhite'
    export let employeeData = {}

    // State
    let showInfoBox = false

    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }
    const mainPosition = employeeData.harAktivtArbeidsforhold ? employeeData.aktiveArbeidsforhold.find(forhold => forhold.lonnsprosent > 0 && forhold.hovedstilling) : undefined
    const displayData = {
        otherPositions: mainPosition ? employeeData.aktiveArbeidsforhold.filter(pos => pos.systemId !== mainPosition.systemId) : employeeData.aktiveArbeidsforhold,
        category: employeeData.personalressurskategori?.navn ?? 'Ukjent',
        employedSince: employeeData.ansettelsesperiode?.start ? convertDate(employeeData.ansettelsesperiode.start) : '🤷‍♂️',
        zipCode: employeeData.bostedsadresse?.postnummer ?? 'Ukjent postnummer'
    }


</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header"><h3 class="title">{title}</h3><div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div></div>
    <InfoBox open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
    <div id="content">
        <div class="infoSection">
            <strong>Ansattkategori</strong>
            <div>
                {displayData.category}
            </div>
        </div>
        <div class="infoSection">
            <strong>Postnummer</strong>
                {#await getCountyValue(displayData.zipCode)}
                    <p>Venter</p>
                {:then county}
                    <div>
                        {displayData.zipCode} {county}
                    </div>
                {:catch error}
                    <p>{error}</p>
                {/await}
        </div>
        <div class="infoSection">
            <strong>Ansatt dato</strong>
            <div>
                {displayData.employedSince}
            </div>
        </div>
        <div class="infoSection">
            {#if mainPosition}
                <h3>Hovedstilling</h3>
                <strong>Tittel</strong>
                <div>
                    {mainPosition.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(mainPosition.lonnsprosent/100)}%) - {mainPosition.arbeidssted?.navn ?? 'Ukjent avdeling'}
                </div>
                <strong>Organisasjonsplassering</strong>
                <div class="orgStructure">
                    {#each mainPosition.arbeidssted.struktur.reverse() as unit, i}
                        <div style="padding-left: {i}rem">{unit.navn}</div>
                    {/each}
                </div>
            {/if}

            {#each displayData.otherPositions as position, i}
                <h3>Stilling {i+1}</h3>
                <strong>Tittel</strong>
                <div>
                    {position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%) - {position.arbeidssted?.navn ?? 'Ukjent avdeling'}
                </div>
                <strong>Organisasjonsplassering</strong>
                <div class="orgStructure">
                    {#each position.arbeidssted.struktur.reverse() as unit, i}
                        <div style="padding-left: {i}rem">{unit.navn}</div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .infoSection {
        margin-bottom: 1rem;
    }
    .header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }
    .headerIcon {
        display: flex;
        align-items: center;
        width: 1rem;
        margin-left: 4px;
    }
    .headerIcon:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
</style>
