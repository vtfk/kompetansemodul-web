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
    <div>
        <div class="employeeHeader">
            <InitialsBadge size='large' initials={employeeInfo.initials} />
            <div class='employeeStuff'>
                <div class="mainStuff">
                    <h3>{employeeInfo.name}</h3>
                    <h4>{employeeInfo.mainTitle} - {employeeInfo.mainDepartment}</h4>
                    <p>{employeeInfo.officeLocation}</p>
                    <p>✉ {employeeInfo.email}</p>
                </div>
            </div>
        </div>
    </div>

</Card>

<style>
    .employeeHeader {
        display: flex;
    }
    .employeeStuff {
        margin-left: 32px;
    }

</style>
