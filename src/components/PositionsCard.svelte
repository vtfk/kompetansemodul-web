<script>
    import Card from "./Card.svelte";
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import InitialsBadge from "./InitialsBadge.svelte";

    // Props
    export let backgroundColor = '--catSkillWhite'
    export let employeeData = {}

    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }
 
    const mainPosition = employeeData.harAktivtArbeidsforhold ? employeeData.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) : undefined // TODO: hva med de som faktisk ikke har aktiv hovedstilling????
    const displayData = {
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        preLocation: employeeData.azureAd?.city ?? 'Ansatt etter sammenslåing',
        otherPositions: mainPosition ? employeeData.aktiveArbeidsforhold.filter(pos => pos.systemId !== mainPosition.systemId) : employeeData.aktiveArbeidsforhold,
        category: employeeData.personalressurskategori?.navn ?? 'Ukjent',
        employedSince: employeeData.ansettelsesperiode?.start ? convertDate(employeeData.ansettelsesperiode.start) : '🤷‍♂️',
        zipCode: employeeData.bostedsadresse?.postnummer ?? 'Ukjent postnummer'
    }

</script>

<Card title="Ansattinformasjon" backgroundColor={backgroundColor} infoBox={ {content: "Her kommer det du trenger hjelp til"}}>
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
                <div class="desc">Ansatt siden</div>
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
            <div class="infoPair">
                <div class="desc">Fylkestilhørighet før sammenslåing</div>
                <div class="value">{displayData.preLocation}</div>
            </div>
        </div>
        {#if mainPosition}
            <div class="mainPosition">
                <h4>Hovedstilling</h4>
                <div class="position">
                    <InitialsBadge size='medium' initials='💼' />
                    <div class='stuff'>
                        <div class="mainStuff">
                            <h3>{mainPosition.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(mainPosition.lonnsprosent/100)}%)</h3>
                            <h4>{mainPosition.arbeidssted.struktur[mainPosition.arbeidssted.struktur.length-1].navn}</h4>
                            <p>{mainPosition.arbeidssted.struktur[2].navn}</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
        {#if displayData.otherPositions.length > 0}
            <div class="secondaryPosition">
                <h4>Aktive sekundærstillinger</h4>
                {#each displayData.otherPositions as position}
                    <div class="position">
                        <InitialsBadge size='medium' initials='💼' />
                        <div class='stuff'>
                            <div class="mainStuff">
                                <h3>{position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%)</h3>
                                <h4>{position.arbeidssted.struktur[position.arbeidssted.struktur.length-1].navn}</h4>
                                <p>{position.arbeidssted.struktur[2].navn}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        <div class="otherPositions">

        </div>
    </div>
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
    .generalInfo {
        padding-bottom: 1rem;
    }

    .position {
        display: flex;
        padding: 1rem 1rem;
        border: 0px solid var(--mork);
        background-color: rgba(0, 0, 0, 0.03);
        border-radius: 1rem;
    }
    .stuff {
        margin-left: 32px;
    }
    .secondaryPosition {
        margin-top: 1rem;
    }

</style>