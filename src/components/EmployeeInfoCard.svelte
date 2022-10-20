<script>
    import Card from "./Card.svelte";
    import { getZipCodeInfo } from '../lib/Helpers/zipCode'
    import InnerCard from "./InnerCard.svelte";

    // Props
    export let backgroundColor = '--catSkillWhite'
    export let employeeData = {}

    const convertDate = (date) => {
        const dateList = date.slice(0,10).split('-')
        return `${dateList[2]}.${dateList[1]}.${dateList[0]}`
    }

    const getDepartment = (structure) => {
        const info = {
            department: structure[0].navn
        }
        if (structure.length === 1) {
            // Must be whaaat, top level?
            info.company = structure[0].navn
        }
        else if (structure.length === 2) {
            // Must be fylkesdirektor level, we use the main company
            info.company = structure[1].navn
        } else if (structure.length === 3) {
            // Must be sector level, we use the main company
            info.company = structure[2].navn
        } else if (structure.length === 4) {
            // Must be section level, we use the sector
            info.company = structure[1].navn
        } else if (structure.length > 4) {
            // Must be something lower like me, we use sector
            info.company = structure[structure.length-3].navn
        } else {
            info.company = 'Ukjent sektor'
        }
        return info
    }

    const infoText = "<p>Her finner du ferdig utfylt informasjon om deg. Dette er informasjon som arbeidsgiver allerede har lagret om deg. Hvis dette ikke stemmer, kan du kontakte nærmeste leder.</p>"
 
    const displayData = {
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        preLocation: employeeData.azureAd?.city ?? 'Ansatt etter sammenslåing',
        category: employeeData.personalressurskategori?.navn ?? 'Ukjent',
        employedSince: employeeData.ansettelsesperiode?.start ? convertDate(employeeData.ansettelsesperiode.start) : '🤷‍♂️',
        zipCode: employeeData.bostedsadresse?.postnummer ?? 'Ukjent postnummer'
    }

</script>

<Card title="Ansattinformasjon" backgroundColor={backgroundColor} infoBox={ {content: infoText}}>
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
    .secondaryPosition {
        margin-top: 1rem;
    }
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }

</style>