<script>
    export let title = 'Ansattinformasjon'
    export let backgroundColor = '--catSkillWhite'
    export let employeeData = {}

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
    <div id="header"><h3 class="title">{title}</h3></div>
    <div id="content">
        <div class="infoSection">
            <strong>Ansattkategori</strong>
            <div>
                {displayData.category}
            </div>
        </div>
        <div class="infoSection">
            <strong>Postnummer</strong>
            <div>
                {displayData.zipCode} (Må få henta kommune basert på postnummer)
            </div>
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
    .title {
        margin: 0 0 16px 0;
    }
    .infoSection {
        margin-bottom: 1rem;
    }
    .orgStructure {

    }
</style>
