<script>
    import Card from "./Card.svelte";
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import { employeeInfoCardHelp } from '../lib/Helpers/helptexts'

    // Props
    export let backgroundColor = '--catSkillWhite'
    export let title="Ansattinformasjon"
    export let employeeData = {}
    export let disableInfoBox = false
    export let hideTextBox = false

    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }
 
    const displayData = {
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        preLocation: employeeData.azureAd?.city ?? 'Ansatt etter sammenslåing',
        category: employeeData.personalressurskategori?.navn ?? 'Ukjent',
        employedSince: employeeData.ansettelsesperiode?.start ? convertDate(employeeData.ansettelsesperiode.start) : '🤷‍♂️',
        zipCode: employeeData.bostedsadresse?.postnummer ?? 'Ukjent postnummer'
    }

    const leaders = employeeData.aktiveArbeidsforhold.map(forhold => {
        return {
            name: forhold.arbeidssted?.leder.navn || 'Ukjent ledernavn',
            upn: forhold.arbeidssted?.struktur[0].leder || false,
            workPlace: forhold.arbeidssted?.navn || 'Ukjent plass'
        }
    }).filter(upn => upn !== false && upn !== '' && upn !== 'Ukjent leder') 
</script>

<Card title={title} backgroundColor={backgroundColor} disableInfoBox={disableInfoBox} infoBox={{content: employeeInfoCardHelp}}>
    <div class="cardContent">
        <div class="generalInfo">
            <div class="infoPair">
                <div class="desc">Navn</div>
                <div class="value">{displayData.name}</div>
            </div>
            <div class="infoPair">
                <div class="desc">Kategori</div>
                <div class="value">{displayData.category}</div>
            </div>
            <div class="infoPair">
                <div class="desc">Første ansettelses dato</div>
                <div class="value">{displayData.employedSince}</div>
            </div>
            <div class="infoPair">
                <div class="desc">Bostedskommune</div>
                <div class="value">{getZipCodeInfo(displayData.zipCode)?.Kommunenavn ?? 'Har ikke gyldig postnummer i HR' }</div>
            </div>
            <div class="infoPair">
                <div class="desc">Nåværende kontorplass</div>
                <div class="value">{displayData.officeLocation}</div>
            </div>
            <!-- Skjules inntil videre -->
            <!-- <div class="infoPair">
                <div class="desc">Fylkestilhørighet før sammenslåing</div>
                <div class="value">{displayData.preLocation}</div>
            </div> -->
        </div>
    </div>
    {#if hideTextBox === false}
        {#each leaders.map(leader => leader.upn) as leader}
            {#if leader === employeeData.userPrincipalName}
                <div class="actionContent">
                    <!-- TODO Her trenger vi en mail til de som er ansvarlig i HR for å endre data -->
                    <p>Hvis noe av informasjonen her ikke stemmer må det endres i HR-systemet.</p>
                </div>
            {:else if leaders.length <= 1}
                <div class="actionContent">
                    <p>Hvis noe av informasjonen her ikke stemmer, klikk <a href={`mailto:${leaders.map(leader => leader.upn).join(';')}?subject=Kompetanse - Feil informasjon`}>her</a> for å sende en mail via Outlook til {leaders.length === 1 ? 'din nærmeste leder:' : 'dine nærmeste ledere:'} <b>{leaders.length === 1 ? leaders.map(leader => leader.name).join(', ') : leaders.map(leader => `${leader.name} (${leader.workPlace})`).join(', ')}</b>, da dette må rettes i HR-systemet.</p>
                </div>
            {/if}
        {/each}
    {:else}
        <div></div>
    {/if}  
</Card>

<style>

    .infoPair {
        display: inline-block;
        padding: 0.5rem;
        border-left: 1px solid var(--mork);
        margin-bottom: 1rem;
        margin-right: 1rem;
    }
    .desc {
        font-size: 0.9rem;
        font-weight: bold;
        font-style: italic;
    }

    .actionContent {
        margin-top: 1rem;
        padding: 1.5rem;
        background-color: var(--ecruWhite);
        border-radius: 1rem;
    }

</style>
