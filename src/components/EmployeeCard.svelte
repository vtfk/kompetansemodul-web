<script>
    import InitialsBadge from "./InitialsBadge.svelte";

    export let title = 'Ansattinformasjon'
    export let backgroundColor = '--springWood'
    export let employeeData = {}

    let mainPosition = employeeData.harAktivtArbeidsforhold ? employeeData.aktiveArbeidsforhold.find(forhold => forhold.lonnsprosent > 0 && forhold.hovedstilling) : undefined
    let employeeInfo = {
        initials: `${employeeData.fornavn.slice(0,1)} ${employeeData.etternavn.slice(0,1)}`,
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        mainTitle: mainPosition?.stillingstittel ?? 'Potet',
        mainDepartment: mainPosition?.arbeidssted?.navn ?? 'En eller annen avdeling',
        mainCompany: mainPosition?.arbeidssted?.kortnavn ?? 'En eller annen sektor',
        officeLocation: employeeData.azureAd?.officeLocation ?? 'Flytende kontorplass',
        email: employeeData.userPrincipalName ?? 'Har visst ikke e-post',
        manager: mainPosition?.leder?.navn ?? 'Sin egen sjef',
        employeeType: employeeData.personalemployeeDatasurskategori?.navn ?? 'En eller annen slags type ansatt',
        employedSince: employeeData.ansettelsesperiode?.start ? employeeData.ansettelsesperiode.start.split('T')[0] : 'Hakke peiling',
    }
</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <!--<div class="header"><h3 class="title">{title}</h3></div>-->
    <div class="content">
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

<style>
    .content {
        display: flex;
    }
    .employeeStuff {
        margin-left: 32px;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .title {
        margin: 0 0 16px 0;
    }
</style>
