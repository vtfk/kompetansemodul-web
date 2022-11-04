<script>
    import Card from "./Card.svelte";
    import InitialsBadge from "./InitialsBadge.svelte"
    import { getPhoto } from '../lib/services/useApi'
    
    // Props
    export let employeeData = {}
    export let backgroundColor = "--springWood"

    let mainPosition = employeeData.harAktivtArbeidsforhold ? employeeData.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) : undefined

    let employeeInfo = {
        initials: `${employeeData.fornavn.slice(0,1)} ${employeeData.etternavn.slice(0,1)}`,
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        mainTitle: mainPosition?.stillingstittel ?? 'Har ikke aktiv hovedstilling',
        mainDepartment: mainPosition?.arbeidssted?.navn ?? 'Har ikke aktiv hovedstilling',
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        email: employeeData.userPrincipalName ?? 'Ukjent e-post',
    }

    // EASTER EGG
    if (employeeInfo.name === 'Jan Thomas Tørrestad') employeeInfo.name = "Jommas 🧔"

    // Handle photo
    const handlePhoto = async () => {
        const url = window.URL || window.webkitURL;
        const photoData = await getPhoto(employeeInfo.email)
        const blobUrl = url.createObjectURL(photoData);
        return blobUrl
    }

</script>

<Card title={null} backgroundColor={backgroundColor}>
    <div class="employeeHeader">
        <div class ="employeeBadge">
            {#await handlePhoto()}
                <InitialsBadge size='large' initials={employeeInfo.initials} />
            {:then res}
                <InitialsBadge size='large' image={res}  />
            {:catch error}
                <InitialsBadge size='large' initials={employeeInfo.initials} />
            {/await}
        </div>
        <div class="mainStuff">
            <div class="employeeTitle">
                <div class="smallBadge">
                    <InitialsBadge size='small' initials={employeeInfo.initials} />
                </div>
                <h3>{employeeInfo.name}</h3>
            </div>
            <h4>{employeeInfo.mainTitle} - {employeeInfo.mainDepartment}</h4>
            <p>{employeeInfo.officeLocation}</p>
            <p>✉ {employeeInfo.email}</p>
        </div>
    </div>

</Card>

<style>
    .employeeHeader {
        display: flex;
    }
    .employeeBadge {
        margin-right: 32px;
    }
    .smallBadge {
        display: none;
        margin-right: 8px;
    }
    .employeeTitle {
        display: flex;
        align-items: center;
        margin-bottom: inherit;
    }
    @media(max-width: 885px) {
        .employeeBadge {
            display: none;
        }
        .smallBadge {
            display: block;
        }
        .employeeTitle {
            margin-bottom: 8px;
        }
    }

</style>
