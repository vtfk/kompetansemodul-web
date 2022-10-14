<script>
    import Card from "./Card.svelte";
    import InitialsBadge from "./InitialsBadge.svelte";
    
    // Props
    export let employeeData = {}

    let mainPosition = employeeData.harAktivtArbeidsforhold ? employeeData.aktiveArbeidsforhold.find(forhold => forhold.hovedstilling) : undefined

    let employeeInfo = {
        initials: `${employeeData.fornavn.slice(0,1)} ${employeeData.etternavn.slice(0,1)}`,
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        mainTitle: mainPosition?.stillingstittel ?? 'Har ikke aktiv hovedstilling',
        mainDepartment: mainPosition?.arbeidssted?.navn ?? 'Har ikke aktiv hovedstilling',
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Ukjent kontorplass',
        email: employeeData.userPrincipalName ?? 'Ukjent e-post',
    }

</script>

<Card title={null}>
    <div class="employeeHeader">
        <div class ="employeeBadge">
            <InitialsBadge size='large' initials={employeeInfo.initials} />
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
