<script>
    export let title = 'Ansattinformasjon'
    export let backgroundColor = '--catSkillWhite'
    export let employeeData = {}

    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }

    const displayData = {
        activePositions: (employeeData.aktiveArbeidsforhold && employeeData.aktiveArbeidsforhold.length > 0) ? employeeData.aktiveArbeidsforhold : [],
        managerName: employeeData.azureAd?.manager.displayName ?? 'Har ingen leder...',
        managerEmail: employeeData.azureAd?.manager.userPrincipalName ?? 'Og da har ikke leder noe e-post',
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
            <strong>Nærmeste leder</strong>
            <div>
                {displayData.managerName}
            </div>
            <div>
                ✉ {displayData.managerEmail}
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
            <strong>Aktive arbeidsforhold</strong>
            {#each displayData.activePositions as position}
                <div>
                    {position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%) - {position.arbeidssted?.navn ?? 'Ukjent avdeling'} - {position.arbeidssted?.kortnavn ?? 'Ukjent avdeling'} - {position.hovedstilling ? 'Hovedstilling' : 'tilleggsstilling' }
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
</style>
